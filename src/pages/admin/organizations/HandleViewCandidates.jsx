import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  UserCircle,
  Award,
  Clock,
  DollarSign,
  GraduationCap,
  Code,
  Tag,
  FileText,
  Download,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Linkedin,
  Globe,
  Star,
  Users,
  ChevronRight,
  PhoneCall,
  MessageSquare,
  Video,
  Mail as MailIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  UserCheck,
  Plus,
  X,
} from "lucide-react";
import { api } from "../../../utils/app";

const HandleViewCandidates = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, applications, documents, followups

  // Follow-up states
  const [followUps, setFollowUps] = useState([]);
  const [followUpsLoading, setFollowUpsLoading] = useState(false);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [followUpPagination, setFollowUpPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [followUpForm, setFollowUpForm] = useState({
    follow_up_date: "",
    contact_mode: "call",
    discussion_notes: "",
  });
  const [followUpFormErrors, setFollowUpFormErrors] = useState({});
  const [followUpSubmitting, setFollowUpSubmitting] = useState(false);
  const [followUpMessage, setFollowUpMessage] = useState({
    type: "",
    text: "",
  });

  // Fetch candidate details
  const fetchCandidateDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/candidates/${id}`);
      console.log("Candidate details:", response.data);
      setCandidate(response.data);
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      setError(error.message || "Failed to load candidate details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch follow-ups
  const fetchFollowUps = async (page = 1) => {
    setFollowUpsLoading(true);
    try {
      const response = await api.get(
        `/candidates/${id}/follow-ups?page=${page}`,
      );
      console.log("Follow-ups:", response.data);
      setFollowUps(response.data.data || []);
      setFollowUpPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total,
      });
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
      setFollowUpMessage({
        type: "error",
        text: error.message || "Failed to load follow-ups",
      });
    } finally {
      setFollowUpsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCandidateDetails();
    }
  }, [id]);

  // Load follow-ups when tab changes to followups
  useEffect(() => {
    if (activeTab === "followups" && id) {
      fetchFollowUps();
    }
  }, [activeTab, id]);

  // Handle follow-up form input change
  const handleFollowUpInputChange = (e) => {
    const { name, value } = e.target;
    setFollowUpForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (followUpFormErrors[name]) {
      setFollowUpFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate follow-up form
  const validateFollowUpForm = () => {
    const errors = {};
    if (!followUpForm.follow_up_date) {
      errors.follow_up_date = "Follow-up date is required";
    }
    if (!followUpForm.contact_mode) {
      errors.contact_mode = "Contact mode is required";
    }
    if (!followUpForm.discussion_notes?.trim()) {
      errors.discussion_notes = "Discussion notes are required";
    }
    return errors;
  };

  // Handle follow-up submit
  const handleFollowUpSubmit = async (e) => {
    e.preventDefault();

    const errors = validateFollowUpForm();
    if (Object.keys(errors).length > 0) {
      setFollowUpFormErrors(errors);
      return;
    }

    setFollowUpSubmitting(true);
    setFollowUpMessage({ type: "", text: "" });

    try {
      const submitData = {
        follow_up_date: followUpForm.follow_up_date,
        contact_mode: followUpForm.contact_mode,
        discussion_notes: followUpForm.discussion_notes,
      };

      await api.post(`/candidates/${id}/follow-ups`, submitData);

      setFollowUpMessage({
        type: "success",
        text: "Follow-up added successfully!",
      });

      // Reset form
      setFollowUpForm({
        follow_up_date: "",
        contact_mode: "call",
        discussion_notes: "",
      });
      setShowFollowUpForm(false);

      // Refresh follow-ups list
      fetchFollowUps(1);

      // Clear success message after 3 seconds
      setTimeout(() => setFollowUpMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error adding follow-up:", error);

      if (error.status === 422 && error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach((key) => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFollowUpFormErrors(backendErrors);
      } else {
        setFollowUpMessage({
          type: "error",
          text: error.message || "Failed to add follow-up",
        });
      }
    } finally {
      setFollowUpSubmitting(false);
    }
  };

  // Get contact mode icon and color
  const getContactModeInfo = (mode) => {
    const modes = {
      call: { icon: PhoneCall, color: "#2563EB", bg: "#DBEAFE", label: "Call" },
      email: {
        icon: MailIcon,
        color: "#8B5CF6",
        bg: "#EDE9FE",
        label: "Email",
      },
      message: {
        icon: MessageSquare,
        color: "#14B8A6",
        bg: "#CCFBF1",
        label: "Message",
      },
      video: {
        icon: Video,
        color: "#F59E0B",
        bg: "#FEF3C7",
        label: "Video Call",
      },
      in_person: {
        icon: Users,
        color: "#EC4899",
        bg: "#FCE7F3",
        label: "In Person",
      },
    };
    return modes[mode] || modes.call;
  };

  // Format date for display
  const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format date with time
  const formatDateWithTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date (only date)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format experience
  const formatExperience = (exp) => {
    if (!exp && exp !== 0) return "Fresher";
    const years = parseFloat(exp);
    if (years === 1) return "1 year";
    if (years < 1) return `${Math.round(years * 12)} months`;
    return `${years} years`;
  };

  // Get source badge color
  const getSourceColor = (source) => {
    const colors = {
      website: "#2563EB",
      linkedin: "#0A66C2",
      referral: "#8B5CF6",
      facebook: "#1877F2",
      twitter: "#1DA1F2",
      other: "#64748B",
    };
    return colors[source] || colors.other;
  };

  // Get stage badge color
  const getStageColor = (stage) => {
    const colors = {
      Applied: "#94A3B8",
      Shortlisted: "#8B5CF6",
      "Interview Scheduled": "#F59E0B",
      Interviewed: "#3B82F6",
      Selected: "#10B981",
      Offered: "#14B8A6",
      Hired: "#059669",
      Rejected: "#EF4444",
    };
    return colors[stage] || "#64748B";
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F1F5F9" }}>
        <div className="p-6">
          {/* Back button skeleton */}
          <div className="mb-6">
            <div
              className="h-8 w-24 rounded-lg"
              style={{ backgroundColor: "#E2E8F0" }}
            ></div>
          </div>

          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <div
                className="rounded-lg p-6"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div className="animate-pulse">
                  <div className="flex items-center space-x-4 mb-6">
                    <div
                      className="w-16 h-16 rounded-full"
                      style={{ backgroundColor: "#E2E8F0" }}
                    ></div>
                    <div className="flex-1">
                      <div
                        className="h-6 w-48 rounded mb-2"
                        style={{ backgroundColor: "#E2E8F0" }}
                      ></div>
                      <div
                        className="h-4 w-32 rounded"
                        style={{ backgroundColor: "#E2E8F0" }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div
                      className="h-4 w-full rounded"
                      style={{ backgroundColor: "#E2E8F0" }}
                    ></div>
                    <div
                      className="h-4 w-3/4 rounded"
                      style={{ backgroundColor: "#E2E8F0" }}
                    ></div>
                    <div
                      className="h-4 w-1/2 rounded"
                      style={{ backgroundColor: "#E2E8F0" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar skeleton */}
            <div className="lg:col-span-1">
              <div
                className="rounded-lg p-6"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div className="animate-pulse">
                  <div
                    className="h-6 w-32 rounded mb-4"
                    style={{ backgroundColor: "#E2E8F0" }}
                  ></div>
                  <div className="space-y-4">
                    <div
                      className="h-16 rounded"
                      style={{ backgroundColor: "#E2E8F0" }}
                    ></div>
                    <div
                      className="h-16 rounded"
                      style={{ backgroundColor: "#E2E8F0" }}
                    ></div>
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
  if (error && !candidate) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F1F5F9" }}>
        <div className="p-6">
          <button
            onClick={() => navigate("/candidates")}
            className="mb-6 flex items-center space-x-2 transition-colors group"
            style={{ color: "#64748B" }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Candidates</span>
          </button>

          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle
              className="w-12 h-12 mb-4"
              style={{ color: "#EF4444" }}
            />
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "#0F172A" }}
            >
              Error Loading Candidate
            </h3>
            <p className="text-sm mb-4" style={{ color: "#64748B" }}>
              {error}
            </p>
            <button
              onClick={fetchCandidateDetails}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: "#2563EB" }}
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
    <div className="min-h-screen" style={{ backgroundColor: "#F1F5F9" }}>
      <div className="p-6">
        {/* Header with back button and actions */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 transition-colors group"
            style={{ color: "#64748B" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Candidates</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchCandidateDetails}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" style={{ color: "#64748B" }} />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Candidate Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <div
              className="rounded-lg overflow-hidden"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
              }}
            >
              {/* Cover Photo Placeholder */}
              <div
                className="h-24"
                style={{
                  background: "linear-gradient(90deg, #2563EB, #14B8A6)",
                }}
              ></div>

              {/* Profile Info */}
              <div className="px-6 pb-6">
                <div className="flex items-end -mt-12 mb-4">
                  <div
                    className="w-20 h-20 rounded-full border-4 flex items-center justify-center"
                    style={{
                      borderColor: "#FFFFFF",
                      backgroundColor: "#DBEAFE",
                    }}
                  >
                    <UserCircle
                      className="w-12 h-12"
                      style={{ color: "#2563EB" }}
                    />
                  </div>
                  <div className="ml-4 mb-2">
                    <h1
                      className="text-2xl font-bold"
                      style={{ color: "#0F172A" }}
                    >
                      {candidate?.name}
                    </h1>
                    <div className="flex items-center space-x-2">
                      <span
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: `${getSourceColor(candidate?.source)}20`,
                          color: getSourceColor(candidate?.source),
                        }}
                      >
                        Source: {candidate?.source}
                      </span>
                      <span className="text-xs" style={{ color: "#64748B" }}>
                        Candidate ID: #{candidate?.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div
                    className="text-center p-3 rounded-lg"
                    style={{ backgroundColor: "#F8FAFC" }}
                  >
                    <Briefcase
                      className="w-4 h-4 mx-auto mb-1"
                      style={{ color: "#2563EB" }}
                    />
                    <p className="text-xs" style={{ color: "#64748B" }}>
                      Experience
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#0F172A" }}
                    >
                      {formatExperience(candidate?.total_experience)}
                    </p>
                  </div>
                  <div
                    className="text-center p-3 rounded-lg"
                    style={{ backgroundColor: "#F8FAFC" }}
                  >
                    <Award
                      className="w-4 h-4 mx-auto mb-1"
                      style={{ color: "#14B8A6" }}
                    />
                    <p className="text-xs" style={{ color: "#64748B" }}>
                      Applications
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#0F172A" }}
                    >
                      {candidate?.applications?.length || 0}
                    </p>
                  </div>
                  <div
                    className="text-center p-3 rounded-lg"
                    style={{ backgroundColor: "#F8FAFC" }}
                  >
                    <Clock
                      className="w-4 h-4 mx-auto mb-1"
                      style={{ color: "#8B5CF6" }}
                    />
                    <p className="text-xs" style={{ color: "#64748B" }}>
                      Notice Period
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#0F172A" }}
                    >
                      {candidate?.notice_period || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div
                  className="flex space-x-1 border-b overflow-x-auto"
                  style={{ borderColor: "#E2E8F0" }}
                >
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === "overview" ? "" : "opacity-60"
                    }`}
                    style={{
                      color: activeTab === "overview" ? "#2563EB" : "#64748B",
                      borderBottom:
                        activeTab === "overview" ? "2px solid #2563EB" : "none",
                    }}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("applications")}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === "applications" ? "" : "opacity-60"
                    }`}
                    style={{
                      color:
                        activeTab === "applications" ? "#2563EB" : "#64748B",
                      borderBottom:
                        activeTab === "applications"
                          ? "2px solid #2563EB"
                          : "none",
                    }}
                  >
                    Applications ({candidate?.applications?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab("followups")}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === "followups" ? "" : "opacity-60"
                    }`}
                    style={{
                      color: activeTab === "followups" ? "#2563EB" : "#64748B",
                      borderBottom:
                        activeTab === "followups"
                          ? "2px solid #2563EB"
                          : "none",
                    }}
                  >
                    Follow-ups ({followUpPagination.total || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab("documents")}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === "documents" ? "" : "opacity-60"
                    }`}
                    style={{
                      color: activeTab === "documents" ? "#2563EB" : "#64748B",
                      borderBottom:
                        activeTab === "documents"
                          ? "2px solid #2563EB"
                          : "none",
                    }}
                  >
                    Documents
                  </button>
                </div>

                {/* Tab Content */}
                <div className="py-4">
                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <div className="space-y-4">
                      {/* Contact Information */}
                      <div>
                        <h3
                          className="text-sm font-semibold mb-2"
                          style={{ color: "#0F172A" }}
                        >
                          Contact Information
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Mail
                              className="w-4 h-4"
                              style={{ color: "#94A3B8" }}
                            />
                            <span
                              className="text-sm"
                              style={{ color: "#64748B" }}
                            >
                              {candidate?.email}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone
                              className="w-4 h-4"
                              style={{ color: "#94A3B8" }}
                            />
                            <span
                              className="text-sm"
                              style={{ color: "#64748B" }}
                            >
                              {candidate?.phone}
                            </span>
                          </div>
                          {candidate?.address && (
                            <div className="flex items-center space-x-2">
                              <MapPin
                                className="w-4 h-4"
                                style={{ color: "#94A3B8" }}
                              />
                              <span
                                className="text-sm"
                                style={{ color: "#64748B" }}
                              >
                                {candidate?.address}
                              </span>
                            </div>
                          )}
                          {candidate?.city && (
                            <div className="flex items-center space-x-2">
                              <Building2
                                className="w-4 h-4"
                                style={{ color: "#94A3B8" }}
                              />
                              <span
                                className="text-sm"
                                style={{ color: "#64748B" }}
                              >
                                {candidate?.city}
                              </span>
                            </div>
                          )}
                          {candidate?.preferred_location && (
                            <div className="flex items-center space-x-2">
                              <MapPin
                                className="w-4 h-4"
                                style={{ color: "#94A3B8" }}
                              />
                              <span
                                className="text-sm"
                                style={{ color: "#64748B" }}
                              >
                                Preferred: {candidate?.preferred_location}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Professional Details */}
                      <div>
                        <h3
                          className="text-sm font-semibold mb-2"
                          style={{ color: "#0F172A" }}
                        >
                          Professional Details
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: "#F8FAFC" }}
                          >
                            <p className="text-xs" style={{ color: "#94A3B8" }}>
                              Current Company
                            </p>
                            <p
                              className="text-sm font-medium"
                              style={{ color: "#0F172A" }}
                            >
                              {candidate?.current_company || "Not specified"}
                            </p>
                          </div>
                          <div
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: "#F8FAFC" }}
                          >
                            <p className="text-xs" style={{ color: "#94A3B8" }}>
                              Education
                            </p>
                            <p
                              className="text-sm font-medium"
                              style={{ color: "#0F172A" }}
                            >
                              {candidate?.education || "Not specified"}
                            </p>
                          </div>
                          <div
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: "#F8FAFC" }}
                          >
                            <p className="text-xs" style={{ color: "#94A3B8" }}>
                              Current Salary
                            </p>
                            <p
                              className="text-sm font-medium"
                              style={{ color: "#0F172A" }}
                            >
                              {formatCurrency(candidate?.current_salary)}
                            </p>
                          </div>
                          <div
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: "#F8FAFC" }}
                          >
                            <p className="text-xs" style={{ color: "#94A3B8" }}>
                              Expected Salary
                            </p>
                            <p
                              className="text-sm font-medium"
                              style={{ color: "#0F172A" }}
                            >
                              {formatCurrency(candidate?.expected_salary)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      {candidate?.skills && (
                        <div>
                          <h3
                            className="text-sm font-semibold mb-2"
                            style={{ color: "#0F172A" }}
                          >
                            Skills
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.split(",").map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs rounded-full"
                                style={{
                                  backgroundColor: "#DBEAFE",
                                  color: "#2563EB",
                                }}
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {candidate?.tags && candidate.tags.length > 0 && (
                        <div>
                          <h3
                            className="text-sm font-semibold mb-2"
                            style={{ color: "#0F172A" }}
                          >
                            Tags
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {candidate.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs rounded-full"
                                style={{
                                  backgroundColor: "#F1F5F9",
                                  color: "#64748B",
                                }}
                              >
                                <Tag className="w-3 h-3 inline mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Applications Tab */}
                  {activeTab === "applications" && (
                    <div className="space-y-4">
                      {candidate?.applications &&
                      candidate.applications.length > 0 ? (
                        candidate.applications.map((application) => (
                          <div
                            key={application.id}
                            className="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                            style={{
                              backgroundColor: "#FFFFFF",
                              borderColor: "#E2E8F0",
                            }}
                            onClick={() =>
                              navigate(
                                `/requirements/${application.requirement_id}`,
                              )
                            }
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4
                                  className="font-semibold"
                                  style={{ color: "#0F172A" }}
                                >
                                  {application.requirement?.title}
                                </h4>
                                <p
                                  className="text-xs"
                                  style={{ color: "#64748B" }}
                                >
                                  {application.requirement?.location} •{" "}
                                  {application.requirement?.openings} openings
                                </p>
                              </div>
                              <span
                                className="px-2 py-1 text-xs rounded-full"
                                style={{
                                  backgroundColor: `${getStageColor(application.pipeline_stage?.name)}20`,
                                  color: getStageColor(
                                    application.pipeline_stage?.name,
                                  ),
                                }}
                              >
                                {application.pipeline_stage?.name}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                              <div>
                                <span style={{ color: "#94A3B8" }}>
                                  Experience:
                                </span>{" "}
                                <span style={{ color: "#0F172A" }}>
                                  {application.requirement?.experience_min}-
                                  {application.requirement?.experience_max}{" "}
                                  years
                                </span>
                              </div>
                              <div>
                                <span style={{ color: "#94A3B8" }}>
                                  Salary:
                                </span>{" "}
                                <span style={{ color: "#0F172A" }}>
                                  {formatCurrency(
                                    application.requirement?.salary_min,
                                  )}{" "}
                                  -{" "}
                                  {formatCurrency(
                                    application.requirement?.salary_max,
                                  )}
                                </span>
                              </div>
                              <div>
                                <span style={{ color: "#94A3B8" }}>
                                  Applied:
                                </span>{" "}
                                <span style={{ color: "#0F172A" }}>
                                  {new Date(
                                    application.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {application.requirement?.skills && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {application.requirement.skills
                                  .slice(0, 3)
                                  .map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 text-xs rounded-full"
                                      style={{
                                        backgroundColor: "#F1F5F9",
                                        color: "#64748B",
                                      }}
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                {application.requirement.skills.length > 3 && (
                                  <span
                                    className="text-xs"
                                    style={{ color: "#94A3B8" }}
                                  >
                                    +{application.requirement.skills.length - 3}{" "}
                                    more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Briefcase
                            className="w-12 h-12 mx-auto mb-3"
                            style={{ color: "#94A3B8" }}
                          />
                          <p style={{ color: "#64748B" }}>
                            No applications yet
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Follow-ups Tab */}
                  {activeTab === "followups" && (
                    <div className="space-y-4">
                      {/* Follow-up message */}
                      {followUpMessage.text && (
                        <div
                          className="p-3 rounded-lg flex items-center space-x-2"
                          style={{
                            backgroundColor:
                              followUpMessage.type === "success"
                                ? "#ECFDF3"
                                : "#FEF2F2",
                            border: `1px solid ${followUpMessage.type === "success" ? "#ABEFC6" : "#FECACA"}`,
                          }}
                        >
                          {followUpMessage.type === "success" ? (
                            <CheckCircle
                              className="w-4 h-4"
                              style={{ color: "#067647" }}
                            />
                          ) : (
                            <AlertCircle
                              className="w-4 h-4"
                              style={{ color: "#DC2626" }}
                            />
                          )}
                          <span
                            className="text-sm"
                            style={{
                              color:
                                followUpMessage.type === "success"
                                  ? "#067647"
                                  : "#DC2626",
                            }}
                          >
                            {followUpMessage.text}
                          </span>
                        </div>
                      )}

                      {/* Add Follow-up Button */}
                      {!showFollowUpForm ? (
                        <button
                          onClick={() => setShowFollowUpForm(true)}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 border-dashed transition-colors"
                          style={{
                            borderColor: "#CBD5E1",
                            color: "#64748B",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#2563EB";
                            e.currentTarget.style.color = "#2563EB";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#CBD5E1";
                            e.currentTarget.style.color = "#64748B";
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Add Follow-up
                          </span>
                        </button>
                      ) : (
                        /* Follow-up Form */
                        <div
                          className="p-4 rounded-lg"
                          style={{
                            backgroundColor: "#F8FAFC",
                            border: "1px solid #E2E8F0",
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4
                              className="text-sm font-semibold"
                              style={{ color: "#0F172A" }}
                            >
                              New Follow-up
                            </h4>
                            <button
                              onClick={() => {
                                setShowFollowUpForm(false);
                                setFollowUpForm({
                                  follow_up_date: "",
                                  contact_mode: "call",
                                  discussion_notes: "",
                                });
                                setFollowUpFormErrors({});
                              }}
                              className="p-1 rounded-full hover:bg-gray-200"
                            >
                              <X
                                className="w-4 h-4"
                                style={{ color: "#64748B" }}
                              />
                            </button>
                          </div>

                          <form onSubmit={handleFollowUpSubmit}>
                            {/* Follow-up Date */}
                            <div className="mb-3">
                              <label
                                className="block text-xs font-medium mb-1"
                                style={{ color: "#0F172A" }}
                              >
                                Follow-up Date *
                              </label>
                              <input
                                type="date"
                                name="follow_up_date"
                                value={followUpForm.follow_up_date}
                                onChange={handleFollowUpInputChange}
                                disabled={followUpSubmitting}
                                className="w-full px-3 py-2 rounded-lg text-sm"
                                style={{
                                  backgroundColor: "#FFFFFF",
                                  border: `1px solid ${followUpFormErrors.follow_up_date ? "#EF4444" : "#E2E8F0"}`,
                                  color: "#0F172A",
                                }}
                              />
                              {followUpFormErrors.follow_up_date && (
                                <p
                                  className="mt-1 text-xs"
                                  style={{ color: "#EF4444" }}
                                >
                                  {followUpFormErrors.follow_up_date}
                                </p>
                              )}
                            </div>

                            {/* Contact Mode */}
                            <div className="mb-3">
                              <label
                                className="block text-xs font-medium mb-1"
                                style={{ color: "#0F172A" }}
                              >
                                Contact Mode *
                              </label>
                              <select
                                name="contact_mode"
                                value={followUpForm.contact_mode}
                                onChange={handleFollowUpInputChange}
                                disabled={followUpSubmitting}
                                className="w-full px-3 py-2 rounded-lg text-sm"
                                style={{
                                  backgroundColor: "#FFFFFF",
                                  border: `1px solid ${followUpFormErrors.contact_mode ? "#EF4444" : "#E2E8F0"}`,
                                  color: "#0F172A",
                                }}
                              >
                                <option value="call">Call</option>
                                <option value="email">Email</option>
                                <option value="message">Message</option>
                                <option value="video">Video Call</option>
                                <option value="in_person">In Person</option>
                              </select>
                              {followUpFormErrors.contact_mode && (
                                <p
                                  className="mt-1 text-xs"
                                  style={{ color: "#EF4444" }}
                                >
                                  {followUpFormErrors.contact_mode}
                                </p>
                              )}
                            </div>

                            {/* Discussion Notes */}
                            <div className="mb-4">
                              <label
                                className="block text-xs font-medium mb-1"
                                style={{ color: "#0F172A" }}
                              >
                                Discussion Notes *
                              </label>
                              <textarea
                                name="discussion_notes"
                                value={followUpForm.discussion_notes}
                                onChange={handleFollowUpInputChange}
                                disabled={followUpSubmitting}
                                rows="3"
                                className="w-full px-3 py-2 rounded-lg text-sm"
                                style={{
                                  backgroundColor: "#FFFFFF",
                                  border: `1px solid ${followUpFormErrors.discussion_notes ? "#EF4444" : "#E2E8F0"}`,
                                  color: "#0F172A",
                                }}
                                placeholder="Enter discussion notes..."
                              />
                              {followUpFormErrors.discussion_notes && (
                                <p
                                  className="mt-1 text-xs"
                                  style={{ color: "#EF4444" }}
                                >
                                  {followUpFormErrors.discussion_notes}
                                </p>
                              )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => setShowFollowUpForm(false)}
                                disabled={followUpSubmitting}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                                style={{
                                  backgroundColor: "#F1F5F9",
                                  color: "#64748B",
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={followUpSubmitting}
                                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                                style={{ backgroundColor: "#2563EB" }}
                              >
                                {followUpSubmitting ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    <span>Saving...</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Save Follow-up</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Follow-ups List */}
                      {followUpsLoading ? (
                        <div className="flex justify-center py-8">
                          <div
                            className="animate-spin rounded-full h-6 w-6 border-b-2"
                            style={{ borderColor: "#2563EB" }}
                          ></div>
                        </div>
                      ) : followUps.length > 0 ? (
                        <div className="space-y-3">
                          {followUps.map((followUp) => {
                            const modeInfo = getContactModeInfo(
                              followUp.contact_mode,
                            );
                            const ModeIcon = modeInfo.icon;

                            return (
                              <div
                                key={followUp.id}
                                className="p-4 rounded-lg"
                                style={{
                                  backgroundColor: "#FFFFFF",
                                  border: "1px solid #E2E8F0",
                                }}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className="p-1.5 rounded-full"
                                      style={{ backgroundColor: modeInfo.bg }}
                                    >
                                      <ModeIcon
                                        className="w-3 h-3"
                                        style={{ color: modeInfo.color }}
                                      />
                                    </div>
                                    <span
                                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                                      style={{
                                        backgroundColor: modeInfo.bg,
                                        color: modeInfo.color,
                                      }}
                                    >
                                      {modeInfo.label}
                                    </span>
                                  </div>
                                  <span
                                    className="text-xs"
                                    style={{ color: "#94A3B8" }}
                                  >
                                    {formatDateWithTime(followUp.created_at)}
                                  </span>
                                </div>

                                <div className="ml-7 space-y-2">
                                  <div className="flex items-center space-x-2 text-xs">
                                    <CalendarIcon
                                      className="w-3 h-3"
                                      style={{ color: "#94A3B8" }}
                                    />
                                    <span style={{ color: "#0F172A" }}>
                                      Follow-up:{" "}
                                      {formatDateShort(followUp.follow_up_date)}
                                    </span>
                                  </div>

                                  <p
                                    className="text-sm"
                                    style={{ color: "#64748B" }}
                                  >
                                    {followUp.discussion_notes}
                                  </p>

                                  {followUp.recruiter && (
                                    <div
                                      className="flex items-center space-x-2 text-xs pt-1 border-t"
                                      style={{ borderColor: "#E2E8F0" }}
                                    >
                                      <UserCheck
                                        className="w-3 h-3"
                                        style={{ color: "#94A3B8" }}
                                      />
                                      <span style={{ color: "#64748B" }}>
                                        Added by {followUp.recruiter.name}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* Pagination */}
                          {followUpPagination.last_page > 1 && (
                            <div className="flex items-center justify-center space-x-2 pt-2">
                              <button
                                onClick={() =>
                                  fetchFollowUps(
                                    followUpPagination.current_page - 1,
                                  )
                                }
                                disabled={followUpPagination.current_page === 1}
                                className="p-1 rounded disabled:opacity-50"
                                style={{ backgroundColor: "#F1F5F9" }}
                              >
                                <ChevronRight
                                  className="w-4 h-4 rotate-180"
                                  style={{ color: "#64748B" }}
                                />
                              </button>
                              <span
                                className="text-xs"
                                style={{ color: "#64748B" }}
                              >
                                Page {followUpPagination.current_page} of{" "}
                                {followUpPagination.last_page}
                              </span>
                              <button
                                onClick={() =>
                                  fetchFollowUps(
                                    followUpPagination.current_page + 1,
                                  )
                                }
                                disabled={
                                  followUpPagination.current_page ===
                                  followUpPagination.last_page
                                }
                                className="p-1 rounded disabled:opacity-50"
                                style={{ backgroundColor: "#F1F5F9" }}
                              >
                                <ChevronRight
                                  className="w-4 h-4"
                                  style={{ color: "#64748B" }}
                                />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <PhoneCall
                            className="w-12 h-12 mx-auto mb-3"
                            style={{ color: "#94A3B8" }}
                          />
                          <p style={{ color: "#64748B" }}>No follow-ups yet</p>
                          <p
                            className="text-xs mt-1"
                            style={{ color: "#94A3B8" }}
                          >
                            Click "Add Follow-up" to log your first interaction
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Documents Tab */}
                  {activeTab === "documents" && (
                    <div className="space-y-4">
                      {/* Resume */}
                      {candidate?.resume_path ? (
                        <div
                          className="p-4 rounded-lg flex items-center justify-between"
                          style={{
                            backgroundColor: "#F8FAFC",
                            border: "1px solid #E2E8F0",
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <FileText
                              className="w-5 h-5"
                              style={{ color: "#2563EB" }}
                            />
                            <div>
                              <p
                                className="text-sm font-medium"
                                style={{ color: "#0F172A" }}
                              >
                                Resume
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: "#64748B" }}
                              >
                                Uploaded on {formatDate(candidate.updated_at)}
                              </p>
                            </div>
                          </div>
                          <button
                            className="flex items-center space-x-1 px-3 py-1 rounded-lg text-sm"
                            style={{
                              backgroundColor: "#FFFFFF",
                              border: "1px solid #E2E8F0",
                            }}
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FileText
                            className="w-12 h-12 mx-auto mb-3"
                            style={{ color: "#94A3B8" }}
                          />
                          <p style={{ color: "#64748B" }}>
                            No documents uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Organization Card */}
            <div
              className="rounded-lg"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
              }}
            >
              <div className="p-4 border-b" style={{ borderColor: "#E2E8F0" }}>
                <h3
                  className="font-semibold flex items-center space-x-2"
                  style={{ color: "#0F172A" }}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Organization</span>
                </h3>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium" style={{ color: "#0F172A" }}>
                  {candidate?.organization?.name}
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <Mail className="w-3 h-3" style={{ color: "#94A3B8" }} />
                    <span style={{ color: "#64748B" }}>
                      {candidate?.organization?.email}
                    </span>
                  </div>
                  {candidate?.organization?.phone && (
                    <div className="flex items-center space-x-2 text-xs">
                      <Phone className="w-3 h-3" style={{ color: "#94A3B8" }} />
                      <span style={{ color: "#64748B" }}>
                        {candidate?.organization?.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Assigned Recruiter Card */}
            {candidate?.assigned_recruiter && (
              <div
                className="rounded-lg"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div
                  className="p-4 border-b"
                  style={{ borderColor: "#E2E8F0" }}
                >
                  <h3
                    className="font-semibold flex items-center space-x-2"
                    style={{ color: "#0F172A" }}
                  >
                    <Users className="w-4 h-4" />
                    <span>Assigned Recruiter</span>
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#DBEAFE" }}
                    >
                      <UserCircle
                        className="w-6 h-6"
                        style={{ color: "#2563EB" }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#0F172A" }}
                      >
                        {candidate.assigned_recruiter.name}
                      </p>
                      <p className="text-xs" style={{ color: "#64748B" }}>
                        {candidate.assigned_recruiter.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Card */}
            <div
              className="rounded-lg"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
              }}
            >
              <div className="p-4 border-b" style={{ borderColor: "#E2E8F0" }}>
                <h3
                  className="font-semibold flex items-center space-x-2"
                  style={{ color: "#0F172A" }}
                >
                  <Clock className="w-4 h-4" />
                  <span>Timeline</span>
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>
                    Created
                  </p>
                  <p className="text-sm" style={{ color: "#0F172A" }}>
                    {formatDate(candidate?.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>
                    Last Updated
                  </p>
                  <p className="text-sm" style={{ color: "#0F172A" }}>
                    {formatDate(candidate?.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className="rounded-lg"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
              }}
            >
              <div className="p-4 border-b" style={{ borderColor: "#E2E8F0" }}>
                <h3 className="font-semibold" style={{ color: "#0F172A" }}>
                  Quick Actions
                </h3>
              </div>
              <div className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab("followups")}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
                  style={{ color: "#64748B" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F1F5F9";
                    e.currentTarget.style.color = "#2563EB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#64748B";
                  }}
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Add Follow-up</span>
                </button>
                <button
                  onClick={() => {
                    /* Send email */
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
                  style={{ color: "#64748B" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F1F5F9";
                    e.currentTarget.style.color = "#2563EB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#64748B";
                  }}
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </button>
                <button
                  onClick={() => {
                    /* Schedule interview */
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
                  style={{ color: "#64748B" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F1F5F9";
                    e.currentTarget.style.color = "#2563EB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#64748B";
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Interview</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandleViewCandidates;
