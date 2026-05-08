import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  MapPin,
  X,
  Phone,
  Building2,
  Filter,
  ExternalLink,
  Trash2,
  Share2,
  ImageOff,
} from 'lucide-react';

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='16' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

function Marketplace() {
  const [businesses, setBusinesses] = useState(() => {
    try {
      const saved = localStorage.getItem('marketplaceBusinesses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    description: '',
    address: '',
    locationLink: '',
    whatsapp: '',
    instagram: '',
    tiktok: '',
    image: '',
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('marketplaceBusinesses', JSON.stringify(businesses));
    } catch {
      // storage quota exceeded — fail silently
    }
  }, [businesses]);

  // Show toast
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Input change handler
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Image upload with size check (max 2MB)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image must be under 2MB');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(r => setTimeout(r, 600)); // small delay for feel

    const newBusiness = { id: Date.now(), ...formData };
    setBusinesses(prev => [newBusiness, ...prev]);

    setFormData({
      businessName: '',
      businessType: '',
      description: '',
      address: '',
      locationLink: '',
      whatsapp: '',
      instagram: '',
      tiktok: '',
      image: '',
    });

    setIsSubmitting(false);
    setShowModal(false);
    showToast('Business registered successfully!');
  };

  // Delete business
  const handleDelete = (id) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
    setSelectedBusiness(null);
    setDeleteConfirm(null);
    showToast('Business removed.');
  };

  // Share business
  const handleShare = async (business) => {
    const text = `Check out ${business.businessName} on ServeLink!\n📍 ${business.address}\n📞 wa.me/${business.whatsapp}`;
    if (navigator.share) {
      try { await navigator.share({ title: business.businessName, text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      showToast('Business info copied to clipboard!');
    }
  };

  // Categories
  const categories = useMemo(() => {
    const types = businesses.map(b => b.businessType).filter(Boolean);
    return ['All', ...new Set(types)];
  }, [businesses]);

  // Filtered list
  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        b.businessName?.toLowerCase().includes(q) ||
        b.businessType?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === 'All' || b.businessType === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [businesses, searchTerm, categoryFilter]);

  return (
    <>
      <section className='min-h-screen w-full bg-gray-50 px-4 lg:px-10 pt-36 pb-28'>

        {/* HEADER */}
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5'>
            <div>
              <h1 className='text-4xl lg:text-6xl font-black text-gray-800'>Marketplace</h1>
              <p className='text-gray-500 mt-2 text-base lg:text-lg'>
                Discover trusted professionals, local services and businesses.
              </p>
            </div>

            <div className='hidden lg:flex items-center gap-3 bg-white px-5 py-4 rounded-3xl shadow-sm border border-gray-200'>
              <Building2 className='text-emerald-500' size={28} />
              <div>
                <h3 className='font-bold text-gray-800'>{businesses.length} Businesses Registered</h3>
                <p className='text-sm text-gray-500'>Growing marketplace</p>
              </div>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className='w-full bg-white rounded-3xl shadow-sm border border-gray-200 p-4 lg:p-5 flex flex-col lg:flex-row gap-4'>
            <div className='flex-1 flex items-center gap-3 bg-gray-100 rounded-2xl px-4 h-14'>
              <Search className='text-gray-500 shrink-0' size={20} />
              <input
                type='text'
                placeholder='Search businesses, services, address...'
                className='bg-transparent outline-none w-full text-gray-700'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className='text-gray-400 hover:text-gray-600'>
                  <X size={16} />
                </button>
              )}
            </div>

            <div className='flex items-center gap-3 bg-gray-100 rounded-2xl px-4 h-14 lg:w-[280px]'>
              <Filter className='text-gray-500 shrink-0' size={20} />
              <select
                className='bg-transparent outline-none w-full text-gray-700'
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* RESULTS COUNT */}
        {searchTerm || categoryFilter !== 'All' ? (
          <p className='mt-6 text-sm text-gray-500'>
            Showing <span className='font-semibold text-gray-800'>{filteredBusinesses.length}</span> result{filteredBusinesses.length !== 1 ? 's' : ''}
            {categoryFilter !== 'All' && <> in <span className='font-semibold text-emerald-600'>{categoryFilter}</span></>}
          </p>
        ) : null}

        {/* BUSINESS CARDS */}
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-8'>
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map(business => (
              <div
                key={business.id}
                onClick={() => setSelectedBusiness(business)}
                className='group bg-white rounded-[30px] overflow-hidden shadow-sm border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer'
              >
                {/* IMAGE */}
                <div className='h-60 overflow-hidden relative bg-gray-100'>
                  <img
                    src={business.image || PLACEHOLDER_IMG}
                    alt={business.businessName}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    onError={e => { e.target.src = PLACEHOLDER_IMG; }}
                  />
                  <div className='absolute top-4 left-4 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg'>
                    {business.businessType}
                  </div>
                  {/* Share button */}
                  <button
                    onClick={e => { e.stopPropagation(); handleShare(business); }}
                    className='absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md'
                  >
                    <Share2 size={15} className='text-gray-700' />
                  </button>
                </div>

                {/* CONTENT */}
                <div className='p-6 flex flex-col gap-4'>
                  <div>
                    <h2 className='text-xl font-bold text-gray-800 line-clamp-1'>{business.businessName}</h2>
                    <div className='flex items-start gap-2 mt-2 text-gray-500 text-sm'>
                      <MapPin size={15} className='mt-0.5 shrink-0' />
                      <p className='line-clamp-2'>{business.address}</p>
                    </div>
                    {business.description && (
                      <p className='mt-2 text-gray-400 text-sm line-clamp-2'>{business.description}</p>
                    )}
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      window.open(`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`, '_blank');
                    }}
                    className='w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 text-white font-semibold flex justify-center items-center gap-2 text-sm'
                  >
                    <Phone size={16} />
                    Contact on WhatsApp
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-full flex flex-col justify-center items-center py-24 text-center'>
              <div className='w-24 h-24 rounded-full bg-gray-200 flex justify-center items-center'>
                <Building2 className='text-gray-400' size={40} />
              </div>
              <h2 className='text-2xl font-bold text-gray-800 mt-6'>No Businesses Found</h2>
              <p className='text-gray-500 mt-3 max-w-md'>
                {searchTerm || categoryFilter !== 'All'
                  ? 'Try adjusting your filters or search term.'
                  : 'Be the first to register your business on the marketplace!'}
              </p>
              {!searchTerm && categoryFilter === 'All' && (
                <button
                  onClick={() => setShowModal(true)}
                  className='mt-6 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-semibold hover:bg-emerald-600 transition duration-300'
                >
                  Register Your Business
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FAB — Add Business */}
      <button
        onClick={() => setShowModal(true)}
        className='fixed bottom-7 right-7 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-2xl shadow-emerald-500/30 flex justify-center items-center text-white transition-all duration-300 hover:scale-110 z-50 group'
        title='Register Business'
      >
        <Plus size={26} className='transition-transform duration-300 group-hover:rotate-90' />
      </button>

      {/* REGISTER MODAL */}
      {showModal && (
        <div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-start p-4 overflow-y-auto'
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className='w-full max-w-3xl bg-white rounded-[32px] p-6 lg:p-10 mt-24 mb-10 relative shadow-2xl'>
            <button
              onClick={() => setShowModal(false)}
              className='absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex justify-center items-center transition duration-200'
            >
              <X size={20} />
            </button>

            <h2 className='text-3xl lg:text-4xl font-black text-gray-800'>Register Business</h2>
            <p className='text-gray-500 mt-2'>Add your business to the marketplace and connect with customers.</p>

            <form onSubmit={handleSubmit} className='mt-8 flex flex-col gap-5'>

              {/* Image upload with preview */}
              <div>
                <label className='font-semibold text-gray-700 block mb-3'>Upload Business Image</label>
                {formData.image ? (
                  <div className='relative w-full h-48 rounded-2xl overflow-hidden group'>
                    <img src={formData.image} alt="Preview" className='w-full h-full object-cover' />
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center'>
                      <label className='cursor-pointer px-4 py-2 bg-white rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-100'>
                        Change Image
                        <input type='file' accept='image/*' className='hidden' onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className='flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 hover:border-emerald-400 rounded-2xl cursor-pointer transition-colors duration-200 bg-gray-50 hover:bg-emerald-50'>
                    <ImageOff className='text-gray-400 mb-2' size={28} />
                    <span className='text-gray-500 text-sm'>Click to upload image (max 2MB)</span>
                    <input type='file' accept='image/*' required className='hidden' onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              {/* Name & Type */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                <div>
                  <label className='font-semibold text-gray-700 block mb-3'>Business Name</label>
                  <input
                    type='text' name='businessName' required
                    value={formData.businessName} onChange={handleChange}
                    placeholder='e.g. Bright Tutors'
                    className='w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all'
                  />
                </div>
                <div>
                  <label className='font-semibold text-gray-700 block mb-3'>Type of Business</label>
                  <input
                    type='text' name='businessType' required
                    value={formData.businessType} onChange={handleChange}
                    placeholder='e.g. Tutor, Engineer'
                    className='w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all'
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className='font-semibold text-gray-700 block mb-3'>Description</label>
                <textarea
                  rows='4' name='description' required
                  value={formData.description} onChange={handleChange}
                  placeholder='Tell people about your business...'
                  className='w-full rounded-2xl border border-gray-200 p-5 outline-none resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all'
                />
              </div>

              {/* Address */}
              <div>
                <label className='font-semibold text-gray-700 block mb-3'>Address</label>
                <input
                  type='text' name='address' required
                  value={formData.address} onChange={handleChange}
                  placeholder='Business address'
                  className='w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all'
                />
              </div>

              {/* Location Link */}
              <div>
                <label className='font-semibold text-gray-700 flex items-center gap-2 mb-3'>
                  <MapPin size={16} className='text-emerald-500' />
                  Google Maps Link
                </label>
                <div className='flex gap-3'>
                  <input
                    type='url' name='locationLink' required
                    value={formData.locationLink} onChange={handleChange}
                    placeholder='Paste Google Maps link'
                    className='flex-1 h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all'
                  />
                  <a
                    href='https://maps.google.com' target='_blank' rel='noreferrer'
                    className='w-14 h-14 rounded-2xl bg-emerald-500 text-white flex justify-center items-center hover:bg-emerald-600 transition duration-300 shrink-0'
                  >
                    <MapPin size={20} />
                  </a>
                </div>
              </div>

              {/* Contacts */}
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
                {[
                  { label: 'WhatsApp Number', name: 'whatsapp', type: 'text', placeholder: '2348012345678', required: true },
                  { label: 'Instagram Link', name: 'instagram', type: 'url', placeholder: 'Instagram URL', required: false },
                  { label: 'TikTok Link', name: 'tiktok', type: 'url', placeholder: 'TikTok URL', required: false },
                ].map(field => (
                  <div key={field.name}>
                    <label className='font-semibold text-gray-700 block mb-3'>{field.label}</label>
                    <input
                      type={field.type} name={field.name} required={field.required}
                      value={formData[field.name]} onChange={handleChange}
                      placeholder={field.placeholder}
                      className='w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all'
                    />
                  </div>
                ))}
              </div>

              {/* Submit */}
              <button
                type='submit'
                disabled={isSubmitting}
                className='mt-2 h-16 rounded-2xl bg-gray-800 hover:bg-black text-white text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed'
              >
                {isSubmitting ? (
                  <>
                    <div className='w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin' />
                    Registering...
                  </>
                ) : 'Register Business'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {selectedBusiness && (
        <div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-start p-4 overflow-y-auto'
          onClick={e => { if (e.target === e.currentTarget) setSelectedBusiness(null); }}
        >
          <div className='w-full max-w-4xl bg-white rounded-[32px] overflow-hidden relative shadow-2xl mt-24 mb-10'>

            {/* Close */}
            <button
              onClick={() => setSelectedBusiness(null)}
              className='absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md hover:bg-white flex justify-center items-center transition duration-200 shadow'
            >
              <X size={20} />
            </button>

            {/* Delete button */}
            <button
              onClick={() => setDeleteConfirm(selectedBusiness.id)}
              className='absolute top-4 right-16 z-10 w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 flex justify-center items-center transition duration-200 shadow'
              title='Remove listing'
            >
              <Trash2 size={17} className='text-red-500' />
            </button>

            {/* Image */}
            <div className='h-[280px] lg:h-[380px] overflow-hidden bg-gray-100'>
              <img
                src={selectedBusiness.image || PLACEHOLDER_IMG}
                alt={selectedBusiness.businessName}
                className='w-full h-full object-cover'
                onError={e => { e.target.src = PLACEHOLDER_IMG; }}
              />
            </div>

            {/* Content */}
            <div className='p-6 lg:p-8 flex flex-col gap-6'>
              <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5'>
                <div>
                  <span className='inline-flex px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm'>
                    {selectedBusiness.businessType}
                  </span>
                  <h2 className='text-3xl lg:text-4xl font-black text-gray-800 mt-3'>
                    {selectedBusiness.businessName}
                  </h2>
                </div>

                <div className='flex gap-3 shrink-0'>
                  <button
                    onClick={() => handleShare(selectedBusiness)}
                    className='h-12 px-5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold flex items-center gap-2 transition duration-300'
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                  <button
                    onClick={() => window.open(`https://wa.me/${selectedBusiness.whatsapp.replace(/\D/g, '')}`, '_blank')}
                    className='h-12 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center gap-2 transition duration-300'
                  >
                    <Phone size={16} />
                    WhatsApp
                  </button>
                </div>
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='bg-gray-50 rounded-3xl p-6'>
                  <h3 className='font-bold text-gray-800 text-lg mb-4'>About</h3>
                  <p className='text-gray-600 leading-7'>{selectedBusiness.description}</p>
                </div>

                <div className='flex flex-col gap-4'>
                  <div className='bg-gray-50 rounded-3xl p-6'>
                    <h3 className='font-bold text-gray-800 text-lg mb-3'>Address</h3>
                    <div className='flex items-start gap-3 text-gray-600'>
                      <MapPin className='text-emerald-500 mt-0.5 shrink-0' size={18} />
                      <p>{selectedBusiness.address}</p>
                    </div>
                  </div>

                  <div className='bg-gray-50 rounded-3xl p-6'>
                    <h3 className='font-bold text-gray-800 text-lg mb-4'>Links</h3>
                    <div className='flex flex-col gap-3'>
                      {selectedBusiness.instagram && (
                        <a href={selectedBusiness.instagram} target='_blank' rel='noreferrer'
                          className='h-12 px-5 rounded-2xl bg-white hover:bg-gray-100 transition duration-300 flex justify-between items-center text-gray-700 font-medium text-sm border border-gray-200'>
                          Instagram <ExternalLink size={16} />
                        </a>
                      )}
                      {selectedBusiness.tiktok && (
                        <a href={selectedBusiness.tiktok} target='_blank' rel='noreferrer'
                          className='h-12 px-5 rounded-2xl bg-white hover:bg-gray-100 transition duration-300 flex justify-between items-center text-gray-700 font-medium text-sm border border-gray-200'>
                          TikTok <ExternalLink size={16} />
                        </a>
                      )}
                      <a href={selectedBusiness.locationLink} target='_blank' rel='noreferrer'
                        className='h-12 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition duration-300 flex justify-between items-center text-white font-medium text-sm'>
                        Open Google Maps <MapPin size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteConfirm && (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4'>
          <div className='bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center'>
            <div className='w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4'>
              <Trash2 className='text-red-500' size={24} />
            </div>
            <h3 className='text-xl font-bold text-gray-800'>Remove Listing?</h3>
            <p className='text-gray-500 mt-2 text-sm'>This action cannot be undone.</p>
            <div className='flex gap-3 mt-6'>
              <button
                onClick={() => setDeleteConfirm(null)}
                className='flex-1 h-12 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition duration-200'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className='flex-1 h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold transition duration-200'
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toastMsg && (
        <div className='fixed bottom-24 left-1/2 -translate-x-1/2 z-[300] bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-medium'
          style={{ animation: 'fadeInUp 0.3s ease' }}>
          {toastMsg}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </>
  );
}

export default Marketplace;