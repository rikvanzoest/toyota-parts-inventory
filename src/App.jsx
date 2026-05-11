import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Search, Plus, Edit2, Trash2, Package, Car, AlertCircle, Lock, LogOut, Image, X } from 'lucide-react'
import './App.css'

function App() {
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPart, setEditingPart] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
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
    quantity: '1',
    photo_1: '',
    photo_2: ''
  })

  // Admin password (in production, use environment variable)
  const ADMIN_PASSWORD = 'admin123'

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

  // Toyota, Lexus, and Scion models (focus on 1980-2000 era)
  const toyotaModels = [
    // Toyota
    '4Runner',
    'Avalon',
    'Camry',
    'Celica',
    'Corolla',
    'Cressida',
    'Echo',
    'GR86/86',
    'Highlander',
    'Land Cruiser',
    'MR2',
    'Paseo',
    'Pickup',
    'Previa',
    'RAV4',
    'Sequoia',
    'Sienna',
    'Solara',
    'Supra',
    'T100',
    'Tacoma',
    'Tercel',
    'Tundra',
    // Lexus
    'ES300',
    'ES330',
    'GS300',
    'GS400',
    'GX470',
    'IS300',
    'LS400',
    'LS430',
    'LX450',
    'LX470',
    'RX300',
    'RX330',
    'SC300',
    'SC400',
    // Scion
    'FR-S',
    'tC'
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

  function handleLogin(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setShowLogin(false)
      setPassword('')
      setLoginError('')
    } else {
      setLoginError('Incorrect password')
    }
  }

  function handleLogout() {
    setIsAdmin(false)
    setPassword('')
  }

  function handlePhotoUpload(photoNumber, e) {
    const file = e.target.files[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be less than 5MB')
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      if (photoNumber === 1) {
        setFormData({ ...formData, photo_1: reader.result })
      } else {
        setFormData({ ...formData, photo_2: reader.result })
      }
    }
    reader.readAsDataURL(file)
  }

  function removePhoto(photoNumber) {
    if (photoNumber === 1) {
      setFormData({ ...formData, photo_1: '' })
    } else {
      setFormData({ ...formData, photo_2: '' })
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      const partData = {
        part_name: formData.part_name,
        category: formData.category,
        vehicle_year: parseInt(formData.vehicle_year),
        vehicle_make: formData.vehicle_make,
        vehicle_model: formData.vehicle_model,
        vehicle_trim: formData.vehicle_trim,
        condition: formData.condition,
        condition_notes: formData.condition_notes,
        price: formData.price_is_call ? 'Call' : formData.price,
        quantity: parseInt(formData.quantity),
        photo_1: formData.photo_1 || null,
        photo_2: formData.photo_2 || null
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
      price_is_call: false,
      quantity: '1',
      photo_1: '',
      photo_2: ''
    })
    setEditingPart(null)
    setShowAddModal(false)
  }

  function handleEdit(part) {
    const priceIsCall = part.price === 'Call'
    setFormData({
      part_name: part.part_name,
      category: part.category,
      vehicle_year: part.vehicle_year.toString(),
      vehicle_make: part.vehicle_make,
      vehicle_model: part.vehicle_model,
      vehicle_trim: part.vehicle_trim || '',
      condition: part.condition,
      condition_notes: part.condition_notes || '',
      price: priceIsCall ? '' : part.price,
      price_is_call: priceIsCall,
      quantity: part.quantity.toString(),
      photo_1: part.photo_1 || '',
      photo_2: part.photo_2 || ''
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
  
  // Calculate total value (only for admin mode and numeric prices)
  const totalValue = parts.reduce((sum, part) => {
    if (part.price === 'Call' || !part.price) return sum
    const price = parseFloat(part.price)
    if (isNaN(price)) return sum
    return sum + (price * part.quantity)
  }, 0)

  function formatPrice(price) {
    if (price === 'Call') return 'Call'
    const numPrice = parseFloat(price)
    return isNaN(numPrice) ? price : `$${numPrice.toFixed(2)}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Car className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Toyota / Lexus / Scion Used Parts</h1>
                <p className="text-red-100 text-sm">Salvage & Recycled Auto Parts</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isAdmin ? (
                <>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 flex items-center space-x-2 transition"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Part</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-800 flex items-center space-x-2 transition"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 flex items-center space-x-2 transition"
                >
                  <Lock className="w-5 h-5" />
                  <span>Admin Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-8`}>
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
          
          {/* Only show total value in admin mode */}
          {isAdmin && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Inventory Value</p>
                  <p className="text-3xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
                </div>
                <Car className="w-12 h-12 text-blue-600" />
              </div>
            </div>
          )}
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
              <p className="text-gray-600">No parts found. {isAdmin ? 'Add your first salvage part to get started!' : ''}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    {isAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParts.map((part) => (
                    <tr key={part.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {part.photo_1 ? (
                          <img 
                            src={part.photo_1} 
                            alt={part.part_name}
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                            <Image className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatPrice(part.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.quantity}</td>
                      {isAdmin && (
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
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-6">
              <Lock className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  autoFocus
                />
                {loginError && (
                  <p className="mt-2 text-sm text-red-600">{loginError}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowLogin(false)
                    setPassword('')
                    setLoginError('')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && isAdmin && (
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
                        min="1980"
                        max={new Date().getFullYear() + 1}
                        value={formData.vehicle_year}
                        onChange={(e) => setFormData({ ...formData, vehicle_year: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="1995"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
                      <select
                        required
                        value={formData.vehicle_make}
                        onChange={(e) => setFormData({ ...formData, vehicle_make: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="Toyota">Toyota</option>
                        <option value="Lexus">Lexus</option>
                        <option value="Scion">Scion</option>
                      </select>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="price_is_call"
                          checked={formData.price_is_call}
                          onChange={(e) => setFormData({ ...formData, price_is_call: e.target.checked, price: '' })}
                          className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="price_is_call" className="text-sm text-gray-700">Call for Price</label>
                      </div>
                      {!formData.price_is_call && (
                        <input
                          type="number"
                          step="0.01"
                          required={!formData.price_is_call}
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      )}
                    </div>
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

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Photos (Optional)</h3>
                  <p className="text-sm text-gray-500 mb-4">Add up to 2 photos of the part (max 5MB each)</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Photo 1 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Photo 1</label>
                      {formData.photo_1 ? (
                        <div className="relative">
                          <img 
                            src={formData.photo_1} 
                            alt="Photo 1" 
                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(1)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Image className="w-10 h-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 font-semibold">Click to upload</p>
                            <p className="text-xs text-gray-400">PNG, JPG (max 5MB)</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(1, e)}
                          />
                        </label>
                      )}
                    </div>

                    {/* Photo 2 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Photo 2</label>
                      {formData.photo_2 ? (
                        <div className="relative">
                          <img 
                            src={formData.photo_2} 
                            alt="Photo 2" 
                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(2)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Image className="w-10 h-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 font-semibold">Click to upload</p>
                            <p className="text-xs text-gray-400">PNG, JPG (max 5MB)</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(2, e)}
                          />
                        </label>
                      )}
                    </div>
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