import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const getYouTubeId = (url = '') => {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
};

/**
 * Full-size viewer for a single flow-chart media item — image or video.
 * Pass `item` ({ type, url, title }) to show it, null/undefined to hide.
 * Render unconditionally; it returns null itself when there's nothing to show.
 */
const MediaLightbox = ({ item, onClose }) => {
  useEffect(() => {
    if (!item) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  if (!item) return null;
  const ytId = item.type === 'video' ? getYouTubeId(item.url) : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
        <X className="w-5 h-5" />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col items-center max-w-[92vw]"
        onClick={e => e.stopPropagation()}>
        {ytId ? (
          <div className="w-[85vw] max-w-3xl aspect-video">
            <iframe
              className="w-full h-full rounded-[10px] shadow-2xl"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
              title={item.title || 'Vidéo'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : item.type === 'video' ? (
          <video src={item.url} controls autoPlay
            className="max-w-[92vw] max-h-[80vh] rounded-[10px] shadow-2xl bg-black" />
        ) : (
          <img src={item.url} alt={item.title || ''}
            className="max-w-[92vw] max-h-[80vh] rounded-[10px] object-contain shadow-2xl bg-white" />
        )}
        {item.title && (
          <span className="mt-3 text-white text-sm font-semibold px-3 py-1 rounded-full text-center"
            style={{ background: 'rgba(255,255,255,0.12)' }}>
            {item.title}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MediaLightbox;
