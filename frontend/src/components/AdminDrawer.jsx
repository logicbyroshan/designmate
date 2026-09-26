import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  PhoneCall,
  Check,
  ExternalLink,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Layers,
  Megaphone,
  CreditCard,
  Package,
  Camera,
  BookOpen,
  Sparkles,
  Video,
  Palette,
  Monitor,
  Layout,
  Globe,
  PenTool,
  Printer,
  Flame,
  Zap,
  Award,
  Star,
  User,
  Sliders,
  CheckCircle,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

// Wrapper component declared outside of render to preserve component tree state
function AdminWrapper({ isFullPage, onClose, children }) {
  if (isFullPage) {
    return <div className="cms-full-page">{children}</div>;
  }
  return (
    <div className="modal-backdrop" onClick={onClose}>
      {children}
    </div>
  );
}

const AVAILABLE_ICONS = [
  { name: 'Megaphone', label: 'Megaphone / Ads', icon: Megaphone },
  { name: 'CreditCard', label: 'ID Cards / Badge', icon: CreditCard },
  { name: 'Package', label: 'Packaging / Print', icon: Package },
  { name: 'Camera', label: 'Camera / Photo', icon: Camera },
  { name: 'BookOpen', label: 'Editorial / Books', icon: BookOpen },
  { name: 'Sparkles', label: 'Sparkles / Digital', icon: Sparkles },
  { name: 'Video', label: 'Video / Motion', icon: Video },
  { name: 'Palette', label: 'Palette / Art', icon: Palette },
  { name: 'Image', label: 'Image / Graphics', icon: ImageIcon },
  { name: 'Layers', label: 'Layers / General', icon: Layers },
  { name: 'Monitor', label: 'Screen / Web', icon: Monitor },
  { name: 'Layout', label: 'Layout / UI', icon: Layout },
  { name: 'PenTool', label: 'Vector / Drawing', icon: PenTool },
  { name: 'Printer', label: 'Print / Prepress', icon: Printer },
  { name: 'Flame', label: 'Trending / Promo', icon: Flame },
  { name: 'Zap', label: 'Fast / Impact', icon: Zap },
  { name: 'Award', label: 'Badge / Certificate', icon: Award },
  { name: 'Star', label: 'Featured / Special', icon: Star },
  { name: 'Globe', label: 'Global / Online', icon: Globe },
];

