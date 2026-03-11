import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Edit,
  Trash2,
  UserPlus,
  Plus,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Shield,
  UserCog,
  ChevronRight,
  Copy,
  ExternalLink,
} from "lucide-react";
import { api } from "../../../utils/app";
import toast from "react-hot-toast";

const HandleOrganizationsDetails = () => {
  const { id } = useParams(); // Get organization ID from URL
  const navigate = useNavigate();

  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, departments, users
  const [refreshing, setRefreshing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch organization details
  const fetchOrganizationDetails = async () => {
    setLoading(true);
    setApiError("");

    try {
      const response = await api.get(`/organizations/${id}`);
      if (response.data) {
        setOrganization(response.data);
      }
    } catch (error) {
      console.error("Error fetching organization details:", error);
      setApiError(error.message || "Failed to fetch organization details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrganizationDetails();
    }
  }, [id]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrganizationDetails();
    setRefreshing(false);
  };

  // Handle copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  // Get type badge color
  const getTypeColor = (type) => {
    const colors = {
      government: "#2563EB",
      private: "#14B8A6",
      consultancy: "#8B5CF6",
      nonprofit: "#F59E0B",
    };
    return colors[type] || "#64748B";
  };

  // Get role badge color
  const getRoleColor = (roleId) => {
    const colors = {
      1: "#EF4444", // Super Admin
      2: "#2563EB", // Org Admin
      3: "#14B8A6", // HR
      4: "#F59E0B", // Manager
      5: "#8B5CF6", // Vendor
    };
    return colors[roleId] || "#64748B";
  };

  // Get role name
  const getRoleName = (roleId) => {
    const roles = {
      1: "Super Admin",
      2: "Organization Admin",
      3: "HR / Recruiter",
      4: "Department Manager",
      5: "Vendor",
    };
    return roles[roleId] || "Unknown";
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await api.delete(`/organizations/${id}`);
      toast.success("Organization deleted successfully!");
      navigate("/admin/organizations")
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setDeleteLoading(false);
    }
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
            Loading organization details...
          </p>
        </div>
      </div>
    );
  }

  if (apiError || !organization) {
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
            Error Loading Organization
          </h2>
          <p className="mb-6" style={{ color: "#64748B" }}>
            {apiError || "Organization not found"}
          </p>
          <button
            onClick={() => navigate("/super-admin/organizations")}
            className="px-4 py-2 rounded-lg text-white transition-colors"
            style={{ backgroundColor: "#2563EB" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#1D4ED8")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#2563EB")
            }
          >
            Back to Organizations
          </button>
        </div>
      </div>
    );
  }

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
                onClick={() => navigate("/super-admin/organizations")}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: "#64748B" }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-6 h-6" style={{ color: "#2563EB" }} />
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: "#0F172A" }}
                  >
                    {organization.name}
                  </h1>
                  <span
                    className="px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: `${getTypeColor(organization.type)}20`,
                      color: getTypeColor(organization.type),
                    }}
                  >
                    {organization.type}
                  </span>
                </div>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs" style={{ color: "#94A3B8" }}>
                    ID: {organization.id}
                  </span>
                  <span className="text-xs" style={{ color: "#94A3B8" }}>
                    •
                  </span>
                  <span className="text-xs" style={{ color: "#94A3B8" }}>
                    Created: {formatDate(organization.created_at)}
                  </span>
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Organization Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
          >
            <div className="flex items-center justify-between mb-2">
              <Mail className="w-5 h-5" style={{ color: "#2563EB" }} />
              <button
                onClick={() => handleCopy(organization.email)}
                className="hover:bg-gray-100 p-1 rounded"
              >
                <Copy className="w-3 h-3" style={{ color: "#94A3B8" }} />
              </button>
            </div>
            <p className="text-sm" style={{ color: "#64748B" }}>
              Email
            </p>
            <p className="font-medium truncate" style={{ color: "#0F172A" }}>
              {organization.email}
            </p>
          </div>

          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
          >
            <div className="flex items-center justify-between mb-2">
              <Phone className="w-5 h-5" style={{ color: "#14B8A6" }} />
              {organization.phone && (
                <button
                  onClick={() => handleCopy(organization.phone)}
                  className="hover:bg-gray-100 p-1 rounded"
                >
                  <Copy className="w-3 h-3" style={{ color: "#94A3B8" }} />
                </button>
              )}
            </div>
            <p className="text-sm" style={{ color: "#64748B" }}>
              Phone
            </p>
            <p className="font-medium" style={{ color: "#0F172A" }}>
              {organization.phone || (
                <span className="italic" style={{ color: "#94A3B8" }}>
                  Not provided
                </span>
              )}
            </p>
          </div>

          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
          >
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5" style={{ color: "#8B5CF6" }} />
            </div>
            <p className="text-sm" style={{ color: "#64748B" }}>
              Address
            </p>
            <p className="font-medium" style={{ color: "#0F172A" }}>
              {organization.address || (
                <span className="italic" style={{ color: "#94A3B8" }}>
                  Not provided
                </span>
              )}
            </p>
          </div>

          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
          >
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5" style={{ color: "#F59E0B" }} />
            </div>
            <p className="text-sm" style={{ color: "#64748B" }}>
              Last Updated
            </p>
            <p className="font-medium" style={{ color: "#0F172A" }}>
              {formatDate(organization.updated_at)}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: "#2563EB",
              backgroundImage:
                "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            }}
          >
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm opacity-90">Total Departments</p>
                <p className="text-3xl font-bold mt-1">
                  {organization.departments?.length || 0}
                </p>
              </div>
              <Briefcase className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: "#14B8A6",
              backgroundImage:
                "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
            }}
          >
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm opacity-90">Total Users</p>
                <p className="text-3xl font-bold mt-1">
                  {organization.users?.length || 0}
                </p>
              </div>
              <Users className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: "#8B5CF6",
              backgroundImage:
                "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
            }}
          >
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm opacity-90">Active Jobs</p>
                <p className="text-3xl font-bold mt-1">--</p>
              </div>
              <Globe className="w-12 h-12 opacity-50" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex space-x-6">
            {["overview", "departments", "users"].map((tab) => (
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
                {tab === "departments" &&
                  organization.departments?.length > 0 && (
                    <span
                      className="ml-2 px-1.5 py-0.5 text-xs rounded-full"
                      style={{ backgroundColor: "#DBEAFE", color: "#2563EB" }}
                    >
                      {organization.departments.length}
                    </span>
                  )}
                {tab === "users" && organization.users?.length > 0 && (
                  <span
                    className="ml-2 px-1.5 py-0.5 text-xs rounded-full"
                    style={{ backgroundColor: "#DBEAFE", color: "#2563EB" }}
                  >
                    {organization.users.length}
                  </span>
                )}
              </button>
            ))}
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
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#0F172A" }}
              >
                Organization Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4
                    className="text-sm font-medium mb-3"
                    style={{ color: "#64748B" }}
                  >
                    Quick Stats
                  </h4>
                  <div className="space-y-3">
                    <div
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: "#F8FAFC" }}
                    >
                      <span style={{ color: "#64748B" }}>Departments</span>
                      <span
                        className="font-semibold"
                        style={{ color: "#2563EB" }}
                      >
                        {organization.departments?.length || 0}
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: "#F8FAFC" }}
                    >
                      <span style={{ color: "#64748B" }}>Users</span>
                      <span
                        className="font-semibold"
                        style={{ color: "#14B8A6" }}
                      >
                        {organization.users?.length || 0}
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: "#F8FAFC" }}
                    >
                      <span style={{ color: "#64748B" }}>Active Jobs</span>
                      <span
                        className="font-semibold"
                        style={{ color: "#8B5CF6" }}
                      >
                        0
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: "#F8FAFC" }}
                    >
                      <span style={{ color: "#64748B" }}>Total Candidates</span>
                      <span
                        className="font-semibold"
                        style={{ color: "#F59E0B" }}
                      >
                        0
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4
                    className="text-sm font-medium mb-3"
                    style={{ color: "#64748B" }}
                  >
                    User Role Distribution
                  </h4>
                  <div className="space-y-3">
                    {organization.users?.reduce((acc, user) => {
                      const roleName = getRoleName(user.role_id);
                      acc[roleName] = (acc[roleName] || 0) + 1;
                      return acc;
                    }, {}) &&
                      Object.entries(
                        organization.users?.reduce((acc, user) => {
                          const roleName = getRoleName(user.role_id);
                          acc[roleName] = (acc[roleName] || 0) + 1;
                          return acc;
                        }, {}),
                      ).map(([role, count]) => (
                        <div
                          key={role}
                          className="flex items-center justify-between p-3 rounded-lg"
                          style={{ backgroundColor: "#F8FAFC" }}
                        >
                          <span style={{ color: "#64748B" }}>{role}</span>
                          <span
                            className="font-semibold"
                            style={{ color: "#2563EB" }}
                          >
                            {count}
                          </span>
                        </div>
                      ))}
                    {(!organization.users ||
                      organization.users.length === 0) && (
                      <p
                        className="text-center py-4 italic"
                        style={{ color: "#94A3B8" }}
                      >
                        No users found
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Departments Tab */}
          {activeTab === "departments" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "#0F172A" }}
                >
                  Departments
                </h3>
                <button
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Department</span>
                </button>
              </div>

              {organization.departments &&
              organization.departments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {organization.departments.map((dept) => (
                    <div
                      key={dept.id}
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4
                          className="font-medium"
                          style={{ color: "#0F172A" }}
                        >
                          {dept.name}
                        </h4>
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: "#DBEAFE",
                            color: "#2563EB",
                          }}
                        >
                          ID: {dept.id}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "#94A3B8" }}>
                        Created: {formatDate(dept.created_at)}
                      </p>
                      <div className="mt-3 flex items-center space-x-2">
                        <button
                          className="text-xs px-2 py-1 rounded"
                          style={{ color: "#2563EB" }}
                        >
                          View Users
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded"
                          style={{ color: "#64748B" }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase
                    className="w-12 h-12 mx-auto mb-3"
                    style={{ color: "#94A3B8" }}
                  />
                  <p style={{ color: "#64748B" }}>No departments found</p>
                  <button className="mt-3 text-sm" style={{ color: "#2563EB" }}>
                    + Add your first department
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "#0F172A" }}
                >
                  Users
                </h3>
                <button
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>

              {organization.users && organization.users.length > 0 ? (
                <div className="space-y-3">
                  {organization.users.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                            style={{
                              backgroundColor: getRoleColor(user.role_id),
                            }}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <h4
                              className="font-medium"
                              style={{ color: "#0F172A" }}
                            >
                              {user.name}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Mail
                                className="w-3 h-3"
                                style={{ color: "#94A3B8" }}
                              />
                              <span
                                className="text-xs"
                                style={{ color: "#64748B" }}
                              >
                                {user.email}
                              </span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center space-x-2 mt-1">
                                <Phone
                                  className="w-3 h-3"
                                  style={{ color: "#94A3B8" }}
                                />
                                <span
                                  className="text-xs"
                                  style={{ color: "#64748B" }}
                                >
                                  {user.phone}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className="px-2 py-1 text-xs rounded-full"
                            style={{
                              backgroundColor: `${getRoleColor(user.role_id)}20`,
                              color: getRoleColor(user.role_id),
                            }}
                          >
                            {getRoleName(user.role_id)}
                          </span>
                          <p
                            className="text-xs mt-2"
                            style={{ color: "#94A3B8" }}
                          >
                            Joined: {formatDate(user.created_at).split(",")[0]}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users
                    className="w-12 h-12 mx-auto mb-3"
                    style={{ color: "#94A3B8" }}
                  />
                  <p style={{ color: "#64748B" }}>No users found</p>
                  <button className="mt-3 text-sm" style={{ color: "#2563EB" }}>
                    + Add your first user
                  </button>
                </div>
              )}
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
          </div>
          <button
            disabled={deleteLoading}
            onClick={() => handleDelete(id)}
            className={`
    flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium
    transition-all duration-200 ease-in-out
    ${deleteLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg transform hover:-translate-y-0.5"}
  `}
            style={{
              backgroundColor: "#EF4444",
              cursor: deleteLoading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!deleteLoading) {
                e.currentTarget.style.backgroundColor = "#DC2626";
              }
            }}
            onMouseLeave={(e) => {
              if (!deleteLoading) {
                e.currentTarget.style.backgroundColor = "#EF4444";
              }
            }}
          >
            {deleteLoading ? (
              <>
                <div className="relative">
                  {/* Spinner */}
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>

                  {/* Pulsing effect behind spinner */}
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{ backgroundColor: "#FFFFFF" }}
                  ></div>
                </div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Delete Organization</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandleOrganizationsDetails;
