import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  Search,
  Filter,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  UserCircle,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Award,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  Check,
  ChevronDown
} from 'lucide-react';
import { api } from '../../../utils/app';

const HandleApplication = () => {
  // State for applications list
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  });

  // State for create application
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Store all fetched data
  const [allCandidates, setAllCandidates] = useState([]);
  const [allRequirements, setAllRequirements] = useState([]);
  
  // Filtered lists for display
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [filteredRequirements, setFilteredRequirements] = useState([]);
  
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [requirementsLoading, setRequirementsLoading] = useState(false);
  
  // Search states
  const [candidateSearch, setCandidateSearch] = useState('');
  const [requirementSearch, setRequirementSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [showCandidateDropdown, setShowCandidateDropdown] = useState(false);
  const [showRequirementDropdown, setShowRequirementDropdown] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    candidate_id: '',
    requirement_id: '',
    pipeline_stage_id: 1,
    source: 'website'
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Stage movement states - UPDATED for popup
  const [showStagePopup, setShowStagePopup] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [stageMoveLoading, setStageMoveLoading] = useState(false);

  // Pipeline stages
  const pipelineStages = [
    { id: 1, name: 'Applied', color: '#94A3B8' },
    { id: 2, name: 'Shortlisted', color: '#8B5CF6' },
    { id: 3, name: 'Interview Scheduled', color: '#F59E0B' },
    { id: 4, name: 'Interviewed', color: '#3B82F6' },
    { id: 5, name: 'Selected', color: '#10B981' },
    { id: 6, name: 'Offered', color: '#14B8A6' },
    { id: 7, name: 'Hired', color: '#059669' },
    { id: 8, name: 'Rejected', color: '#EF4444' }
  ];

  // Fetch applications
  const fetchApplications = async (page = 1) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get('/applications');
      console.log('Applications:', response.data);
      
      // Handle paginated response
      const data = response.data.data || response.data || [];
      setApplications(Array.isArray(data) ? data : []);
      
      // Update pagination if available
      if (response.data.current_page) {
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
      console.error('Error fetching applications:', error);
      setError(error.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all candidates once
  const fetchAllCandidates = async () => {
    setCandidatesLoading(true);
    try {
      const response = await api.get('/candidates');
      console.log('All candidates:', response.data);
      
      // Handle both paginated and non-paginated responses
      const candidatesData = response.data.data || response.data || [];
      setAllCandidates(Array.isArray(candidatesData) ? candidatesData : []);
      setFilteredCandidates(Array.isArray(candidatesData) ? candidatesData : []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setCandidatesLoading(false);
    }
  };

  // Fetch all requirements once
  const fetchAllRequirements = async () => {
    setRequirementsLoading(true);
    try {
      const response = await api.get('/requirements');
      console.log('All requirements:', response.data);
      
      // Handle both paginated and non-paginated responses
      const requirementsData = response.data.data || response.data || [];
      
      // Filter to show only published requirements if needed
      const publishedRequirements = requirementsData.filter(req => 
        req.status === 'published' || !req.status
      );
      
      setAllRequirements(Array.isArray(requirementsData) ? requirementsData : []);
      setFilteredRequirements(Array.isArray(publishedRequirements) ? publishedRequirements : []);
    } catch (error) {
      console.error('Error fetching requirements:', error);
    } finally {
      setRequirementsLoading(false);
    }
  };

  // Handle stage movement - UPDATED
  const handleMoveStage = async (newStageId) => {
    if (!selectedApplication) return;
    
    setStageMoveLoading(true);
    setError('');

    try {
      await api.post(`/applications/${selectedApplication.id}/move-stage`, {
        pipeline_stage_id: newStageId
      });

      // Refresh applications list
      await fetchApplications(pagination.current_page);
      
      setSuccessMessage('Application stage updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Close popup
      setShowStagePopup(false);
      setSelectedApplication(null);
      
    } catch (error) {
      console.error('Error moving stage:', error);
      
      if (error.status === 422 && error.data?.errors) {
        const errorMessage = Object.values(error.data.errors).flat()[0];
        setError(errorMessage || 'Failed to update stage');
      } else {
        setError(error.message || 'Failed to update stage');
      }
    } finally {
      setStageMoveLoading(false);
    }
  };

  // Open stage popup - UPDATED
  const openStagePopup = (application) => {
    console.log("Opening popup for:", application);
    setSelectedApplication(application);
    setShowStagePopup(true);
  };

  // Close stage popup - NEW
  const closeStagePopup = () => {
    setShowStagePopup(false);
    setSelectedApplication(null);
    setError('');
  };

  // Get available stages (excluding current stage)
  const getAvailableStages = (currentStageId) => {
    return pipelineStages.filter(stage => stage.id !== currentStageId);
  };

  // Load all data when form opens
  useEffect(() => {
    if (showCreateForm) {
      fetchAllCandidates();
      fetchAllRequirements();
    }
  }, [showCreateForm]);

  // Filter candidates based on search
  useEffect(() => {
    if (!candidateSearch.trim()) {
      setFilteredCandidates(allCandidates);
    } else {
      const searchLower = candidateSearch.toLowerCase();
      const filtered = allCandidates.filter(candidate => 
        candidate.name?.toLowerCase().includes(searchLower) ||
        candidate.email?.toLowerCase().includes(searchLower) ||
        candidate.phone?.includes(searchLower)
      );
      setFilteredCandidates(filtered);
    }
  }, [candidateSearch, allCandidates]);

  // Filter requirements based on search
  useEffect(() => {
    if (!requirementSearch.trim()) {
      // Show only published requirements when no search
      const publishedRequirements = allRequirements.filter(req => 
        req.status === 'published' || !req.status
      );
      setFilteredRequirements(publishedRequirements);
    } else {
      const searchLower = requirementSearch.toLowerCase();
      const filtered = allRequirements.filter(requirement => 
        requirement.title?.toLowerCase().includes(searchLower) ||
        requirement.location?.toLowerCase().includes(searchLower) ||
        requirement.organization?.name?.toLowerCase().includes(searchLower)
      );
      setFilteredRequirements(filtered);
    }
  }, [requirementSearch, allRequirements]);

  // Initial fetch
  useEffect(() => {
    fetchApplications();
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
  };

  // Select candidate
  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setFormData(prev => ({ ...prev, candidate_id: candidate.id }));
    setCandidateSearch(candidate.name);
    setShowCandidateDropdown(false);
    // Clear error
    if (formErrors.candidate_id) {
      setFormErrors(prev => ({ ...prev, candidate_id: '' }));
    }
  };

  // Select requirement
  const handleSelectRequirement = (requirement) => {
    setSelectedRequirement(requirement);
    setFormData(prev => ({ ...prev, requirement_id: requirement.id }));
    setRequirementSearch(requirement.title);
    setShowRequirementDropdown(false);
    // Clear error
    if (formErrors.requirement_id) {
      setFormErrors(prev => ({ ...prev, requirement_id: '' }));
    }
  };

  // Clear selected candidate
  const handleClearCandidate = () => {
    setSelectedCandidate(null);
    setFormData(prev => ({ ...prev, candidate_id: '' }));
    setCandidateSearch('');
    setShowCandidateDropdown(false);
  };

  // Clear selected requirement
  const handleClearRequirement = () => {
    setSelectedRequirement(null);
    setFormData(prev => ({ ...prev, requirement_id: '' }));
    setRequirementSearch('');
    setShowRequirementDropdown(false);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.candidate_id) {
      errors.candidate_id = 'Please select a candidate';
    }
    if (!formData.requirement_id) {
      errors.requirement_id = 'Please select a requirement';
    }
    if (!formData.pipeline_stage_id) {
      errors.pipeline_stage_id = 'Please select a pipeline stage';
    }
    if (!formData.source) {
      errors.source = 'Please select a source';
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
    setError('');

    try {
      const submitData = {
        candidate_id: formData.candidate_id,
        requirement_id: formData.requirement_id,
        pipeline_stage_id: formData.pipeline_stage_id,
        source: formData.source
      };

      await api.post('/applications', submitData);
      
      setSuccessMessage('Application created successfully!');
      setShowCreateForm(false);
      resetForm();
      
      // Refresh applications list
      fetchApplications(1);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error creating application:', error);
      
      if (error.status === 422 && error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach(key => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setError(error.message || 'Failed to create application');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      candidate_id: '',
      requirement_id: '',
      pipeline_stage_id: 1,
      source: 'website'
    });
    setSelectedCandidate(null);
    setSelectedRequirement(null);
    setCandidateSearch('');
    setRequirementSearch('');
    setFormErrors({});
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format experience
  const formatExperience = (exp) => {
    if (!exp && exp !== 0) return 'Fresher';
    const years = parseFloat(exp);
    if (years === 1) return '1 year';
    if (years < 1) return `${Math.round(years * 12)} months`;
    return `${years} years`;
  };

  // Get stage color
  const getStageColor = (stageName) => {
    const stage = pipelineStages.find(s => s.name === stageName);
    return stage?.color || '#64748B';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Briefcase className="w-6 h-6" style={{ color: '#2563EB' }} />
              <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Applications</h1>
              <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}>
                Total: {pagination.total}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchApplications(pagination.current_page)}
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
                  setShowCreateForm(true);
                  setError('');
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: '#2563EB' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New Application</span>
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
        {error && !showStagePopup && (
          <div className="mb-4 p-4 rounded-lg flex items-center space-x-3" style={{ 
            backgroundColor: '#FEF2F2', 
            border: '1px solid #FECACA' 
          }}>
            <AlertCircle className="w-5 h-5" style={{ color: '#DC2626' }} />
            <span style={{ color: '#DC2626' }}>{error}</span>
          </div>
        )}

        {/* Create Application Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 bg-opacity-50"
                onClick={() => !submitting && setShowCreateForm(false)}
              ></div>
              
              {/* Modal Content */}
              <div 
                className="relative bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                {/* Header */}
                <div className="sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between" style={{ 
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0'
                }}>
                  <h2 className="text-lg font-semibold" style={{ color: '#0F172A' }}>
                    Create New Application
                  </h2>
                  <button
                    onClick={() => !submitting && setShowCreateForm(false)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    disabled={submitting}
                  >
                    <X className="w-5 h-5" style={{ color: '#64748B' }} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6">
                  <form onSubmit={handleSubmit}>
                    {/* Search and Select Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Candidate Selection */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                          Select Candidate *
                        </label>
                        <div className="relative">
                          <div className="flex items-center border rounded-lg" style={{ 
                            borderColor: formErrors.candidate_id ? '#EF4444' : '#E2E8F0'
                          }}>
                            <Search className="w-4 h-4 ml-3" style={{ color: '#94A3B8' }} />
                            <input
                              type="text"
                              value={candidateSearch}
                              onChange={(e) => {
                                setCandidateSearch(e.target.value);
                                setShowCandidateDropdown(true);
                                if (selectedCandidate) {
                                  handleClearCandidate();
                                }
                              }}
                              onFocus={() => setShowCandidateDropdown(true)}
                              placeholder="Search candidates by name or email..."
                              className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                              style={{
                                backgroundColor: '#FFFFFF',
                                color: '#0F172A'
                              }}
                              disabled={submitting}
                            />
                            {selectedCandidate && (
                              <button
                                type="button"
                                onClick={handleClearCandidate}
                                className="mr-2 p-1 rounded-full hover:bg-gray-100"
                              >
                                <X className="w-3 h-3" style={{ color: '#64748B' }} />
                              </button>
                            )}
                          </div>
                          
                          {/* Candidate Dropdown */}
                          {showCandidateDropdown && (
                            <div 
                              className="absolute z-20 mt-1 w-full rounded-lg shadow-lg max-h-60 overflow-y-auto"
                              style={{ 
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E2E8F0'
                              }}
                            >
                              {candidatesLoading ? (
                                <div className="p-4 text-center">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 mx-auto" style={{ borderColor: '#2563EB' }}></div>
                                </div>
                              ) : filteredCandidates.length > 0 ? (
                                filteredCandidates.map(candidate => (
                                  <div
                                    key={candidate.id}
                                    onClick={() => handleSelectCandidate(candidate)}
                                    className="p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
                                    style={{ borderColor: '#E2E8F0' }}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div 
                                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: '#DBEAFE' }}
                                      >
                                        <UserCircle className="w-5 h-5" style={{ color: '#2563EB' }} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium" style={{ color: '#0F172A' }}>
                                          {candidate.name}
                                        </p>
                                        <p className="text-xs truncate" style={{ color: '#64748B' }}>
                                          {candidate.email} • {candidate.phone}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-4 text-center">
                                  <p className="text-sm" style={{ color: '#64748B' }}>No candidates found</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {formErrors.candidate_id && (
                          <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{formErrors.candidate_id}</p>
                        )}
                      </div>

                      {/* Requirement Selection */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                          Select Requirement *
                        </label>
                        <div className="relative">
                          <div className="flex items-center border rounded-lg" style={{ 
                            borderColor: formErrors.requirement_id ? '#EF4444' : '#E2E8F0'
                          }}>
                            <Briefcase className="w-4 h-4 ml-3" style={{ color: '#94A3B8' }} />
                            <input
                              type="text"
                              value={requirementSearch}
                              onChange={(e) => {
                                setRequirementSearch(e.target.value);
                                setShowRequirementDropdown(true);
                                if (selectedRequirement) {
                                  handleClearRequirement();
                                }
                              }}
                              onFocus={() => setShowRequirementDropdown(true)}
                              placeholder="Search requirements by title..."
                              className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                              style={{
                                backgroundColor: '#FFFFFF',
                                color: '#0F172A'
                              }}
                              disabled={submitting}
                            />
                            {selectedRequirement && (
                              <button
                                type="button"
                                onClick={handleClearRequirement}
                                className="mr-2 p-1 rounded-full hover:bg-gray-100"
                              >
                                <X className="w-3 h-3" style={{ color: '#64748B' }} />
                              </button>
                            )}
                          </div>
                          
                          {/* Requirement Dropdown */}
                          {showRequirementDropdown && (
                            <div 
                              className="absolute z-20 mt-1 w-full rounded-lg shadow-lg max-h-60 overflow-y-auto"
                              style={{ 
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E2E8F0'
                              }}
                            >
                              {requirementsLoading ? (
                                <div className="p-4 text-center">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 mx-auto" style={{ borderColor: '#2563EB' }}></div>
                                </div>
                              ) : filteredRequirements.length > 0 ? (
                                filteredRequirements.map(requirement => (
                                  <div
                                    key={requirement.id}
                                    onClick={() => handleSelectRequirement(requirement)}
                                    className="p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
                                    style={{ borderColor: '#E2E8F0' }}
                                  >
                                    <p className="text-sm font-medium" style={{ color: '#0F172A' }}>
                                      {requirement.title}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1 text-xs">
                                      <span style={{ color: '#64748B' }}>{requirement.location}</span>
                                      <span style={{ color: '#94A3B8' }}>•</span>
                                      <span style={{ color: '#64748B' }}>{requirement.openings} openings</span>
                                      {requirement.organization && (
                                        <>
                                          <span style={{ color: '#94A3B8' }}>•</span>
                                          <span style={{ color: '#64748B' }}>{requirement.organization.name}</span>
                                        </>
                                      )}
                                    </div>
                                    {/* Show status badge for non-published requirements */}
                                    {requirement.status && requirement.status !== 'published' && (
                                      <div className="mt-1">
                                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ 
                                          backgroundColor: '#F1F5F9', 
                                          color: '#64748B' 
                                        }}>
                                          {requirement.status}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="p-4 text-center">
                                  <p className="text-sm" style={{ color: '#64748B' }}>No requirements found</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {formErrors.requirement_id && (
                          <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{formErrors.requirement_id}</p>
                        )}
                      </div>
                    </div>

                    {/* Pipeline Stage and Source */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Pipeline Stage */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                          Pipeline Stage *
                        </label>
                        <select
                          name="pipeline_stage_id"
                          value={formData.pipeline_stage_id}
                          onChange={handleInputChange}
                          disabled={submitting}
                          className="w-full px-3 py-2 rounded-lg text-sm"
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: `1px solid ${formErrors.pipeline_stage_id ? '#EF4444' : '#E2E8F0'}`,
                            color: '#0F172A'
                          }}
                        >
                          {pipelineStages.map(stage => (
                            <option key={stage.id} value={stage.id}>
                              {stage.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.pipeline_stage_id && (
                          <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{formErrors.pipeline_stage_id}</p>
                        )}
                      </div>

                      {/* Source */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
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
                    </div>

                    {/* Preview Section */}
                    {(selectedCandidate || selectedRequirement) && (
                      <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <h3 className="text-sm font-semibold mb-3 flex items-center space-x-2" style={{ color: '#0F172A' }}>
                          <Eye className="w-4 h-4" />
                          <span>Preview</span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Candidate Preview */}
                          {selectedCandidate && (
                            <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                              <p className="text-xs font-medium mb-2" style={{ color: '#2563EB' }}>Selected Candidate</p>
                              <div className="flex items-start space-x-3">
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: '#DBEAFE' }}
                                >
                                  <UserCircle className="w-6 h-6" style={{ color: '#2563EB' }} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium" style={{ color: '#0F172A' }}>{selectedCandidate.name}</p>
                                  <p className="text-xs" style={{ color: '#64748B' }}>{selectedCandidate.email}</p>
                                  <p className="text-xs" style={{ color: '#64748B' }}>{selectedCandidate.phone}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Award className="w-3 h-3" style={{ color: '#94A3B8' }} />
                                    <span className="text-xs" style={{ color: '#64748B' }}>
                                      Exp: {formatExperience(selectedCandidate.total_experience)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Requirement Preview */}
                          {selectedRequirement && (
                            <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                              <p className="text-xs font-medium mb-2" style={{ color: '#14B8A6' }}>Selected Requirement</p>
                              <p className="text-sm font-medium" style={{ color: '#0F172A' }}>{selectedRequirement.title}</p>
                              <div className="flex items-center space-x-2 mt-1 text-xs">
                                <MapPin className="w-3 h-3" style={{ color: '#94A3B8' }} />
                                <span style={{ color: '#64748B' }}>{selectedRequirement.location}</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1 text-xs">
                                <Users className="w-3 h-3" style={{ color: '#94A3B8' }} />
                                <span style={{ color: '#64748B' }}>{selectedRequirement.openings} openings</span>
                              </div>
                              {selectedRequirement.salary_min && (
                                <div className="flex items-center space-x-2 mt-1 text-xs">
                                  <DollarSign className="w-3 h-3" style={{ color: '#94A3B8' }} />
                                  <span style={{ color: '#64748B' }}>
                                    {formatCurrency(selectedRequirement.salary_min)} - {formatCurrency(selectedRequirement.salary_max)}
                                  </span>
                                </div>
                              )}
                              {selectedRequirement.organization && (
                                <div className="flex items-center space-x-2 mt-1 text-xs">
                                  <Building2 className="w-3 h-3" style={{ color: '#94A3B8' }} />
                                  <span style={{ color: '#64748B' }}>{selectedRequirement.organization.name}</span>
                                </div>
                              )}
                              {/* Show status for non-published requirements */}
                              {selectedRequirement.status && selectedRequirement.status !== 'published' && (
                                <div className="mt-2">
                                  <span className="text-xs px-2 py-1 rounded" style={{ 
                                    backgroundColor: '#F1F5F9', 
                                    color: '#64748B' 
                                  }}>
                                    Status: {selectedRequirement.status}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
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
                            <CheckCircle className="w-4 h-4" />
                            <span>Create Application</span>
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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search applications by candidate or requirement..."
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

        {/* Applications Table */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Requirement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Pipeline Stage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Applied Date</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {applications.length > 0 ? (
                    applications.map((application) => (
                      <tr key={application.id} className="border-t hover:bg-gray-50" style={{ borderColor: '#E2E8F0' }}>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: '#DBEAFE' }}
                            >
                              <UserCircle className="w-5 h-5" style={{ color: '#2563EB' }} />
                            </div>
                            <div>
                              <p className="text-sm font-medium" style={{ color: '#0F172A' }}>
                                {application.candidate?.name}
                              </p>
                              <p className="text-xs" style={{ color: '#94A3B8' }}>
                                {application.candidate?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium" style={{ color: '#0F172A' }}>
                            {application.requirement?.title}
                          </p>
                          <p className="text-xs" style={{ color: '#94A3B8' }}>
                            {application.requirement?.organization?.name}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              className="stage-badge px-2 py-1 text-xs rounded-full cursor-pointer hover:opacity-80 transition-opacity border-0"
                              style={{
                                backgroundColor: `${getStageColor(application.pipeline_stage?.name)}20`,
                                color: getStageColor(application.pipeline_stage?.name)
                              }}
                              onClick={() => openStagePopup(application)}
                            >
                              {application.pipeline_stage?.name}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm" style={{ color: '#64748B' }}>
                            {application.source}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm" style={{ color: '#64748B' }}>
                            {new Date(application.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        {/* <td className="px-6 py-4">
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
                              className="p-1 rounded hover:bg-gray-100"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                            </button>
                          </div>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <Briefcase className="w-12 h-12 mx-auto mb-3" style={{ color: '#94A3B8' }} />
                        <p style={{ color: '#94A3B8' }}>No applications found</p>
                        <button
                          onClick={() => setShowCreateForm(true)}
                          className="mt-3 text-sm font-medium"
                          style={{ color: '#2563EB' }}
                        >
                          Create your first application
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
                  Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} applications
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchApplications(pagination.current_page - 1)}
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
                    onClick={() => fetchApplications(pagination.current_page + 1)}
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

        {/* Stage Movement Popup Modal - NEW */}
        {showStagePopup && selectedApplication && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 bg-opacity-50"
                onClick={closeStagePopup}
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
                    Move Application Stage
                  </h3>
                  <button
                    onClick={closeStagePopup}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    disabled={stageMoveLoading}
                  >
                    <X className="w-5 h-5" style={{ color: '#64748B' }} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Candidate Info */}
                  <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                    <p className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>Candidate</p>
                    <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>
                      {selectedApplication.candidate?.name}
                    </p>
                    <p className="text-xs" style={{ color: '#64748B' }}>
                      {selectedApplication.requirement?.title}
                    </p>
                  </div>

                  {/* Current Stage */}
                  <div className="mb-4">
                    <p className="text-xs font-medium mb-2" style={{ color: '#64748B' }}>Current Stage</p>
                    <span 
                      className="inline-block px-3 py-1.5 text-sm rounded-full"
                      style={{
                        backgroundColor: `${getStageColor(selectedApplication.pipeline_stage?.name)}20`,
                        color: getStageColor(selectedApplication.pipeline_stage?.name)
                      }}
                    >
                      {selectedApplication.pipeline_stage?.name}
                    </span>
                  </div>

                  {/* Select New Stage */}
                  <div className="mb-6">
                    <p className="text-xs font-medium mb-2" style={{ color: '#64748B' }}>Select New Stage</p>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {getAvailableStages(selectedApplication.pipeline_stage_id).map(stage => (
                        <button
                          key={stage.id}
                          onClick={() => handleMoveStage(stage.id)}
                          disabled={stageMoveLoading}
                          className="w-full text-left p-3 rounded-lg border-2 transition-all hover:shadow-md disabled:opacity-50"
                          style={{ 
                            borderColor: stage.color,
                            backgroundColor: `${stage.color}10`
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span style={{ color: stage.color }}>{stage.name}</span>
                            <ArrowRight className="w-4 h-4" style={{ color: stage.color }} />
                          </div>
                        </button>
                      ))}
                    </div>
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
                      onClick={closeStagePopup}
                      disabled={stageMoveLoading}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
                    >
                      Cancel
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

export default HandleApplication;