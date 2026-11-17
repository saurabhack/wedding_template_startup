'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Users,
  Plus,
  Upload,
  Download,
  Share2,
  Copy,
  Check,
  Trash2,
  MessageSquare,
  Search,
  Filter,
  Sparkles,
  ArrowLeft,
  Utensils,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

function GuestManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterProjectId = searchParams.get('projectId');
  const filterInvitationId = searchParams.get('invitationId');

  const [guests, setGuests] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [rsvpFilter, setRsvpFilter] = useState('all');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Add Guest Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('VIP Relatives');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedInvitationId, setSelectedInvitationId] = useState('');
  const [personalizedMsg, setPersonalizedMsg] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // CSV Import Modal
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Load guests & data
  const loadData = () => {
    setIsLoading(true);
    Promise.all([
      fetch('/api/projects').then((r) => r.json()),
      fetch('/api/invitations').then((r) => r.json()),
      fetch('/api/guests').then((r) => r.json()),
    ])
      .then(([projData, invData, guestData]) => {
        setProjects(projData.projects || []);
        setInvitations(invData.invitations || []);
        setGuests(guestData.guests || []);

        if (projData.projects?.length > 0) {
          setSelectedProjectId(filterProjectId || projData.projects[0].id);
        }
        if (invData.invitations?.length > 0) {
          setSelectedInvitationId(filterInvitationId || invData.invitations[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [filterProjectId, filterInvitationId]);

  // Handle single guest add
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectId,
          invitationId: selectedInvitationId || undefined,
          fullName,
          familyName,
          phone,
          email,
          category,
          personalizedMessage: personalizedMsg,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setFullName('');
        setFamilyName('');
        setPhone('');
        setEmail('');
        setPersonalizedMsg('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  // Handle CSV Import
  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvContent.trim()) return;
    setIsImporting(true);

    try {
      const res = await fetch('/api/guests/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectId,
          invitationId: selectedInvitationId || undefined,
          csvData: csvContent,
        }),
      });

      if (res.ok) {
        setShowCsvModal(false);
        setCsvContent('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsImporting(false);
    }
  };

  // Delete Guest
  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm('Are you sure you want to remove this guest?')) return;
    try {
      const res = await fetch(`/api/guests?id=${guestId}`, { method: 'DELETE' });
      if (res.ok) {
        setGuests((prev) => prev.filter((g) => g.id !== guestId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Copy Personalized URL
  const handleCopyGuestLink = (slug: string, token: string) => {
    const url = `${window.location.origin}/invitation/${slug}?guest=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  // WhatsApp click-to-chat deep link
  const generateWhatsAppLink = (guest: any, inv: any) => {
    const link = `${window.location.origin}/invitation/${inv.slug}?guest=${inv.uniqueToken}`;
    const cleanPhone = guest.phone ? guest.phone.replace(/[^0-9]/g, '') : '';
    const message = `Namaste ${guest.fullName}! 🙏\n\nWith the divine blessings of our ancestors, we warmly invite you and your family to celebrate our wedding ceremonies.\n\nPlease find the invitation itinerary, sacred timings, and Google Maps venue navigation on your personalized card:\n${link}\n\nWe look forward to celebrating together!`;
    const encoded = encodeURIComponent(message);
    return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
  };

  // Export CSV of all guests and RSVP statuses
  const handleExportCsv = () => {
    const headers = [
      'Full Name',
      'Family Name',
      'Phone',
      'Email',
      'Category',
      'RSVP Status',
      'Attendees Count',
      'Dietary Preference',
      'Message',
      'Personalized Link',
    ];

    const rows = guests.map((g) => {
      const inv = g.invitations?.[0];
      const r = inv?.rsvpResponse;
      const link = inv
        ? `${window.location.origin}/invitation/${inv.invitation?.slug}?guest=${inv.uniqueToken}`
        : '';
      return [
        `"${g.fullName}"`,
        `"${g.familyName || ''}"`,
        `"${g.phone || ''}"`,
        `"${g.email || ''}"`,
        `"${g.category}"`,
        `"${r?.responseStatus || 'Pending'}"`,
        `"${r?.numberOfAttendees || 0}"`,
        `"${r?.dietaryPreference || ''}"`,
        `"${(r?.message || '').replace(/"/g, '""')}"`,
        `"${link}"`,
      ].join(',');
    });

    const csvString = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ShubhVivah_Guests_RSVP_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Guests
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (g.familyName && g.familyName.toLowerCase().includes(search.toLowerCase())) ||
      (g.phone && g.phone.includes(search));

    const matchesCategory = categoryFilter === 'all' || g.category === categoryFilter;

    let matchesRsvp = true;
    const r = g.invitations?.[0]?.rsvpResponse;
    if (rsvpFilter === 'attending') matchesRsvp = r?.responseStatus === 'attending';
    if (rsvpFilter === 'declined') matchesRsvp = r?.responseStatus === 'declined';
    if (rsvpFilter === 'tentative') matchesRsvp = r?.responseStatus === 'tentative';
    if (rsvpFilter === 'pending') matchesRsvp = !r || r.responseStatus === 'pending';

    return matchesSearch && matchesCategory && matchesRsvp;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
      <Navbar />

      {/* Header Strip */}
      <div className="bg-[#FFFDF9] border-b border-[#C9A44C]/30 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Link href="/dashboard" className="text-neutral-400 hover:text-royal-maroon text-xs">
                Dashboard
              </Link>
              <span className="text-neutral-300">/</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A44C]">
                Guest CRM & RSVP Tracker
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-royal-maroon">
              Wedding Guest Directory
            </h1>
            <p className="text-xs text-neutral-500 font-light">
              Generate individualized invitation links, send 1-tap WhatsApp greetings, and track dietary RSVPs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowCsvModal(true)}
              className="px-3.5 py-2 rounded-xl border border-[#C9A44C]/50 bg-royal-champagne/40 hover:bg-royal-champagne text-royal-maroon text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Bulk CSV Import</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy text-xs font-bold shadow-royal flex items-center space-x-1.5 border border-[#C9A44C]"
            >
              <Plus className="w-3.5 h-3.5 text-[#E8D390]" />
              <span>Add Guest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main CRM Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-white border border-[#C9A44C]/30 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, family or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-300 text-xs outline-none focus:border-royal-maroon"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white text-neutral-700 outline-none"
            >
              <option value="all">All Guest Categories</option>
              <option value="VIP Relatives">VIP Relatives</option>
              <option value="Bride Side">Bride Side</option>
              <option value="Groom Side">Groom Side</option>
              <option value="Friends">Friends</option>
              <option value="Colleagues">Colleagues</option>
            </select>

            <select
              value={rsvpFilter}
              onChange={(e) => setRsvpFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white text-neutral-700 outline-none"
            >
              <option value="all">All RSVP Responses</option>
              <option value="attending">Confirmed Attending</option>
              <option value="declined">Declined</option>
              <option value="tentative">Tentative / Maybe</option>
              <option value="pending">Pending Response</option>
            </select>
          </div>
        </div>

        {/* Guests Table */}
        <div className="bg-white rounded-3xl border border-[#C9A44C]/30 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700">
              <thead className="bg-[#FFFDF9] border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="py-3.5 px-6">Guest & Family</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">RSVP Status</th>
                  <th className="py-3.5 px-6">Attendees & Meals</th>
                  <th className="py-3.5 px-6">Personalized Link</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-400">
                      Loading guest records...
                    </td>
                  </tr>
                ) : filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-500">
                      No matching guests found in this filter.
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((g) => {
                    const guestInv = g.invitations?.[0];
                    const r = guestInv?.rsvpResponse;
                    const slug = guestInv?.invitation?.slug;
                    const token = guestInv?.uniqueToken;

                    return (
                      <tr key={g.id} className="hover:bg-amber-50/30 transition-colors">
                        {/* Guest & Family */}
                        <td className="py-4 px-6">
                          <div>
                            <span className="font-bold text-neutral-900 block text-sm">
                              {g.fullName}
                            </span>
                            {g.familyName && (
                              <span className="text-[11px] text-neutral-500 block">
                                {g.familyName}
                              </span>
                            )}
                            <div className="text-[10px] text-neutral-400 flex items-center space-x-2 mt-0.5">
                              {g.phone && <span>{g.phone}</span>}
                              {g.email && <span>• {g.email}</span>}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-semibold border border-neutral-200">
                            {g.category}
                          </span>
                        </td>

                        {/* RSVP Status */}
                        <td className="py-4 px-6">
                          {r?.responseStatus === 'attending' ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>Attending</span>
                            </span>
                          ) : r?.responseStatus === 'declined' ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-bold text-[10px]">
                              <XCircle className="w-3 h-3 text-red-700" />
                              <span>Declined</span>
                            </span>
                          ) : r?.responseStatus === 'tentative' ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                              <HelpCircle className="w-3 h-3 text-amber-700" />
                              <span>Maybe</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500 text-[10px]">
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Attendees & Meals */}
                        <td className="py-4 px-6">
                          {r ? (
                            <div>
                              <span className="font-bold text-neutral-800 block">
                                {r.numberOfAttendees} Attendees
                              </span>
                              <span className="text-[10px] text-neutral-500 flex items-center space-x-1">
                                <Utensils className="w-3 h-3 text-[#C9A44C]" />
                                <span>{r.dietaryPreference || 'Vegetarian'}</span>
                              </span>
                              {r.message && (
                                <p className="text-[10px] text-neutral-400 italic line-clamp-1 mt-0.5">
                                  "{r.message}"
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-neutral-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Personalized Link */}
                        <td className="py-4 px-6">
                          {token && slug ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleCopyGuestLink(slug, token)}
                                className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-semibold flex items-center space-x-1 transition-colors"
                              >
                                {copiedToken === token ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="text-emerald-600 font-bold">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy Link</span>
                                  </>
                                )}
                              </button>

                              <Link
                                href={`/invitation/${slug}?guest=${token}`}
                                target="_blank"
                                className="p-1 text-neutral-400 hover:text-royal-maroon"
                                title="Open Guest Card"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          ) : (
                            <span className="text-neutral-400 text-[11px]">No link issued</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {guestInv && (
                              <a
                                href={generateWhatsAppLink(g, guestInv)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center space-x-1 shadow-xs transition-colors"
                                title="Send WhatsApp Message"
                              >
                                <Share2 className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            )}

                            <button
                              onClick={() => handleDeleteGuest(g.id)}
                              className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                              title="Delete Guest"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Single Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#C9A44C] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A44C]">
                  Guest Personalization
                </span>
                <h3 className="font-serif font-bold text-xl text-royal-maroon">
                  Add Wedding Guest
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGuest} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Shri Rajesh Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs outline-none focus:border-royal-maroon"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Family Designation
                  </label>
                  <input
                    type="text"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    placeholder="Sharma Parivaar"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs outline-none focus:border-royal-maroon"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs outline-none focus:border-royal-maroon"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Category Tag
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs outline-none bg-white"
                  >
                    <option value="VIP Relatives">VIP Relatives</option>
                    <option value="Bride Side">Bride Side</option>
                    <option value="Groom Side">Groom Side</option>
                    <option value="Friends">Friends</option>
                    <option value="Colleagues">Colleagues</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Personalized Greeting Note (Displays on Guest's Card)
                </label>
                <textarea
                  rows={2}
                  value={personalizedMsg}
                  onChange={(e) => setPersonalizedMsg(e.target.value)}
                  placeholder="Dear Rajesh Bhaiya and Bhabhi, our celebration is incomplete without you!"
                  className="w-full p-3 rounded-xl border border-neutral-300 text-xs outline-none focus:border-royal-maroon"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-5 py-2 rounded-xl bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy text-xs font-bold shadow-royal disabled:opacity-50"
                >
                  {isAdding ? 'Adding Guest...' : 'Save & Generate Token'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Bulk Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#C9A44C] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A44C]">
                  Planner Bulk Importer
                </span>
                <h3 className="font-serif font-bold text-xl text-royal-maroon">
                  Import Guests via CSV
                </h3>
              </div>
              <button
                onClick={() => setShowCsvModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCsvImport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Paste CSV Data (or upload below)
                </label>
                <p className="text-[11px] text-neutral-500 mb-2 font-mono">
                  Format: Full Name, Family Name, Phone, Email, Category, Note
                </p>
                <textarea
                  rows={6}
                  required
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder={`Full Name,Family Name,Phone,Email,Category,Note
"Shri Rajesh Sharma","Sharma Parivaar","+919811122334","rajesh@example.com","VIP Relatives","Warm blessings"
"Dr. Amit Verma","Verma Family","+919822233445","amit@example.com","Friends","Excited for Sangeet!"`}
                  className="w-full p-3 rounded-xl border border-neutral-300 font-mono text-[11px] outline-none focus:border-royal-maroon"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowCsvModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isImporting}
                  className="px-5 py-2 rounded-xl bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy text-xs font-bold shadow-royal disabled:opacity-50 flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E8D390]" />
                  <span>{isImporting ? 'Importing...' : 'Process CSV Import'}</span>
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

export default function GuestManagementPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center font-serif text-royal-maroon font-bold">Loading Guest CRM...</div>}>
      <GuestManagementContent />
    </Suspense>
  );
}
