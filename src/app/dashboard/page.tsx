'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  LayoutDashboard,
  Users,
  Calendar,
  Eye,
  Edit,
  Share2,
  Copy,
  Check,
  Plus,
  ArrowRight,
  TrendingUp,
  Heart,
  Globe,
  Settings,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Clock,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createFromTemplateId = searchParams.get('createFrom');

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [guests, setGuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // New Project / Invitation Modal state
  const [showCreateModal, setShowCreateModal] = useState(!!createFromTemplateId);
  const [templatesList, setTemplatesList] = useState<any[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newBrideName, setNewBrideName] = useState('Priya Sharma');
  const [newGroomName, setNewGroomName] = useState('Rohan Singhania');
  const [selectedTemplateId, setSelectedTemplateId] = useState(createFromTemplateId || '');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // 1. Fetch user & dashboard data
    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch('/api/projects').then((r) => r.json()),
      fetch('/api/invitations').then((r) => r.json()),
      fetch('/api/guests').then((r) => r.json()),
      fetch('/api/templates').then((r) => r.json()),
    ])
      .then(([userData, projData, invData, guestData, templData]) => {
        if (!userData?.user) {
          router.push('/login');
          return;
        }
        setCurrentUser(userData.user);
        setProjects(projData.projects || []);
        setInvitations(invData.invitations || []);
        setGuests(guestData.guests || []);
        setTemplatesList(templData.templates || []);

        if (createFromTemplateId) {
          setSelectedTemplateId(createFromTemplateId);
          setShowCreateModal(true);
        }
      })
      .catch((err) => console.error('Dashboard load error:', err))
      .finally(() => setIsLoading(false));
  }, [router, createFromTemplateId]);

  // Copy link helper
  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/invitation/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // Toggle publish
  const handleTogglePublish = async (invitationId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? false : true;
    try {
      const res = await fetch(`/api/invitations/${invitationId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: newStatus }),
      });
      if (res.ok) {
        setInvitations((prev) =>
          prev.map((inv) =>
            inv.id === invitationId
              ? { ...inv, status: newStatus ? 'published' : 'draft' }
              : inv
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create new invitation workflow
  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId) return;
    setIsCreating(true);

    try {
      // Find or create project
      let targetProjectId = projects[0]?.id;
      if (!targetProjectId || newProjectName) {
        const projRes = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectName: newProjectName || `${newBrideName} & ${newGroomName}'s Wedding`,
            brideName: newBrideName,
            groomName: newGroomName,
          }),
        });
        const projData = await projRes.json();
        targetProjectId = projData.project.id;
      }

      // Create Invitation
      const invRes = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: targetProjectId,
          templateId: selectedTemplateId,
          invitationTitle: `Wedding Celebration of ${newBrideName} & ${newGroomName}`,
        }),
      });

      const invData = await invRes.json();
      if (invData.invitation) {
        router.push(`/dashboard/editor/${invData.invitation.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  // Telemetry Metrics calculation
  const totalInvites = invitations.length;
  const publishedCount = invitations.filter((i) => i.status === 'published').length;
  const draftCount = totalInvites - publishedCount;
  const totalGuests = guests.length;

  let attendingCount = 0;
  let attendeesHeadcount = 0;
  let declinedCount = 0;
  let tentativeCount = 0;

  guests.forEach((g) => {
    g.invitations?.forEach((inv: any) => {
      const r = inv.rsvpResponse;
      if (r) {
        if (r.responseStatus === 'attending') {
          attendingCount++;
          attendeesHeadcount += r.numberOfAttendees || 1;
        } else if (r.responseStatus === 'declined') {
          declinedCount++;
        } else if (r.responseStatus === 'tentative') {
          tentativeCount++;
          attendeesHeadcount += r.numberOfAttendees || 1;
        }
      }
    });
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] flex flex-col justify-center items-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#C9A44C] border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-serif text-royal-maroon font-bold">
          Loading your wedding portal...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
      <Navbar />

      {/* Top Welcome Strip */}
      <div className="bg-[#FFFDF9] border-b border-[#C9A44C]/30 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#C9A44C]">
              Host Management Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-royal-maroon">
              Namaste, {currentUser?.fullName}!
            </h1>
            <p className="text-xs text-neutral-500 font-light">
              Manage your wedding invitations, guest lists, multi-day functions, and real-time RSVPs.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/guests"
              className="px-4 py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold shadow-xs flex items-center space-x-2 transition-all"
            >
              <Users className="w-4 h-4 text-royal-maroon" />
              <span>Guest CRM & RSVPs</span>
            </Link>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 rounded-xl bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy text-xs font-bold shadow-royal flex items-center space-x-2 transition-all border border-[#C9A44C]"
            >
              <Plus className="w-4 h-4 text-[#E8D390]" />
              <span>New Invitation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        {/* Metric Telemetry Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Invitations */}
          <div className="p-5 rounded-2xl bg-white border border-[#C9A44C]/30 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-royal-champagne/40 text-royal-maroon flex items-center justify-center shrink-0 border border-[#C9A44C]/30">
              <Sparkles className="w-6 h-6 text-[#C9A44C]" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 font-bold uppercase block">
                Total Invitations
              </span>
              <span className="text-2xl font-serif font-bold text-royal-maroon">
                {totalInvites}
              </span>
              <span className="text-[10px] text-neutral-400 block">
                {publishedCount} Published • {draftCount} Draft
              </span>
            </div>
          </div>

          {/* Card 2: Total Guests */}
          <div className="p-5 rounded-2xl bg-white border border-[#C9A44C]/30 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-royal-champagne/40 text-royal-maroon flex items-center justify-center shrink-0 border border-[#C9A44C]/30">
              <Users className="w-6 h-6 text-[#C9A44C]" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 font-bold uppercase block">
                Guest Directory
              </span>
              <span className="text-2xl font-serif font-bold text-royal-maroon">
                {totalGuests}
              </span>
              <span className="text-[10px] text-neutral-400 block">
                Tokens generated & segmented
              </span>
            </div>
          </div>

          {/* Card 3: Confirmed Attendees */}
          <div className="p-5 rounded-2xl bg-white border border-emerald-300 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 font-bold uppercase block">
                Confirmed Headcount
              </span>
              <span className="text-2xl font-serif font-bold text-emerald-800">
                {attendeesHeadcount} Guests
              </span>
              <span className="text-[10px] text-emerald-600 font-medium block">
                {attendingCount} families confirmed
              </span>
            </div>
          </div>

          {/* Card 4: RSVP Rate */}
          <div className="p-5 rounded-2xl bg-white border border-[#C9A44C]/30 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-royal-champagne/40 text-royal-maroon flex items-center justify-center shrink-0 border border-[#C9A44C]/30">
              <TrendingUp className="w-6 h-6 text-[#C9A44C]" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 font-bold uppercase block">
                RSVP Responses
              </span>
              <span className="text-2xl font-serif font-bold text-royal-maroon">
                {attendingCount + declinedCount + tentativeCount} / {totalGuests}
              </span>
              <span className="text-[10px] text-neutral-400 block">
                {declinedCount} declined • {tentativeCount} maybe
              </span>
            </div>
          </div>
        </div>

        {/* My Invitations Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif font-bold text-royal-maroon">
                My Wedding Invitations
              </h2>
              <p className="text-xs text-neutral-500">
                Customized digital invitation pages associated with your account
              </p>
            </div>
          </div>

          {invitations.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#C9A44C]/30 shadow-sm space-y-4">
              <span className="text-4xl block">💌</span>
              <h3 className="font-serif font-bold text-lg text-royal-maroon">
                You haven't created an invitation yet
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Select from our 15 authentic cultural templates to create your interactive invitation.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 rounded-full bg-royal-maroon text-[#FFF9F0] text-xs font-bold shadow-royal"
              >
                Choose Template & Start
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white rounded-2xl border border-[#C9A44C]/40 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A44C] block">
                          {inv.template?.category?.name || 'Traditional Design'} • {inv.template?.name}
                        </span>
                        <h3 className="font-serif font-bold text-lg text-royal-maroon line-clamp-1">
                          {inv.invitationTitle}
                        </h3>
                      </div>

                      {inv.status === 'published' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold">
                          Draft
                        </span>
                      )}
                    </div>

                    {/* Events Mini List */}
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-1">
                      <span className="font-semibold text-neutral-800 block text-[11px]">
                        Itinerary Events ({inv.events?.length || 0}):
                      </span>
                      {inv.events?.slice(0, 2).map((ev: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-[11px]">
                          <span>{ev.eventName}</span>
                          <span className="text-neutral-500">{ev.startTime || 'Scheduled'}</span>
                        </div>
                      ))}
                      {(inv.events?.length || 0) > 2 && (
                        <span className="text-[10px] text-neutral-400 block pt-0.5">
                          + {inv.events.length - 2} more functions
                        </span>
                      )}
                    </div>

                    {/* Shareable Link Bar */}
                    <div className="flex items-center space-x-2 p-2 rounded-xl bg-royal-champagne/30 border border-[#C9A44C]/30 text-xs">
                      <Globe className="w-3.5 h-3.5 text-royal-maroon shrink-0" />
                      <span className="font-mono text-[11px] text-neutral-700 truncate flex-1">
                        /invitation/{inv.slug}
                      </span>
                      <button
                        onClick={() => handleCopyLink(inv.slug)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-neutral-50 border border-neutral-200 text-[10px] font-semibold text-royal-maroon flex items-center space-x-1 shrink-0 transition-colors"
                      >
                        {copiedSlug === inv.slug ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTogglePublish(inv.id, inv.status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          inv.status === 'published'
                            ? 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                            : 'bg-emerald-700 text-white hover:bg-emerald-800'
                        }`}
                      >
                        {inv.status === 'published' ? 'Unpublish' : 'Publish Live'}
                      </button>
                      <Link
                        href={`/dashboard/guests?projectId=${inv.projectId}&invitationId=${inv.id}`}
                        className="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 text-xs font-semibold text-neutral-700 flex items-center space-x-1"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Guests ({inv._count?.guestInvitations || 0})</span>
                      </Link>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/invitation/${inv.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-royal-maroon hover:border-royal-maroon transition-colors"
                        title="View Public Invitation"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/editor/${inv.id}`}
                        className="px-4 py-1.5 rounded-lg bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy text-xs font-bold flex items-center space-x-1.5 shadow-royal"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#E8D390]" />
                        <span>Launch Studio</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create New Invitation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#C9A44C] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A44C]">
                  New Wedding Project
                </span>
                <h3 className="font-serif font-bold text-xl text-royal-maroon">
                  Create Your Wedding Invitation
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvitation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Choose Cultural Template
                </label>
                <select
                  required
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-royal-maroon outline-none bg-white cursor-pointer"
                >
                  <option value="">-- Select an authentic template --</option>
                  {templatesList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.category?.name}) {Number(t.price) === 0 ? '• Free' : '• Premium'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Bride's Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newBrideName}
                    onChange={(e) => setNewBrideName(e.target.value)}
                    placeholder="Priya Sharma"
                    className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-sm focus:border-royal-maroon outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Groom's Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newGroomName}
                    onChange={(e) => setNewGroomName(e.target.value)}
                    placeholder="Rohan Singhania"
                    className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-sm focus:border-royal-maroon outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !selectedTemplateId}
                  className="px-6 py-2.5 rounded-xl bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy text-xs font-bold shadow-royal flex items-center space-x-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#E8D390]" />
                  <span>{isCreating ? 'Setting Up Studio...' : 'Start Customizing in Studio'}</span>
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

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center font-serif text-royal-maroon font-bold">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
