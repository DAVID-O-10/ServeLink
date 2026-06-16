import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  X, Phone, MapPin, ExternalLink, Share2, Heart, Trash2, Flag, BadgeCheck, ChevronLeft,
} from 'lucide-react';
import SEO from '../components/SEO';
import Stars from '../components/marketplace/Stars';
import { useBusinesses } from '../context/BusinessContext';
import { useAuth } from '../context/AuthContext';
import {
  getBusinessById,
  getAverageRating,
  addReview,
  saveBooking,
  isFavorite,
  toggleFavorite,
} from '../lib/storage';
import { trackAnalytics as trackRemote, reportListing } from '../lib/businessService';

function getWhatsAppUrl(phone, message = '') {
  const number = String(phone || '').replace(/\D/g, '');
  if (!number) return null;
  const encoded = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${number}${encoded}`;
}

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3C/svg%3E";

export default function BusinessProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { remove, refresh } = useBusinesses();
  const [business, setBusiness] = useState(null);
  const [fav, setFav] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, text: '' });
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', message: '', date: '' });
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [toast, setToast] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const b = getBusinessById(id);
    setBusiness(b);
    setFav(isFavorite(id));
    if (b) {
      trackRemote(b.id, 'views');
      refresh();
    }
  }, [id, refresh]);

  if (!business) {
    return (
      <section className="min-h-screen pt-36 px-4 text-center">
        <p className="text-gray-500 text-lg">Business not found.</p>
        <Link to="/marketplace" className="mt-4 inline-block text-emerald-600 font-semibold">
          Back to marketplace
        </Link>
      </section>
    );
  }

  const images = business.images?.length ? business.images : business.image ? [business.image] : [PLACEHOLDER];
  const rating = getAverageRating(business);
  const canDelete = !business.userId || business.userId === user?.userId;

  const toastMsg = (m) => {
    setToast(m);
    setTimeout(() => setToast(''), 3000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out ${business.businessName} on ServeLink!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: business.businessName, text, url });
      } catch {
        /* noop */
      }
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`);
      toastMsg('Link copied!');
    }
  };

  const submitReview = (e) => {
    e.preventDefault();
    addReview(business.id, {
      userName: reviewForm.name || user?.name || 'Guest',
      rating: Number(reviewForm.rating),
      text: reviewForm.text,
      userId: user?.userId,
    });
    setBusiness(getBusinessById(id));
    setReviewForm({ name: '', rating: 5, text: '' });
    toastMsg('Review added!');
  };

  const submitBooking = (e) => {
    e.preventDefault();
    saveBooking({
      businessId: business.id,
      businessName: business.businessName,
      ownerId: business.userId,
      ...bookingForm,
    });
    setBookingForm({ name: '', email: '', message: '', date: '' });
    toastMsg('Quote request sent!');
  };

  const submitReport = () => {
    reportListing(business.id, reportReason, user?.userId ?? 'anonymous');
    setShowReport(false);
    setReportReason('');
    toastMsg('Report submitted. Thank you.');
  };

  return (
    <>
      <SEO title={business.businessName} description={business.description?.slice(0, 160)} />
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-28 pb-20 px-4 lg:px-10">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-6 hover:text-emerald-600"
        >
          <ChevronLeft size={20} /> Back to marketplace
        </Link>

        <article className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-[32px] overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="relative h-[240px] sm:h-[280px] lg:h-[420px] bg-gray-100">
            <img src={images[galleryIdx]} alt="" className="w-full h-full object-cover" />
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-2 pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setGalleryIdx(i)}
                    className={`shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden border-2 ${i === galleryIdx ? 'border-emerald-500' : 'border-white/50'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  toggleFavorite(business.id);
                  setFav(isFavorite(business.id));
                }}
                className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow"
              >
                <Heart size={18} className={fav ? 'fill-red-500 text-red-500' : 'text-gray-700'} />
              </button>
              <button type="button" onClick={handleShare} className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">
                <Share2 size={18} />
              </button>
              <button type="button" onClick={() => setShowReport(true)} className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">
                <Flag size={18} className="text-amber-600" />
              </button>
              {canDelete && (
                <button type="button" onClick={() => setDeleteConfirm(true)} className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shadow">
                  <Trash2 size={18} className="text-red-500" />
                </button>
              )}
            </div>
          </div>

          <div className="p-6 lg:p-10 space-y-8">
            <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                    {business.category}
                  </span>
                  {business.verified && (
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold flex items-center gap-1">
                      <BadgeCheck size={14} /> Verified
                    </span>
                  )}
                  {business.featured && (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">Featured</span>
                  )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-800 dark:text-white">{business.businessName}</h1>
                {rating > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Stars rating={rating} size={16} />
                    <span className="text-gray-500">{rating.toFixed(1)} · {business.reviews?.length ?? 0} reviews</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    trackRemote(business.id, 'whatsappClicks');
                    const url = getWhatsAppUrl(
                      business.whatsapp,
                      `Hi, I found your business (${business.businessName}) on ServeLink and I would like to know more.`
                    );
                    if (url) window.open(url, '_blank');
                  }}
                  className="h-12 px-4 sm:px-6 rounded-2xl bg-emerald-500 text-white font-semibold flex items-center gap-2 text-sm sm:text-base"
                >
                  <Phone size={16} /> Contact Us
                </button>
                <a
                  href={business.locationLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackRemote(business.id, 'mapsClicks')}
                  className="h-12 px-4 sm:px-6 rounded-2xl bg-gray-800 text-white font-semibold flex items-center gap-2 text-sm sm:text-base"
                >
                  <MapPin size={16} /> Maps
                </a>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{business.description}</p>
            <p className="flex items-start gap-2 text-gray-500"><MapPin size={18} className="shrink-0 mt-0.5" />{business.address}</p>

            {(business.instagram || business.tiktok) && (
              <div className="flex flex-wrap gap-3">
                {business.instagram && (
                  <a href={business.instagram} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center gap-2 text-sm">
                    Instagram <ExternalLink size={14} />
                  </a>
                )}
                {business.tiktok && (
                  <a href={business.tiktok} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center gap-2 text-sm">
                    TikTok <ExternalLink size={14} />
                  </a>
                )}
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Request a quote</h3>
                <form onSubmit={submitBooking} className="space-y-3">
                  <input required placeholder="Your name" value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-800" />
                  <input required type="email" placeholder="Email" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-800" />
                  <input type="date" value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-800" />
                  <textarea required rows={3} placeholder="What do you need?" value={bookingForm.message} onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-800 resize-none" />
                  <button type="submit" className="w-full h-12 bg-emerald-500 text-white rounded-xl font-semibold">Send request</button>
                </form>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Reviews</h3>
                <form onSubmit={submitReview} className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <input placeholder="Your name" value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-800" />
                  <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })} className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-800">
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} stars</option>
                    ))}
                  </select>
                  <textarea required rows={2} placeholder="Your review" value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-800 resize-none" />
                  <button type="submit" className="h-11 px-5 bg-gray-800 text-white rounded-xl font-semibold text-sm">Post review</button>
                </form>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {(business.reviews ?? []).length === 0 ? (
                    <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
                  ) : (
                    business.reviews.map((r) => (
                      <div key={r.id} className="border-b border-gray-100 dark:border-gray-700 pb-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-800 dark:text-white">{r.userName}</span>
                          <Stars rating={r.rating} size={12} />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{r.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>

        {showReport && (
          <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full">
              <h3 className="font-bold text-lg mb-2">Report listing</h3>
              <textarea value={reportReason} onChange={(e) => setReportReason(e.target.value)} rows={3} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600" placeholder="Reason..." />
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowReport(false)} className="flex-1 h-11 border rounded-xl">Cancel</button>
                <button type="button" onClick={submitReport} disabled={!reportReason.trim()} className="flex-1 h-11 bg-amber-500 text-white rounded-xl font-semibold">Submit</button>
              </div>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center">
              <h3 className="font-bold text-lg">Remove listing?</h3>
              <p className="text-gray-500 text-sm mt-2">This cannot be undone.</p>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setDeleteConfirm(false)} className="flex-1 h-11 border rounded-xl">Cancel</button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const result = await remove(business.id, user?.userId);
                      if (result.remoteAttempted) {
                        if (result.remoteRemoved) {
                          toastMsg('Listing removed from Supabase and local storage.');
                        } else {
                          toastMsg('Listing removed locally, but remote delete failed.');
                        }
                      } else {
                        toastMsg('Listing removed locally.');
                      }
                      setDeleteConfirm(false);
                      setTimeout(() => navigate('/marketplace'), 1100);
                    } catch (e) {
                      console.error(e);
                      toastMsg(e.message || 'Remove failed.');
                    }
                  }}
                  className="flex-1 h-11 bg-red-500 text-white rounded-xl font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-2 rounded-xl text-sm z-[300] whitespace-nowrap">
            {toast}
          </div>
        )}
      </section>
    </>
  );
}