const ACCENT_COLORS = [
  { name: 'Electric Blue', hex: '#0066FF' },
  { name: 'Purple Neon', hex: '#7C3AED' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Sunset Orange', hex: '#EA580C' },
  { name: 'Hot Pink', hex: '#DB2777' },
  { name: 'Cyan Glow', hex: '#06B6D4' },
  { name: 'Slate Dark', hex: '#0F172A' },
  { name: 'Amber Gold', hex: '#D97706' },
];

export default function AdminDrawer({
  isOpen,
  onClose,
  profile,
  categories = [],
  projects = [],
  onRefresh,
  isFullPage = false,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'categories' | 'profile' | 'bookings'
  
  // Status feedback
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState('success'); // 'success' | 'error'
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({ ...profile });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '');

  // Project Management State
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    subtitle: '',
    category: 'Advertising',
    description: '',
    client: '',
    year: '2026',
    image_url_fallback: '',
    accent_color: '#0066FF',
    tags: 'Photoshop, Creative, Branding',
    external_url: '',
    featured: true,
  });
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [projectImagePreview, setProjectImagePreview] = useState('');
  const projectFileInputRef = useRef(null);
  const avatarFileInputRef = useRef(null);

  // Category Management State
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    key: '',
    subtitle: '',
    icon_name: 'Sparkles',
    order: 0,
  });

  // Bookings / Inquiries
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  const showNotification = (msg, type = 'success') => {
    setStatusMsg(msg);
    setStatusType(type);
    setTimeout(() => {
      setStatusMsg('');
    }, 4000);
  };

  const fetchBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch(API_ENDPOINTS.bookings, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    if (profile) {
      setProfileForm({ ...profile });
      setAvatarPreview(profile.avatar_url || '/MePhoto.webp');
    }
  }, [profile]);

  useEffect(() => {
    if (isOpen && activeTab === 'bookings') {
      fetchBookings();
    }
  }, [isOpen, activeTab, fetchBookings]);

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // PROFILE SUBMIT HANDLER (Multipart FormData with Avatar File)
  // -------------------------------------------------------------
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.keys(profileForm).forEach((key) => {
        if (key !== 'avatar' && key !== 'avatar_url' && key !== 'hero_bg_image' && key !== 'hero_bg_url') {
          if (profileForm[key] !== null && profileForm[key] !== undefined) {
            formData.append(key, profileForm[key]);
          }
        }
      });

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await fetch(`${API_ENDPOINTS.profile}1/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: formData,
      });

      if (res.ok) {
        showNotification('Profile updated successfully! All changes live on the site.');
        setAvatarFile(null);
        if (onRefresh) onRefresh();
      } else {
        const errData = await res.json();
        showNotification(`Error: ${JSON.stringify(errData)}`, 'error');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      showNotification('Error connecting to backend.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // -------------------------------------------------------------
  // PROJECT FORM SUBMIT (Multipart FormData with Project Image)
  // -------------------------------------------------------------
  const handleOpenAddProject = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      subtitle: '',
      category: categories[0]?.key || 'Advertising',
      description: '',
      client: '',
      year: '2026',
      image_url_fallback: '',
      accent_color: '#0066FF',
      tags: 'Photoshop, CorelDRAW, Creative',
      external_url: '',
      featured: true,
    });
    setProjectImageFile(null);
    setProjectImagePreview('');
    setIsProjectFormOpen(true);
  };

  const handleOpenEditProject = (p) => {
    setEditingProjectId(p.id);
    setProjectForm({
      title: p.title || '',
      subtitle: p.subtitle || '',
      category: p.category || 'Advertising',
      description: p.description || '',
      client: p.client || '',
      year: p.year || '2026',
      image_url_fallback: p.image_url_fallback || '',
      accent_color: p.accent_color || '#0066FF',
      tags: p.tags || '',
      external_url: p.external_url || '',
      featured: p.featured !== undefined ? p.featured : true,
    });
    setProjectImageFile(null);
    setProjectImagePreview(p.image_url || p.image_url_fallback || '');
    setIsProjectFormOpen(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', projectForm.title);
      formData.append('category', projectForm.category);
      formData.append('subtitle', projectForm.subtitle || '');
      formData.append('description', projectForm.description || '');
      formData.append('client', projectForm.client || '');
      formData.append('year', projectForm.year || '2026');
      formData.append('tags', projectForm.tags || '');
      formData.append('accent_color', projectForm.accent_color || '#0066FF');
      formData.append('external_url', projectForm.external_url || '');
      formData.append('featured', projectForm.featured ? 'true' : 'false');
      formData.append('image_url_fallback', projectForm.image_url_fallback || '');

      if (projectImageFile) {
        formData.append('image', projectImageFile);
      }

      let url = API_ENDPOINTS.projects;
      let method = 'POST';

      if (editingProjectId) {
        url = `${API_ENDPOINTS.projects}${editingProjectId}/`;
        method = 'PATCH';
      }

      const res = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: formData,
      });

      if (res.ok) {
        showNotification(
          editingProjectId
            ? 'Project updated successfully with latest image and details!'
            : 'New project published to your portfolio!'
        );
        setIsProjectFormOpen(false);
        setEditingProjectId(null);
        setProjectImageFile(null);
        setProjectImagePreview('');
        if (onRefresh) onRefresh();
      } else {
        const errData = await res.json();
        showNotification(`Error: ${JSON.stringify(errData)}`, 'error');
      }
    } catch (err) {
      console.error('Error saving project:', err);
      showNotification('Error saving project.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete project "${title}"?`)) {
      return;
    }
    try {
      const res = await fetch(`${API_ENDPOINTS.projects}${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok || res.status === 204) {
        showNotification(`Project "${title}" deleted.`);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      showNotification('Error deleting project.', 'error');
    }
  };

  // -------------------------------------------------------------
  // CATEGORY FORM SUBMIT (Create & Edit Categories)
  // -------------------------------------------------------------
  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setCategoryForm({
      name: '',
      key: '',
      subtitle: '',
      icon_name: 'Sparkles',
      order: categories.length + 1,
    });
    setIsCategoryFormOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({
      name: cat.name || '',
      key: cat.key || '',
      subtitle: cat.subtitle || '',
      icon_name: cat.icon_name || 'Layers',
      order: cat.order || 0,
    });
    setIsCategoryFormOpen(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Auto-generate key if empty
      let keyVal = categoryForm.key.trim();
      if (!keyVal) {
        keyVal = categoryForm.name.replace(/[^a-zA-Z0-9]/g, '');
      }

      const payload = {
        name: categoryForm.name,
        key: keyVal,
        subtitle: categoryForm.subtitle,
        icon_name: categoryForm.icon_name,
        order: parseInt(categoryForm.order, 10) || 0,
      };

      let url = API_ENDPOINTS.categories;
      let method = 'POST';

      if (editingCategoryId) {
        url = `${API_ENDPOINTS.categories}${editingCategoryId}/`;
        method = 'PATCH';
      }

      const res = await fetch(url, {
        method: method,
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showNotification(
          editingCategoryId
            ? 'Category updated successfully!'
            : 'New category created! You can now assign projects to it.'
        );
        setIsCategoryFormOpen(false);
        setEditingCategoryId(null);
        if (onRefresh) onRefresh();
      } else {
        const errData = await res.json();
        showNotification(`Error: ${JSON.stringify(errData)}`, 'error');
      }
    } catch (err) {
      console.error('Error saving category:', err);
      showNotification('Error saving category.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id, name, key) => {
    const projectCount = projects.filter((p) => p.category === key).length;
    let confirmMsg = `Are you sure you want to delete category "${name}"?`;
    if (projectCount > 0) {
      confirmMsg += ` (Note: ${projectCount} projects currently use this category key).`;
    }
    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.categories}${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok || res.status === 204) {
        showNotification(`Category "${name}" deleted.`);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      showNotification('Error deleting category.', 'error');
    }
  };

  // -------------------------------------------------------------
  // BOOKINGS HANDLERS (Update status / delete)
  // -------------------------------------------------------------
  const handleUpdateBookingStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.bookings}${id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchBookings();
        showNotification('Inquiry status updated.');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      showNotification('Failed to update status.', 'error');
    }
  };

  const handleDeleteBooking = async (id, fullName) => {
    if (!window.confirm(`Permanently erase inquiry for "${fullName || 'Client'}" under DPDP Section 12 (Right to Erasure)? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_ENDPOINTS.bookings}${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok || res.status === 204) {
        fetchBookings();
        showNotification('Inquiry permanently erased under DPDP compliance.');
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
      showNotification('Failed to delete inquiry.', 'error');
    }
  };

  return (
    <AdminWrapper isFullPage={isFullPage} onClose={onClose}>
      <div
        className={isFullPage ? 'cms-full-panel' : 'modal-content'}
        style={isFullPage ? {} : {
          maxWidth: 900,
          maxHeight: '92vh',
          borderRadius: 16,
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          className="admin-header-bar"
          style={{
            background: '#0F172A',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  background: '#0066FF',
                  padding: 6,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sliders size={18} color="#FFFFFF" />
              </div>
              <h2 className="admin-header-title" style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                Portfolio CMS
              </h2>
              <span
                className="admin-live-badge"
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34D399',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 99,
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                }}
              >
                ● Live Django API
              </span>
            </div>
            <p className="admin-header-sub" style={{ color: '#94A3B8', fontSize: '0.82rem', margin: '4px 0 0 38px' }}>
              Create categories, upload high-res images, update bio copy & review inquiries
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              title="Open public portfolio in new tab"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(255,255,255,0.08)',
                color: '#E2E8F0',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
            >
              <ExternalLink size={13} /> View Site
            </a>

            <button
              onClick={onRefresh}
              title="Refresh Portfolio Data"
              className="admin-refresh-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(255,255,255,0.1)',
                color: '#F8FAFC',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <RefreshCw size={13} /> Refresh
            </button>

            <button
              onClick={onLogout || onClose}
              title="Exit CMS and return to public portfolio"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(239, 68, 68, 0.18)',
                color: '#FCA5A5',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <LogOut size={13} /> Exit / Log Out
            </button>

            <button
              onClick={onLogout || onClose}
              title="Close"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#FFFFFF',
                width: 34,
                height: 34,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div
          className="admin-tabs-bar"
          style={{
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
          }}
        >
          <button
            id="admin-tab-projects"
            className="admin-tab-btn"
            onClick={() => {
              setActiveTab('projects');
              setIsProjectFormOpen(false);
            }}
            style={{
              padding: '12px 18px',
              border: 'none',
              borderBottom: activeTab === 'projects' ? '2.5px solid #0066FF' : '2.5px solid transparent',
              background: 'transparent',
              color: activeTab === 'projects' ? '#0066FF' : '#64748B',
              fontWeight: activeTab === 'projects' ? 800 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              marginBottom: '-2px',
            }}
          >
            <ImageIcon size={15} /> Projects & Works ({projects.length})
          </button>

          <button
            id="admin-tab-categories"
            className="admin-tab-btn"
            onClick={() => {
              setActiveTab('categories');
              setIsCategoryFormOpen(false);
            }}
            style={{
              padding: '12px 18px',
              border: 'none',
              borderBottom: activeTab === 'categories' ? '2.5px solid #0066FF' : '2.5px solid transparent',
              background: 'transparent',
              color: activeTab === 'categories' ? '#0066FF' : '#64748B',
              fontWeight: activeTab === 'categories' ? 800 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              marginBottom: '-2px',
            }}
          >
            <Layers size={15} /> Categories ({categories.length})
          </button>

          <button
            id="admin-tab-profile"
            className="admin-tab-btn"
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '12px 18px',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '2.5px solid #0066FF' : '2.5px solid transparent',
              background: 'transparent',
              color: activeTab === 'profile' ? '#0066FF' : '#64748B',
              fontWeight: activeTab === 'profile' ? 800 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              marginBottom: '-2px',
            }}
          >
            <User size={15} /> Designer Profile
          </button>

          <button
            id="admin-tab-bookings"
            className="admin-tab-btn"
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '12px 18px',
              border: 'none',
              borderBottom: activeTab === 'bookings' ? '2.5px solid #0066FF' : '2.5px solid transparent',
              background: 'transparent',
              color: activeTab === 'bookings' ? '#0066FF' : '#64748B',
              fontWeight: activeTab === 'bookings' ? 800 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              marginBottom: '-2px',
            }}
          >
            <PhoneCall size={15} /> Inquiries
          </button>
        </div>

        {/* Notification Banner */}
        {statusMsg && (
          <div
            style={{
              background: statusType === 'error' ? '#FEF2F2' : '#ECFDF5',
              color: statusType === 'error' ? '#991B1B' : '#065F46',
              borderBottom: `1px solid ${statusType === 'error' ? '#F87171' : '#A7F3D0'}`,
              padding: '10px 20px',
              fontSize: '0.88rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {statusType === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Body Container */}
        <div className="admin-modal-body" style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
          {/* ============================================================== */}
          {/* TAB 1: PROJECTS & WORKS MANAGEMENT                            */}
          {/* ============================================================== */}
          {activeTab === 'projects' && (
            <div>
              {!isProjectFormOpen ? (
                <div>
                  {/* Action Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 18,
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        All Portfolio Works
                      </h3>
                      <p style={{ color: '#64748B', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                        Manage images, case studies, and categories
                      </p>
                    </div>

                    <button
                      id="add-new-work-btn"
                      onClick={handleOpenAddProject}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: '#0066FF',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '9px 18px',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0, 102, 255, 0.25)',
                      }}
                    >
                      <Plus size={16} /> Add New Work & Upload Image
                    </button>
                  </div>

                  {/* Projects List Grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {projects.map((p) => {
                      const imgSrc = p.image_url || p.image_url_fallback;
                      return (
                        <div
                          key={p.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: 12,
                            gap: 16,
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                          }}
                        >
                          {/* Image Thumbnail */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div
                              style={{
                                width: 56,
                                height: 56,
                                borderRadius: 8,
                                overflow: 'hidden',
                                background: '#F1F5F9',
                                flexShrink: 0,
                                border: '1px solid #E2E8F0',
                              }}
                            >
                              {imgSrc ? (
                                <img
                                  src={imgSrc}
                                  alt={p.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    background: p.accent_color || '#0066FF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#FFFFFF',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                  }}
                                >
                                  {p.category?.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>

                            {/* Project Info */}
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                                  {p.title}
                                </h4>
                                <span
                                  style={{
                                    background: '#EFF6FF',
                                    color: '#1D4ED8',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: 6,
                                    border: '1px solid #DBEAFE',
                                  }}
                                >
                                  {p.category}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '3px 0 0 0' }}>
                                Client: <strong>{p.client || 'Roshan Damor'}</strong> • Year: {p.year || '2026'}
                                {p.tags && ` • ${p.tags}`}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => handleOpenEditProject(p)}
                              title="Edit Project"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                background: '#F1F5F9',
                                border: '1px solid #CBD5E1',
                                color: '#334155',
                                padding: '6px 12px',
                                borderRadius: 6,
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id, p.title)}
                              title="Delete Project"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                background: '#FEF2F2',
                                border: '1px solid #FECACA',
                                color: '#DC2626',
                                padding: '6px 12px',
                                borderRadius: 6,
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ADD / EDIT PROJECT FORM */
                <form onSubmit={handleProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {editingProjectId ? 'Edit Project Work' : 'Add New Portfolio Project'}
                      </h3>
                      <p style={{ color: '#64748B', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                        Fill details and upload a graphic design image
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsProjectFormOpen(false)}
                      style={{
                        background: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Title & Category Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        placeholder="e.g. Brand Identity System"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Category *
                      </label>
                      <select
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.9rem' }}
                      >
                        {categories.map((c) => (
                          <option key={c.id || c.key} value={c.key}>
                            {c.name} ({c.key})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Subtitle / Headline */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      Headline / Subtitle
                    </label>
                    <input
                      type="text"
                      value={projectForm.subtitle}
                      onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                      placeholder="e.g. Multi-platform social campaign with 3.2M impressions"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  {/* ============================================================== */}
                  {/* IMAGE UPLOAD SECTION                                          */}
                  {/* ============================================================== */}
                  <div
                    style={{
                      border: '1.5px dashed #0066FF',
                      borderRadius: 12,
                      padding: '16px',
                      background: '#F8FAFC',
                    }}
                  >
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                      📸 Upload Project Image (From Your Computer)
                    </label>
                    
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="file"
                        ref={projectFileInputRef}
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setProjectImageFile(file);
                            setProjectImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => projectFileInputRef.current?.click()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          background: '#0066FF',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 8,
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <Upload size={15} /> Select Image File
                      </button>

                      {projectImagePreview ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            src={projectImagePreview}
                            alt="Upload preview"
                            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #CBD5E1' }}
                          />
                          <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#059669', display: 'block' }}>
                              ✓ Image Ready for Upload
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setProjectImageFile(null);
                                setProjectImagePreview('');
                                if (projectFileInputRef.current) projectFileInputRef.current.value = '';
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#DC2626',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                padding: 0,
                                textDecoration: 'underline',
                              }}
                            >
                              Remove Image
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                          Supports PNG, JPG, WEBP, SVG (Max 15MB)
                        </span>
                      )}
                    </div>

                    {/* Or Fallback Image URL */}
                    <div style={{ marginTop: 12 }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748B', marginBottom: 3 }}>
                        Or Paste Web Image URL (Optional):
                      </label>
                      <input
                        type="url"
                        value={projectForm.image_url_fallback}
                        onChange={(e) => {
                          setProjectForm({ ...projectForm, image_url_fallback: e.target.value });
                          if (!projectImageFile) setProjectImagePreview(e.target.value);
                        }}
                        placeholder="https://images.unsplash.com/..."
                        style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                      />
                    </div>
                  </div>

                  {/* Case Study Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      Project Description / Case Study *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      placeholder="Explain design goals, typography choices, tools used (Photoshop, CorelDRAW), print specs..."
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem', fontFamily: 'inherit' }}
                    />
                  </div>

                  {/* Client, Year, Tags Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1.5fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Client Name
                      </label>
                      <input
                        type="text"
                        value={projectForm.client}
                        onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                        placeholder="e.g. Adarsh ID Cards / Client"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Year
                      </label>
                      <input
                        type="text"
                        value={projectForm.year}
                        onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                        placeholder="2026"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={projectForm.tags}
                        onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                        placeholder="Photoshop, CMYK, Vector, Lanyards"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  {/* Accent Color & External URL */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, alignItems: 'center' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                        Theme Accent Color
                      </label>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        {ACCENT_COLORS.map((c) => (
                          <div
                            key={c.hex}
                            onClick={() => setProjectForm({ ...projectForm, accent_color: c.hex })}
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              background: c.hex,
                              cursor: 'pointer',
                              border: projectForm.accent_color === c.hex ? '3px solid #0F172A' : '1px solid rgba(0,0,0,0.1)',
                              boxShadow: projectForm.accent_color === c.hex ? '0 0 0 2px #0066FF' : 'none',
                            }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        External Project / Behance Link (Optional)
                      </label>
                      <input
                        type="url"
                        value={projectForm.external_url}
                        onChange={(e) => setProjectForm({ ...projectForm, external_url: e.target.value })}
                        placeholder="https://behance.net/gallery/..."
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8, paddingTop: 12, borderTop: '1px solid #E2E8F0' }}>
                    <button
                      type="button"
                      onClick={() => setIsProjectFormOpen(false)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 8,
                        background: '#F1F5F9',
                        color: '#475569',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSaving}
                      style={{
                        padding: '10px 26px',
                        borderRadius: 8,
                        background: '#0066FF',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)',
                      }}
                    >
                      <Check size={16} />
                      {isSaving ? 'Uploading & Saving...' : editingProjectId ? 'Update Project' : 'Publish to Portfolio'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: CATEGORIES ARCHITECTURE                                */}
          {/* ============================================================== */}
          {activeTab === 'categories' && (
            <div>
              {!isCategoryFormOpen ? (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 18,
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Portfolio Categories & Sections
                      </h3>
                      <p style={{ color: '#64748B', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                        Each category creates a dedicated section in "MY WORKS"
                      </p>
                    </div>

                    <button
                      id="create-category-btn"
                      onClick={handleOpenAddCategory}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: '#0066FF',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '9px 18px',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0, 102, 255, 0.25)',
                      }}
                    >
                      <Plus size={16} /> Create New Category
                    </button>
                  </div>

                  {/* Categories Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
                    {categories.map((cat) => {
                      const count = projects.filter((p) => p.category === cat.key).length;
                      const IconComp = AVAILABLE_ICONS.find((i) => i.name === cat.icon_name)?.icon || Layers;

                      return (
                        <div
                          key={cat.id}
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: 12,
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 12,
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div
                                  style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 8,
                                    background: '#EFF6FF',
                                    color: '#0066FF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <IconComp size={18} />
                                </div>
                                <div>
                                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                                    {cat.name}
                                  </h4>
                                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                                    Key: <code>{cat.key}</code>
                                  </span>
                                </div>
                              </div>

                              <span
                                style={{
                                  background: '#F1F5F9',
                                  color: '#334155',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  padding: '3px 8px',
                                  borderRadius: 99,
                                }}
                              >
                                {count} {count === 1 ? 'Work' : 'Works'}
                              </span>
                            </div>

                            {cat.subtitle && (
                              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                                {cat.subtitle}
                              </p>
                            )}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
                            <button
                              onClick={() => handleOpenEditCategory(cat)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                background: '#F8FAFC',
                                border: '1px solid #CBD5E1',
                                color: '#334155',
                                padding: '5px 10px',
                                borderRadius: 6,
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              <Edit2 size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name, cat.key)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                background: '#FEF2F2',
                                border: '1px solid #FECACA',
                                color: '#DC2626',
                                padding: '5px 10px',
                                borderRadius: 6,
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ADD / EDIT CATEGORY FORM */
                <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {editingCategoryId ? 'Edit Category' : 'Create New Portfolio Category'}
                      </h3>
                      <p style={{ color: '#64748B', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                        Defines how your graphic design works are organized and titled
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCategoryFormOpen(false)}
                      style={{
                        background: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Category Display Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={categoryForm.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCategoryForm({
                            ...categoryForm,
                            name: val,
                            key: editingCategoryId ? categoryForm.key : val.replace(/[^a-zA-Z0-9]/g, ''),
                          });
                        }}
                        placeholder="e.g. Motion Graphics & Video Promos"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Category Key / Slug * (Unique Identifier)
                      </label>
                      <input
                        type="text"
                        required
                        value={categoryForm.key}
                        onChange={(e) => setCategoryForm({ ...categoryForm, key: e.target.value.replace(/[^a-zA-Z0-9_-]/g, '') })}
                        placeholder="e.g. MotionGraphics"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      Category Subtitle / Description (Shows on the page header)
                    </label>
                    <input
                      type="text"
                      value={categoryForm.subtitle}
                      onChange={(e) => setCategoryForm({ ...categoryForm, subtitle: e.target.value })}
                      placeholder="e.g. Kinetic typography, YouTube intros, commercial product reels & 3D renders"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  {/* Icon Picker */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 8 }}>
                      Select Category Icon
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
                      {AVAILABLE_ICONS.map((item) => {
                        const IconComponent = item.icon;
                        const isSelected = categoryForm.icon_name === item.name;
                        return (
                          <div
                            key={item.name}
                            onClick={() => setCategoryForm({ ...categoryForm, icon_name: item.name })}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '8px 10px',
                              borderRadius: 8,
                              border: isSelected ? '2px solid #0066FF' : '1px solid #E2E8F0',
                              background: isSelected ? '#EFF6FF' : '#FFFFFF',
                              cursor: 'pointer',
                              color: isSelected ? '#0066FF' : '#475569',
                              fontWeight: isSelected ? 700 : 500,
                              fontSize: '0.8rem',
                            }}
                          >
                            <IconComponent size={16} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Display Order */}
                  <div style={{ maxWidth: 160 }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={categoryForm.order}
                      onChange={(e) => setCategoryForm({ ...categoryForm, order: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8, paddingTop: 12, borderTop: '1px solid #E2E8F0' }}>
                    <button
                      type="button"
                      onClick={() => setIsCategoryFormOpen(false)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 8,
                        background: '#F1F5F9',
                        color: '#475569',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSaving}
                      style={{
                        padding: '10px 26px',
                        borderRadius: 8,
                        background: '#0066FF',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)',
                      }}
                    >
                      <Check size={16} />
                      {isSaving ? 'Saving...' : editingCategoryId ? 'Update Category' : 'Create Category'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: PROFILE & AVATAR EDITING                                */}
          {/* ============================================================== */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Avatar Upload Banner */}
              <div
                style={{
                  background: '#F8FAFC',
                  border: '1.5px dashed #CBD5E1',
                  borderRadius: 12,
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: '#E2E8F0',
                    border: '2px solid #0066FF',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={avatarPreview || '/MePhoto.webp'}
                    alt="Roshan Damor Avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/MePhoto.webp';
                    }}
                  />
                </div>

                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Designer Avatar Photo (MePhoto.webp)
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '2px 0 8px 0' }}>
                    Upload a new square portrait photo to replace on hero and about sections
                  </p>

                  <input
                    type="file"
                    ref={avatarFileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAvatarFile(file);
                        setAvatarPreview(URL.createObjectURL(file));
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: '#0F172A',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: 6,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Upload size={13} /> Change Photo
                  </button>
                  {avatarFile && (
                    <span style={{ fontSize: '0.78rem', color: '#059669', marginLeft: 10, fontWeight: 600 }}>
                      ✓ New photo selected
                    </span>
                  )}
                </div>
              </div>

              {/* Name, Tagline, Location */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Tagline / Specialization
                  </label>
                  <input
                    type="text"
                    value={profileForm.tagline || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileForm.location || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>

              {/* Contact Email & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Primary Email
                  </label>
                  <input
                    type="email"
                    value={profileForm.email || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Alternative Email
                  </label>
                  <input
                    type="email"
                    value={profileForm.alt_email || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, alt_email: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>

              {/* Bio Heading */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Bio Heading
                </label>
                <input
                  type="text"
                  value={profileForm.bio_heading || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, bio_heading: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1' }}
                />
              </div>

              {/* Bio Paragraph 1 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Bio Paragraph 1 (Credentials & Overview)
                </label>
                <textarea
                  rows={3}
                  value={profileForm.bio_paragraph_1 || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, bio_paragraph_1: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontFamily: 'inherit', fontSize: '0.88rem' }}
                />
              </div>

              {/* Bio Paragraph 2 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Bio Paragraph 2 (Experience & Software Expertise)
                </label>
                <textarea
                  rows={2}
                  value={profileForm.bio_paragraph_2 || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, bio_paragraph_2: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontFamily: 'inherit', fontSize: '0.88rem' }}
                />
              </div>

              {/* Social Media Links */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.instagram_url || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, instagram_url: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Figma Profile
                  </label>
                  <input
                    type="url"
                    value={profileForm.figma_url || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, figma_url: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Behance Portfolio
                  </label>
                  <input
                    type="url"
                    value={profileForm.behance_url || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, behance_url: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Submit Profile */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, paddingTop: 12, borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: '10px 28px',
                    borderRadius: 8,
                    background: '#0066FF',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)',
                  }}
                >
                  <Check size={16} />
                  {isSaving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 4: CLIENT INQUIRIES & CALL BOOKINGS                        */}
          {/* ============================================================== */}
          {activeTab === 'bookings' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Received Client Inquiries & Messages
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                    Leads submitted from the "Contact Me" modal
                  </p>
                </div>
                <button
                  onClick={fetchBookings}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={12} /> Refresh Inquiries
                </button>
              </div>

              {isLoadingBookings ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>
                  Loading inquiries...
                </div>
              ) : bookings.length === 0 ? (
                <div className="ui-empty-state">
                  <div className="ui-empty-icon">
                    <PhoneCall size={24} />
                  </div>
                  <div>
                    <h4 className="ui-empty-title">No client inquiries recorded yet</h4>
                    <p className="ui-empty-desc">When visitors submit the "Contact Me" form on the portfolio, their messages and project requests will appear here in real-time.</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        border: '1px solid var(--border-subtle)',
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        background: '#FFFFFF',
                        boxShadow: 'var(--shadow-xs)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                            {b.full_name}
                          </h4>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 3 }}>
                            <a href={`mailto:${b.email}`} style={{ fontSize: '0.84rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                              {b.email}
                            </a>
                            {b.phone && (
                              <a href={`tel:${b.phone}`} style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                                • {b.phone}
                              </a>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                            className={`badge ${
                              b.status === 'completed'
                                ? 'badge-success'
                                : b.status === 'contacted'
                                ? 'badge-warning'
                                : b.status === 'cancelled'
                                ? 'badge-danger'
                                : 'badge-primary'
                            }`}
                            style={{ cursor: 'pointer', padding: '5px 10px', outline: 'none' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => handleDeleteBooking(b.id, b.full_name)}
                            title="Permanently Erase Inquiry (DPDP Right to Erasure)"
                            className="btn btn-danger btn-icon btn-sm"
                            style={{ width: 30, height: 30 }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', gap: 16, margin: '8px 0', flexWrap: 'wrap' }}>
                        <span><strong>Service Needed:</strong> {b.project_type || 'General Inquiry'}</span>
                        {b.budget && <span><strong>Budget:</strong> {b.budget}</span>}
                        {b.preferred_date && <span><strong>Timing:</strong> {b.preferred_date}</span>}
                      </div>

                      {b.message && (
                        <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', margin: '8px 0 0 0', lineHeight: 1.45 }}>
                          "{b.message}"
                        </p>
                      )}

                      {/* DPDP Governance & Audit Footer */}
                      <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94A3B8', flexWrap: 'wrap', gap: 6 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: b.consent_given ? '#059669' : '#DC2626', fontWeight: 600 }}>
                          ✓ DPDP Consent Recorded (v{b.consent_notice_version || '1.0'})
                        </span>
                        <span>
                          Received: {b.created_at ? new Date(b.created_at).toLocaleDateString() : 'Recent'} · 180-day retention
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminWrapper>
  );
}
