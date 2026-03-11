import React, { useState, useEffect } from 'react';
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
  Building2,
  Mail,
  Phone,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  User,
  UserCog,
  Briefcase,
  Shield,
  Truck,
  Users as UsersIcon,
  Key
} from 'lucide-react';
import { api } from '../../utils/app';

const HandleOrgUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterOrg, setFilterOrg] = useState('all');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  });

  // Form state for add user
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization_id: 1, // Static for now, will be updated later
    role_id: 3 // Default to HR/Recruiter
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Role definitions
  const roles = [
    { id: 3, name: 'HR / Recruiter', slug: 'hr_recruiter', color: '#14B8A6', bgColor: '#CCFBF1', icon: UsersIcon },
    { id: 4, name: 'Department Manager', slug: 'dept_manager', color: '#8B5CF6', bgColor: '#EDE9FE', icon: Briefcase },
    { id: 5, name: 'Vendor / Consultancy', slug: 'vendor', color: '#F59E0B', bgColor: '#FEF3C7', icon: Truck },
    { id: 6, name: 'Interview Panel', slug: 'interview_panel', color: '#EC4899', bgColor: '#FCE7F3', icon: UserCog }
  ];

  // Fetch users
  const fetchUsers = async (page = 1) => {
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
      
      if (filterRole !== 'all') {
        params.append('role_id', filterRole);
      }
      
      if (filterOrg !== 'all') {
        params.append('organization_id', filterOrg);
      }

      const response = await api.get(`/users?${params.toString()}`);
      
      if (response.data) {
        setUsers(response.data.data || []);
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
      console.error('Error fetching users:', error);
      setApiError(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Debounce search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUsers(1);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterRole, filterOrg]);

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
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (!formData.role_id) {
      errors.role_id = 'Role is required';
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
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        organization_id: formData.organization_id,
        role_id: parseInt(formData.role_id)
      };

      console.log('Submitting user:', submitData);

      const response = await api.post('/users', submitData);
      
      setSuccessMessage('User created successfully!');
      setShowModal(false);
      resetForm();
      
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchUsers(pagination.current_page);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      if (error.status === 422 && error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach(key => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.message || 'Failed to create user');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    setSubmitting(true);
    setApiError('');
    
    try {
      await api.delete(`/users/${id}`);
      
      setDeleteConfirm(null);
      setSuccessMessage('User deleted successfully!');
      
      setTimeout(() => setSuccessMessage(''), 3000);
      
      const newPage = users.length === 1 && pagination.current_page > 1 
        ? pagination.current_page - 1 
        : pagination.current_page;
      
      fetchUsers(newPage);
      
    } catch (error) {
      console.error('Error deleting user:', error);
      setApiError(error.message || 'Failed to delete user');
      setDeleteConfirm(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchUsers(page);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      organization_id: 1,
      role_id: 3
    });
    setFormErrors({});
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get role details by ID
  const getRoleDetails = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role || { 
      id: roleId, 
      name: 'Unknown', 
      color: '#64748B', 
      bgColor: '#F1F5F9',
      icon: User 
    };
  };

  // Get verification badge
  const getVerificationBadge = (verifiedAt) => {
    if (verifiedAt) {
      return {
        label: 'Verified',
        color: '#22C55E',
        bgColor: '#DCFCE7'
      };
    }
    return {
      label: 'Unverified',
      color: '#F59E0B',
      bgColor: '#FEF3C7'
    };
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6" style={{ color: '#2563EB' }} />
              <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Organization Users</h1>
              <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}>
                Total: {pagination.total}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchUsers(pagination.current_page)}
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
                <span className="text-sm font-medium">Add User</span>
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
          <div className="flex items-center space-x-3 flex-wrap gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search users..."
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

            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#0F172A'
              }}
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>

            {/* Organization Filter */}
            <select
              value={filterOrg}
              onChange={(e) => setFilterOrg(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#0F172A'
              }}
            >
              <option value="all">All Organizations</option>
              <option value="1">ABC Government Dept</option>
              {/* Add more organizations as needed */}
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

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#2563EB' }}></div>
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead style={{ backgroundColor: '#F1F5F9' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>User</th>
                   <th className="px-6 py-3 text-left text-xs font-medium w-[180px]">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Organization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => {
                      const roleDetails = getRoleDetails(user.role_id);
                      const RoleIcon = roleDetails.icon;
                      const verification = getVerificationBadge(user.email_verified_at);
                      
                      return (
                        <tr key={user.id} className="border-t hover:bg-gray-50" style={{ borderColor: '#E2E8F0' }}>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: roleDetails.bgColor }}>
                                <RoleIcon className="w-4 h-4" style={{ color: roleDetails.color }} />
                              </div>
                              <div>
                                <p className="text-sm font-medium" style={{ color: '#0F172A' }}>{user.name}</p>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>ID: {user.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs rounded-full" style={{
                              backgroundColor: roleDetails.bgColor,
                              color: roleDetails.color
                            }}>
                              {roleDetails.name}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {user.organization ? (
                              <div className="flex items-center space-x-1">
                                <Building2 className="w-3 h-3" style={{ color: '#2563EB' }} />
                                <span className="text-sm" style={{ color: '#64748B' }}>{user.organization.name}</span>
                              </div>
                            ) : (
                              <span className="text-sm italic" style={{ color: '#94A3B8' }}>No Organization</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" style={{ color: '#94A3B8' }} />
                                <span className="text-sm" style={{ color: '#64748B' }}>{user.email}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="w-3 h-3" style={{ color: '#94A3B8' }} />
                                  <span className="text-sm" style={{ color: '#64748B' }}>{user.phone}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs rounded-full" style={{
                              backgroundColor: verification.bgColor,
                              color: verification.color
                            }}>
                              {verification.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm" style={{ color: '#64748B' }}>{formatDate(user.created_at)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                className="p-1 rounded hover:bg-gray-100"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" style={{ color: '#64748B' }} />
                              </button>
                              <button
                                className="p-1 rounded hover:bg-gray-100"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" style={{ color: '#64748B' }} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(user.id)}
                                className="p-1 rounded hover:bg-gray-100"
                                title="Delete"
                                disabled={submitting}
                              >
                                <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                              </button>
                              <button
                                className="p-1 rounded hover:bg-gray-100"
                                title="Reset Password"
                              >
                                <Key className="w-4 h-4" style={{ color: '#F59E0B' }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center">
                        <Users className="w-12 h-12 mx-auto mb-3" style={{ color: '#94A3B8' }} />
                        <p style={{ color: '#94A3B8' }}>No users found</p>
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
                  Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} users
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
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(pagination.last_page)].map((_, index) => {
                      const pageNumber = index + 1;
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

        {/* Add User Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black/50" onClick={() => !submitting && setShowModal(false)}></div>
              
              <div className="relative bg-white rounded-lg w-full max-w-md p-6" style={{
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: '#0F172A' }}>
                    Add New User
                  </h3>
                  <button 
                    onClick={() => !submitting && setShowModal(false)} 
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

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Organization ID (Hidden for now) */}
                  <input type="hidden" name="organization_id" value={formData.organization_id} />

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
                      placeholder="Enter full name"
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

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: `1px solid ${formErrors.password ? '#EF4444' : '#E2E8F0'}`,
                        color: '#0F172A'
                      }}
                      placeholder="Enter password"
                    />
                    {formErrors.password && (
                      <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{formErrors.password}</p>
                    )}
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Minimum 6 characters</p>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>
                      Role *
                    </label>
                    <select
                      name="role_id"
                      value={formData.role_id}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: `1px solid ${formErrors.role_id ? '#EF4444' : '#E2E8F0'}`,
                        color: '#0F172A'
                      }}
                    >
                      <option value="">Select a role</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                    {formErrors.role_id && (
                      <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{formErrors.role_id}</p>
                    )}
                  </div>

                  {/* Organization Info - Static for now */}
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <p className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>Organization:</p>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4" style={{ color: '#2563EB' }} />
                      <span className="text-sm font-medium" style={{ color: '#0F172A' }}>ABC Government Dept (ID: 1)</span>
                    </div>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>
                      Note: Organization ID is set to 1 (will be configurable later)
                    </p>
                  </div>

               

                  {/* Buttons */}
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => !submitting && setShowModal(false)}
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
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Create User</span>
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
                    Are you sure you want to delete this user? This action cannot be undone.
                  </p>
                  
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

export default HandleOrgUser;