import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Users,
  Briefcase,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { api } from '../../../utils/app';

const HandleDepartmentsDetails = () => {
  const { id } = useParams(); // Get department ID from URL
  const navigate = useNavigate();
  
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch department details
  const fetchDepartmentDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get(`/departments/${id}`);
      console.log('Department details:', response.data);
      setDepartment(response.data);
    } catch (error) {
      console.error('Error fetching department details:', error);
      setError(error.message || 'Failed to load department details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDepartmentDetails();
    }
  }, [id]);

  // Handle delete department
  const handleDelete = async () => {
    setDeleteLoading(true);
    setError('');
    
    try {
      await api.delete(`/departments/${id}`);
      // Redirect to departments list with success message
      navigate(`/organizations/${department?.organization_id}/departments`, {
        state: { 
          success: 'Department deleted successfully!' 
        }
      });
    } catch (error) {
      console.error('Error deleting department:', error);
      setError(error.message || 'Failed to delete department');
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get organization type badge color
  const getOrgTypeColor = (type) => {
    const colors = {
      government: '#2563EB',
      private: '#14B8A6',
      consultancy: '#8B5CF6',
      nonprofit: '#F59E0B'
    };
    return colors[type] || '#64748B';
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
        <div className="p-6">
          {/* Back button skeleton */}
          <div className="mb-6">
            <div className="h-8 w-24 rounded-lg" style={{ backgroundColor: '#E2E8F0' }}></div>
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main card skeleton */}
            <div className="lg:col-span-2">
              <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <div className="animate-pulse">
                  <div className="h-8 w-48 rounded mb-4" style={{ backgroundColor: '#E2E8F0' }}></div>
                  <div className="space-y-3">
                    <div className="h-4 w-full rounded" style={{ backgroundColor: '#E2E8F0' }}></div>
                    <div className="h-4 w-3/4 rounded" style={{ backgroundColor: '#E2E8F0' }}></div>
                    <div className="h-4 w-1/2 rounded" style={{ backgroundColor: '#E2E8F0' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar skeleton */}
            <div className="lg:col-span-1">
              <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <div className="animate-pulse">
                  <div className="h-6 w-32 rounded mb-4" style={{ backgroundColor: '#E2E8F0' }}></div>
                  <div className="space-y-4">
                    <div className="h-16 rounded" style={{ backgroundColor: '#E2E8F0' }}></div>
                    <div className="h-16 rounded" style={{ backgroundColor: '#E2E8F0' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !department) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
        <div className="p-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center space-x-2 transition-colors group"
            style={{ color: '#64748B' }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Go Back</span>
          </button>
          
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="w-12 h-12 mb-4" style={{ color: '#EF4444' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#0F172A' }}>Error Loading Department</h3>
            <p className="text-sm mb-4" style={{ color: '#64748B' }}>{error}</p>
            <button
              onClick={fetchDepartmentDetails}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: '#2563EB' }}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <div className="p-6">
        {/* Header with back button and actions */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 transition-colors group"
            style={{ color: '#64748B' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#2563EB'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Departments</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchDepartmentDetails}
              className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" style={{ color: '#64748B' }} />
            </button>
           
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Delete</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Department Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Department Info Card */}
            <div className="rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#DBEAFE' }}>
                    <Building className="w-6 h-6" style={{ color: '#2563EB' }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: '#0F172A' }}>{department?.name}</h2>
                    <p className="text-sm" style={{ color: '#64748B' }}>Department Details</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Department ID */}
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 flex-shrink-0" style={{ color: '#94A3B8' }}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#94A3B8' }}>Department ID</p>
                    <p className="text-sm font-medium" style={{ color: '#0F172A' }}>#{department?.id}</p>
                  </div>
                </div>

                {/* Organization */}
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 flex-shrink-0" style={{ color: '#94A3B8' }}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#94A3B8' }}>Organization</p>
                    <p className="text-sm font-medium" style={{ color: '#0F172A' }}>{department?.organization?.name}</p>
                  </div>
                </div>

                {/* Created At */}
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 flex-shrink-0" style={{ color: '#94A3B8' }}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#94A3B8' }}>Created</p>
                    <p className="text-sm" style={{ color: '#0F172A' }}>{formatDate(department?.created_at)}</p>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 flex-shrink-0" style={{ color: '#94A3B8' }}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#94A3B8' }}>Last Updated</p>
                    <p className="text-sm" style={{ color: '#0F172A' }}>{formatDate(department?.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Organization Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Organization Card */}
            <div className="rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div className="p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
                <h3 className="font-semibold" style={{ color: '#0F172A' }}>Parent Organization</h3>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Organization Name with Type Badge */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium" style={{ color: '#0F172A' }}>{department?.organization?.name}</p>
                    <span 
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: `${getOrgTypeColor(department?.organization?.type)}20`,
                        color: getOrgTypeColor(department?.organization?.type)
                      }}
                    >
                      {department?.organization?.type}
                    </span>
                  </div>
                  
                  {/* Organization Details */}
                  <div className="space-y-2 mt-3">
                    {department?.organization?.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" style={{ color: '#94A3B8' }} />
                        <span className="text-sm" style={{ color: '#64748B' }}>{department?.organization?.email}</span>
                      </div>
                    )}
                    
                    {department?.organization?.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" style={{ color: '#94A3B8' }} />
                        <span className="text-sm" style={{ color: '#64748B' }}>{department?.organization?.phone}</span>
                      </div>
                    )}
                    
                    {department?.organization?.address ? (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" style={{ color: '#94A3B8' }} />
                        <span className="text-sm" style={{ color: '#64748B' }}>{department?.organization?.address}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" style={{ color: '#94A3B8' }} />
                        <span className="text-sm italic" style={{ color: '#94A3B8' }}>No address provided</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t" style={{ borderColor: '#E2E8F0' }}>
                  <div className="text-center p-2 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                    <Users className="w-4 h-4 mx-auto mb-1" style={{ color: '#2563EB' }} />
                    <p className="text-xs font-medium" style={{ color: '#64748B' }}>Organization ID</p>
                    <p className="text-sm font-bold" style={{ color: '#0F172A' }}>#{department?.organization_id}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                    <Building className="w-4 h-4 mx-auto mb-1" style={{ color: '#14B8A6' }} />
                    <p className="text-xs font-medium" style={{ color: '#64748B' }}>Department ID</p>
                    <p className="text-sm font-bold" style={{ color: '#0F172A' }}>#{department?.id}</p>
                  </div>
                </div>

                {/* View Organization Button */}
                <button
                  onClick={() => navigate(`/admin/organizations/${department?.organization_id}`)}
                  className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ 
                    backgroundColor: '#F1F5F9',
                    color: '#2563EB',
                    border: '1px solid #E2E8F0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#DBEAFE';
                    e.currentTarget.style.borderColor = '#2563EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F1F5F9';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}
                >
                  <Building2 className="w-4 h-4" />
                  <span>View Organization</span>
                </button>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div className="p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
                <h3 className="font-semibold" style={{ color: '#0F172A' }}>Quick Actions</h3>
              </div>
              <div className="p-4 space-y-2">
                <button
                  onClick={() => navigate(`/organizations/${department?.organization_id}/departments`)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{ color: '#64748B' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F1F5F9';
                    e.currentTarget.style.color = '#2563EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#64748B';
                  }}
                >
                  View all departments in this organization
                </button>
                <button
                  onClick={() => navigate(`/organizations/${department?.organization_id}/employees`)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{ color: '#64748B' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F1F5F9';
                    e.currentTarget.style.color = '#2563EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#64748B';
                  }}
                >
                  View employees in this department
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div 
                className="fixed inset-0 bg-black bg-opacity-50" 
                onClick={() => !deleteLoading && setShowDeleteModal(false)}
              ></div>
              
              <div className="relative bg-white rounded-lg w-full max-w-md p-6">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#EF4444' }} />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#0F172A' }}>Delete Department</h3>
                  <p className="text-sm mb-6" style={{ color: '#64748B' }}>
                    Are you sure you want to delete <span className="font-semibold">{department?.name}</span>? 
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
                      onClick={() => setShowDeleteModal(false)}
                      disabled={deleteLoading}
                      className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                      style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
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

export default HandleDepartmentsDetails;