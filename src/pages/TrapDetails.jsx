import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { useTraps } from '../hooks/useTraps'
import { addTrap, updateTrap, deleteTrap, uploadDetectionImage } from '../services/firestoreService'
import { formatDate, formatTimeAgo, formatConfidence, getConfidenceColor, getConfidenceBarColor, normalizeConfidence, isDetected } from '../utils/helpers'

const EMPTY_FORM = { trapId: '', location: '', description: '', status: 'No RPW', confidence: '', imageUrl: '', active: true }

export default function TrapDetails() {
  const { traps, loading } = useTraps()
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [lightbox, setLightbox] = useState(false)

  // Keep selected in sync with live updates
  useEffect(() => {
    if (selected) {
      const updated = traps.find((t) => t.id === selected.id)
      if (updated) setSelected(updated)
    }
  }, [traps])

  const openAdd = () => {
    setEditing(null); setForm(EMPTY_FORM)
    setImageFile(null); setImagePreview(null); setShowForm(true)
  }

  const openEdit = (trap) => {
    setEditing(trap)
    setForm({
      trapId: trap.trapId || '',
      location: trap.location || '',
      description: trap.description || '',
      status: trap.status || 'No RPW',
      confidence: trap.confidence ?? '',
      imageUrl: trap.imageUrl || '',
      active: trap.active ?? true,
    })
    setImageFile(null); setImagePreview(null); setShowForm(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      let finalImageUrl = form.imageUrl
      if (imageFile) {
        setUploading(true)
        finalImageUrl = await uploadDetectionImage(imageFile, form.trapId || 'unknown')
        setUploading(false)
      }
      const payload = {
        trapId: form.trapId,
        location: form.location,
        description: form.description,
        status: form.status,
        confidence: form.confidence !== '' ? Number(form.confidence) : null,
        imageUrl: finalImageUrl,
        active: form.active,
      }
      if (editing) await updateTrap(editing.id, payload)
      else await addTrap(payload)
      setShowForm(false)
    } finally {
      setSaving(false); setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this trap record?')) {
      if (selected?.id === id) setSelected(null)
      await deleteTrap(id)
    }
  }

  const detected = selected ? isDetected(selected) : false
  const confValue = selected ? normalizeConfidence(selected.confidence) : null

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="page-title">Trap Details</h1>
          <p className="page-subtitle">Full detection information with images</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <span className="text-lg">+</span> Add Record
        </button>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-5">{editing ? '✏️ Edit Record' : '➕ Add Detection Record'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trap ID *</label>
                  <input className="input" value={form.trapId} onChange={(e) => setForm({ ...form, trapId: e.target.value })} required placeholder="TRAP001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="No RPW">No RPW</option>
                    <option value="RPW Detected">RPW Detected</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confidence (0–100)</label>
                  <input className="input" type="number" min="0" max="100" value={form.confidence} onChange={(e) => setForm({ ...form, confidence: e.target.value })} placeholder="e.g. 96" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="North Field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="input resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional notes..." />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detection Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                {(imagePreview || form.imageUrl) && (
                  <div className="mt-2 rounded-xl overflow-hidden h-32 bg-gray-100">
                    <img src={imagePreview || form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                {uploading && <p className="text-xs text-primary-600 mt-1 animate-pulse">⬆️ Uploading to Firebase Storage...</p>}
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-primary-600" />
                <label htmlFor="active" className="text-sm text-gray-700">Active trap</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1" disabled={saving}>
                  {saving ? (uploading ? 'Uploading...' : 'Saving...') : 'Save'}
                </button>
                <button type="button" className="btn-secondary flex-1" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && selected?.imageUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <img src={selected.imageUrl} alt="Detection" className="max-w-full max-h-full rounded-xl shadow-2xl" />
          <button className="absolute top-4 right-4 text-white text-2xl bg-white/10 w-10 h-10 rounded-full hover:bg-white/20">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Trap List */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <LoadingSpinner message="Loading traps..." />
          ) : traps.length === 0 ? (
            <EmptyState icon="🪤" title="No records yet" message="Records written by your Python YOLO script will appear here." />
          ) : (
            traps.map((trap) => {
              const det = isDetected(trap)
              return (
                <div
                  key={trap.id}
                  onClick={() => setSelected(trap)}
                  className={`card cursor-pointer transition-all hover:shadow-md
                    ${selected?.id === trap.id ? 'ring-2 ring-primary-500 bg-primary-50' : ''}
                    ${det ? 'border-l-4 border-l-red-400' : 'border-l-4 border-l-emerald-400'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-base">{trap.trapId}</p>
                      <p className="text-xs text-gray-500 truncate">{trap.location || 'No location'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatTimeAgo(trap.timestamp)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className={det ? 'badge-detected' : 'badge-clear'}>
                        {det ? '🚨 RPW' : '✅ Clear'}
                      </span>
                      {trap.confidence != null && (
                        <span className={`text-xs font-bold ${getConfidenceColor(trap.confidence)}`}>
                          {formatConfidence(trap.confidence)}
                        </span>
                      )}
                    </div>
                  </div>
                  {trap.imageUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden h-20 bg-gray-100">
                      <img src={trap.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => e.target.parentElement.style.display='none'} />
                    </div>
                  )}
                  <div className="flex gap-3 mt-2 pt-2 border-t border-gray-100">
                    <button onClick={(e) => { e.stopPropagation(); openEdit(trap) }} className="text-xs text-blue-500 hover:text-blue-700 font-medium">✏️ Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(trap.id) }} className="text-xs text-red-400 hover:text-red-600 font-medium">🗑 Delete</button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="card flex flex-col items-center justify-center py-24 text-center">
              <span className="text-5xl mb-3">👈</span>
              <p className="font-semibold text-gray-600">Select a trap to view full details</p>
              <p className="text-sm text-gray-400 mt-1">Detection image, confidence score, and timestamps</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Large Image */}
              {selected.imageUrl ? (
                <div
                  className="relative rounded-2xl overflow-hidden bg-gray-900 cursor-zoom-in shadow-lg"
                  onClick={() => setLightbox(true)}
                  style={{ height: '280px' }}
                >
                  <img
                    src={selected.imageUrl}
                    alt={`Detection from ${selected.trapId}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.parentElement.style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-white font-extrabold text-2xl">{selected.trapId}</p>
                      <p className="text-white/70 text-xs">{selected.location || ''}</p>
                    </div>
                    <span className={detected ? 'badge-detected' : 'badge-clear'}>
                      {detected ? '🚨 RPW Detected' : '✅ No RPW'}
                    </span>
                  </div>
                  <span className="absolute top-3 right-3 text-xs bg-black/50 text-white px-2 py-1 rounded-full">
                    🔍 Click to enlarge
                  </span>
                </div>
              ) : (
                <div className="rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 h-40 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <p className="text-3xl mb-1">🖼️</p>
                    <p className="text-sm">No image available</p>
                  </div>
                </div>
              )}

              {/* Info Card */}
              <div className="card space-y-4">
                <h3 className="section-title">Detection Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Trap ID</p>
                    <p className="font-bold text-gray-900 text-lg">{selected.trapId}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${detected ? 'bg-red-50' : 'bg-emerald-50'}`}>
                    <p className="text-xs text-gray-400 mb-0.5">Status</p>
                    <p className={`font-bold text-base ${detected ? 'text-red-700' : 'text-emerald-700'}`}>
                      {selected.status || (detected ? 'RPW Detected' : 'No RPW')}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Timestamp</p>
                    <p className="font-medium text-gray-800 text-sm">{formatDate(selected.timestamp)}</p>
                    <p className="text-xs text-gray-400">{formatTimeAgo(selected.timestamp)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Location</p>
                    <p className="font-medium text-gray-800 text-sm">{selected.location || '—'}</p>
                  </div>
                </div>

                {/* Confidence Score */}
                {confValue != null && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700">Confidence Score</p>
                      <p className={`text-2xl font-extrabold ${getConfidenceColor(selected.confidence)}`}>
                        {formatConfidence(selected.confidence)}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${getConfidenceBarColor(selected.confidence)}`}
                        style={{ width: `${confValue}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0%</span>
                      <span className={confValue >= 80 ? 'text-red-500 font-medium' : confValue >= 50 ? 'text-yellow-500 font-medium' : 'text-green-500 font-medium'}>
                        {confValue >= 80 ? 'High Risk' : confValue >= 50 ? 'Medium Risk' : 'Low Risk'}
                      </span>
                      <span>100%</span>
                    </div>
                  </div>
                )}

                {selected.description && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Notes</p>
                    <p className="text-sm text-gray-700">{selected.description}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={() => openEdit(selected)} className="btn-secondary flex-1 text-sm">✏️ Edit</button>
                  <button onClick={() => handleDelete(selected.id)} className="btn-danger flex-1 text-sm">🗑 Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
