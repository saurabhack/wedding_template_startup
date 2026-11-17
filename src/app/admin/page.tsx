'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Users,
  LayoutTemplate,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Search,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'users' | 'plans'>('overview');

  // Create Template Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateSlug, setTemplateSlug] = useState('');
  const [templateCategoryId, setTemplateCategoryId] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [templatePreview, setTemplatePreview] = useState('');
  const [templatePrice, setTemplatePrice] = useState('0');
  const [templateIsPremium, setTemplateIsPremium] = useState(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

  useEffect(() => {
    // 1. Verify admin authentication
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((userData) => {
        if (!userData?.user || userData.user.role !== 'ADMIN') {
          router.push('/dashboard');
          return;
        }
        setCurrentUser(userData.user);

        // Fetch stats, templates, users
        return Promise.all([
          fetch('/api/admin/stats').then((r) => r.json()),
          fetch('/api/admin/templates').then((r) => r.json()),
          fetch('/api/admin/users').then((r) => r.json()),
        ]);
      })
      .then((results) => {
        if (!results) return;
        const [statsData, templData, usersData] = results;
        setStats(statsData.stats);
        setPlans(statsData.plans || []);
        setTemplates(templData.templates || []);
        setCategories(templData.categories || []);
        setUsersList(usersData.users || []);
        if (templData.categories?.length > 0) {
          setTemplateCategoryId(templData.categories[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [router]);

  // Create Template Handler
  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingTemplate(true);
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          slug: templateSlug || templateName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          categoryId: templateCategoryId,
          description: templateDesc,
          previewImage: templatePreview || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800',
          price: Number(templatePrice),
          isPremium: templateIsPremium,
          designConfiguration: {
            themeId: 'custom-royal',
            colors: { primary: '#800020', secondary: '#C9A44C', background: '#FFF9F0' },
          },
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        // Refresh templates
        const updated = await fetch('/api/admin/templates').then((r) => r.json());
        setTemplates(updated.templates || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingTemplate(false);
    }
  };

  // Toggle Template Active
  const handleToggleTemplate = async (templateId: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: templateId, isActive: !currentActive }),
      });
      if (res.ok) {
        setTemplates((prev) =>
          prev.map((t) => (t.id === templateId ? { ...t, isActive: !currentActive } : t))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Template
  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      const res = await fetch(`/api/admin/templates?id=${templateId}`, { method: 'DELETE' });
      if (res.ok) {
        setTemplates((prev) => prev.filter((t) => t.id !== templateId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Change User Role
  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] flex flex-col justify-center items-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-serif text-emerald-900 font-bold">
          Verifying Admin Authorization...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
      <Navbar />

      {/* Admin Header Strip */}
      <div className="bg-[#112217] text-white py-8 px-4 sm:px-8 border-b-2 border-emerald-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Administration Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              ShubhVivah Platform Governance
            </h1>
            <p className="text-xs text-neutral-300 font-light">
              Admin: {currentUser?.fullName} ({currentUser?.email})
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white/10 text-neutral-300 hover:bg-white/20'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'templates'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white/10 text-neutral-300 hover:bg-white/20'
              }`}
            >
              Templates ({templates.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'users'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white/10 text-neutral-300 hover:bg-white/20'
              }`}
            >
              Users ({usersList.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8 animate-in fade-in">
            {/* Metric KPI Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 uppercase block">
                  Total Users
                </span>
                <span className="text-3xl font-serif font-bold text-neutral-900">
                  {stats.totalUsers}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block">
                  Couples & Planners
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 uppercase block">
                  Active Templates
                </span>
                <span className="text-3xl font-serif font-bold text-neutral-900">
                  {stats.totalTemplates}
                </span>
                <span className="text-[10px] text-neutral-500 block">
                  Across 15 Cultural Traditions
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 uppercase block">
                  Invitations Created
                </span>
                <span className="text-3xl font-serif font-bold text-neutral-900">
                  {stats.totalInvitations}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold block">
                  {stats.publishedInvitations} Published Live
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-emerald-300 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 uppercase block">
                  Gross Platform Revenue
                </span>
                <span className="text-3xl font-serif font-bold text-emerald-800">
                  {formatCurrency(stats.totalRevenue)}
                </span>
                <span className="text-[10px] text-neutral-400 block">
                  Subscription & Template Licenses
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-3xl bg-white border border-[#C9A44C]/30 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-royal-maroon">
                  Cultural Template Marketplace Management
                </h3>
                <p className="text-xs text-neutral-500">
                  Create new regional wedding designs or modify existing cultural motifs.
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('templates');
                  setShowCreateModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy text-xs font-bold shadow-royal flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4 text-[#E8D390]" />
                <span>Add New Template</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: TEMPLATES MANAGEMENT */}
        {activeTab === 'templates' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-serif font-bold text-royal-maroon">
                  Template Catalog Management
                </h2>
                <p className="text-xs text-neutral-500">
                  Activate, edit pricing, or add new templates to the marketplace.
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-xl bg-royal-maroon text-[#FFF9F0] text-xs font-bold shadow-royal flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Template</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-neutral-200 shadow-md overflow-hidden">
              <table className="w-full text-left text-xs text-neutral-700">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase text-neutral-500">
                  <tr>
                    <th className="py-3.5 px-6">Template</th>
                    <th className="py-3.5 px-6">Tradition Category</th>
                    <th className="py-3.5 px-6">Price</th>
                    <th className="py-3.5 px-6">Tier</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {templates.map((t) => (
                    <tr key={t.id} className="hover:bg-neutral-50">
                      <td className="py-4 px-6 flex items-center space-x-3">
                        <img
                          src={t.previewImage}
                          alt={t.name}
                          className="w-10 h-10 rounded-lg object-cover border"
                        />
                        <div>
                          <span className="font-bold text-neutral-900 block">{t.name}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            /{t.slug}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 font-medium">
                          {t.category?.name}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold">
                        {Number(t.price) === 0 ? 'Free' : formatCurrency(t.price)}
                      </td>
                      <td className="py-4 px-6">
                        {t.isPremium ? (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                            Premium
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Free
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleTemplate(t.id, t.isActive)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            t.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-200 text-neutral-600'
                          }`}
                        >
                          {t.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeleteTemplate(t.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600"
                          title="Delete Template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: USERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-serif font-bold text-royal-maroon">
              User Directory & Role Permissions
            </h2>

            <div className="bg-white rounded-3xl border border-neutral-200 shadow-md overflow-hidden">
              <table className="w-full text-left text-xs text-neutral-700">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase text-neutral-500">
                  <tr>
                    <th className="py-3.5 px-6">Full Name & Email</th>
                    <th className="py-3.5 px-6">Phone</th>
                    <th className="py-3.5 px-6">Projects</th>
                    <th className="py-3.5 px-6">Role</th>
                    <th className="py-3.5 px-6">Member Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50">
                      <td className="py-4 px-6">
                        <span className="font-bold text-neutral-900 block">{u.fullName}</span>
                        <span className="text-[11px] text-neutral-500">{u.email}</span>
                      </td>
                      <td className="py-4 px-6 text-neutral-600">{u.phone || '—'}</td>
                      <td className="py-4 px-6 font-semibold">{u.projectsCount} Projects</td>
                      <td className="py-4 px-6">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-neutral-300 text-xs bg-white font-semibold"
                        >
                          <option value="USER">USER (Couple / Host)</option>
                          <option value="PLANNER">PLANNER</option>
                          <option value="ADMIN">ADMIN (Full Governance)</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-neutral-500">
                        {formatDate(u.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create New Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#C9A44C] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A44C]">
                  Marketplace Authoring
                </span>
                <h3 className="font-serif font-bold text-xl text-royal-maroon">
                  Create New Wedding Template
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  required
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g. Royal Marwar Heritage"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs outline-none focus:border-royal-maroon"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Cultural Category *
                </label>
                <select
                  required
                  value={templateCategoryId}
                  onChange={(e) => setTemplateCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs outline-none bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Preview Image URL
                </label>
                <input
                  type="url"
                  value={templatePreview}
                  onChange={(e) => setTemplatePreview(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Price (INR)
                  </label>
                  <input
                    type="number"
                    value={templatePrice}
                    onChange={(e) => setTemplatePrice(e.target.value)}
                    placeholder="0 for free"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs outline-none"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isPremium"
                    checked={templateIsPremium}
                    onChange={(e) => setTemplateIsPremium(e.target.checked)}
                    className="w-4 h-4 text-royal-maroon rounded"
                  />
                  <label htmlFor="isPremium" className="text-xs font-semibold text-neutral-700 cursor-pointer">
                    Premium Badge
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={templateDesc}
                  onChange={(e) => setTemplateDesc(e.target.value)}
                  placeholder="Traditional handcrafted aesthetics..."
                  className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTemplate}
                  className="px-5 py-2 rounded-xl bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy text-xs font-bold shadow-royal disabled:opacity-50"
                >
                  {isCreatingTemplate ? 'Saving Template...' : 'Publish Template to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
