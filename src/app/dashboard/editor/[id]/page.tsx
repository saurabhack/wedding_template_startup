'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import LiveTemplateRenderer from '@/components/LiveTemplateRenderer';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Save,
  Globe,
  Share2,
  Download,
  Eye,
  Plus,
  Trash2,
  Upload,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Palette,
  Users,
  Smartphone,
  Tablet,
  Monitor,
  Check,
  AlertCircle,
  Music,
  QrCode,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default function InvitationEditorPage({ params }: Props) {
  const router = useRouter();
  const invitationId = params.id;

  const [invitation, setInvitation] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Active Editor Section Tab
  const [activeTab, setActiveTab] = useState<
    'couple' | 'family' | 'welcome' | 'events' | 'design' | 'shagun'
  >('couple');

  // Device Viewport mode for preview
  const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  // Form states initialized from invitation
  const [invitationTitle, setInvitationTitle] = useState('');
  const [mantra, setMantra] = useState('');
  const [welcomeNote, setWelcomeNote] = useState('');

  // Couple details
  const [brideName, setBrideName] = useState('');
  const [brideParents, setBrideParents] = useState('');
  const [bridePhoto, setBridePhoto] = useState('');
  const [brideBio, setBrideBio] = useState('');

  const [groomName, setGroomName] = useState('');
  const [groomParents, setGroomParents] = useState('');
  const [groomPhoto, setGroomPhoto] = useState('');
  const [groomBio, setGroomBio] = useState('');
  const [hashtag, setHashtag] = useState('');

  // Family members list
  const [familyList, setFamilyList] = useState<any[]>([]);

  // Multi-event functions list
  const [eventsList, setEventsList] = useState<any[]>([]);

  // Design styling tokens
  const [primaryColor, setPrimaryColor] = useState('#800020');
  const [secondaryColor, setSecondaryColor] = useState('#C9A44C');
  const [backgroundColor, setBackgroundColor] = useState('#FFF9F0');
  const [animationType, setAnimationType] = useState('palace-doors');
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Shagun UPI Registry
  const [shagunEnabled, setShagunEnabled] = useState(true);
  const [shagunUpiId, setShagunUpiId] = useState('');
  const [shagunNote, setShagunNote] = useState('');

  // Load invitation data on mount
  useEffect(() => {
    fetch(`/api/invitations/${invitationId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load invitation');
        return res.json();
      })
      .then((data) => {
        const inv = data.invitation;
        setInvitation(inv);
        setTemplate(inv.template);
        setInvitationTitle(inv.invitationTitle || '');

        const invData = (inv.invitationData as any) || {};
        setMantra(invData.mantra || '');
        setWelcomeNote(invData.welcomeNote || '');

        // Couple
        setBrideName(invData.couple?.bride?.name || '');
        setBrideParents(invData.couple?.bride?.parents || '');
        setBridePhoto(invData.couple?.bride?.photo || '');
        setBrideBio(invData.couple?.bride?.bio || '');

        setGroomName(invData.couple?.groom?.name || '');
        setGroomParents(invData.couple?.groom?.parents || '');
        setGroomPhoto(invData.couple?.groom?.photo || '');
        setGroomBio(invData.couple?.groom?.bio || '');
        setHashtag(invData.couple?.hashtag || '');

        // Family
        setFamilyList(inv.project?.familyMembers || []);

        // Events
        setEventsList(
          inv.events?.map((e: any) => ({
            ...e,
            eventDate: e.eventDate ? e.eventDate.split('T')[0] : '',
          })) || []
        );

        // Styling
        const styling = invData.customStyling || {};
        const configColors = inv.template?.designConfiguration?.colors || {};
        setPrimaryColor(styling.primaryColor || configColors.primary || '#800020');
        setSecondaryColor(styling.secondaryColor || configColors.secondary || '#C9A44C');
        setBackgroundColor(styling.backgroundColor || configColors.background || '#FFF9F0');
        setAnimationType(
          invData.animationType ||
            inv.template?.designConfiguration?.animationType ||
            'palace-doors'
        );
        setAudioEnabled(invData.audio?.enabled !== false);

        // Shagun
        setShagunEnabled(invData.shagunRegistry?.enabled !== false);
        setShagunUpiId(invData.shagunRegistry?.upiId || '');
        setShagunNote(invData.shagunRegistry?.note || '');
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg('Error loading invitation details.');
      })
      .finally(() => setIsLoading(false));
  }, [invitationId]);

  // Image Upload handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'bride' | 'groom') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    if (invitation?.projectId) formData.append('projectId', invitation.projectId);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        if (target === 'bride') setBridePhoto(data.url);
        if (target === 'groom') setGroomPhoto(data.url);
      }
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  // Add Family Member
  const addFamilyMember = () => {
    setFamilyList((prev) => [
      ...prev,
      {
        fullName: 'New Family Member',
        relationship: 'Grandparents / Elders',
        description: 'With blessings',
      },
    ]);
  };

  // Remove Family Member
  const removeFamilyMember = (index: number) => {
    setFamilyList((prev) => prev.filter((_, i) => i !== index));
  };

  // Add Wedding Event
  const addEvent = () => {
    setEventsList((prev) => [
      ...prev,
      {
        eventName: 'New Wedding Function',
        eventDate: new Date().toISOString().split('T')[0],
        startTime: '07:00 PM',
        endTime: '11:00 PM',
        venue: 'The Grand Palace',
        address: 'City, State',
        dressCode: 'Traditional Elegance',
        description: 'Celebratory gathering with dinner and music.',
      },
    ]);
  };

  // Remove Wedding Event
  const removeEvent = (index: number) => {
    setEventsList((prev) => prev.filter((_, i) => i !== index));
  };

  // Construct Live Data for Preview
  const liveInvitationData = {
    mantra,
    welcomeNote,
    couple: {
      bride: { name: brideName, parents: brideParents, photo: bridePhoto, bio: brideBio },
      groom: { name: groomName, parents: groomParents, photo: groomPhoto, bio: groomBio },
      hashtag,
    },
    audio: {
      enabled: audioEnabled,
      trackUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
      title: 'Auspicious Shehnai Raag',
    },
    shagunRegistry: {
      enabled: shagunEnabled,
      upiId: shagunUpiId,
      note: shagunNote,
      qrCodeUrl: shagunUpiId
        ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent(
            shagunUpiId
          )}&pn=${encodeURIComponent(brideName + 'Weds' + groomName)}`
        : '',
    },
    customStyling: {
      primaryColor,
      secondaryColor,
      backgroundColor,
    },
    animationType,
  };

  // Save changes to database
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/invitations/${invitationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationTitle,
          invitationData: liveInvitationData,
          events: eventsList,
          familyMembers: familyList,
        }),
      });

      if (!res.ok) throw new Error('Failed to save changes');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle publish
  const handleTogglePublish = async () => {
    const nextStatus = invitation?.status === 'published' ? false : true;
    try {
      const res = await fetch(`/api/invitations/${invitationId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: nextStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setInvitation((prev: any) => ({ ...prev, status: data.status }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] flex flex-col justify-center items-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#C9A44C] border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-serif text-royal-maroon font-bold">
          Loading ShubhVivah Studio...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
      {/* Studio Header Bar */}
      <header className="sticky top-0 z-50 bg-[#FFF9F0] border-b border-[#C9A44C]/30 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 transition-colors"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A44C] block">
                Live Studio • {template?.name}
              </span>
              <input
                type="text"
                value={invitationTitle}
                onChange={(e) => setInvitationTitle(e.target.value)}
                className="font-serif font-bold text-base text-royal-maroon bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-royal-maroon outline-none px-1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            {saveSuccess && (
              <span className="text-xs text-emerald-700 font-semibold flex items-center space-x-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>Saved Live!</span>
              </span>
            )}

            <button
              onClick={handleTogglePublish}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                invitation?.status === 'published'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              {invitation?.status === 'published' ? '● Published' : '○ Draft Mode'}
            </button>

            <Link
              href={`/invitation/${invitation?.slug}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl border border-[#C9A44C]/40 bg-white hover:bg-royal-champagne/40 text-royal-maroon text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Link</span>
            </Link>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy text-xs font-bold shadow-royal flex items-center space-x-1.5 transition-all disabled:opacity-50 border border-[#C9A44C]"
            >
              <Save className="w-3.5 h-3.5 text-[#E8D390]" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Two-Column Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Form Controls (7 Columns on large screens) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#C9A44C]/30 shadow-md overflow-hidden flex flex-col">
          {/* Section Navigation Tabs */}
          <div className="flex overflow-x-auto border-b border-neutral-100 bg-[#FFFDF9] p-2 gap-1 text-xs font-semibold scrollbar-none">
            <button
              onClick={() => setActiveTab('couple')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'couple'
                  ? 'bg-royal-maroon text-[#FFF9F0] shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              👰 Groom & Bride
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'events'
                  ? 'bg-royal-maroon text-[#FFF9F0] shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              📅 Events ({eventsList.length})
            </button>
            <button
              onClick={() => setActiveTab('family')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'family'
                  ? 'bg-royal-maroon text-[#FFF9F0] shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              👵 Family Blessings
            </button>
            <button
              onClick={() => setActiveTab('welcome')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'welcome'
                  ? 'bg-royal-maroon text-[#FFF9F0] shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              📜 Mantra & Note
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'design'
                  ? 'bg-royal-maroon text-[#FFF9F0] shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              🎨 Colors & Style
            </button>
            <button
              onClick={() => setActiveTab('shagun')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'shagun'
                  ? 'bg-royal-maroon text-[#FFF9F0] shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              🧧 Shagun UPI
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* 1. COUPLE SECTION */}
            {activeTab === 'couple' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Bride Details */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-royal-maroon block">
                    Bride Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Bride Full Name
                      </label>
                      <input
                        type="text"
                        value={brideName}
                        onChange={(e) => setBrideName(e.target.value)}
                        placeholder="Priya Sharma"
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs outline-none focus:border-royal-maroon"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Bride's Parents
                      </label>
                      <input
                        type="text"
                        value={brideParents}
                        onChange={(e) => setBrideParents(e.target.value)}
                        placeholder="Smt. Sunita & Shri Ramesh Sharma"
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs outline-none focus:border-royal-maroon"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Bride Photograph (Upload or Image URL)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={bridePhoto}
                        onChange={(e) => setBridePhoto(e.target.value)}
                        placeholder="https://... or upload below"
                        className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 text-xs outline-none focus:border-royal-maroon"
                      />
                      <label className="px-3 py-2 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-xs font-semibold cursor-pointer shrink-0 flex items-center space-x-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(e, 'bride')}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Groom Details */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-royal-maroon block">
                    Groom Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Groom Full Name
                      </label>
                      <input
                        type="text"
                        value={groomName}
                        onChange={(e) => setGroomName(e.target.value)}
                        placeholder="Rohan Singhania"
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs outline-none focus:border-royal-maroon"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Groom's Parents
                      </label>
                      <input
                        type="text"
                        value={groomParents}
                        onChange={(e) => setGroomParents(e.target.value)}
                        placeholder="Smt. Rekha & Shri Vikram Singhania"
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs outline-none focus:border-royal-maroon"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Groom Photograph (Upload or Image URL)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={groomPhoto}
                        onChange={(e) => setGroomPhoto(e.target.value)}
                        placeholder="https://... or upload below"
                        className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 text-xs outline-none focus:border-royal-maroon"
                      />
                      <label className="px-3 py-2 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-xs font-semibold cursor-pointer shrink-0 flex items-center space-x-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(e, 'groom')}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Couple Hashtag */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Couple Wedding Hashtag
                  </label>
                  <input
                    type="text"
                    value={hashtag}
                    onChange={(e) => setHashtag(e.target.value)}
                    placeholder="#PriyaFoundHerRohan"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:border-royal-maroon outline-none"
                  />
                </div>
              </div>
            )}

            {/* 2. WEDDING EVENTS ITINERARY */}
            {activeTab === 'events' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-royal-maroon">
                    Wedding Functions ({eventsList.length})
                  </span>
                  <button
                    onClick={addEvent}
                    className="px-3 py-1.5 rounded-lg bg-royal-maroon text-[#FFF9F0] text-xs font-bold flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Function</span>
                  </button>
                </div>

                {eventsList.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 relative"
                  >
                    <button
                      onClick={() => removeEvent(idx)}
                      className="absolute top-3 right-3 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <span className="text-[10px] font-bold text-[#C9A44C] block uppercase">
                      Function #{idx + 1}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">
                          Event Name
                        </label>
                        <input
                          type="text"
                          value={ev.eventName}
                          onChange={(e) => {
                            const updated = [...eventsList];
                            updated[idx].eventName = e.target.value;
                            setEventsList(updated);
                          }}
                          placeholder="Mehendi & Haldi"
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">
                          Event Date
                        </label>
                        <input
                          type="date"
                          value={ev.eventDate}
                          onChange={(e) => {
                            const updated = [...eventsList];
                            updated[idx].eventDate = e.target.value;
                            setEventsList(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">
                          Timings (e.g. 11:00 AM)
                        </label>
                        <input
                          type="text"
                          value={ev.startTime || ''}
                          onChange={(e) => {
                            const updated = [...eventsList];
                            updated[idx].startTime = e.target.value;
                            setEventsList(updated);
                          }}
                          placeholder="11:00 AM – 03:00 PM"
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">
                          Dress Code / Attire
                        </label>
                        <input
                          type="text"
                          value={ev.dressCode || ''}
                          onChange={(e) => {
                            const updated = [...eventsList];
                            updated[idx].dressCode = e.target.value;
                            setEventsList(updated);
                          }}
                          placeholder="Festive Yellows & Florals"
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">
                          Venue Name
                        </label>
                        <input
                          type="text"
                          value={ev.venue || ''}
                          onChange={(e) => {
                            const updated = [...eventsList];
                            updated[idx].venue = e.target.value;
                            setEventsList(updated);
                          }}
                          placeholder="Taj Umaid Bhawan Palace"
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">
                          Google Maps URL
                        </label>
                        <input
                          type="url"
                          value={ev.mapUrl || ''}
                          onChange={(e) => {
                            const updated = [...eventsList];
                            updated[idx].mapUrl = e.target.value;
                            setEventsList(updated);
                          }}
                          placeholder="https://maps.google.com/?q=..."
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">
                        Address Details
                      </label>
                      <input
                        type="text"
                        value={ev.address || ''}
                        onChange={(e) => {
                          const updated = [...eventsList];
                          updated[idx].address = e.target.value;
                          setEventsList(updated);
                        }}
                        placeholder="Circuit House Road, Cantt Area, Jodhpur"
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. FAMILY SECTION */}
            {activeTab === 'family' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-royal-maroon">
                    Elders & Family Members
                  </span>
                  <button
                    onClick={addFamilyMember}
                    className="px-3 py-1.5 rounded-lg bg-royal-maroon text-[#FFF9F0] text-xs font-bold flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Member</span>
                  </button>
                </div>

                {familyList.map((fm, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-3 relative"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={fm.fullName}
                          onChange={(e) => {
                            const updated = [...familyList];
                            updated[idx].fullName = e.target.value;
                            setFamilyList(updated);
                          }}
                          placeholder="Full Name (e.g. Late Shri Dinanath Sharma)"
                          className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs outline-none"
                        />
                        <input
                          type="text"
                          value={fm.relationship}
                          onChange={(e) => {
                            const updated = [...familyList];
                            updated[idx].relationship = e.target.value;
                            setFamilyList(updated);
                          }}
                          placeholder="Relationship (e.g. Paternal Grandparents)"
                          className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => removeFamilyMember(idx)}
                      className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 4. WELCOME & MANTRA */}
            {activeTab === 'welcome' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Sacred Invocations / Shloka / Mantra
                  </label>
                  <textarea
                    rows={3}
                    value={mantra}
                    onChange={(e) => setMantra(e.target.value)}
                    placeholder="॥ श्री गणेशाय नमः ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ..."
                    className="w-full p-3 rounded-xl border border-neutral-300 text-xs focus:border-royal-maroon outline-none font-devanagari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Formal Invitation Welcome Note
                  </label>
                  <textarea
                    rows={3}
                    value={welcomeNote}
                    onChange={(e) => setWelcomeNote(e.target.value)}
                    placeholder="Together with our families, we joyfully invite you..."
                    className="w-full p-3 rounded-xl border border-neutral-300 text-xs focus:border-royal-maroon outline-none"
                  />
                </div>
              </div>
            )}

            {/* 5. DESIGN & PALETTE */}
            {activeTab === 'design' && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-royal-maroon block mb-1">
                    Visual Animation Style
                  </span>
                  <p className="text-[11px] text-neutral-500 mb-2">
                    Select the active entrance and background animation effect for this invitation:
                  </p>
                  <select
                    value={animationType}
                    onChange={(e) => setAnimationType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold bg-white text-neutral-800 outline-none focus:border-royal-maroon"
                  >
                    <option value="palace-doors">🚪 3D Royal Palace Gates (Swinging Doors + Rose Petals)</option>
                    <option value="falling-petals">🌸 Romantic Rose Petals Shower</option>
                    <option value="marigold-shower">🌼 Auspicious Marigold Cascade (Haldi & Sangeet)</option>
                    <option value="temple-bells">🔔 Swinging Temple Bells & White Jasmine (South Indian)</option>
                    <option value="rotating-mandala">☸ Sacred Rotating Mandala & Glowing Rays</option>
                    <option value="starry-sparkles">✨ Twinkling Starlight & Champagne Sparkles</option>
                    <option value="floating-diyas">🪔 Floating Earthen Diyas & Sacred Warmth</option>
                    <option value="gold-dust">⚜ Floating Gold Leaf Flakes</option>
                  </select>
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-royal-maroon block">
                  Cultural Color Palette Swatches
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Primary Accent
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-full px-2 py-1 text-xs font-mono border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Gold Highlight
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-full px-2 py-1 text-xs font-mono border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Canvas Background
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-full px-2 py-1 text-xs font-mono border rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-neutral-800 block">
                      Ambient Shehnai / Sitar Audio
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      Plays sacred Indian traditional music with unmute control
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={audioEnabled}
                    onChange={(e) => setAudioEnabled(e.target.checked)}
                    className="w-4 h-4 text-royal-maroon rounded"
                  />
                </div>
              </div>
            )}

            {/* 6. SHAGUN UPI REGISTRY */}
            {activeTab === 'shagun' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-royal-maroon block">
                    Digital Shagun (Lifafa)
                  </span>
                  <input
                    type="checkbox"
                    checked={shagunEnabled}
                    onChange={(e) => setShagunEnabled(e.target.checked)}
                    className="w-4 h-4 text-royal-maroon rounded"
                  />
                </div>

                {shagunEnabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Your UPI ID for Blessing Shagun
                      </label>
                      <input
                        type="text"
                        value={shagunUpiId}
                        onChange={(e) => setShagunUpiId(e.target.value)}
                        placeholder="priya.sharma@okhdfcbank"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:border-royal-maroon outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Custom Note for Guests
                      </label>
                      <textarea
                        rows={2}
                        value={shagunNote}
                        onChange={(e) => setShagunNote(e.target.value)}
                        placeholder="Your presence and blessings are our greatest gift..."
                        className="w-full p-3 rounded-xl border border-neutral-300 text-xs focus:border-royal-maroon outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Real-time Live Canvas Preview (6 Columns on large screens) */}
        <div className="lg:col-span-6 flex flex-col items-center space-y-4 sticky top-24">
          {/* Viewport Sizer Controls */}
          <div className="bg-white px-4 py-2 rounded-2xl border border-[#C9A44C]/30 shadow-sm flex items-center space-x-3 text-xs">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">
              Preview Mode:
            </span>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
                viewportMode === 'mobile'
                  ? 'bg-royal-maroon text-white font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
                viewportMode === 'tablet'
                  ? 'bg-royal-maroon text-white font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
                viewportMode === 'desktop'
                  ? 'bg-royal-maroon text-white font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
          </div>

          {/* Interactive Live Canvas Container */}
          <div
            className={`w-full transition-all duration-300 max-h-[80vh] overflow-y-auto rounded-3xl p-2 border-2 border-dashed border-[#C9A44C]/40 ${
              viewportMode === 'mobile'
                ? 'max-w-sm'
                : viewportMode === 'tablet'
                ? 'max-w-md'
                : 'max-w-xl'
            }`}
          >
            <LiveTemplateRenderer
              invitationData={liveInvitationData}
              designConfiguration={{
                ...template?.designConfiguration,
                animationType,
              }}
              events={eventsList}
              familyMembers={familyList}
              isPreview={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
