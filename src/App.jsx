import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Search, Plus, Edit2, Trash2, Package, TrendingUp, AlertCircle } from 'lucide-react'
import './App.css'

function App() {
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPart, setEditingPart] = useState(null)
  const [formData, setFormData] = useState({
    part_number: '',
    part_name: '',
    category: '',
    description: '',
    price: '',
    stock_quantity: '',
    min_stock_level: '',
    compatible_models: ''
  })

  // Common Toyota part categories
  const categories = [
    'Engine Parts',
    'Brake System',
    'Suspension',
    'Electrical',
    'Filters',
    'Fluids',
    'Belts & Hoses',
    'Lighting',
    'Body Parts',
    'Interior'
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
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        min_stock_level: parseInt(formData.min_stock_level)
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
      part_number: '',
      part_name: '',
      category: '',
      description: '',
      price: '',
      stock_quantity: '',
      min_stock_level: '',
      compatible_models: ''
    })
    setEditingPart(null)
    setShowAddModal(false)
  }

  function handleEdit(part) {
    setFormData({
      part_number: part.part_number,
      part_name: part.part_name,
      category: part.category,
      description: part.description || '',
      price: part.price.toString(),
      stock_quantity: part.stock_quantity.toString(),
      min_stock_level: part.min_stock_level.toString(),
      compatible_models: part.compatible_models || ''
    })
    setEditingPart(part)
    setShowAddModal(true)
  }

  const filteredParts = parts.filter(part =>
    part.part_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const lowStockParts = parts.filter(part => part.stock_quantity <= part.min_stock_level)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Toyota Parts Inventory</h1>
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
                <p className="text-gray-500 text-sm font-medium">Low Stock Alert</p>
                <p className="text-3xl font-bold text-orange-600">{lowStockParts.length}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Categories</p>
                <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by part name, number, or category..."
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
              <p className="text-gray-600">No parts found. Add your first part to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compatible Models</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParts.map((part) => (
                    <tr key={part.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{part.part_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.part_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          {part.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${part.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-semibold ${part.stock_quantity <= part.min_stock_level ? 'text-orange-600' : 'text-green-600'}`}>
                          {part.stock_quantity}
                        </span>
                        <span className="text-gray-500"> / {part.min_stock_level}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{part.compatible_models || 'N/A'}</td>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Part Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.part_number}
                      onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., 04152-YZZA1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Part Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.part_name}
                      onChange={(e) => setFormData({ ...formData, part_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., Oil Filter"
                    />
                  </div>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="3"
                    placeholder="Part description..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock Level *</label>
                    <input
                      type="number"
                      required
                      value={formData.min_stock_level}
                      onChange={(e) => setFormData({ ...formData, min_stock_level: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compatible Models</label>
                  <input
                    type="text"
                    value={formData.compatible_models}
                    onChange={(e) => setFormData({ ...formData, compatible_models: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Camry, Corolla, RAV4"
                  />
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
