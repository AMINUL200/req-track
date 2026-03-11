import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  UserCircle,
  Building2,
  Calendar,
  Star,
  Award,
  Clock,
  Globe,
  Linkedin,
  Facebook,
  Twitter
} from 'lucide-react';
import { api } from '../../../utils/app';

const HandleCandidates = () => {
  const navigate = useNavigate();
  
  // State for candidates list
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  });

  // State for create form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    organization_id: 1, // Will be dynamic later
    name: '',
    email: '',
    phone: '',
    source: 'website'
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // State for messages
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // State for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch candidates
  const fetchCandidates = async (page = 1) => {
    setLoading(true);
    setApiError('');
    
    try {
      const params = new URLSearchParams({
        page: page,
        per_page: pagination.per_page
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (filterSource !== 'all') {
        params.append('source', filterSource);
      }

      const response = await api.get(`/candidates?${params.toString()}`);
      
      if (response.data) {
        setCandidates(response.data.data || []);
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
      console.error('Error fetching candidates:', error);
      setApiError(error.message || 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCandidates(1);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterSource]);

  // Initial fetch
  useEffect(() => {
    fetchCandidates();
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
      errors.name = 'Candidate name is required';
    }
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.source) {
      errors.source = 'Source is required';
    }
    return errors;
  };

  // Handle form submit
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
      // Prepare data
      const submitData = {
        organization_id: formData.organization_id,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/\D/g, ''),
        source: formData.source
      };

      const response = await api.post('/candidates', submitData);
      
      setSuccessMessage('Candidate added successfully!');
      setShowForm(false);
      resetForm();
      
      // Refresh list
      fetchCandidates(1);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error adding candidate:', error);
      
      if (error.status === 422 && error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach(key => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.message || 'Failed to add candidate');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    setDeleteLoading(true);
    setApiError('');
    
    try {
      await api.delete(`/candidates/${id}`);
      
      setDeleteConfirm(null);
      setSuccessMessage('Candidate deleted successfully!');
      
      // Refresh list
      const newPage = candidates.length === 1 && pagination.current_page > 1 
        ? pagination.current_page - 1 
        : pagination.current_page;
      
      fetchCandidates(newPage);
      
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error deleting candidate:', error);
      setApiError(error.message || 'Failed to delete candidate');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      organization_id: 1,
      name: '',
      email: '',
      phone: '',
      source: 'website'
    });
    setFormErrors({});
  };

  // Handle view details
  const handleViewDetails = (id) => {
    navigate(`/admin/candidates/${id}`);
  };

  // Handle edit
  const handleEdit = (id) => {
    navigate(`/candidates/${id}/edit`);
  };

  // Get source badge color
  const getSourceColor = (source) => {
    const colors = {
      website: '#2563EB',
      linkedin: '#0A66C2',
      referral: '#8B5CF6',
      facebook: '#1877F2',
      twitter: '#1DA1F2',
      other: '#64748B'
    };
    return colors[source] || colors.other;
  };

  // Format experience
  const formatExperience = (exp) => {
    if (!exp) return 'Fresher';
    const years = parseFloat(exp);
    if (years === 1) return '1 year';
    if (years < 1) return `${Math.round(years * 12)} months`;
    return `${years} years`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6" style={{ color: '#2563EB' }} />
              <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Candidates</h1>
              <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}>
                Total: {pagination.total}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchCandidates(pagination.current_page)}
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
                  setShowForm(!showForm);
                  setApiError('');
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: '#2563EB' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Candidate</span>
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

        {/* Create Form - Slides in from top */}
        <div className={`mb-6 transition-all duration-300 overflow-hidden ${
          showForm ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#0F172A' }}>Add New Candidate</h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" style={{ color: '#64748B' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>
                  Full Name *
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
                  placeholder="Enter candidate name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{formErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
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
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>
                  Phone Number *
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

              {/* Source */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>
                  Source *
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${formErrors.source ? '#EF4444' : '#E2E8F0'}`,
                    color: '#0F172A'
                  }}
                >
                  <option value="website">Website</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="referral">Referral</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="other">Other</option>
                </select>
                {formErrors.source && (
                  <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{formErrors.source}</p>
                )}
              </div>

              {/* Submit Button - Full width on mobile, span 2 columns on desktop */}
              <div className="md:col-span-2 flex justify-end space-x-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
                      <Save className="w-4 h-4" />
                      <span>Add Candidate</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search candidates..."
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

            {/* Source Filter */}
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#0F172A'
              }}
            >
              <option value="all">All Sources</option>
              <option value="website">Website</option>
              <option value="linkedin">LinkedIn</option>
              <option value="referral">Referral</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
          >
            <Download className="w-4 h-4" style={{ color: '#64748B' }} />
            <span style={{ color: '#64748B' }}>Export</span>
          </button>
        </div>

        {/* Candidates Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#2563EB' }}></div>
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead style={{ backgroundColor: '#F1F5F9' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.length > 0 ? (
                    candidates.map((candidate) => (
                      <tr key={candidate.id} className="border-t hover:bg-gray-50" style={{ borderColor: '#E2E8F0' }}>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: '#DBEAFE' }}
                            >
                              <UserCircle className="w-5 h-5" style={{ color: '#2563EB' }} />
                            </div>
                            <div>
                              <p className="text-sm font-medium" style={{ color: '#0F172A' }}>{candidate.name}</p>
                              <p className="text-xs" style={{ color: '#94A3B8' }}>ID: {candidate.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3" style={{ color: '#94A3B8' }} />
                              <span className="text-sm" style={{ color: '#64748B' }}>{candidate.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" style={{ color: '#94A3B8' }} />
                              <span className="text-sm" style={{ color: '#64748B' }}>{candidate.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm" style={{ color: '#64748B' }}>
                            {formatExperience(candidate.total_experience)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span 
                            className="px-2 py-1 text-xs rounded-full"
                            style={{
                              backgroundColor: `${getSourceColor(candidate.source)}20`,
                              color: getSourceColor(candidate.source)
                            }}
                          >
                            {candidate.source}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {candidate.assigned_recruiter ? (
                            <div>
                              <p className="text-sm" style={{ color: '#0F172A' }}>{candidate.assigned_recruiter.name}</p>
                              <p className="text-xs" style={{ color: '#94A3B8' }}>Recruiter</p>
                            </div>
                          ) : (
                            <span className="text-sm italic" style={{ color: '#94A3B8' }}>Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm" style={{ color: '#64748B' }}>
                            {new Date(candidate.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(candidate.id)}
                              className="p-1 rounded hover:bg-gray-100"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" style={{ color: '#64748B' }} />
                            </button>
                            {/* <button
                              onClick={() => handleEdit(candidate.id)}
                              className="p-1 rounded hover:bg-gray-100"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" style={{ color: '#64748B' }} />
                            </button> */}
                            {/* <button
                              onClick={() => setDeleteConfirm(candidate.id)}
                              className="p-1 rounded hover:bg-gray-100"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center">
                        <Users className="w-12 h-12 mx-auto mb-3" style={{ color: '#94A3B8' }} />
                        <p style={{ color: '#94A3B8' }}>No candidates found</p>
                        <button
                          onClick={() => setShowForm(true)}
                          className="mt-3 text-sm font-medium"
                          style={{ color: '#2563EB' }}
                        >
                          Add your first candidate
                        </button>
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
                  Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} candidates
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchCandidates(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1 || loading}
                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
                  >
                    <ChevronLeft className="w-4 h-4" style={{ color: '#64748B' }} />
                  </button>
                  
                  <span className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
                    {pagination.current_page}
                  </span>
                  
                  <button
                    onClick={() => fetchCandidates(pagination.current_page + 1)}
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

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div 
                className="fixed inset-0 bg-black bg-opacity-50" 
                onClick={() => !deleteLoading && setDeleteConfirm(null)}
              ></div>
              
              <div className="relative bg-white rounded-lg w-full max-w-md p-6">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#EF4444' }} />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#0F172A' }}>Delete Candidate</h3>
                  <p className="text-sm mb-6" style={{ color: '#64748B' }}>
                    Are you sure you want to delete this candidate? This action cannot be undone.
                  </p>
                  
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
                      disabled={deleteLoading}
                      className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                      style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(deleteConfirm)}
                      disabled={deleteLoading}
                      className={`
                        flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium
                        transition-all duration-200 min-w-[100px] justify-center
                        ${deleteLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#DC2626]'}
                      `}
                      style={{ 
                        backgroundColor: "#EF4444",
                        cursor: deleteLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {deleteLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
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

export default HandleCandidates;