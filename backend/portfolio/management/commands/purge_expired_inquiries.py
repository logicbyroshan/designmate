import logging
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from portfolio.models import CallBooking

logger = logging.getLogger('portfolio')

class Command(BaseCommand):
    help = "DPDP Data Retention: Purges client consultation inquiries older than the retention period."

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=180,
            help="Retention period threshold in days (default: 180 days in accordance with DPDP policy).",
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help="Simulate the purge and report count without deleting records from database.",
        )

    def handle(self, *args, **options):
        days = options['days']
        dry_run = options['dry_run']
        cutoff_date = timezone.now() - timedelta(days=days)

        expired_qs = CallBooking.objects.filter(created_at__lt=cutoff_date)
        count = expired_qs.count()

        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    f"[DRY-RUN] Found {count} consultation inquiries older than {days} days ({cutoff_date.strftime('%Y-%m-%d')}). No data deleted."
                )
            )
            return

        deleted_count, _ = expired_qs.delete()
        logger.info(f"DPDP Retention Cleanup: Successfully purged {deleted_count} expired consultation inquiries (older than {days} days).")
        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully purged {deleted_count} consultation inquiries older than {days} days."
            )
        )
