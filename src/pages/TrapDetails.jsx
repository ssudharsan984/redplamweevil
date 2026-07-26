import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import DetectionCard from '../components/DetectionCard'
import { useTraps } from '../hooks/useTraps'
import { addTrap, updateTrap, deleteTrap, subscribeToDetectionsByTrap } from '../services/firestoreService'
import { formatDate } from '../utils/helpers'

const EMPTY_FORM = { trapId: '', location: '', description: '', active: true }

export default function TrapDetails() {
  const { traps, loading } = useTraps()
  const [selected, setSelected] = useState(null)
  const [trapDetections, setTrapDetections] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!selected) return
    const unsub = subscribeToDetectionsByTrap(selected.trapId, setTrapDetections)
    return unsub
  }, [selected])

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true) }
  const openEdit = (trap) => { setEditing(trap); setForm({ trapId: trap.trapId, location: trap.location || '', description: trap.description || '', active: trap.active ?? true }); setShowForm(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) await updateTrap(editing.id, form)
      else await addTrap(form)
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this trap?')) {
      if (selected?.id === id) setSelected(null)
      await deleteTrap(id)
    }
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trap Details</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and monitor your detection traps</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <span>+</span> Add Trap
        </button>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Trap' : 'Add New Trap'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trap ID *</label>
                <input className="input" value={form.trapId} onChange={(e) => setForm({ ...form, trapId: e.target.value })} required placeholder="e.g. TRAP-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. North Field, Row 3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="input resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional notes..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-primary-600" />
                <label htmlFor="active" className="text-sm text-gray-700">Active</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" className="btn-secondary flex-1" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trap List */}
        <div className="lg:col-span-1">
          {loading ? (
            <LoadingSpinner message="Loading traps..." />
          ) : traps.length === 0 ? (
            <EmptyState icon="🪤" title="No traps added" message="Click 'Add Trap' to register your first trap." />
          ) : (
            <div className="space-y-3">
              {traps.map((trap) => (
                <div
                  key={trap.id}
                  onClick={() => setSelected(trap)}
                  className={`card cursor-pointer transition-all hover:shadow-md
                    ${selected?.id === trap.id ? 'ring-2 ring-primary-500 bg-primary-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{trap.trapId}</p>
                      <p className="text-sm text-gray-500">{trap.location || 'No location'}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(trap.createdAt)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${trap.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {trap.active ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex gap-2 mt-1">
                        <button onClick={(e) => { e.stopPropagation(); openEdit(trap) }} className="text-xs text-blue-500 hover:text-blue-700">Edit</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(trap.id) }} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    </div>
                  </div>
                  {trap.description && <p className="text-xs text-gray-500 mt-2 border-t pt-2">{trap.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trap Detection History */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="card flex flex-col items-center justify-center py-20 text-center">
              <span className="text-4xl mb-3">👈</span>
              <p className="text-gray-500">Select a trap to view its detection history</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Detections for <span className="text-primary-600">{selected.trapId}</span>
                </h2>
                <p className="text-sm text-gray-500">{selected.location}</p>
              </div>
              {trapDetections.length === 0 ? (
                <EmptyState icon="📡" title="No detections" message="No detection events recorded for this trap yet." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {trapDetections.map((d) => (
                    <DetectionCard key={d.id} detection={d} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
