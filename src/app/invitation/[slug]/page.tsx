'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import LiveTemplateRenderer from '@/components/LiveTemplateRenderer';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Heart,
  Share2,
  Download,
  Calendar,
  Sparkles,
  X,
  CheckCircle,
  Copy,
  Check,
  QrCode,
  MapPin,
  Clock,
  Utensils,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Props {
  params: { slug: string };
}

function PublicInvitationContent({ params }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const guestToken = searchParams.get('guest');
  const slug = params.slug;

  const [invitation, setInvitation] = useState<any>(null);
  const [guestInfo, setGuestInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Wax seal envelope opening state
  const [isUnsealed, setIsUnsealed] = useState(false);

  // RSVP Modal
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpFullName, setRsvpFullName] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'attending' | 'declined' | 'tentative'>('attending');
  const [attendeesCount, setAttendeesCount] = useState(2);
  const [dietaryPref, setDietaryPref] = useState('Vegetarian');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // QR Code Modal
  const [showQrModal, setShowQrModal] = useState(false);

  // WhatsApp Share Modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // PDF Generating indicator
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    // Fetch invitation by slug
    fetch(`/api/invitations`)
      .then((r) => r.json())
      .then((data) => {
        const found = data.invitations?.find((i: any) => i.slug === slug);
        if (found) {
          setInvitation(found);
          // Check for matching guest token
          if (guestToken && found.guestInvitations) {
            const matched = found.guestInvitations.find((gi: any) => gi.uniqueToken === guestToken);
            if (matched) {
              setGuestInfo({
                fullName: matched.guest.fullName,
                familyName: matched.guest.familyName,
                personalizedMessage: matched.personalizedMessage,
                token: matched.uniqueToken,
                allowedEventIds: matched.allowedEventIds,
              });
              setRsvpFullName(matched.guest.fullName);
              if (matched.rsvpResponse) {
                setRsvpStatus(matched.rsvpResponse.responseStatus);
                setAttendeesCount(matched.rsvpResponse.numberOfAttendees || 1);
                setDietaryPref(matched.rsvpResponse.dietaryPreference || 'Vegetarian');
                setRsvpMessage(matched.rsvpResponse.message || '');
              }
            }
          }
        } else {
          setErrorMsg('Invitation not found or currently unlisted.');
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg('Error loading wedding invitation.');
      })
      .finally(() => setIsLoading(false));
  }, [slug, guestToken]);

  // Handle RSVP Submission
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRsvp(true);

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: guestToken || undefined,
          invitationSlug: slug,
          fullName: rsvpFullName || guestInfo?.fullName || 'Esteemed Guest',
          responseStatus: rsvpStatus,
          numberOfAttendees: Number(attendeesCount),
          dietaryPreference: dietaryPref,
          message: rsvpMessage,
        }),
      });

      if (res.ok) {
        setRsvpSuccess(true);
        if (rsvpStatus === 'attending') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
        setTimeout(() => {
          setShowRsvpModal(false);
          setRsvpSuccess(false);
        }, 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  // High-Resolution 300 DPI PDF Generation
  const handleDownloadPdf = async () => {
    const element = document.getElementById('invitation-render-container');
    if (!element) return;
    setIsGeneratingPdf(true);

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 mm width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${slug}-shubhvivah-invitation.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Copy shareable link
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  // WhatsApp share
  const handleOpenWhatsApp = () => {
    const bride = invitation?.invitationData?.couple?.bride?.name || 'Bride';
    const groom = invitation?.invitationData?.couple?.groom?.name || 'Groom';
    const msg = `Namaste! 🙏\n\nWith the divine blessings of our ancestors, you are warmly invited to celebrate the wedding of ${bride} & ${groom}.\n\nView the sacred itinerary and RSVP here:\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] flex flex-col justify-center items-center">
        <div className="w-14 h-14 rounded-full border-4 border-[#C9A44C] border-t-transparent animate-spin mb-4" />
        <p className="text-base font-serif text-royal-maroon font-bold">
          Opening Sacred Wedding Invitation...
        </p>
      </div>
    );
  }

  if (errorMsg || !invitation) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] flex flex-col justify-center items-center p-6 text-center">
        <span className="text-5xl block mb-4">🪔</span>
        <h2 className="text-2xl font-serif font-bold text-royal-maroon mb-2">
          Invitation Not Found
        </h2>
        <p className="text-xs text-neutral-600 max-w-sm mb-6">
          This invitation may be in private draft mode or the link has changed.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 rounded-full bg-royal-maroon text-[#FFF9F0] text-xs font-bold shadow-royal"
        >
          Return to ShubhVivah Home
        </button>
      </div>
    );
  }

  const invitationData = invitation.invitationData || {};
  const designConfig = {
    ...(invitation.template?.designConfiguration || {}),
    ...(invitationData.animationType ? { animationType: invitationData.animationType } : {}),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A0F12] via-[#2A1810] to-[#1A0F12] text-[#FFF9F0] py-6 sm:py-12 px-3 sm:px-6 relative flex flex-col items-center">
      {/* Privacy meta header */}
      <meta name="robots" content="noindex, nofollow" />

      {/* Decorative Gold Stars */}
      <div className="absolute top-4 left-6 text-2xl text-[#C9A44C]/30 select-none">✦</div>
      <div className="absolute top-24 right-8 text-xl text-[#C9A44C]/30 select-none">✧</div>
      <div className="absolute bottom-10 left-12 text-3xl text-[#C9A44C]/20 select-none">✦</div>

      {/* Royal Wax Seal Opening Screen if not unsealed yet */}
      {!isUnsealed ? (
        <div className="my-auto max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-[#C9A44C]/40 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="space-y-2">
            <span className="text-xs font-serif italic text-[#E8D390] block">
              ॥ श्री गणेशाय नमः ॥
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block">
              You Have Received A Royal Wedding Invitation
            </span>
            <h1 className="text-3xl font-serif font-bold text-white">
              {invitationData.couple?.bride?.name || 'Bride'} & {invitationData.couple?.groom?.name || 'Groom'}
            </h1>
            {guestInfo && (
              <p className="text-xs text-amber-200 font-medium pt-1">
                Personalized For {guestInfo.fullName}
              </p>
            )}
          </div>

          {/* Interactive Wax Seal Stamp */}
          <div className="py-6 flex flex-col items-center">
            <button
              onClick={() => {
                setIsUnsealed(true);
                confetti({
                  particleCount: 80,
                  spread: 60,
                  origin: { y: 0.5 },
                });
              }}
              className="group relative w-24 h-24 rounded-full bg-gradient-to-b from-[#800020] via-[#5A1024] to-[#3B0713] border-4 border-[#C9A44C] shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95"
            >
              <span className="text-3xl group-hover:rotate-12 transition-transform">🪷</span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-[#E8D390] mt-1">
                Tap to Open
              </span>
            </button>
            <span className="text-[11px] text-neutral-400 mt-4 animate-pulse">
              Click the royal seal to unfold the invitation
            </span>
          </div>

          <div className="text-[10px] text-neutral-500 font-serif">
            Powered by ShubhVivah • Indian Wedding SaaS
          </div>
        </div>
      ) : (
        /* The Unfolded Live Invitation */
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
          {/* Top Host Brand Badge */}
          <div className="flex justify-between items-center px-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🪔</span>
              <span className="text-xs font-serif font-bold text-[#E8D390]">
                ShubhVivah Wedding Invitation
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowQrModal(true)}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#FFF9F0] border border-white/20 flex items-center space-x-1.5 transition-all"
                title="View QR Code"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Code</span>
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-lg flex items-center space-x-1.5 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* The Core Live Rendered Invitation Card */}
          <LiveTemplateRenderer
            invitationData={invitationData}
            designConfiguration={designConfig}
            events={invitation.events || []}
            familyMembers={invitation.project?.familyMembers || []}
            guestInfo={guestInfo}
            onRsvpClick={() => setShowRsvpModal(true)}
            onPdfDownload={handleDownloadPdf}
            onWhatsAppShare={handleOpenWhatsApp}
          />

          {/* Bottom Floating Bar */}
          <div className="text-center text-xs text-neutral-400 py-4 font-light">
            <p>Need to save this invitation? Download the 300 DPI PDF or bookmark this link.</p>
          </div>
        </div>
      )}

      {/* RSVP Submission Modal */}
      {showRsvpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#FFF9F0] text-neutral-800 rounded-3xl border-2 border-[#C9A44C] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-[#C9A44C]/30 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A44C]">
                  Honored Guest Response
                </span>
                <h3 className="font-serif font-bold text-xl text-royal-maroon">
                  Confirm Your RSVP
                </h3>
              </div>
              <button
                onClick={() => setShowRsvpModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {rsvpSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-serif font-bold text-xl text-royal-maroon">
                  Dhanyavaad! Your RSVP is Confirmed
                </h4>
                <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                  The host family has been notified of your response. We look forward to celebrating together!
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Your Full Name & Family
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpFullName}
                    onChange={(e) => setRsvpFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma & Family"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none focus:border-royal-maroon bg-white"
                  />
                </div>

                {/* RSVP Attendance Radio Buttons */}
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1.5">
                    Will you be attending?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('attending')}
                      className={`py-2 px-2 rounded-xl text-center font-bold border transition-all ${
                        rsvpStatus === 'attending'
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      ✓ Joyfully Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('declined')}
                      className={`py-2 px-2 rounded-xl text-center font-bold border transition-all ${
                        rsvpStatus === 'declined'
                          ? 'bg-red-700 text-white border-red-800 shadow-sm'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      ✗ Regretfully No
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('tentative')}
                      className={`py-2 px-2 rounded-xl text-center font-bold border transition-all ${
                        rsvpStatus === 'tentative'
                          ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      ? Tentative
                    </button>
                  </div>
                </div>

                {rsvpStatus !== 'declined' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-neutral-700 mb-1">
                          Number of Attendees
                        </label>
                        <select
                          value={attendeesCount}
                          onChange={(e) => setAttendeesCount(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none bg-white font-medium"
                        >
                          <option value={1}>1 Person</option>
                          <option value={2}>2 People</option>
                          <option value={3}>3 People</option>
                          <option value={4}>4 People</option>
                          <option value={5}>5+ Family Members</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-neutral-700 mb-1">
                          Meal Preference
                        </label>
                        <select
                          value={dietaryPref}
                          onChange={(e) => setDietaryPref(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none bg-white font-medium"
                        >
                          <option value="Vegetarian">Pure Vegetarian</option>
                          <option value="Jain">Jain Vegetarian (No root veg)</option>
                          <option value="Non-Vegetarian">Non-Vegetarian</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Congratulatory Message for Couple
                  </label>
                  <textarea
                    rows={2}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Wishing you a lifetime of laughter, joy and togetherness!"
                    className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-royal-maroon bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingRsvp}
                    className="w-full py-3 rounded-xl bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy font-bold text-xs shadow-royal transition-all disabled:opacity-50 border border-[#C9A44C]"
                  >
                    {isSubmittingRsvp ? 'Submitting...' : 'Submit RSVP Response'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white text-neutral-800 rounded-3xl border border-[#C9A44C] shadow-2xl p-6 text-center space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-serif font-bold text-royal-maroon">
                Invitation QR Code
              </span>
              <button onClick={() => setShowQrModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.href : ''
                )}`}
                alt="Invitation QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <p className="text-[11px] text-neutral-500">
              Scan with any mobile camera to immediately open this wedding invitation page.
            </p>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-md bg-white text-neutral-800 rounded-3xl border border-[#C9A44C] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="font-serif font-bold text-base text-royal-maroon">
                Share Wedding Invitation
              </h3>
              <button onClick={() => setShowShareModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleOpenWhatsApp}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </button>

              <div className="flex items-center space-x-2 p-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs">
                <span className="font-mono text-[11px] text-neutral-600 truncate flex-1">
                  {typeof window !== 'undefined' ? window.location.href : ''}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-royal-maroon text-white font-bold text-[10px] shrink-0"
                >
                  {shareCopied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicInvitationPage(props: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1A0F12] flex items-center justify-center font-serif text-[#E8D390] font-bold">Unfolding Sacred Invitation...</div>}>
      <PublicInvitationContent {...props} />
    </Suspense>
  );
}
