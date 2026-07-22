import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Full-size photo viewer — click any thumbnail to open it here.
 * Render inside an <AnimatePresence> so it animates in/out; pass null to
 * hide. `photos` is an array of { photo_data }, `index` the one showing.
 */
const PhotoLightbox = ({ photos, index, onIndexChange, onClose }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onIndexChange((index - 1 + photos.length) % photos.length);
      else if (e.key === 'ArrowRight') onIndexChange((index + 1) % photos.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, photos.length, onIndexChange, onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
        <X className="w-5 h-5" />
      </button>

      {photos.length > 1 && (
        <button onClick={() => onIndexChange((index - 1 + photos.length) % photos.length)}
          className="absolute left-3 sm:left-6 w-11 h-11 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      <motion.img
        key={index}
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        src={photos[index]?.photo_data} alt=""
        className="max-w-[90vw] max-h-[85vh] rounded-[10px] object-contain shadow-2xl"
      />

      {photos.length > 1 && (
        <button onClick={() => onIndexChange((index + 1) % photos.length)}
          className="absolute right-3 sm:right-6 w-11 h-11 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {photos.length > 1 && (
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white text-xs font-mono font-semibold px-3 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.12)' }}>
          {index + 1} / {photos.length}
        </span>
      )}
    </motion.div>
  );
};

export default PhotoLightbox;
