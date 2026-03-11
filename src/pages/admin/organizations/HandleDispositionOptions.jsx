import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { api } from '../../../utils/app';

const HandleDispositionOptions = () => {
  // State for disposition options list
  const [dispositions, setDispositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for filtered list
  const [filteredDispositions, setFilteredDispositions] = useState([]);
  
  // State for create popup
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [formData, setFormData] = useState({
    name: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // State for edit popup
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedDisposition, setSelectedDisposition] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: ''
  });
  const [editFormErrors, setEditFormErrors] = useState({});
  const [editing, setEditing] = useState(false);

  // State for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch all disposition options
  const fetchDispositions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get('/disposition-options');
      console.log('Disposition options:', response.data);
      
      // Handle the response data
      const data = response.data.data || response.data || [];
      const dispositionsArray = Array.isArray(data) ? data : [];
      
      // Sort by name alphabetically
      dispositionsArray.sort((a, b) => a.name.localeCompare(b.name));
      
      setDispositions(dispositionsArray);
      setFilteredDispositions(dispositionsArray);
    } catch (error) {
      console.error('Error fetching disposition options:', error);
      setError(error.message || 'Failed to load disposition options');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDispositions();
  }, []);

  // Filter dispositions based on search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDispositions(dispositions);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = dispositions.filter(disposition => 
        disposition.name?.toLowerCase().includes(searchLower)
      );
      setFilteredDispositions(filtered);
    }
  }, [searchTerm, dispositions]);

  // Handle create form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle edit form input change
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (editFormErrors[name]) {
      setEditFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate create form
  const validateCreateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) {
      errors.name = 'Disposition name is required';
    }
    return errors;
  };

  // Validate edit form
  const validateEditForm = () => {
    const errors = {};
    if (!editFormData.name?.trim()) {
      errors.name = 'Disposition name is required';
    }
    return errors;
  };

  // Handle create submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateCreateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const submitData = {
        name: formData.name.trim()
      };

      await api.post('/disposition-options', submitData);
      
      setSuccessMessage('Disposition option created successfully!');
      setShowCreatePopup(false);
      resetForm();
      
      // Refresh list
      await fetchDispositions();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error creating disposition option:', error);
      
      if (error.status === 422 && error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach(key => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setError(error.message || 'Failed to create disposition option');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit click
  const handleEditClick = (disposition) => {
    setSelectedDisposition(disposition);
    setEditFormData({
      name: disposition.name
    });
    setEditFormErrors({});
    setShowEditPopup(true);
  };

  // Handle edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateEditForm();
    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors);
      return;
    }

    setEditing(true);
    setError('');

    try {
      const submitData = {
        name: editFormData.name.trim()
      };

      await api.put(`/disposition-options/${selectedDisposition.id}`, submitData);
      
      setSuccessMessage('Disposition option updated successfully!');
      setShowEditPopup(false);
      setSelectedDisposition(null);
      
      // Refresh list
      await fetchDispositions();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error updating disposition option:', error);
      
      if (error.status === 422 && error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach(key => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setEditFormErrors(backendErrors);
      } else {
        setError(error.message || 'Failed to update disposition option');
      }
    } finally {
      setEditing(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    setDeleting(true);
    setError('');

    try {
      await api.delete(`/disposition-options/${id}`);
      
      setDeleteConfirm(null);
      setSuccessMessage('Disposition option deleted successfully!');
      
      // Refresh list
      await fetchDispositions();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error deleting disposition option:', error);
      setError(error.message || 'Failed to delete disposition option');
    } finally {
      setDeleting(false);
    }
  };

  // Reset create form
  const resetForm = () => {
    setFormData({
      name: ''
    });
    setFormErrors({});
  };

  // Close create popup
  const closeCreatePopup = () => {
    setShowCreatePopup(false);
    resetForm();
    setError('');
  };

  // Close edit popup
  const closeEditPopup = () => {
    setShowEditPopup(false);
    setSelectedDisposition(null);
    setEditFormData({ name: '' });
    setEditFormErrors({});
    setError('');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Tag className="w-6 h-6" style={{ color: '#2563EB' }} />
              <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Disposition Options</h1>
              <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}>
                Total: {dispositions.length}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchDispositions}
                className="p-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
                title="Refresh"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} style={{ color: '#64748B' }} />
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowCreatePopup(true);
                  setError('');
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: '#2563EB' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Disposition</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 rounded-lg flex items-center space-x-3" style={{ 
            backgroundColor: '#ECFDF3', 
            border: '1px solid #ABEFC6' 
          }}>
            <CheckCircle className="w-5 h-5" style={{ color: '#067647' }} />
            <span style={{ color: '#067647' }}>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && !showCreatePopup && !showEditPopup && (
          <div className="mb-4 p-4 rounded-lg flex items-center space-x-3" style={{ 
            backgroundColor: '#FEF2F2', 
            border: '1px solid #FECACA' 
          }}>
            <AlertCircle className="w-5 h-5" style={{ color: '#DC2626' }} />
            <span style={{ color: '#DC2626' }}>{error}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search dispositions by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#0F172A'
              }}
            />
          </div>
        </div>

        {/* Dispositions List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#2563EB' }}></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDispositions.length > 0 ? (
              filteredDispositions.map((disposition) => (
                <div
                  key={disposition.id}
                  className="rounded-lg p-4 transition-all hover:shadow-md"
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Tag className="w-4 h-4" style={{ color: '#2563EB' }} />
                        <h3 className="text-sm font-medium" style={{ color: '#0F172A' }}>
                          {disposition.name}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <span style={{ color: '#94A3B8' }}>ID:</span>
                        <span style={{ color: '#64748B' }}>#{disposition.id}</span>
                        {disposition.organization_id === null && (
                          <>
                            <span style={{ color: '#94A3B8' }}>•</span>
                            <span style={{ color: '#14B8A6' }}>Global</span>
                          </>
                        )}
                      </div>
                      <div className="mt-2 text-xs" style={{ color: '#94A3B8' }}>
                        Created: {new Date(disposition.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => handleEditClick(disposition)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" style={{ color: '#64748B' }} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(disposition)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Tag className="w-12 h-12 mx-auto mb-3" style={{ color: '#94A3B8' }} />
                <p style={{ color: '#94A3B8' }}>No disposition options found</p>
                {searchTerm && (
                  <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                    Try adjusting your search
                  </p>
                )}
                <button
                  onClick={() => {
                    resetForm();
                    setShowCreatePopup(true);
                  }}
                  className="mt-3 text-sm font-medium"
                  style={{ color: '#2563EB' }}
                >
                  Add your first disposition
                </button>
              </div>
            )}
          </div>
        )}

        {/* Create Popup */}
        {showCreatePopup && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 bg-opacity-50"
                onClick={closeCreatePopup}
              ></div>
              
              {/* Popup Content */}
              <div 
                className="relative bg-white rounded-lg w-full max-w-md"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between" style={{ 
                  borderColor: '#E2E8F0'
                }}>
                  <h3 className="text-lg font-semibold" style={{ color: '#0F172A' }}>
                    Add Disposition Option
                  </h3>
                  <button
                    onClick={closeCreatePopup}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    disabled={submitting}
                  >
                    <X className="w-5 h-5" style={{ color: '#64748B' }} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6">
                  <form onSubmit={handleCreateSubmit}>
                    {/* Name Input */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                        Disposition Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={submitting}
                        placeholder="e.g., Callback requested"
                        className="w-full px-3 py-2 rounded-lg text-sm"
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: `1px solid ${formErrors.name ? '#EF4444' : '#E2E8F0'}`,
                          color: '#0F172A'
                        }}
                        autoFocus
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{formErrors.name}</p>
                      )}
                      <p className="mt-1 text-xs" style={{ color: '#94A3B8' }}>
                        Enter a unique disposition name
                      </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="mb-4 p-3 rounded-lg flex items-center space-x-2" style={{ 
                        backgroundColor: '#FEF2F2', 
                        border: '1px solid #FECACA' 
                      }}>
                        <AlertCircle className="w-4 h-4" style={{ color: '#DC2626' }} />
                        <span className="text-sm" style={{ color: '#DC2626' }}>{error}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeCreatePopup}
                        disabled={submitting}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                        style={{ backgroundColor: '#2563EB' }}
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Adding...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Add Disposition</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Popup */}
        {showEditPopup && selectedDisposition && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 bg-opacity-50"
                onClick={closeEditPopup}
              ></div>
              
              {/* Popup Content */}
              <div 
                className="relative bg-white rounded-lg w-full max-w-md"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between" style={{ 
                  borderColor: '#E2E8F0'
                }}>
                  <h3 className="text-lg font-semibold" style={{ color: '#0F172A' }}>
                    Edit Disposition Option
                  </h3>
                  <button
                    onClick={closeEditPopup}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    disabled={editing}
                  >
                    <X className="w-5 h-5" style={{ color: '#64748B' }} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6">
                  <form onSubmit={handleEditSubmit}>
                    {/* Name Input */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                        Disposition Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditInputChange}
                        disabled={editing}
                        className="w-full px-3 py-2 rounded-lg text-sm"
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: `1px solid ${editFormErrors.name ? '#EF4444' : '#E2E8F0'}`,
                          color: '#0F172A'
                        }}
                        autoFocus
                      />
                      {editFormErrors.name && (
                        <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{editFormErrors.name}</p>
                      )}
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="mb-4 p-3 rounded-lg flex items-center space-x-2" style={{ 
                        backgroundColor: '#FEF2F2', 
                        border: '1px solid #FECACA' 
                      }}>
                        <AlertCircle className="w-4 h-4" style={{ color: '#DC2626' }} />
                        <span className="text-sm" style={{ color: '#DC2626' }}>{error}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeEditPopup}
                        disabled={editing}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={editing}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                        style={{ backgroundColor: '#2563EB' }}
                      >
                        {editing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Update</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 bg-opacity-50"
                onClick={() => !deleting && setDeleteConfirm(null)}
              ></div>
              
              {/* Popup Content */}
              <div 
                className="relative bg-white rounded-lg w-full max-w-md"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                <div className="p-6 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#EF4444' }} />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#0F172A' }}>
                    Delete Disposition Option
                  </h3>
                  <p className="text-sm mb-4" style={{ color: '#64748B' }}>
                    Are you sure you want to delete <span className="font-semibold">"{deleteConfirm.name}"</span>? 
                    This action cannot be undone.
                  </p>
                  
                  {error && (
                    <div className="mb-4 p-3 rounded-lg text-sm" style={{ 
                      backgroundColor: '#FEF2F2', 
                      color: '#DC2626',
                      border: '1px solid #FECACA'
                    }}>
                      {error}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      disabled={deleting}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(deleteConfirm.id)}
                      disabled={deleting}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                      style={{ backgroundColor: '#EF4444' }}
                    >
                      {deleting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleDispositionOptions;