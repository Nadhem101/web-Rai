import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { outillageService } from '../../services/api';
import { Plus, Trash2, Pencil, X, Check, Package, Image } from 'lucide-react';
import { staggerItemVariants } from '../../components/motion/ScreenTransition.jsx';

const EMPTY_FORM = { designation: '', quantity: 1, references: [{ reference: '', label: '' }], photos: [] };

const OutillagesInventaire = () => {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null); // null | { mode:'create'|'edit', data }
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState(EMPTY_FORM);
  const fileRef = useRef();

  const load = async () => {
    try {
      setLoading(true);
      const data = await outillageService.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, references: [{ reference: '', label: '' }], photos: [] });
    setModal({ mode: 'create' });
  };

  const openEdit = (item) => {
    setForm({
      designation: item.designation,
      quantity: item.quantity,
      references: item.references?.length
        ? item.references.map(r => ({ reference: r.reference, label: r.label || '' }))
        : [{ reference: '', label: '' }],
      photos: item.photos?.map(p => ({ photo_data: p.photo_data })) || [],
    });
    setModal({ mode: 'edit', id: item.id });
  };

  const handleSave = async () => {
    if (!form.designation.trim()) return alert('La désignation est obligatoire.');
    setSaving(true);
    try {
      const payload = {
        designation: form.designation.trim(),
        quantity: Number(form.quantity) || 1,
        references: form.references.filter(r => r.reference.trim()).map(r => ({ reference: r.reference.trim(), label: r.label.trim() || null })),
        photos: form.photos,
      };
      if (modal.mode === 'create') await outillageService.create(payload);
      else await outillageService.update(modal.id, payload);
      setModal(null);
      load();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Supprimer "${item.designation}" ?`)) return;
    try { await outillageService.delete(item.id); load(); }
    catch (err) { alert(err.message); }
  };

  const addRef   = () => setForm(f => ({ ...f, references: [...f.references, { reference: '', label: '' }] }));
  const removeRef = (i) => setForm(f => ({ ...f, references: f.references.filter((_, idx) => idx !== i) }));
  const setRef   = (i, field, val) => setForm(f => {
    const refs = [...f.references];
    refs[i] = { ...refs[i], [field]: val };
    return { ...f, references: refs };
  });

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm(f => ({ ...f, photos: [...f.photos, { photo_data: ev.target.result }] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removePhoto = (i) => setForm(f => ({ ...f, photos: f.photos.filter((_, idx) => idx !== i) }));

  const fieldClass = 'w-full rounded-[8px] border text-[13px] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)] transition';
  const fieldStyle = { background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' };
  const labelClass = 'block text-[12px] font-semibold mb-1';

  return (
    <div className="flex-1 overflow-auto px-[26px] pt-6 pb-10" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <motion.div variants={staggerItemVariants} className="flex flex-wrap items-end justify-between gap-3.5 mb-[18px]">
        <div className="flex items-center gap-3.5">
          <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <Package className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>
              Inventaire des outillages
            </h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>
              Source de vérité des outillages · Département Industrialisation
            </p>
          </div>
        </div>
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
          <Plus className="w-4 h-4" />
          Nouvel outillage
        </button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20" style={{ color: 'var(--text3)' }}>
          <Package className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-[15px] font-medium">Aucun outillage enregistré</p>
          <p className="text-[13px] mt-1">Cliquez sur "Nouvel outillage" pour commencer.</p>
        </div>
      ) : (
        <motion.div variants={staggerItemVariants}
          className="rounded-[14px] overflow-hidden border" style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
                {['Désignation', 'Références', 'Qté', 'Photos', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-[12px] uppercase tracking-wide"
                    style={{ color: 'var(--text3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id}
                  style={{ borderBottom: idx < items.length - 1 ? '1px solid var(--border)' : 'none' }}
                  className="group hover:bg-[var(--bg3)] transition-colors">
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--text)' }}>{item.designation}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text2)' }}>
                    {item.references?.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {item.references.map((r, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[11px] font-mono"
                            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                            {r.reference}{r.label ? <span style={{ color: 'var(--text3)' }}>· {r.label}</span> : null}
                          </span>
                        ))}
                      </div>
                    ) : <span style={{ color: 'var(--text3)' }}>—</span>}
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text)' }}>{item.quantity}</td>
                  <td className="px-4 py-3">
                    {item.photos?.length ? (
                      <div className="flex gap-1">
                        {item.photos.slice(0, 3).map((p, i) => (
                          <img key={i} src={p.photo_data} alt="" className="w-9 h-9 rounded-[6px] object-cover border"
                            style={{ borderColor: 'var(--border)' }} />
                        ))}
                        {item.photos.length > 3 && (
                          <span className="w-9 h-9 rounded-[6px] flex items-center justify-center text-[11px] font-bold"
                            style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>+{item.photos.length - 3}</span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[12px]" style={{ color: 'var(--text3)' }}>
                        <Image className="w-3.5 h-3.5" /> Aucune
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(item)}
                        className="p-1.5 rounded-[7px] hover:bg-[var(--accent-soft)] transition-colors"
                        style={{ color: 'var(--accent)' }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(item)}
                        className="p-1.5 rounded-[7px] hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                        style={{ color: 'var(--crit)' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-[16px] shadow-2xl overflow-hidden"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h2 className="font-semibold text-[16px]" style={{ color: 'var(--text)' }}>
                  {modal.mode === 'create' ? 'Nouvel outillage' : 'Modifier l\'outillage'}
                </h2>
                <button onClick={() => setModal(null)} className="p-1 rounded-[6px] hover:bg-[var(--bg3)]" style={{ color: 'var(--text3)' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Désignation */}
                <div>
                  <label className={labelClass} style={{ color: 'var(--text2)' }}>Désignation *</label>
                  <input className={fieldClass} style={fieldStyle} value={form.designation}
                    onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                    placeholder="ex. Gabarit de positionnement" />
                </div>

                {/* Quantité */}
                <div>
                  <label className={labelClass} style={{ color: 'var(--text2)' }}>Quantité</label>
                  <input type="number" min="0" className={fieldClass} style={fieldStyle} value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
                </div>

                {/* Références */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass} style={{ color: 'var(--text2)', marginBottom: 0 }}>Références</label>
                    <button onClick={addRef} className="inline-flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-[6px]"
                      style={{ color: 'var(--accent)', background: 'var(--accent-soft)' }}>
                      <Plus className="w-3 h-3" /> Ajouter
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.references.map((r, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input className={fieldClass} style={fieldStyle} value={r.reference}
                          onChange={e => setRef(i, 'reference', e.target.value)}
                          placeholder="Référence (ex. 79.209.07)" />
                        <input className={fieldClass} style={{ ...fieldStyle, maxWidth: '140px' }} value={r.label}
                          onChange={e => setRef(i, 'label', e.target.value)}
                          placeholder="Label (opt.)" />
                        {form.references.length > 1 && (
                          <button onClick={() => removeRef(i)} className="flex-shrink-0 p-1.5 rounded-[6px] hover:bg-red-100"
                            style={{ color: 'var(--crit)' }}>
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass} style={{ color: 'var(--text2)', marginBottom: 0 }}>
                      Photos <span className="font-normal" style={{ color: 'var(--text3)' }}>(miniatures)</span>
                    </label>
                    <button onClick={() => fileRef.current?.click()}
                      className="inline-flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-[6px]"
                      style={{ color: 'var(--accent)', background: 'var(--accent-soft)' }}>
                      <Image className="w-3 h-3" /> Ajouter
                    </button>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
                  {form.photos.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.photos.map((p, i) => (
                        <div key={i} className="relative group/photo">
                          <img src={p.photo_data} alt="" className="w-16 h-16 rounded-[8px] object-cover border"
                            style={{ borderColor: 'var(--border)' }} />
                          <button onClick={() => removePhoto(i)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity"
                            style={{ background: 'var(--crit)', color: '#fff' }}>
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex justify-end gap-3 px-5 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <button onClick={() => setModal(null)}
                  className="px-4 py-2 rounded-[9px] text-[13px] font-medium border transition-colors hover:bg-[var(--bg3)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>
                  Annuler
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[9px] text-[13px] font-bold text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
                  <Check className="w-4 h-4" />
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OutillagesInventaire;
