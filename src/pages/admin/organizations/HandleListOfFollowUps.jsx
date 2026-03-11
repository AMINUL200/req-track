import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Mail,
  MessageSquare,
  Video,
  Users,
  Calendar,
  Clock,
  UserCircle,
  Building2,
  Briefcase,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Eye,
  X,
  Download,
  UserCheck,
  Phone,
  Mail as MailIcon,
  MapPin,
  Award,
  Tag
} from 'lucide-react';
import { api } from '../../../utils/app';

const HandleListOfFollowUps = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  });

  // Popup states
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);

  // Fetch follow-ups
  const fetchFollowUps = async (page = 1) => {
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
      
      if (filterMode !== 'all') {
        params.append('contact_mode', filterMode);
      }

      const response = await api.get(`/follow-ups?${params.toString()}`);
      console.log('Follow-ups:', response.data);
      
      setFollowUps(response.data.data || []);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
        from: response.data.from,
        to: response.data.to
      });
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
      setError(error.message || 'Failed to load follow-ups');
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchFollowUps(1);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterMode]);

  // Initial fetch
  useEffect(() => {
    fetchFollowUps();
  }, []);

  // Handle view details
  const handleViewDetails = (followUp) => {
    setSelectedFollowUp(followUp);
    setShowPopup(true);
  };

  // Close popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedFollowUp(null);
  };

  // Get contact mode icon and color
  const getContactModeInfo = (mode) => {
    const modes = {
      call: { icon: PhoneCall, color: '#2563EB', bg: '#DBEAFE', label: 'Call' },
      email: { icon: Mail, color: '#8B5CF6', bg: '#EDE9FE', label: 'Email' },
      message: { icon: MessageSquare, color: '#14B8A6', bg: '#CCFBF1', label: 'Message' },
      video: { icon: Video, color: '#F59E0B', bg: '#FEF3C7', label: 'Video Call' },
      in_person: { icon: Users, color: '#EC4899', bg: '#FCE7F3', label: 'In Person' }
    };
    return modes[mode] || modes.call;
  };

  // Get response color
  const getResponseColor = (response) => {
    const colors = {
      'Interested': '#10B981',
      'Not Interested': '#EF4444',
      'Call Back Later': '#F59E0B',
      'Not Reachable': '#94A3B8',
      'Wrong Number': '#64748B'
    };
    return colors[response] || '#64748B';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format experience
  const formatExperience = (exp) => {
    if (!exp && exp !== 0) return 'Fresher';
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
              <PhoneCall className="w-6 h-6" style={{ color: '#2563EB' }} />
              <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Follow-ups</h1>
              <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}>
                Total: {pagination.total}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchFollowUps(pagination.current_page)}
                className="p-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
                title="Refresh"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} style={{ color: '#64748B' }} />
              </button>
              <button
                onClick={() => {/* Export functionality */}}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
              >
                <Download className="w-4 h-4" style={{ color: '#64748B' }} />
                <span style={{ color: '#64748B' }}>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 rounded-lg flex items-center space-x-3" style={{ 
            backgroundColor: '#FEF2F2', 
            border: '1px solid #FECACA' 
          }}>
            <AlertCircle className="w-5 h-5" style={{ color: '#DC2626' }} />
            <span style={{ color: '#DC2626' }}>{error}</span>
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
                placeholder="Search by candidate name or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  color: '#0F172A',
                  width: '300px'
                }}
              />
            </div>

            {/* Contact Mode Filter */}
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#0F172A'
              }}
            >
              <option value="all">All Contact Modes</option>
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="message">Message</option>
              <option value="video">Video Call</option>
              <option value="in_person">In Person</option>
            </select>
          </div>
        </div>

        {/* Follow-ups Table */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Contact Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Follow-up Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Discussion Notes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Response</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Next Follow-up</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Recruiter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {followUps.length > 0 ? (
                    followUps.map((followUp) => {
                      const modeInfo = getContactModeInfo(followUp.contact_mode);
                      const ModeIcon = modeInfo.icon;
                      
                      return (
                        <tr key={followUp.id} className="border-t hover:bg-gray-50" style={{ borderColor: '#E2E8F0' }}>
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
                                  {followUp.candidate?.name}
                                </p>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>
                                  ID: {followUp.candidate_id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="p-1 rounded-full"
                                style={{ backgroundColor: modeInfo.bg }}
                              >
                                <ModeIcon className="w-3 h-3" style={{ color: modeInfo.color }} />
                              </div>
                              <span 
                                className="text-xs px-2 py-1 rounded-full"
                                style={{ backgroundColor: modeInfo.bg, color: modeInfo.color }}
                              >
                                {modeInfo.label}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" style={{ color: '#94A3B8' }} />
                              <span className="text-sm" style={{ color: '#64748B' }}>
                                {formatDate(followUp.follow_up_date)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm truncate max-w-xs" style={{ color: '#64748B' }}>
                              {followUp.discussion_notes}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            {followUp.candidate_response ? (
                              <span 
                                className="px-2 py-1 text-xs rounded-full"
                                style={{
                                  backgroundColor: `${getResponseColor(followUp.candidate_response)}20`,
                                  color: getResponseColor(followUp.candidate_response)
                                }}
                              >
                                {followUp.candidate_response}
                              </span>
                            ) : (
                              <span className="text-xs italic" style={{ color: '#94A3B8' }}>
                                No response
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {followUp.next_follow_up_date ? (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" style={{ color: '#F59E0B' }} />
                                <span className="text-sm" style={{ color: '#64748B' }}>
                                  {formatDate(followUp.next_follow_up_date)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs italic" style={{ color: '#94A3B8' }}>
                                Not scheduled
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {followUp.recruiter ? (
                              <div>
                                <p className="text-sm" style={{ color: '#0F172A' }}>
                                  {followUp.recruiter.name}
                                </p>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>
                                  {followUp.recruiter.email}
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs italic" style={{ color: '#94A3B8' }}>
                                Not assigned
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewDetails(followUp)}
                              className="p-1 rounded hover:bg-gray-100"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" style={{ color: '#64748B' }} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center">
                        <PhoneCall className="w-12 h-12 mx-auto mb-3" style={{ color: '#94A3B8' }} />
                        <p style={{ color: '#94A3B8' }}>No follow-ups found</p>
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
                  Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} follow-ups
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchFollowUps(pagination.current_page - 1)}
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
                    onClick={() => fetchFollowUps(pagination.current_page + 1)}
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

        {/* Details Popup */}
        {showPopup && selectedFollowUp && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 bg-opacity-50 transition-opacity"
                onClick={handleClosePopup}
              ></div>
              
              {/* Popup Content */}
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
                    Follow-up Details
                  </h2>
                  <button
                    onClick={handleClosePopup}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" style={{ color: '#64748B' }} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Candidate Info Card */}
                  <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <h3 className="text-sm font-semibold mb-3 flex items-center space-x-2" style={{ color: '#0F172A' }}>
                      <UserCircle className="w-4 h-4" />
                      <span>Candidate Information</span>
                    </h3>
                    
                    <div className="flex items-start space-x-4">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#DBEAFE' }}
                      >
                        <UserCircle className="w-10 h-10" style={{ color: '#2563EB' }} />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold" style={{ color: '#0F172A' }}>
                          {selectedFollowUp.candidate?.name}
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="flex items-center space-x-2">
                            <MailIcon className="w-4 h-4" style={{ color: '#94A3B8' }} />
                            <span className="text-sm" style={{ color: '#64748B' }}>
                              {selectedFollowUp.candidate?.email}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" style={{ color: '#94A3B8' }} />
                            <span className="text-sm" style={{ color: '#64748B' }}>
                              {selectedFollowUp.candidate?.phone}
                            </span>
                          </div>
                          {selectedFollowUp.candidate?.current_company && (
                            <div className="flex items-center space-x-2">
                              <Building2 className="w-4 h-4" style={{ color: '#94A3B8' }} />
                              <span className="text-sm" style={{ color: '#64748B' }}>
                                {selectedFollowUp.candidate.current_company}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4" style={{ color: '#94A3B8' }} />
                            <span className="text-sm" style={{ color: '#64748B' }}>
                              Exp: {formatExperience(selectedFollowUp.candidate?.total_experience)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Follow-up Details */}
                  <div className="space-y-4">
                    {/* Contact Mode */}
                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                      <span className="text-sm font-medium" style={{ color: '#0F172A' }}>Contact Mode</span>
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const modeInfo = getContactModeInfo(selectedFollowUp.contact_mode);
                          const ModeIcon = modeInfo.icon;
                          return (
                            <>
                              <div 
                                className="p-1.5 rounded-full"
                                style={{ backgroundColor: modeInfo.bg }}
                              >
                                <ModeIcon className="w-4 h-4" style={{ color: modeInfo.color }} />
                              </div>
                              <span style={{ color: modeInfo.color }}>{modeInfo.label}</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Follow-up Date */}
                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                      <span className="text-sm font-medium" style={{ color: '#0F172A' }}>Follow-up Date</span>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" style={{ color: '#64748B' }} />
                        <span style={{ color: '#64748B' }}>{formatDateTime(selectedFollowUp.follow_up_date)}</span>
                      </div>
                    </div>

                    {/* Discussion Notes */}
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                      <p className="text-sm font-medium mb-2" style={{ color: '#0F172A' }}>Discussion Notes</p>
                      <p className="text-sm" style={{ color: '#64748B' }}>{selectedFollowUp.discussion_notes}</p>
                    </div>

                    {/* Candidate Response */}
                    {selectedFollowUp.candidate_response && (
                      <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                        <span className="text-sm font-medium" style={{ color: '#0F172A' }}>Candidate Response</span>
                        <span 
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: `${getResponseColor(selectedFollowUp.candidate_response)}20`,
                            color: getResponseColor(selectedFollowUp.candidate_response)
                          }}
                        >
                          {selectedFollowUp.candidate_response}
                        </span>
                      </div>
                    )}

                    {/* Disposition Option */}
                    {selectedFollowUp.disposition_option && (
                      <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                        <span className="text-sm font-medium" style={{ color: '#0F172A' }}>Disposition</span>
                        <span 
                          className="px-2 py-1 text-xs rounded-full"
                          style={{ backgroundColor: '#E2E8F0', color: '#64748B' }}
                        >
                          {selectedFollowUp.disposition_option.name}
                        </span>
                      </div>
                    )}

                    {/* Next Follow-up */}
                    {selectedFollowUp.next_follow_up_date && (
                      <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                        <span className="text-sm font-medium" style={{ color: '#0F172A' }}>Next Follow-up</span>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" style={{ color: '#F59E0B' }} />
                          <span style={{ color: '#F59E0B' }}>{formatDate(selectedFollowUp.next_follow_up_date)}</span>
                        </div>
                      </div>
                    )}

                    {/* Recruiter Info */}
                    {selectedFollowUp.recruiter && (
                      <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                        <span className="text-sm font-medium" style={{ color: '#0F172A' }}>Added By</span>
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4" style={{ color: '#64748B' }} />
                          <div>
                            <span style={{ color: '#64748B' }}>{selectedFollowUp.recruiter.name}</span>
                            <span className="text-xs ml-2" style={{ color: '#94A3B8' }}>
                              ({formatDateTime(selectedFollowUp.created_at)})
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Requirement Info (if any) */}
                  {selectedFollowUp.requirement && (
                    <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <h3 className="text-sm font-semibold mb-2 flex items-center space-x-2" style={{ color: '#0F172A' }}>
                        <Briefcase className="w-4 h-4" />
                        <span>Related Requirement</span>
                      </h3>
                      <p className="text-sm font-medium" style={{ color: '#0F172A' }}>
                        {selectedFollowUp.requirement.title}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <span style={{ color: '#64748B' }}>Location: {selectedFollowUp.requirement.location}</span>
                        <span style={{ color: '#64748B' }}>Experience: {selectedFollowUp.requirement.experience_min}-{selectedFollowUp.requirement.experience_max} years</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 px-6 py-4 border-t flex justify-end" style={{ 
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0'
                }}>
                  <button
                    onClick={handleClosePopup}
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleListOfFollowUps;