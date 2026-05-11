import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Search, Plus, Edit2, Trash2, Package, Car, AlertCircle, Lock, Eye } from 'lucide-react'
import './App.css'

function App() {
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPart, setEditingPart] = useState(null)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [formData, setFormData] = useState({
    part_name: '',
    category: '',
    vehicle_year: '',
    vehicle_make: 'Toyota',
    vehicle_model: '',
    vehicle_trim: '',
    condition: '',
    condition_notes: '',
    price: '',
    price_is_call: false,
    quantity: '1'
  })
  // Used car part categories (no fluids)
  const categories = [
    'Engine & Drivetrain',
    'Body Parts',
    'Interior',
    'Electrical',
    'Suspension',
    'Brake System',
    'Exhaust',
    'Cooling System',
    'Lighting',
    'Wheels & Tires'
  ]

  // Condition options for used parts
  const conditions = [
    'Excellent',
    'Good',
    'Fair',
    'Poor',
    'For Parts Only'
  ]

  // Common Toyota models
  const toyotaModels = [
    'Camry',
    'Corolla',
    'RAV4',
    'Highlander',
    'Tacoma',
    'Tundra',
    '4Runner',
    'Prius',
    'Sienna',
    'Avalon',
    'Sequoia',
    'Land Cruiser',
    'C-HR',
    'Yaris',
    'Venza',
    'GR86',
    'Supra'
  ]

  useEffect(() => {
    fetchParts()
  }, [])

  async function fetchParts() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('toyota_parts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setParts(data || [])
    } catch (error) {
      console.error('Error fetching parts:', error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      const partData = {
        ...formData,
        vehicle_year: parseInt(formData.vehicle_year),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      }

      if (editingPart) {
        const { error } = await supabase
          .from('toyota_parts')
          .update(partData)
          .eq('id', editingPart.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('toyota_parts')
          .insert([partData])
        
        if (error) throw error
      }

      resetForm()
      fetchParts()
    } catch (error) {
      console.error('Error saving part:', error.message)
      alert('Error saving part: ' + error.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this part?')) return

    try {
      const { error } = await supabase
        .from('toyota_parts')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchParts()
    } catch (error) {
      console.error('Error deleting part:', error.message)
    }
  }

  function resetForm() {
    setFormData({
      part_name: '',
      category: '',
      vehicle_year: '',
      vehicle_make: 'Toyota',
      vehicle_model: '',
      vehicle_trim: '',
      condition: '',
      condition_notes: '',
      price: '',
      quantity: '1'
    })
    setEditingPart(null)
    setShowAddModal(false)
  }

  function handleEdit(part) {
    setFormData({
      part_name: part.part_name,
      category: part.category,
      vehicle_year: part.vehicle_year.toString(),
      vehicle_make: part.vehicle_make,
      vehicle_model: part.vehicle_model,
      vehicle_trim: part.vehicle_trim || '',
      condition: part.condition,
      condition_notes: part.condition_notes || '',
      price: part.price.toString(),
      quantity: part.quantity.toString()
    })
    setEditingPart(part)
    setShowAddModal(true)
  }

  const filteredParts = parts.filter(part =>
    part.part_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.vehicle_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.vehicle_year.toString().includes(searchTerm)
  )

  // Count parts by condition
  const excellentParts = parts.filter(p => p.condition === 'Excellent').length
  const totalValue = parts.reduce((sum, part) => sum + (part.price * part.quantity), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Car className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Toyota Used Parts Inventory</h1>
                <p className="text-red-100 text-sm">Salvage & Recycled Auto Parts</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 flex items-center space-x-2 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Add Part</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Parts</p>
                <p className="text-3xl font-bold text-gray-900">{parts.length}</p>
              </div>
              <Package className="w-12 h-12 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Excellent Condition</p>
                <p className="text-3xl font-bold text-green-600">{excellentParts}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Inventory Value</p>
                <p className="text-3xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
              </div>
              <Car className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by part name, category, model, or year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Parts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading parts...</p>
            </div>
          ) : filteredParts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No parts found. Add your first salvage part to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParts.map((part) => (
                    <tr key={part.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {part.part_name}
                        {part.condition_notes && (
                          <p className="text-xs text-gray-500 mt-1">{part.condition_notes.substring(0, 50)}{part.condition_notes.length > 50 ? '...' : ''}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{part.vehicle_year} {part.vehicle_model}</div>
                        {part.vehicle_trim && <div className="text-xs text-gray-500">{part.vehicle_trim}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          {part.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          part.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                          part.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                          part.condition === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {part.condition}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${part.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(part)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(part.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">{editingPart ? 'Edit Part' : 'Add New Part'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Part Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.part_name}
                    onChange={(e) => setFormData({ ...formData, part_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Front Bumper Cover, Driver Side Door"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Source Vehicle Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                      <input
                        type="number"
                        required
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        value={formData.vehicle_year}
                        onChange={(e) => setFormData({ ...formData, vehicle_year: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="2020"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                      <input
                        type="text"
                        value={formData.vehicle_make}
                        onChange={(e) => setFormData({ ...formData, vehicle_make: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                        placeholder="Toyota"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                      <select
                        required
                        value={formData.vehicle_model}
                        onChange={(e) => setFormData({ ...formData, vehicle_model: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Select model</option>
                        {toyotaModels.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trim</label>
                      <input
                        type="text"
                        value={formData.vehicle_trim}
                        onChange={(e) => setFormData({ ...formData, vehicle_trim: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="e.g., LE, SE, XLE, Limited"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Condition</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
                    <select
                      required
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select condition</option>
                      {conditions.map(cond => (
                        <option key={cond} value={cond}>{cond}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition Notes</label>
                    <textarea
                      value={formData.condition_notes}
                      onChange={(e) => setFormData({ ...formData, condition_notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows="3"
                      placeholder="e.g., Minor scratches, no dents, tested and working perfectly..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    {editingPart ? 'Update Part' : 'Add Part'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
