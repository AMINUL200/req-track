import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Mail,
  Phone,
  MapPin,
  Users,
  Briefcase,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { api } from '../../../utils/app';
import { useNavigate } from 'react-router-dom';

const HandleOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    type: 'private',
    email: '',
    address: '',
    phone: '' // Added phone field
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Base API URL - you can move this to env file

  // Fetch organizations with pagination, search, and filter
  const fetchOrganizations = async (page = 1) => {
    setLoading(true);
    setApiError('');
    
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page,
        per_page: pagination.per_page
      });
      
      // Add search if provided
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      // Add type filter if not 'all'
      if (filterType !== 'all') {
        params.append('type', filterType);
      }

      const response = await api.get(`/organizations?${params.toString()}`);
      
      // The response should match your provided structure
      if (response.data) {
        setOrganizations(response.data.data || []);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to
        });
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setApiError(error.message || 'Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchOrganizations(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterType]);

  // Initial fetch
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Handle form input change
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
    // Clear API error
    if (apiError) setApiError('');
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) {
      errors.name = 'Organization name is required';
    }
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.type) {
      errors.type = 'Organization type is required';
    }
    // Optional: validate phone if provided
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone number must be 10 digits';
    }
    return errors;
  };

  // Handle form submit (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    setApiError('');
    setSuccessMessage('');

    try {
      // Prepare data in required format
      const submitData = {
        name: formData.name.trim(),
        type: formData.type,
        email: formData.email.trim().toLowerCase(),
        address: formData.address?.trim() || null,
        phone: formData.phone?.replace(/\D/g, '') || null
      };

      console.log('Submitting data:', submitData);

      let response;
      if (modalMode === 'add') {
        // Create new organization
        response = await api.post('/organizations', submitData);
        setSuccessMessage('Organization created successfully!');
      } else {
        // Update existing organization
        response = await api.put(`/organizations/${selectedOrg.id}`, submitData);
        setSuccessMessage('Organization updated successfully!');
      }

      // On success
      setShowModal(false);
      resetForm();
      
      // Show success message for 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh the list (stay on current page)
      fetchOrganizations(pagination.current_page);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Handle validation errors from backend
      if (error.status === 422 && error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach(key => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.message || 'Failed to save organization');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit click
  const handleEdit = (org) => {
    setSelectedOrg(org);
    setFormData({
      name: org.name || '',
      type: org.type || 'private',
      email: org.email || '',
      address: org.address || '',
      phone: org.phone || ''
    });
    setModalMode('edit');
    setShowModal(true);
    setApiError('');
  };

  // Handle delete
  const handleDelete = async (id) => {
    setSubmitting(true);
    setApiError('');
    
    try {
      await api.delete(`/organizations/${id}`);
      
      setDeleteConfirm(null);
      setSuccessMessage('Organization deleted successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh list - go to previous page if current page becomes empty
      const newPage = organizations.length === 1 && pagination.current_page > 1 
        ? pagination.current_page - 1 
        : pagination.current_page;
      
      fetchOrganizations(newPage);
      
    } catch (error) {
      console.error('Error deleting organization:', error);
      setApiError(error.message || 'Failed to delete organization');
      setDeleteConfirm(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchOrganizations(page);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      type: 'private',
      email: '',
      address: '',
      phone: ''
    });
    setFormErrors({});
    setSelectedOrg(null);
    setModalMode('add');
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchOrganizations(pagination.current_page);
    setSuccessMessage('Data refreshed successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle export (you can implement this based on your API)
  const handleExport = async () => {
    try {
      const response = await api.get('/organizations/export', {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'organizations.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (error) {
      console.error('Error exporting data:', error);
      setApiError('Failed to export data');
    }
  };

  // Get type badge color
  const getTypeColor = (type) => {
    const colors = {
      government: '#2563EB',
      private: '#14B8A6',
      consultancy: '#8B5CF6',
      nonprofit: '#F59E0B'
    };
    return colors[type] || '#64748B';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDetails = (id) =>{
    navigate(`/admin/organizations/${id}`)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="w-6 h-6" style={{ color: '#2563EB' }} />
              <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Organizations</h1>
              <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}>
                Total: {pagination.total}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
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
                  setShowModal(true);
                  setApiError('');
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: '#2563EB' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Organization</span>
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
        {apiError && (
          <div className="mb-4 p-4 rounded-lg flex items-center space-x-3" style={{ 
            backgroundColor: '#FEF2F2', 
            border: '1px solid #FECACA' 
          }}>
            <AlertCircle className="w-5 h-5" style={{ color: '#DC2626' }} />
            <span style={{ color: '#DC2626' }}>{apiError}</span>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  color: '#0F172A',
                  width: '250px'
                }}
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#0F172A'
              }}
            >
              <option value="all">All Types</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
              <option value="consultancy">Consultancy</option>
              <option value="nonprofit">Non-Profit</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
          >
            <Download className="w-4 h-4" style={{ color: '#64748B' }} />
            <span style={{ color: '#64748B' }}>Export</span>
          </button>
        </div>

        {/* Organizations Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#2563EB' }}></div>
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: '#F1F5F9' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Organization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Stats</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.length > 0 ? (
                    organizations.map((org) => (
                      <tr key={org.id} className="border-t hover:bg-gray-50" style={{ borderColor: '#E2E8F0' }}>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium" style={{ color: '#0F172A' }}>{org.name}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>ID: {org.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs rounded-full" style={{
                            backgroundColor: `${getTypeColor(org.type)}20`,
                            color: getTypeColor(org.type)
                          }}>
                            {org.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3" style={{ color: '#94A3B8' }} />
                              <span className="text-sm" style={{ color: '#64748B' }}>{org.email}</span>
                            </div>
                            {org.phone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="w-3 h-3" style={{ color: '#94A3B8' }} />
                                <span className="text-sm" style={{ color: '#64748B' }}>{org.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {org.address ? (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" style={{ color: '#94A3B8' }} />
                              <span className="text-sm" style={{ color: '#64748B' }}>{org.address}</span>
                            </div>
                          ) : (
                            <span className="text-sm italic" style={{ color: '#94A3B8' }}>Not provided</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" style={{ color: '#2563EB' }} />
                              <span className="text-xs" style={{ color: '#64748B' }}>{org.users_count || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Briefcase className="w-3 h-3" style={{ color: '#14B8A6' }} />
                              <span className="text-xs" style={{ color: '#64748B' }}>{org.departments_count || 0}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm" style={{ color: '#64748B' }}>{formatDate(org.created_at)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(org)}
                              className="p-1 rounded hover:bg-gray-100"
                              title="Edit"
                              disabled={submitting}
                            >
                              <Edit className="w-4 h-4" style={{ color: '#64748B' }} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(org.id)}
                              className="p-1 rounded hover:bg-gray-100"
                              title="Delete"
                              disabled={submitting}
                            >
                              <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                            </button>
                            <button
                            onClick={()=>handleDetails(org.id)}
                              className="p-1 rounded hover:bg-gray-100"
                              title="View Details"
                              disabled={submitting}
                            >
                              <Eye className="w-4 h-4" style={{ color: '#64748B' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center">
                        <p style={{ color: '#94A3B8' }}>No organizations found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
                <div className="text-sm" style={{ color: '#64748B' }}>
                  Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} organizations
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1 || loading}
                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
                  >
                    <ChevronLeft className="w-4 h-4" style={{ color: '#64748B' }} />
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {[...Array(pagination.last_page)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show current page, first, last, and pages around current
                      if (
                        pageNumber === 1 ||
                        pageNumber === pagination.last_page ||
                        (pageNumber >= pagination.current_page - 1 && pageNumber <= pagination.current_page + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            disabled={loading}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              pagination.current_page === pageNumber ? 'text-white' : ''
                            }`}
                            style={{
                              backgroundColor: pagination.current_page === pageNumber ? '#2563EB' : '#F8FAFC',
                              color: pagination.current_page === pageNumber ? '#FFFFFF' : '#64748B',
                              border: '1px solid #E2E8F0'
                            }}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === pagination.current_page - 2 ||
                        pageNumber === pagination.current_page + 2
                      ) {
                        return <span key={pageNumber} style={{ color: '#94A3B8' }}>...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page || loading}
                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
                  >
                    <ChevronRight className="w-4 h-4" style={{ color: '#64748B' }} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black/50 " onClick={() => setShowModal(false)}></div>
              
              <div className="relative bg-white rounded-lg w-full max-w-md p-6" style={{
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: '#0F172A' }}>
                    {modalMode === 'add' ? 'Add New Organization' : 'Edit Organization'}
                  </h3>
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="p-1 rounded-full hover:bg-gray-100"
                    disabled={submitting}
                  >
                    <X className="w-5 h-5" style={{ color: '#64748B' }} />
                  </button>
                </div>

                {/* Modal Error Message */}
                {apiError && (
                  <div className="mb-4 p-3 rounded-lg flex items-center space-x-2" style={{ 
                    backgroundColor: '#FEF2F2', 
                    border: '1px solid #FECACA' 
                  }}>
                    <AlertCircle className="w-4 h-4" style={{ color: '#DC2626' }} />
                    <span className="text-sm" style={{ color: '#DC2626' }}>{apiError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: `1px solid ${formErrors.name ? '#EF4444' : '#E2E8F0'}`,
                        color: '#0F172A'
                      }}
                      placeholder="Enter organization name"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{formErrors.name}</p>
                    )}
                  </div>

                  {/* Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>
                      Organization Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: `1px solid ${formErrors.type ? '#EF4444' : '#E2E8F0'}`,
                        color: '#0F172A'
                      }}
                    >
                      <option value="government">Government</option>
                      <option value="private">Private</option>
                      <option value="consultancy">Consultancy</option>
                      <option value="nonprofit">Non-Profit</option>
                    </select>
                    {formErrors.type && (
                      <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{formErrors.type}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: `1px solid ${formErrors.email ? '#EF4444' : '#E2E8F0'}`,
                        color: '#0F172A'
                      }}
                      placeholder="Enter email address"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{formErrors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: `1px solid ${formErrors.phone ? '#EF4444' : '#E2E8F0'}`,
                        color: '#0F172A'
                      }}
                      placeholder="Enter 10-digit phone number"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{formErrors.phone}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        color: '#0F172A',
                        minHeight: '80px'
                      }}
                      placeholder="Enter address (optional)"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
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
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>{modalMode === 'add' ? 'Create' : 'Update'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => !submitting && setDeleteConfirm(null)}></div>
              
              <div className="relative bg-white rounded-lg w-full max-w-md p-6">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#EF4444' }} />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#0F172A' }}>Confirm Delete</h3>
                  <p className="text-sm mb-6" style={{ color: '#64748B' }}>
                    Are you sure you want to delete this organization? This action cannot be undone.
                  </p>
                  
                  {/* Delete Error */}
                  {apiError && (
                    <div className="mb-4 p-3 rounded-lg text-sm" style={{ 
                      backgroundColor: '#FEF2F2', 
                      color: '#DC2626',
                      border: '1px solid #FECACA'
                    }}>
                      {apiError}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      disabled={submitting}
                      className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                      style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(deleteConfirm)}
                      disabled={submitting}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                      style={{ backgroundColor: '#EF4444' }}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        'Delete'
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

export default HandleOrganizations;