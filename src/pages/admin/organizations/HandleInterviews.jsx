import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  Users,
  Search,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  UserCircle,
  Building2,
  MapPin,
  Mail,
  Phone as PhoneIcon,
  Award,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';
import { api } from '../../../utils/app';

const HandleInterviews = () => {
  // State for interviews list
  const [interviews, setInterviews] = useState([]);
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

  // State for create interview
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Store all applications data
  const [allApplications, setAllApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  
  // Search states for application
  const [applicationSearch, setApplicationSearch] = useState('');
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationDropdown, setShowApplicationDropdown] = useState(false);
  
  // Interview form state
  const [interviewForm, setInterviewForm] = useState({
    application_id: '',
    scheduled_at: '',
    mode: 'online',
    meeting_link: ''
  });
  const [interviewFormErrors, setInterviewFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Feedback states
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    technical_rating: 3,
    communication_rating: 3,
    recommendation: 'selected'
  });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackErrors, setFeedbackErrors] = useState({});

  // Fetch interviews
  const fetchInterviews = async (page = 1) => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        page: page,
        per_page: pagination.per_page
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await api.get(`/interviews?${params.toString()}`);
      console.log('Interviews:', response.data);
      
      const data = response.data.data || response.data || [];
      setInterviews(Array.isArray(data) ? data : []);
      
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
      console.error('Error fetching interviews:', error);
      setError(error.message || 'Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all applications for search
  const fetchAllApplications = async () => {
    setApplicationsLoading(true);
    try {
      const response = await api.get('/applications');
      console.log('All applications:', response.data);
      
      const applicationsData = response.data.data || response.data || [];
      setAllApplications(Array.isArray(applicationsData) ? applicationsData : []);
      setFilteredApplications(Array.isArray(applicationsData) ? applicationsData : []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setApplicationsLoading(false);
    }
  };

  // Filter applications based on search
  useEffect(() => {
    if (!applicationSearch.trim()) {
      setFilteredApplications(allApplications);
    } else {
      const searchLower = applicationSearch.toLowerCase();
      const filtered = allApplications.filter(app => 
        app.candidate?.name?.toLowerCase().includes(searchLower) ||
        app.requirement?.title?.toLowerCase().includes(searchLower) ||
        app.candidate?.email?.toLowerCase().includes(searchLower)
      );
      setFilteredApplications(filtered);
    }
  }, [applicationSearch, allApplications]);

  // Load applications when form opens
  useEffect(() => {
    if (showCreateForm) {
      fetchAllApplications();
    }
  }, [showCreateForm]);

  // Initial fetch
  useEffect(() => {
    fetchInterviews();
  }, []);

  // Handle interview form input change
  const handleInterviewInputChange = (e) => {
    const { name, value } = e.target;
    setInterviewForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (interviewFormErrors[name]) {
      setInterviewFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle feedback form input change
  const handleFeedbackInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (feedbackErrors[name]) {
      setFeedbackErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Select application
  const handleSelectApplication = (application) => {
    setSelectedApplication(application);
    setInterviewForm(prev => ({ ...prev, application_id: application.id }));
    setApplicationSearch(`${application.candidate?.name} - ${application.requirement?.title}`);
    setShowApplicationDropdown(false);
    // Clear error
    if (interviewFormErrors.application_id) {
      setInterviewFormErrors(prev => ({ ...prev, application_id: '' }));
    }
  };

  // Clear selected application
  const handleClearApplication = () => {
    setSelectedApplication(null);
    setInterviewForm(prev => ({ ...prev, application_id: '' }));
    setApplicationSearch('');
    setShowApplicationDropdown(false);
  };

  // Validate interview form
  const validateInterviewForm = () => {
    const errors = {};
    if (!interviewForm.application_id) {
      errors.application_id = 'Please select an application';
    }
    if (!interviewForm.scheduled_at) {
      errors.scheduled_at = 'Please select interview date and time';
    }
    if (!interviewForm.mode) {
      errors.mode = 'Please select interview mode';
    }
    if (interviewForm.mode === 'online' && !interviewForm.meeting_link) {
      errors.meeting_link = 'Please provide meeting link for online interview';
    }
    return errors;
  };

  // Handle interview submit
  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateInterviewForm();
    if (Object.keys(errors).length > 0) {
      setInterviewFormErrors(errors);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const submitData = {
        application_id: interviewForm.application_id,
        scheduled_at: interviewForm.scheduled_at,
        mode: interviewForm.mode,
        meeting_link: interviewForm.meeting_link || null
      };

      await api.post('/interviews', submitData);
      
      setSuccessMessage('Interview scheduled successfully!');
      setShowCreateForm(false);
      resetInterviewForm();
      
      // Refresh interviews list
      fetchInterviews(1);
      
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error scheduling interview:', error);
      
      if (error.status === 422 && error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach(key => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setInterviewFormErrors(backendErrors);
      } else {
        setError(error.message || 'Failed to schedule interview');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Open feedback popup
  const openFeedbackPopup = (interview) => {
    setSelectedInterview(interview);
    setFeedbackForm({
      technical_rating: 3,
      communication_rating: 3,
      recommendation: 'selected'
    });
    setFeedbackErrors({});
    setShowFeedbackPopup(true);
  };

  // Close feedback popup
  const closeFeedbackPopup = () => {
    setShowFeedbackPopup(false);
    setSelectedInterview(null);
    setFeedbackErrors({});
    setError('');
  };

  // Validate feedback form
  const validateFeedbackForm = () => {
    const errors = {};
    if (!feedbackForm.technical_rating || feedbackForm.technical_rating < 1 || feedbackForm.technical_rating > 5) {
      errors.technical_rating = 'Technical rating must be between 1 and 5';
    }
    if (!feedbackForm.communication_rating || feedbackForm.communication_rating < 1 || feedbackForm.communication_rating > 5) {
      errors.communication_rating = 'Communication rating must be between 1 and 5';
    }
    if (!feedbackForm.recommendation) {
      errors.recommendation = 'Please select a recommendation';
    }
    return errors;
  };

  // Handle feedback submit
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateFeedbackForm();
    if (Object.keys(errors).length > 0) {
      setFeedbackErrors(errors);
      return;
    }

    setFeedbackSubmitting(true);
    setError('');

    try {
      const submitData = {
        technical_rating: parseInt(feedbackForm.technical_rating),
        communication_rating: parseInt(feedbackForm.communication_rating),
        recommendation: feedbackForm.recommendation
      };

      await api.post(`/interviews/${selectedInterview.id}/feedback`, submitData);
      
      setSuccessMessage('Feedback submitted successfully!');
      closeFeedbackPopup();
      
      // Refresh interviews list
      fetchInterviews(pagination.current_page);
      
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      if (error.status === 422 && error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach(key => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFeedbackErrors(backendErrors);
      } else {
        setError(error.message || 'Failed to submit feedback');
      }
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Reset interview form
  const resetInterviewForm = () => {
    setInterviewForm({
      application_id: '',
      scheduled_at: '',
      mode: 'online',
      meeting_link: ''
    });
    setSelectedApplication(null);
    setApplicationSearch('');
    setInterviewFormErrors({});
  };

  // Format date
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      scheduled: '#F59E0B',
      completed: '#10B981',
      cancelled: '#EF4444',
      rescheduled: '#8B5CF6'
    };
    return colors[status] || '#64748B';
  };

  // Get mode icon
  const getModeIcon = (mode) => {
    switch(mode) {
      case 'online': return Video;
      case 'phone': return Phone;
      case 'in_person': return Users;
      default: return Video;
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="w-3 h-3"
            style={{ color: star <= rating ? '#F59E0B' : '#E2E8F0' }}
            fill={star <= rating ? '#F59E0B' : 'none'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6" style={{ color: '#2563EB' }} />
              <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Interviews</h1>
              <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}>
                Total: {pagination.total}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchInterviews(pagination.current_page)}
                className="p-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
                title="Refresh"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} style={{ color: '#64748B' }} />
              </button>
              <button
                onClick={() => {
                  resetInterviewForm();
                  setShowCreateForm(true);
                  setError('');
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: '#2563EB' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Schedule Interview</span>
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
        {error && !showCreateForm && !showFeedbackPopup && (
          <div className="mb-4 p-4 rounded-lg flex items-center space-x-3" style={{ 
            backgroundColor: '#FEF2F2', 
            border: '1px solid #FECACA' 
          }}>
            <AlertCircle className="w-5 h-5" style={{ color: '#DC2626' }} />
            <span style={{ color: '#DC2626' }}>{error}</span>
          </div>
        )}

        {/* Create Interview Form Modal */}
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
                className="relative bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
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
                    Schedule New Interview
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
                  <form onSubmit={handleInterviewSubmit}>
                    {/* Application Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                        Select Application *
                      </label>
                      <div className="relative">
                        <div className="flex items-center border rounded-lg" style={{ 
                          borderColor: interviewFormErrors.application_id ? '#EF4444' : '#E2E8F0'
                        }}>
                          <Search className="w-4 h-4 ml-3" style={{ color: '#94A3B8' }} />
                          <input
                            type="text"
                            value={applicationSearch}
                            onChange={(e) => {
                              setApplicationSearch(e.target.value);
                              setShowApplicationDropdown(true);
                              if (selectedApplication) {
                                handleClearApplication();
                              }
                            }}
                            onFocus={() => setShowApplicationDropdown(true)}
                            placeholder="Search by candidate name or requirement..."
                            className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                            style={{
                              backgroundColor: '#FFFFFF',
                              color: '#0F172A'
                            }}
                            disabled={submitting}
                          />
                          {selectedApplication && (
                            <button
                              type="button"
                              onClick={handleClearApplication}
                              className="mr-2 p-1 rounded-full hover:bg-gray-100"
                            >
                              <X className="w-3 h-3" style={{ color: '#64748B' }} />
                            </button>
                          )}
                        </div>
                        
                        {/* Application Dropdown */}
                        {showApplicationDropdown && (
                          <div 
                            className="absolute z-20 mt-1 w-full rounded-lg shadow-lg max-h-60 overflow-y-auto"
                            style={{ 
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #E2E8F0'
                            }}
                          >
                            {applicationsLoading ? (
                              <div className="p-4 text-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 mx-auto" style={{ borderColor: '#2563EB' }}></div>
                              </div>
                            ) : filteredApplications.length > 0 ? (
                              filteredApplications.map(app => (
                                <div
                                  key={app.id}
                                  onClick={() => handleSelectApplication(app)}
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
                                        {app.candidate?.name}
                                      </p>
                                      <p className="text-xs truncate" style={{ color: '#64748B' }}>
                                        {app.requirement?.title} • {app.requirement?.location}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-center">
                                <p className="text-sm" style={{ color: '#64748B' }}>No applications found</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {interviewFormErrors.application_id && (
                        <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{interviewFormErrors.application_id}</p>
                      )}
                    </div>

                    {/* Selected Application Preview */}
                    {selectedApplication && (
                      <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <h3 className="text-xs font-medium mb-2" style={{ color: '#2563EB' }}>Selected Application</h3>
                        <div className="flex items-start space-x-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: '#DBEAFE' }}
                          >
                            <UserCircle className="w-6 h-6" style={{ color: '#2563EB' }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium" style={{ color: '#0F172A' }}>
                              {selectedApplication.candidate?.name}
                            </p>
                            <p className="text-xs" style={{ color: '#64748B' }}>
                              {selectedApplication.candidate?.email} • {selectedApplication.candidate?.phone}
                            </p>
                            <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                              <span className="font-medium">Requirement:</span> {selectedApplication.requirement?.title}
                            </p>
                            <p className="text-xs" style={{ color: '#64748B' }}>
                              <span className="font-medium">Location:</span> {selectedApplication.requirement?.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Schedule Date and Time */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                        Schedule Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        name="scheduled_at"
                        value={interviewForm.scheduled_at}
                        onChange={handleInterviewInputChange}
                        disabled={submitting}
                        className="w-full px-3 py-2 rounded-lg text-sm"
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: `1px solid ${interviewFormErrors.scheduled_at ? '#EF4444' : '#E2E8F0'}`,
                          color: '#0F172A'
                        }}
                      />
                      {interviewFormErrors.scheduled_at && (
                        <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{interviewFormErrors.scheduled_at}</p>
                      )}
                    </div>

                    {/* Interview Mode */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                        Interview Mode *
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['online', 'phone', 'in_person'].map((mode) => {
                          const ModeIcon = mode === 'online' ? Video : mode === 'phone' ? Phone : Users;
                          return (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => {
                                setInterviewForm(prev => ({ ...prev, mode }));
                                if (interviewFormErrors.mode) {
                                  setInterviewFormErrors(prev => ({ ...prev, mode: '' }));
                                }
                              }}
                              className="flex items-center justify-center space-x-2 p-3 rounded-lg transition-all"
                              style={{
                                backgroundColor: interviewForm.mode === mode ? '#2563EB' : '#F8FAFC',
                                border: `2px solid ${interviewForm.mode === mode ? '#2563EB' : '#E2E8F0'}`,
                                color: interviewForm.mode === mode ? '#FFFFFF' : '#64748B'
                              }}
                            >
                              <ModeIcon className="w-4 h-4" />
                              <span className="text-sm capitalize">{mode.replace('_', ' ')}</span>
                            </button>
                          );
                        })}
                      </div>
                      {interviewFormErrors.mode && (
                        <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{interviewFormErrors.mode}</p>
                      )}
                    </div>

                    {/* Meeting Link (for online mode) */}
                    {interviewForm.mode === 'online' && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                          Meeting Link *
                        </label>
                        <input
                          type="url"
                          name="meeting_link"
                          value={interviewForm.meeting_link}
                          onChange={handleInterviewInputChange}
                          disabled={submitting}
                          placeholder="https://meet.example.com/abc"
                          className="w-full px-3 py-2 rounded-lg text-sm"
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: `1px solid ${interviewFormErrors.meeting_link ? '#EF4444' : '#E2E8F0'}`,
                            color: '#0F172A'
                          }}
                        />
                        {interviewFormErrors.meeting_link && (
                          <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{interviewFormErrors.meeting_link}</p>
                        )}
                      </div>
                    )}

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
                            <span>Scheduling...</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4" />
                            <span>Schedule Interview</span>
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

        {/* Feedback Popup */}
        {showFeedbackPopup && selectedInterview && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 bg-opacity-50"
                onClick={closeFeedbackPopup}
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
                    Interview Feedback
                  </h3>
                  <button
                    onClick={closeFeedbackPopup}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    disabled={feedbackSubmitting}
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
                      {selectedInterview.application?.candidate?.name}
                    </p>
                    <p className="text-xs" style={{ color: '#64748B' }}>
                      {selectedInterview.application?.requirement?.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-2 text-xs">
                      <Calendar className="w-3 h-3" style={{ color: '#94A3B8' }} />
                      <span style={{ color: '#64748B' }}>{formatDateTime(selectedInterview.scheduled_at)}</span>
                    </div>
                  </div>

                  <form onSubmit={handleFeedbackSubmit}>
                    {/* Technical Rating */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                        Technical Rating (1-5)
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          name="technical_rating"
                          min="1"
                          max="5"
                          value={feedbackForm.technical_rating}
                          onChange={handleFeedbackInputChange}
                          disabled={feedbackSubmitting}
                          className="w-full"
                          style={{ accentColor: '#2563EB' }}
                        />
                        <span className="text-sm font-medium w-8" style={{ color: '#2563EB' }}>
                          {feedbackForm.technical_rating}/5
                        </span>
                      </div>
                      {renderStars(parseInt(feedbackForm.technical_rating))}
                      {feedbackErrors.technical_rating && (
                        <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{feedbackErrors.technical_rating}</p>
                      )}
                    </div>

                    {/* Communication Rating */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                        Communication Rating (1-5)
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          name="communication_rating"
                          min="1"
                          max="5"
                          value={feedbackForm.communication_rating}
                          onChange={handleFeedbackInputChange}
                          disabled={feedbackSubmitting}
                          className="w-full"
                          style={{ accentColor: '#2563EB' }}
                        />
                        <span className="text-sm font-medium w-8" style={{ color: '#2563EB' }}>
                          {feedbackForm.communication_rating}/5
                        </span>
                      </div>
                      {renderStars(parseInt(feedbackForm.communication_rating))}
                      {feedbackErrors.communication_rating && (
                        <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{feedbackErrors.communication_rating}</p>
                      )}
                    </div>

                    {/* Recommendation */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                        Recommendation *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'selected', label: 'Selected', icon: ThumbsUp, color: '#10B981' },
                          { value: 'rejected', label: 'Rejected', icon: ThumbsDown, color: '#EF4444' },
                          { value: 'hold', label: 'Hold', icon: Clock, color: '#F59E0B' }
                        ].map(option => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setFeedbackForm(prev => ({ ...prev, recommendation: option.value }));
                                if (feedbackErrors.recommendation) {
                                  setFeedbackErrors(prev => ({ ...prev, recommendation: '' }));
                                }
                              }}
                              className="flex flex-col items-center justify-center p-3 rounded-lg transition-all"
                              style={{
                                backgroundColor: feedbackForm.recommendation === option.value ? `${option.color}20` : '#F8FAFC',
                                border: `2px solid ${feedbackForm.recommendation === option.value ? option.color : '#E2E8F0'}`,
                                color: feedbackForm.recommendation === option.value ? option.color : '#64748B'
                              }}
                            >
                              <Icon className="w-5 h-5 mb-1" />
                              <span className="text-xs">{option.label}</span>
                            </button>
                          );
                        })}
                      </div>
                      {feedbackErrors.recommendation && (
                        <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{feedbackErrors.recommendation}</p>
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
                        onClick={closeFeedbackPopup}
                        disabled={feedbackSubmitting}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={feedbackSubmitting}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                        style={{ backgroundColor: '#2563EB' }}
                      >
                        {feedbackSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Submit Feedback</span>
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
              placeholder="Search interviews by candidate or requirement..."
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

        {/* Interviews Table */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Schedule</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.length > 0 ? (
                    interviews.map((interview) => {
                      const ModeIcon = getModeIcon(interview.mode);
                      return (
                        <tr key={interview.id} className="border-t hover:bg-gray-50" style={{ borderColor: '#E2E8F0' }}>
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
                                  {interview.application?.candidate?.name}
                                </p>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>
                                  {interview.application?.candidate?.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium" style={{ color: '#0F172A' }}>
                              {interview.application?.requirement?.title}
                            </p>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>
                              {interview.application?.requirement?.location}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" style={{ color: '#94A3B8' }} />
                                <span className="text-sm" style={{ color: '#64748B' }}>
                                  {new Date(interview.scheduled_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" style={{ color: '#94A3B8' }} />
                                <span className="text-sm" style={{ color: '#64748B' }}>
                                  {new Date(interview.scheduled_at).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <ModeIcon className="w-4 h-4" style={{ color: '#64748B' }} />
                              <span className="text-sm capitalize" style={{ color: '#64748B' }}>
                                {interview.mode.replace('_', ' ')}
                              </span>
                            </div>
                            {interview.meeting_link && (
                              <a
                                href={interview.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 mt-1 text-xs"
                                style={{ color: '#2563EB' }}
                              >
                                <LinkIcon className="w-3 h-3" />
                                <span>Join Meeting</span>
                              </a>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span 
                              className="px-2 py-1 text-xs rounded-full"
                              style={{
                                backgroundColor: `${getStatusColor(interview.status)}20`,
                                color: getStatusColor(interview.status)
                              }}
                            >
                              {interview.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {interview.status === 'scheduled' && (
                                <button
                                  onClick={() => openFeedbackPopup(interview)}
                                  className="p-1 rounded hover:bg-gray-100"
                                  title="Add Feedback"
                                >
                                  <MessageSquare className="w-4 h-4" style={{ color: '#2563EB' }} />
                                </button>
                              )}
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
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: '#94A3B8' }} />
                        <p style={{ color: '#94A3B8' }}>No interviews scheduled</p>
                        <button
                          onClick={() => setShowCreateForm(true)}
                          className="mt-3 text-sm font-medium"
                          style={{ color: '#2563EB' }}
                        >
                          Schedule your first interview
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
                  Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} interviews
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchInterviews(pagination.current_page - 1)}
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
                    onClick={() => fetchInterviews(pagination.current_page + 1)}
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
      </div>
    </div>
  );
};

export default HandleInterviews;