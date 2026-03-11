import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Briefcase,
  ArrowLeft,
  Building2,
  Users,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Copy,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  MinusCircle,
  Mail,
  Phone,
  User,
  FileText,
  DollarSign,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Globe,
  Shield,
  CheckSquare,
  XSquare,
  ChevronRight,
  Download,
  ExternalLink,
  Share2,
  Eye,
  MessageCircle,
  Paperclip,
} from "lucide-react";
import { api } from "../../../utils/app";

const HandleRequirementsDetails = () => {
  const { id } = useParams(); // Get requirement ID from URL
  const navigate = useNavigate();

  const [requirement, setRequirement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview, applications, approvals, activity

  // Fetch requirement details
  const fetchRequirementDetails = async () => {
    setLoading(true);
    setApiError("");

    try {
      const response = await api.get(`/requirements/${id}`);
      if (response.data) {
        setRequirement(response.data);
      }
    } catch (error) {
      console.error("Error fetching requirement details:", error);
      setApiError(error.message || "Failed to fetch requirement details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRequirementDetails();
    }
  }, [id]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRequirementDetails();
    setRefreshing(false);
  };

  // Handle copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  // Get priority icon and color
  const getPriorityInfo = (priority) => {
    const info = {
      high: {
        icon: TrendingUp,
        color: "#EF4444",
        bgColor: "#FEE2E2",
        label: "High",
      },
      medium: {
        icon: MinusCircle,
        color: "#F59E0B",
        bgColor: "#FEF3C7",
        label: "Medium",
      },
      low: {
        icon: TrendingDown,
        color: "#22C55E",
        bgColor: "#DCFCE7",
        label: "Low",
      },
    };
    return info[priority] || info.medium;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      draft: "#64748B",
      pending_approval: "#F59E0B",
      approved: "#22C55E",
      published: "#2563EB",
      closed: "#64748B",
      cancelled: "#EF4444",
    };
    return colors[status] || "#64748B";
  };

  // Get employment type color
  const getEmploymentTypeColor = (type) => {
    const colors = {
      permanent: "#2563EB",
      contract: "#14B8A6",
      internship: "#8B5CF6",
      temporary: "#F59E0B",
    };
    return colors[type] || "#64748B";
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getApprovalStatus = (status) => {
    const map = {
      approved: {
        color: "#22C55E",
        bg: "#DCFCE7",
        icon: CheckCircle,
        label: "Approved",
      },
      rejected: {
        color: "#EF4444",
        bg: "#FEE2E2",
        icon: XSquare,
        label: "Rejected",
      },
      pending: {
        color: "#F59E0B",
        bg: "#FEF3C7",
        icon: Clock,
        label: "Pending",
      },
    };

    return map[status] || map.pending;
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F1F5F9" }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: "#2563EB" }}
          ></div>
          <p className="mt-4" style={{ color: "#64748B" }}>
            Loading requirement details...
          </p>
        </div>
      </div>
    );
  }

  if (apiError || !requirement) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F1F5F9" }}
      >
        <div className="text-center max-w-md p-6">
          <AlertCircle
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: "#EF4444" }}
          />
          <h2 className="text-xl font-bold mb-2" style={{ color: "#0F172A" }}>
            Error Loading Requirement
          </h2>
          <p className="mb-6" style={{ color: "#64748B" }}>
            {apiError || "Requirement not found"}
          </p>
          <button
            onClick={() => navigate("/admin/requirements")}
            className="px-4 py-2 rounded-lg text-white transition-colors"
            style={{ backgroundColor: "#2563EB" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#1D4ED8")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#2563EB")
            }
          >
            Back to Requirements
          </button>
        </div>
      </div>
    );
  }

  const PriorityIcon = getPriorityInfo(requirement.priority).icon;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F1F5F9" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10"
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/requirements")}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: "#64748B" }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-6 h-6" style={{ color: "#2563EB" }} />
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: "#0F172A" }}
                  >
                    {requirement.title}
                  </h1>
                  <span
                    className="px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: `${getPriorityInfo(requirement.priority).bgColor}`,
                      color: getPriorityInfo(requirement.priority).color,
                    }}
                  >
                    {requirement.priority} priority
                  </span>
                  <span
                    className="px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: `${getStatusColor(requirement.status)}20`,
                      color: getStatusColor(requirement.status),
                    }}
                  >
                    {requirement.status}
                  </span>
                  {requirement.is_urgent && (
                    <span
                      className="px-2 py-1 text-xs rounded-full"
                      style={{ backgroundColor: "#FEE2E2", color: "#EF4444" }}
                    >
                      URGENT
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center space-x-1">
                    <Building2
                      className="w-3 h-3"
                      style={{ color: "#64748B" }}
                    />
                    <span className="text-xs" style={{ color: "#64748B" }}>
                      {requirement.organization?.name}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: "#94A3B8" }}>
                    •
                  </span>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" style={{ color: "#64748B" }} />
                    <span className="text-xs" style={{ color: "#64748B" }}>
                      {requirement.department?.name}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: "#94A3B8" }}>
                    •
                  </span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" style={{ color: "#64748B" }} />
                    <span className="text-xs" style={{ color: "#64748B" }}>
                      {requirement.location}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: "#94A3B8" }}>
                    •
                  </span>
                  <div className="flex items-center space-x-1">
                    <Calendar
                      className="w-3 h-3"
                      style={{ color: "#64748B" }}
                    />
                    <span className="text-xs" style={{ color: "#64748B" }}>
                      Posted:{" "}
                      {formatDate(requirement.published_at).split(",")[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                }}
                title="Refresh"
                disabled={refreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  style={{ color: "#64748B" }}
                />
              </button>
              <button
                onClick={() =>
                  navigate(`/super-admin/requirements/edit/${requirement.id}`)
                }
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                }}
              >
                <Edit className="w-4 h-4" style={{ color: "#64748B" }} />
                <span className="text-sm" style={{ color: "#64748B" }}>
                  Edit
                </span>
              </button>
              <button
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: "#2563EB" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1D4ED8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2563EB")
                }
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5" style={{ color: "#2563EB" }} />
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: "#DBEAFE", color: "#2563EB" }}
              >
                Total
              </span>
            </div>
            <p className="text-sm" style={{ color: "#64748B" }}>
              Openings
            </p>
            <p className="text-2xl font-bold" style={{ color: "#0F172A" }}>
              {requirement.openings}
            </p>
          </div>

          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5" style={{ color: "#14B8A6" }} />
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: "#CCFBF1", color: "#14B8A6" }}
              >
                Received
              </span>
            </div>
            <p className="text-sm" style={{ color: "#64748B" }}>
              Applications
            </p>
            <p className="text-2xl font-bold" style={{ color: "#0F172A" }}>
              {requirement.applications?.length || 0}
            </p>
          </div>

          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5" style={{ color: "#8B5CF6" }} />
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: "#EDE9FE", color: "#8B5CF6" }}
              >
                Range
              </span>
            </div>
            <p className="text-sm" style={{ color: "#64748B" }}>
              Salary
            </p>
            <p className="text-lg font-bold" style={{ color: "#0F172A" }}>
              {formatCurrency(requirement.salary_min)} -{" "}
              {formatCurrency(requirement.salary_max)}
            </p>
          </div>

          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
          >
            <div className="flex items-center justify-between mb-2">
              <GraduationCap className="w-5 h-5" style={{ color: "#F59E0B" }} />
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: "#FEF3C7", color: "#F59E0B" }}
              >
                Min-Max
              </span>
            </div>
            <p className="text-sm" style={{ color: "#64748B" }}>
              Experience
            </p>
            <p className="text-2xl font-bold" style={{ color: "#0F172A" }}>
              {requirement.experience_min} - {requirement.experience_max} years
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex space-x-6">
            {["overview", "applications", "approvals", "activity"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="py-3 px-1 text-sm font-medium capitalize relative"
                  style={{
                    color: activeTab === tab ? "#2563EB" : "#64748B",
                    borderBottom:
                      activeTab === tab
                        ? "2px solid #2563EB"
                        : "2px solid transparent",
                  }}
                >
                  {tab}
                  {tab === "applications" &&
                    requirement.applications?.length > 0 && (
                      <span
                        className="ml-2 px-1.5 py-0.5 text-xs rounded-full"
                        style={{ backgroundColor: "#DBEAFE", color: "#2563EB" }}
                      >
                        {requirement.applications.length}
                      </span>
                    )}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div
          className="rounded-lg"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
        >
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Job Description */}
                  <div>
                    <h3
                      className="text-lg font-semibold mb-3"
                      style={{ color: "#0F172A" }}
                    >
                      Job Description
                    </h3>
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: "#F8FAFC" }}
                    >
                      <p style={{ color: "#334155", lineHeight: "1.6" }}>
                        {requirement.job_description ||
                          "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Skills Required */}
                  <div>
                    <h3
                      className="text-lg font-semibold mb-3"
                      style={{ color: "#0F172A" }}
                    >
                      Skills Required
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {requirement.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 rounded-lg text-sm"
                          style={{
                            backgroundColor: "#DBEAFE",
                            color: "#2563EB",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                      {(!requirement.skills ||
                        requirement.skills.length === 0) && (
                        <p style={{ color: "#94A3B8" }}>No skills specified</p>
                      )}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: "#F8FAFC" }}
                    >
                      <h4
                        className="text-sm font-medium mb-3"
                        style={{ color: "#64748B" }}
                      >
                        Education
                      </h4>
                      <p style={{ color: "#0F172A" }}>
                        {requirement.education || "Not specified"}
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: "#F8FAFC" }}
                    >
                      <h4
                        className="text-sm font-medium mb-3"
                        style={{ color: "#64748B" }}
                      >
                        Employment Type
                      </h4>
                      <span
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: `${getEmploymentTypeColor(requirement.employment_type)}20`,
                          color: getEmploymentTypeColor(
                            requirement.employment_type,
                          ),
                        }}
                      >
                        {requirement.employment_type}
                      </span>
                    </div>
                  </div>

                  {/* Justification */}
                  {requirement.justification && (
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: "#F8FAFC" }}
                    >
                      <h4
                        className="text-sm font-medium mb-2"
                        style={{ color: "#64748B" }}
                      >
                        Justification
                      </h4>
                      <p style={{ color: "#334155" }}>
                        {requirement.justification}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column - Sidebar Info */}
                <div className="space-y-4">
                  {/* Organization Info */}
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: "#F8FAFC" }}
                  >
                    <h4
                      className="text-sm font-medium mb-3"
                      style={{ color: "#64748B" }}
                    >
                      Organization
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Building2
                          className="w-4 h-4"
                          style={{ color: "#2563EB" }}
                        />
                        <span style={{ color: "#0F172A" }}>
                          {requirement.organization?.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail
                          className="w-4 h-4"
                          style={{ color: "#64748B" }}
                        />
                        <span className="text-sm" style={{ color: "#64748B" }}>
                          {requirement.organization?.email}
                        </span>
                      </div>
                      {requirement.organization?.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone
                            className="w-4 h-4"
                            style={{ color: "#64748B" }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: "#64748B" }}
                          >
                            {requirement.organization?.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Department Info */}
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: "#F8FAFC" }}
                  >
                    <h4
                      className="text-sm font-medium mb-3"
                      style={{ color: "#64748B" }}
                    >
                      Department
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" style={{ color: "#14B8A6" }} />
                      <span style={{ color: "#0F172A" }}>
                        {requirement.department?.name}
                      </span>
                    </div>
                  </div>

                  {/* Created By */}
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: "#F8FAFC" }}
                  >
                    <h4
                      className="text-sm font-medium mb-3"
                      style={{ color: "#64748B" }}
                    >
                      Created By
                    </h4>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" style={{ color: "#8B5CF6" }} />
                      <span style={{ color: "#0F172A" }}>
                        {requirement.created_by?.name}
                      </span>
                    </div>
                    <p className="text-xs mt-2" style={{ color: "#94A3B8" }}>
                      {formatDate(requirement.created_at)}
                    </p>
                  </div>

                  {/* Shareable URL */}
                  {requirement.shareable_url && (
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: "#F8FAFC" }}
                    >
                      <h4
                        className="text-sm font-medium mb-3"
                        style={{ color: "#64748B" }}
                      >
                        Shareable URL
                      </h4>
                      <div className="flex items-center space-x-2">
                        <LinkIcon
                          className="w-4 h-4"
                          style={{ color: "#2563EB" }}
                        />
                        <span
                          className="text-sm truncate"
                          style={{ color: "#2563EB" }}
                        >
                          {requirement.shareable_url}
                        </span>
                        <button
                          onClick={() => handleCopy(requirement.shareable_url)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Copy
                            className="w-3 h-3"
                            style={{ color: "#64748B" }}
                          />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: "#F8FAFC" }}
                  >
                    <h4
                      className="text-sm font-medium mb-3"
                      style={{ color: "#64748B" }}
                    >
                      Additional Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span style={{ color: "#64748B" }}>
                          Applications Enabled
                        </span>
                        {requirement.applications_enabled ? (
                          <CheckCircle
                            className="w-4 h-4"
                            style={{ color: "#22C55E" }}
                          />
                        ) : (
                          <XCircle
                            className="w-4 h-4"
                            style={{ color: "#EF4444" }}
                          />
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: "#64748B" }}>
                          Required Joining Date
                        </span>
                        <span style={{ color: "#0F172A" }}>
                          {
                            formatDate(requirement.required_joining_date).split(
                              ",",
                            )[0]
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: "#64748B" }}>Budget Head</span>
                        <span style={{ color: "#0F172A" }}>
                          {requirement.budget_head || "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: "#64748B" }}>
                          Sanction Order No
                        </span>
                        <span style={{ color: "#0F172A" }}>
                          {requirement.sanction_order_no || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === "applications" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "#0F172A" }}
                >
                  Job Applications
                </h3>
                <button
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}
                >
                  <Eye className="w-4 h-4" />
                  <span>View All</span>
                </button>
              </div>

              {requirement.applications &&
              requirement.applications.length > 0 ? (
                <div className="space-y-3">
                  {requirement.applications.map((application) => (
                    <div
                      key={application.id}
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "#DBEAFE" }}
                          >
                            <User
                              className="w-5 h-5"
                              style={{ color: "#2563EB" }}
                            />
                          </div>
                          <div>
                            <p
                              className="font-medium"
                              style={{ color: "#0F172A" }}
                            >
                              Application #{application.id}
                            </p>
                            <div className="flex items-center space-x-3 mt-1">
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: "#CCFBF1",
                                  color: "#14B8A6",
                                }}
                              >
                                {application.source}
                              </span>
                              <span
                                className="text-xs"
                                style={{ color: "#64748B" }}
                              >
                                Stage ID: {application.pipeline_stage_id}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs" style={{ color: "#94A3B8" }}>
                            Applied on
                          </p>
                          <p className="text-sm" style={{ color: "#0F172A" }}>
                            {formatDate(application.created_at).split(",")[0]}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText
                    className="w-12 h-12 mx-auto mb-3"
                    style={{ color: "#94A3B8" }}
                  />
                  <p style={{ color: "#64748B" }}>
                    No applications received yet
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Approvals Tab */}
          {activeTab === "approvals" && (
            <div className="p-6">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#0F172A" }}
              >
                Approval History
              </h3>

              {requirement.approvals && requirement.approvals.length > 0 ? (
                <div className="space-y-4">
                  {requirement.approvals.map((approval, index) => {
                    const statusInfo = getApprovalStatus(approval.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <div
                        key={approval.id}
                        className="flex items-start space-x-4 p-4 rounded-lg"
                        style={{
                          backgroundColor: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        {/* Level Indicator */}
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: statusInfo.bg }}
                        >
                          <StatusIcon
                            className="w-5 h-5"
                            style={{ color: statusInfo.color }}
                          />
                        </div>

                        {/* Approval Info */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p
                                className="font-medium"
                                style={{ color: "#0F172A" }}
                              >
                                Level {approval.level} - {approval.level_name}
                              </p>

                              <p
                                className="text-sm mt-1"
                                style={{ color: "#64748B" }}
                              >
                                Approver: {approval.approver?.name}
                              </p>
                            </div>

                            <span
                              className="px-2 py-1 text-xs rounded-full"
                              style={{
                                backgroundColor: statusInfo.bg,
                                color: statusInfo.color,
                              }}
                            >
                              {statusInfo.label}
                            </span>
                          </div>

                          {/* Remarks */}
                          {approval.remarks && (
                            <p
                              className="text-sm mt-2"
                              style={{ color: "#334155" }}
                            >
                              Remarks: {approval.remarks}
                            </p>
                          )}

                          {/* Time */}
                          <p
                            className="text-xs mt-2"
                            style={{ color: "#94A3B8" }}
                          >
                            {approval.acted_at
                              ? `Acted on ${formatDate(approval.acted_at)}`
                              : "Awaiting action"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckSquare
                    className="w-12 h-12 mx-auto mb-3"
                    style={{ color: "#94A3B8" }}
                  />
                  <p style={{ color: "#64748B" }}>No approvals found</p>
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className="p-6">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#0F172A" }}
              >
                Activity Timeline
              </h3>

              <div className="space-y-4">
                <div
                  className="flex items-start space-x-3 p-3 rounded-lg"
                  style={{ backgroundColor: "#F8FAFC" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#DBEAFE" }}
                  >
                    <Briefcase
                      className="w-4 h-4"
                      style={{ color: "#2563EB" }}
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#0F172A" }}
                    >
                      Requirement Created
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                      Job requirement was created in the system
                    </p>
                    <p className="text-xs mt-2" style={{ color: "#94A3B8" }}>
                      {formatDate(requirement.created_at)}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start space-x-3 p-3 rounded-lg"
                  style={{ backgroundColor: "#F8FAFC" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#CCFBF1" }}
                  >
                    <Globe className="w-4 h-4" style={{ color: "#14B8A6" }} />
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#0F172A" }}
                    >
                      Requirement Published
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                      Job was published and is now visible to candidates
                    </p>
                    <p className="text-xs mt-2" style={{ color: "#94A3B8" }}>
                      {formatDate(requirement.published_at)}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start space-x-3 p-3 rounded-lg"
                  style={{ backgroundColor: "#F8FAFC" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#FEE2E2" }}
                  >
                    <Clock className="w-4 h-4" style={{ color: "#EF4444" }} />
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#0F172A" }}
                    >
                      Last Updated
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                      Requirement information was updated
                    </p>
                    <p className="text-xs mt-2" style={{ color: "#94A3B8" }}>
                      {formatDate(requirement.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-lg"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
              }}
            >
              <Download className="w-4 h-4" style={{ color: "#64748B" }} />
            </button>
            <button
              className="p-2 rounded-lg"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
              }}
            >
              <ExternalLink className="w-4 h-4" style={{ color: "#64748B" }} />
            </button>
            <button
              className="p-2 rounded-lg"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
              }}
            >
              <Paperclip className="w-4 h-4" style={{ color: "#64748B" }} />
            </button>
          </div>
          <button
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors"
            style={{ backgroundColor: "#EF4444" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#DC2626")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#EF4444")
            }
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">Delete Requirement</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandleRequirementsDetails;
