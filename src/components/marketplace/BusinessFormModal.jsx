// BusinessFormModal.jsx
import { useState, useRef, useEffect } from 'react';
import { X, MapPin, ImageOff, Tag } from 'lucide-react';
import { BUSINESS_CATEGORIES } from '../../constants/categories';
import { useAuth } from '../../context/AuthContext';
import { compressImage } from '../../lib/compressImage';

const emptyForm = {
  businessName: '',
  businessType: '',
  category: '',
  description: '',
  address: '',
  locationLink: '',
  whatsapp: '',
  instagram: '',
  tiktok: '',
  images: [],
};

// ── Typeahead combobox ──────────────────────────────────────────────
function CategoryCombobox({ value, onChange }) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapRef = useRef(null);

  const matches = query.trim()
    ? BUSINESS_CATEGORIES.filter((c) =>
        c.toLowerCase().includes(query.toLowerCase())
      )
    : BUSINESS_CATEGORIES;

  const pick = (val) => {
    setQuery(val);
    onChange(val);
    setOpen(false);
    setActiveIdx(-1);
  };

  const highlight = (text) => {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-emerald-600 font-semibold">
          {text.slice(idx, idx + query.length)}
        </span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex items-center w-full h-14 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-900 px-5 gap-3 focus-within:border-emerald-500">
        <Tag size={15} className="text-emerald-500 shrink-0" />
        <input
          type="text"
          required
          placeholder="e.g. Bakery, Plumbing, Hair Salon…"
          className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 text-sm"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
            setActiveIdx(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!open) return;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIdx((i) => Math.min(i + 1, matches.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIdx((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              if (activeIdx >= 0 && matches[activeIdx]) pick(matches[activeIdx]);
              else if (query.trim()) pick(query.trim());
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); onChange(''); setOpen(false); }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl max-h-52 overflow-y-auto py-1">
          {matches.length > 0 ? (
            matches.map((cat, i) => (
              <li
                key={cat}
                onMouseDown={() => pick(cat)}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm cursor-pointer transition-colors ${
                  i === activeIdx
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Tag size={13} className="text-gray-400 shrink-0" />
                {highlight(cat)}
              </li>
            ))
          ) : (
            <li
              onMouseDown={() => pick(query.trim())}
              className="flex items-center gap-3 px-5 py-2.5 text-sm cursor-pointer text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <X size={13} className="shrink-0" />
              Add &ldquo;{query}&rdquo; as custom category
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
// ───────────────────────────────────────────────────────────────────

export default function BusinessFormModal({ open, onClose, onSubmit, initial, isSubmitting }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState(() =>
    initial
      ? {
          ...emptyForm,
          ...initial,
          images: initial.images?.length ? initial.images : initial.image ? [initial.image] : [],
        }
      : emptyForm
  );

  if (!open) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) continue;
      try {
        const compressed = await compressImage(file);
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), compressed].slice(0, 3),
        }));
      } catch { /* skip */ }
    }
    e.target.value = '';
  };

  const removeImage = (idx) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      businessType: formData.category,
      userId: user?.userId ?? null,
      image: formData.images[0] ?? '',
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-start p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-[32px] p-6 lg:p-10 mt-24 mb-10 relative shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 flex justify-center items-center"
        >
          <X size={20} />
        </button>

        <h2 className="text-3xl font-black text-gray-800 dark:text-white">
          {initial ? 'Edit Business' : 'Register Business'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Add up to 3 images (auto-compressed for saving).</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {/* Images — unchanged */}
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-3">
              Images ({formData.images.length}/3)
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {formData.images.map((img, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs">×</button>
                </div>
              ))}
            </div>
            {formData.images.length < 3 && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer hover:border-emerald-400 bg-gray-50 dark:bg-gray-900">
                <ImageOff className="text-gray-400 mb-2" size={24} />
                <span className="text-gray-500 text-sm">Add images</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">Business Name</label>
              <input
                name="businessName"
                required
                value={formData.businessName}
                onChange={handleChange}
                className="w-full h-14 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-900 px-5 outline-none focus:border-emerald-500"
              />
            </div>

            
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">Category</label>
              <CategoryCombobox
                value={formData.category}
                onChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}
              />
            </div>
          </div>

         
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">Description</label>
            <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-900 p-5 outline-none resize-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">Address</label>
            <input name="address" required value={formData.address} onChange={handleChange} className="w-full h-14 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-900 px-5 outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-emerald-500" /> Google Maps Link
            </label>
            <input type="url" name="locationLink" required value={formData.locationLink} onChange={handleChange} className="w-full h-14 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-900 px-5 outline-none focus:border-emerald-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">WhatsApp</label>
              <input name="whatsapp" required value={formData.whatsapp} onChange={handleChange} className="w-full h-14 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-900 px-5 outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">Instagram</label>
              <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full h-14 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-900 px-5 outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">TikTok</label>
              <input type="url" name="tiktok" value={formData.tiktok} onChange={handleChange} className="w-full h-14 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-900 px-5 outline-none focus:border-emerald-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !formData.images.length}
            className="h-16 rounded-2xl bg-gray-800 dark:bg-emerald-600 hover:bg-black text-white text-lg font-semibold disabled:opacity-70"
          >
            {isSubmitting ? 'Saving...' : initial ? 'Update Business' : 'Register Business'}
          </button>
        </form>
      </div>
    </div>
  );
}