import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
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
  Users,
  MapPin,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  MinusCircle,
  Send,
  ThumbsUp,
  Globe,
  Calendar as CalendarIcon,
  AlertTriangle,
} from "lucide-react";
import { api } from "../../../utils/app";

const HandleRequirements = () => {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
  });

  // Form state
  const [formData, setFormData] = useState({
    organization_id: "",
    department_id: "",
    title: "",
    location: "",
    openings: 1,
    employment_type: "permanent",
    priority: "medium",
  });

  // Approval form state
  const [approvalData, setApprovalData] = useState({
    action: "approve",
    remarks: "",
  });

  // Publish form state
  const [publishData, setPublishData] = useState({
    expiry_date: "",
    is_urgent: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Organization and Department data
  const [organizations, setOrganizations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  // Search states
  const [orgSearchTerm, setOrgSearchTerm] = useState("");
  const [deptSearchTerm, setDeptSearchTerm] = useState("");
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [loadingDepts, setLoadingDepts] = useState(false);

  // Employment types
  const employmentTypes = [
    { value: "permanent", label: "Permanent", color: "#2563EB" },
    { value: "contract", label: "Contract", color: "#14B8A6" },
    { value: "internship", label: "Internship", color: "#8B5CF6" },
    { value: "temporary", label: "Temporary", color: "#F59E0B" },
  ];

  // Priority levels
  const priorityLevels = [
    { value: "high", label: "High", color: "#EF4444" },
    { value: "medium", label: "Medium", color: "#F59E0B" },
    { value: "low", label: "Low", color: "#22C55E" },
  ];

  // Status options
  const statusOptions = [
    { value: "draft", label: "Draft", color: "#64748B" },
    { value: "pending_approval", label: "Pending Approval", color: "#F59E0B" },
    { value: "approved", label: "Approved", color: "#2563EB" },
    { value: "published", label: "Published", color: "#22C55E" },
    { value: "closed", label: "Closed", color: "#64748B" },
    { value: "cancelled", label: "Cancelled", color: "#EF4444" },
  ];

  // Fetch requirements
  const fetchRequirements = async (page = 1) => {
    setLoading(true);
    setApiError("");

    try {
      const params = new URLSearchParams({
        page: page,
        per_page: pagination.per_page,
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }

      if (filterPriority !== "all") {
        params.append("priority", filterPriority);
      }

      const response = await api.get(`/requirements?${params.toString()}`);

      if (response.data) {
        setRequirements(response.data.data || []);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to,
        });
      }
    } catch (error) {
      console.error("Error fetching requirements:", error);
      setApiError(error.message || "Failed to fetch requirements");
    } finally {
      setLoading(false);
    }
  };

  // Submit for approval
  const handleSubmitApproval = async (requirementId) => {
    setSubmitting(true);
    setApiError("");

    try {
      await api.post(`/requirements/${requirementId}/submit-approval`);
      setSuccessMessage("Requirement submitted for approval successfully!");
      setSelectedRequirement(null);
      fetchRequirements(pagination.current_page);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting for approval:", error);
      setApiError(error.message || "Failed to submit for approval");
    } finally {
      setSubmitting(false);
    }
  };

  // Approve/Reject requirement
  const handleApproval = async (requirementId) => {
    setSubmitting(true);
    setApiError("");

    try {
      await api.post(`/requirements/${requirementId}/approve`, approvalData);
      setSuccessMessage(
        `Requirement ${approvalData.action === "approve" ? "approved" : "rejected"} successfully!`,
      );
      setShowApprovalModal(false);
      setSelectedRequirement(null);
      setApprovalData({ action: "approve", remarks: "" });
      fetchRequirements(pagination.current_page);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error processing approval:", error);
      if (error.status === 422 && error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach((key) => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.message || "Failed to process approval");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Publish requirement
  const handlePublish = async (requirementId) => {
    setSubmitting(true);
    setApiError("");
    setFormErrors({});

    try {
      await api.post(`/requirements/${requirementId}/publish`, publishData);
      setSuccessMessage("Requirement published successfully!");
      setShowPublishModal(false);
      setSelectedRequirement(null);
      setPublishData({ expiry_date: "", is_urgent: false });
      fetchRequirements(pagination.current_page);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error publishing requirement:", error);
      if (error.status === 422 && error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach((key) => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.message || "Failed to publish requirement");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch organizations
  const fetchOrganizations = async (search = "") => {
    setLoadingOrgs(true);
    try {
      const params = new URLSearchParams();
      if (search) {
        params.append("search", search);
      }

      const response = await api.get(`/organizations?${params.toString()}`);
      if (response.data) {
        setOrganizations(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoadingOrgs(false);
    }
  };

  // Fetch departments
  const fetchDepartments = async (search = "") => {
    setLoadingDepts(true);
    try {
      const params = new URLSearchParams();
      if (search) {
        params.append("search", search);
      }

      const response = await api.get(`/departments?${params.toString()}`);
      if (response.data) {
        setDepartments(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoadingDepts(false);
    }
  };

  // Filter departments based on selected organization
  useEffect(() => {
    if (selectedOrganization) {
      const filtered = departments.filter(
        (dept) => dept.organization_id === selectedOrganization.id,
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments([]);
    }
  }, [selectedOrganization, departments]);

  // Search organizations with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (showOrgDropdown) {
        fetchOrganizations(orgSearchTerm);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [orgSearchTerm, showOrgDropdown]);

  // Search departments with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (showDeptDropdown) {
        fetchDepartments(deptSearchTerm);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [deptSearchTerm, showDeptDropdown]);

  // Initial fetch
  useEffect(() => {
    fetchRequirements();
    fetchOrganizations();
    fetchDepartments();
  }, []);

  // Debounce search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchRequirements(1);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterStatus, filterPriority]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle approval form change
  const handleApprovalChange = (e) => {
    const { name, value } = e.target;
    setApprovalData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle publish form change
  const handlePublishChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPublishData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle organization selection
  const handleOrganizationSelect = (org) => {
    setSelectedOrganization(org);
    setFormData((prev) => ({
      ...prev,
      organization_id: org.id,
      department_id: "",
    }));
    setSelectedDepartment(null);
    setDeptSearchTerm("");
    setOrgSearchTerm(org.name);
    setShowOrgDropdown(false);
    if (formErrors.organization_id) {
      setFormErrors((prev) => ({
        ...prev,
        organization_id: "",
      }));
    }
  };

  // Handle department selection
  const handleDepartmentSelect = (dept) => {
    setSelectedDepartment(dept);
    setFormData((prev) => ({
      ...prev,
      department_id: dept.id,
    }));
    setDeptSearchTerm(dept.name);
    setShowDeptDropdown(false);
    if (formErrors.department_id) {
      setFormErrors((prev) => ({
        ...prev,
        department_id: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.organization_id) {
      errors.organization_id = "Organization is required";
    }
    if (!formData.department_id) {
      errors.department_id = "Department is required";
    }
    if (!formData.title?.trim()) {
      errors.title = "Job title is required";
    }
    if (!formData.location?.trim()) {
      errors.location = "Location is required";
    }
    if (!formData.openings || formData.openings < 1) {
      errors.openings = "Number of openings must be at least 1";
    }
    if (!formData.employment_type) {
      errors.employment_type = "Employment type is required";
    }
    if (!formData.priority) {
      errors.priority = "Priority is required";
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
    setApiError("");
    setSuccessMessage("");

    try {
      const submitData = {
        organization_id: formData.organization_id,
        department_id: formData.department_id,
        title: formData.title.trim(),
        location: formData.location.trim(),
        openings: parseInt(formData.openings),
        employment_type: formData.employment_type,
        priority: formData.priority,
      };

      const response = await api.post("/requirements", submitData);

      setSuccessMessage("Requirement created successfully!");
      setShowModal(false);
      resetForm();

      setTimeout(() => setSuccessMessage(""), 3000);
      fetchRequirements(pagination.current_page);
    } catch (error) {
      console.error("Error submitting form:", error);

      if (error.status === 422 && error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach((key) => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.message || "Failed to create requirement");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    setSubmitting(true);
    setApiError("");

    try {
      await api.delete(`/requirements/${id}`);

      setDeleteConfirm(null);
      setSuccessMessage("Requirement deleted successfully!");

      setTimeout(() => setSuccessMessage(""), 3000);

      const newPage =
        requirements.length === 1 && pagination.current_page > 1
          ? pagination.current_page - 1
          : pagination.current_page;

      fetchRequirements(newPage);
    } catch (error) {
      console.error("Error deleting requirement:", error);
      setApiError(error.message || "Failed to delete requirement");
      setDeleteConfirm(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchRequirements(page);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      organization_id: "",
      department_id: "",
      title: "",
      location: "",
      openings: 1,
      employment_type: "permanent",
      priority: "medium",
    });
    setFormErrors({});
    setSelectedOrganization(null);
    setSelectedDepartment(null);
    setOrgSearchTerm("");
    setDeptSearchTerm("");
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get priority icon and color
  const getPriorityInfo = (priority) => {
    const info = {
      high: { icon: TrendingUp, color: "#EF4444", bgColor: "#FEE2E2" },
      medium: { icon: MinusCircle, color: "#F59E0B", bgColor: "#FEF3C7" },
      low: { icon: TrendingDown, color: "#22C55E", bgColor: "#DCFCE7" },
    };
    return info[priority] || info.medium;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      draft: "#64748B",
      pending_approval: "#F59E0B",
      approved: "#2563EB",
      published: "#22C55E",
      closed: "#64748B",
      cancelled: "#EF4444",
    };
    return colors[status] || "#64748B";
  };

  // Get available actions based on status
  const getAvailableActions = (status) => {
    const actions = {
      draft: ["submit_approval", "edit", "delete"],
      pending_approval: ["approve", "reject", "view"],
      approved: ["publish", "edit", "delete"],
      published: ["view", "close"],
      closed: ["view"],
      cancelled: ["view", "delete"],
    };
    return actions[status] || ["view"];
  };

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
            <div className="flex items-center space-x-3">
              <Briefcase className="w-6 h-6" style={{ color: "#2563EB" }} />
              <h1 className="text-2xl font-bold" style={{ color: "#0F172A" }}>
                Requirements
              </h1>
              <span
                className="px-2 py-1 text-xs rounded-full"
                style={{ backgroundColor: "#DBEAFE", color: "#2563EB" }}
              >
                Total: {pagination.total}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchRequirements(pagination.current_page)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                }}
                title="Refresh"
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  style={{ color: "#64748B" }}
                />
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                  setApiError("");
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: "#2563EB" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1D4ED8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2563EB")
                }
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Create Requirement</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Success Message */}
        {successMessage && (
          <div
            className="mb-4 p-4 rounded-lg flex items-center space-x-3"
            style={{
              backgroundColor: "#ECFDF3",
              border: "1px solid #ABEFC6",
            }}
          >
            <CheckCircle className="w-5 h-5" style={{ color: "#067647" }} />
            <span style={{ color: "#067647" }}>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {apiError && (
          <div
            className="mb-4 p-4 rounded-lg flex items-center space-x-3"
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
            }}
          >
            <AlertCircle className="w-5 h-5" style={{ color: "#DC2626" }} />
            <span style={{ color: "#DC2626" }}>{apiError}</span>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3 flex-wrap gap-2">
            {/* Search */}
            <div className="relative">
              <Search
                className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: "#94A3B8" }}
              />
              <input
                type="text"
                placeholder="Search requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  color: "#0F172A",
                  width: "250px",
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                color: "#0F172A",
              }}
            >
              <option value="all">All Status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                color: "#0F172A",
              }}
            >
              <option value="all">All Priorities</option>
              {priorityLevels.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
          >
            <Download className="w-4 h-4" style={{ color: "#64748B" }} />
            <span style={{ color: "#64748B" }}>Export</span>
          </button>
        </div>

        {/* Requirements Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderColor: "#2563EB" }}
            ></div>
          </div>
        ) : (
          <div
            className="rounded-lg overflow-hidden"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
          >
            <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead style={{ backgroundColor: "#F1F5F9" }}>
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium"
                      style={{ color: "#64748B" }}
                    >
                      ID
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium"
                      style={{ color: "#64748B" }}
                    >
                      Title
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium"
                      style={{ color: "#64748B" }}
                    >
                      Organization
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium"
                      style={{ color: "#64748B" }}
                    >
                      Department
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium"
                      style={{ color: "#64748B" }}
                    >
                      Location
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium"
                      style={{ color: "#64748B" }}
                    >
                      Openings
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium"
                      style={{ color: "#64748B" }}
                    >
                      Type
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium"
                      style={{ color: "#64748B" }}
                    >
                      Priority
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium"
                      style={{ color: "#64748B" }}
                    >
                      Status
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium"
                      style={{ color: "#64748B" }}
                    >
                      Created
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium"
                      style={{ color: "#64748B" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requirements.length > 0 ? (
                    requirements.map((req) => {
                      const PriorityIcon = getPriorityInfo(req.priority).icon;
                      const availableActions = getAvailableActions(req.status);

                      return (
                        <tr
                          key={req.id}
                          className="border-t hover:bg-gray-50"
                          style={{ borderColor: "#E2E8F0" }}
                        >
                          <td className="px-6 py-4">
                            <span
                              className="text-sm"
                              style={{ color: "#64748B" }}
                            >
                              #{req.id}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="text-sm font-medium"
                              style={{ color: "#0F172A" }}
                            >
                              {req.title}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1">
                              <Building2
                                className="w-3 h-3"
                                style={{ color: "#2563EB" }}
                              />
                              <span
                                className="text-sm"
                                style={{ color: "#64748B" }}
                              >
                                {req.organization?.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="text-sm"
                              style={{ color: "#64748B" }}
                            >
                              {req.department?.name}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1">
                              <MapPin
                                className="w-3 h-3"
                                style={{ color: "#94A3B8" }}
                              />
                              <span
                                className="text-sm"
                                style={{ color: "#64748B" }}
                              >
                                {req.location}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="text-sm font-medium"
                              style={{ color: "#0F172A" }}
                            >
                              {req.openings}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="px-2 py-1 text-xs rounded-full"
                              style={{
                                backgroundColor:
                                  employmentTypes.find(
                                    (t) => t.value === req.employment_type,
                                  )?.color + "20" || "#F1F5F9",
                                color:
                                  employmentTypes.find(
                                    (t) => t.value === req.employment_type,
                                  )?.color || "#64748B",
                              }}
                            >
                              {req.employment_type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1">
                              <PriorityIcon
                                className="w-3 h-3"
                                style={{
                                  color: getPriorityInfo(req.priority).color,
                                }}
                              />
                              <span
                                className="text-sm"
                                style={{
                                  color: getPriorityInfo(req.priority).color,
                                }}
                              >
                                {req.priority}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="px-2 py-1 text-xs rounded-full"
                              style={{
                                backgroundColor:
                                  getStatusColor(req.status) + "20",
                                color: getStatusColor(req.status),
                              }}
                            >
                              {req.status?.replace("_", " ") || "draft"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="text-sm"
                              style={{ color: "#64748B" }}
                            >
                              {formatDate(req.created_at)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap items-center gap-2 min-w-[300px]">
                              {/* View Details */}
                              <button
                                onClick={() =>
                                  navigate(`/admin/requirements/${req.id}`)
                                }
                                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-gray-100"
                                style={{
                                  color: "#64748B",
                                  backgroundColor: "#F8FAFC",
                                  border: "1px solid #E2E8F0",
                                }}
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </button>

                              {/* Submit for Approval - Only for draft */}
                              {availableActions.includes("submit_approval") && (
                                <button
                                  onClick={() => {
                                    setSelectedRequirement(req);
                                    handleSubmitApproval(req.id);
                                  }}
                                  disabled={submitting}
                                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                  style={{
                                    backgroundColor: "#FEF3C7",
                                    color: "#F59E0B",
                                    border: "1px solid #F59E0B20",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#FDE68A")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#FEF3C7")
                                  }
                                  title="Submit for Approval"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Submit</span>
                                </button>
                              )}

                              {/* Approve/Reject - Only for pending_approval */}
                              {availableActions.includes("approve") && (
                                <button
                                  onClick={() => {
                                    setSelectedRequirement(req);
                                    setShowApprovalModal(true);
                                  }}
                                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                  style={{
                                    backgroundColor: "#DBEAFE",
                                    color: "#2563EB",
                                    border: "1px solid #2563EB20",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#BFDBFE")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#DBEAFE")
                                  }
                                  title="Approve/Reject"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span>Review</span>
                                </button>
                              )}

                              {/* Publish - Only for approved */}
                              {availableActions.includes("publish") && (
                                <button
                                  onClick={() => {
                                    setSelectedRequirement(req);
                                    setShowPublishModal(true);
                                  }}
                                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                  style={{
                                    backgroundColor: "#DCFCE7",
                                    color: "#22C55E",
                                    border: "1px solid #22C55E20",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#BBF7D0")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#DCFCE7")
                                  }
                                  title="Publish"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                  <span>Publish</span>
                                </button>
                              )}

                              {/* Edit - Only for draft and approved */}
                              {/* {availableActions.includes("edit") && (
                                <button
                                  onClick={() => {
                                    // Handle edit
                                  }}
                                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                  style={{
                                    backgroundColor: "#F1F5F9",
                                    color: "#64748B",
                                    border: "1px solid #E2E8F0",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#E2E8F0")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#F1F5F9")
                                  }
                                  title="Edit"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                              )} */}

                              {/* Delete - Only for draft, approved, cancelled */}
                              {/* {availableActions.includes("delete") && (
                                <button
                                  onClick={() => setDeleteConfirm(req.id)}
                                  disabled={submitting}
                                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                  style={{
                                    backgroundColor: "#FEE2E2",
                                    color: "#EF4444",
                                    border: "1px solid #EF444420",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#FECACA")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#FEE2E2")
                                  }
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              )} */}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="11" className="px-6 py-8 text-center">
                        <Briefcase
                          className="w-12 h-12 mx-auto mb-3"
                          style={{ color: "#94A3B8" }}
                        />
                        <p style={{ color: "#94A3B8" }}>
                          No requirements found
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div
                className="px-6 py-4 border-t flex items-center justify-between"
                style={{ borderColor: "#E2E8F0" }}
              >
                <div className="text-sm" style={{ color: "#64748B" }}>
                  Showing {pagination.from || 0} to {pagination.to || 0} of{" "}
                  {pagination.total} requirements
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handlePageChange(pagination.current_page - 1)
                    }
                    disabled={pagination.current_page === 1 || loading}
                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <ChevronLeft
                      className="w-4 h-4"
                      style={{ color: "#64748B" }}
                    />
                  </button>

                  <div className="flex items-center space-x-1">
                    {[...Array(pagination.last_page)].map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === pagination.last_page ||
                        (pageNumber >= pagination.current_page - 1 &&
                          pageNumber <= pagination.current_page + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            disabled={loading}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              pagination.current_page === pageNumber
                                ? "text-white"
                                : ""
                            }`}
                            style={{
                              backgroundColor:
                                pagination.current_page === pageNumber
                                  ? "#2563EB"
                                  : "#F8FAFC",
                              color:
                                pagination.current_page === pageNumber
                                  ? "#FFFFFF"
                                  : "#64748B",
                              border: "1px solid #E2E8F0",
                            }}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === pagination.current_page - 2 ||
                        pageNumber === pagination.current_page + 2
                      ) {
                        return (
                          <span key={pageNumber} style={{ color: "#94A3B8" }}>
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() =>
                      handlePageChange(pagination.current_page + 1)
                    }
                    disabled={
                      pagination.current_page === pagination.last_page ||
                      loading
                    }
                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <ChevronRight
                      className="w-4 h-4"
                      style={{ color: "#64748B" }}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Create Requirement Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div
                className="fixed inset-0 bg-black/50"
                onClick={() => !submitting && setShowModal(false)}
              ></div>

              <div
                className="relative bg-white rounded-lg w-full max-w-2xl p-6"
                style={{
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#0F172A" }}
                  >
                    Create New Requirement
                  </h3>
                  <button
                    onClick={() => !submitting && setShowModal(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                    disabled={submitting}
                  >
                    <X className="w-5 h-5" style={{ color: "#64748B" }} />
                  </button>
                </div>

                {/* Modal Error Message */}
                {apiError && (
                  <div
                    className="mb-4 p-3 rounded-lg flex items-center space-x-2"
                    style={{
                      backgroundColor: "#FEF2F2",
                      border: "1px solid #FECACA",
                    }}
                  >
                    <AlertCircle
                      className="w-4 h-4"
                      style={{ color: "#DC2626" }}
                    />
                    <span className="text-sm" style={{ color: "#DC2626" }}>
                      {apiError}
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Organization Selection */}
                    <div className="relative">
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "#0F172A" }}
                      >
                        Organization *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={orgSearchTerm}
                          onChange={(e) => {
                            setOrgSearchTerm(e.target.value);
                            setShowOrgDropdown(true);
                            if (selectedOrganization) {
                              setSelectedOrganization(null);
                              setFormData((prev) => ({
                                ...prev,
                                organization_id: "",
                                department_id: "",
                              }));
                            }
                          }}
                          onFocus={() => setShowOrgDropdown(true)}
                          placeholder="Search organization..."
                          disabled={submitting}
                          className="w-full px-3 py-2 rounded-lg text-sm"
                          style={{
                            backgroundColor: "#FFFFFF",
                            border: `1px solid ${formErrors.organization_id ? "#EF4444" : "#E2E8F0"}`,
                            color: "#0F172A",
                          }}
                        />
                        {loadingOrgs && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div
                              className="animate-spin rounded-full h-4 w-4 border-b-2"
                              style={{ borderColor: "#2563EB" }}
                            ></div>
                          </div>
                        )}
                      </div>

                      {/* Organization Dropdown */}
                      {showOrgDropdown && (
                        <div
                          className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border max-h-60 overflow-y-auto"
                          style={{ borderColor: "#E2E8F0" }}
                        >
                          {organizations.length > 0 ? (
                            organizations.map((org) => (
                              <button
                                key={org.id}
                                type="button"
                                onClick={() => handleOrganizationSelect(org)}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                              >
                                <div>
                                  <span
                                    className="text-sm font-medium"
                                    style={{ color: "#0F172A" }}
                                  >
                                    {org.name}
                                  </span>
                                  <span
                                    className="text-xs ml-2 px-1.5 py-0.5 rounded-full"
                                    style={{
                                      backgroundColor:
                                        org.type === "government"
                                          ? "#DBEAFE"
                                          : org.type === "private"
                                            ? "#CCFBF1"
                                            : org.type === "consultancy"
                                              ? "#EDE9FE"
                                              : "#FEF3C7",
                                      color:
                                        org.type === "government"
                                          ? "#2563EB"
                                          : org.type === "private"
                                            ? "#14B8A6"
                                            : org.type === "consultancy"
                                              ? "#8B5CF6"
                                              : "#F59E0B",
                                    }}
                                  >
                                    {org.type}
                                  </span>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div
                              className="px-3 py-2 text-sm"
                              style={{ color: "#94A3B8" }}
                            >
                              No organizations found
                            </div>
                          )}
                        </div>
                      )}

                      {formErrors.organization_id && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: "#EF4444" }}
                        >
                          {formErrors.organization_id}
                        </p>
                      )}
                    </div>

                    {/* Department Selection */}
                    <div className="relative">
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "#0F172A" }}
                      >
                        Department *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={deptSearchTerm}
                          onChange={(e) => {
                            setDeptSearchTerm(e.target.value);
                            setShowDeptDropdown(true);
                          }}
                          onFocus={() => setShowDeptDropdown(true)}
                          placeholder={
                            selectedOrganization
                              ? "Search department..."
                              : "Select organization first"
                          }
                          disabled={!selectedOrganization || submitting}
                          className="w-full px-3 py-2 rounded-lg text-sm"
                          style={{
                            backgroundColor: !selectedOrganization
                              ? "#F8FAFC"
                              : "#FFFFFF",
                            border: `1px solid ${formErrors.department_id ? "#EF4444" : "#E2E8F0"}`,
                            color: "#0F172A",
                          }}
                        />
                        {loadingDepts && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div
                              className="animate-spin rounded-full h-4 w-4 border-b-2"
                              style={{ borderColor: "#2563EB" }}
                            ></div>
                          </div>
                        )}
                      </div>

                      {/* Department Dropdown */}
                      {showDeptDropdown && selectedOrganization && (
                        <div
                          className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border max-h-60 overflow-y-auto"
                          style={{ borderColor: "#E2E8F0" }}
                        >
                          {filteredDepartments.length > 0 ? (
                            filteredDepartments.map((dept) => (
                              <button
                                key={dept.id}
                                type="button"
                                onClick={() => handleDepartmentSelect(dept)}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50"
                              >
                                <span
                                  className="text-sm"
                                  style={{ color: "#0F172A" }}
                                >
                                  {dept.name}
                                </span>
                              </button>
                            ))
                          ) : (
                            <div
                              className="px-3 py-2 text-sm"
                              style={{ color: "#94A3B8" }}
                            >
                              No departments found for this organization
                            </div>
                          )}
                        </div>
                      )}

                      {formErrors.department_id && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: "#EF4444" }}
                        >
                          {formErrors.department_id}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Selected Organization Preview */}
                  {selectedOrganization && (
                    <div
                      className="p-3 rounded-lg"
                      style={{
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <p
                        className="text-xs font-medium mb-1"
                        style={{ color: "#64748B" }}
                      >
                        Selected Organization:
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Building2
                            className="w-4 h-4"
                            style={{ color: "#2563EB" }}
                          />
                          <span
                            className="text-sm font-medium"
                            style={{ color: "#0F172A" }}
                          >
                            {selectedOrganization.name}
                          </span>
                        </div>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor:
                              selectedOrganization.type === "government"
                                ? "#DBEAFE"
                                : selectedOrganization.type === "private"
                                  ? "#CCFBF1"
                                  : selectedOrganization.type === "consultancy"
                                    ? "#EDE9FE"
                                    : "#FEF3C7",
                            color:
                              selectedOrganization.type === "government"
                                ? "#2563EB"
                                : selectedOrganization.type === "private"
                                  ? "#14B8A6"
                                  : selectedOrganization.type === "consultancy"
                                    ? "#8B5CF6"
                                    : "#F59E0B",
                          }}
                        >
                          {selectedOrganization.type}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Selected Department Preview */}
                  {selectedDepartment && (
                    <div
                      className="p-3 rounded-lg"
                      style={{
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <p
                        className="text-xs font-medium mb-1"
                        style={{ color: "#64748B" }}
                      >
                        Selected Department:
                      </p>
                      <div className="flex items-center space-x-2">
                        <Users
                          className="w-4 h-4"
                          style={{ color: "#14B8A6" }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "#0F172A" }}
                        >
                          {selectedDepartment.name}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Job Title */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "#0F172A" }}
                    >
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: `1px solid ${formErrors.title ? "#EF4444" : "#E2E8F0"}`,
                        color: "#0F172A",
                      }}
                      placeholder="e.g., Senior Software Engineer"
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-xs" style={{ color: "#EF4444" }}>
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Location */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "#0F172A" }}
                      >
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="w-full px-3 py-2 rounded-lg text-sm"
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: `1px solid ${formErrors.location ? "#EF4444" : "#E2E8F0"}`,
                          color: "#0F172A",
                        }}
                        placeholder="e.g., Mumbai, Bangalore, Remote"
                      />
                      {formErrors.location && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: "#EF4444" }}
                        >
                          {formErrors.location}
                        </p>
                      )}
                    </div>

                    {/* Number of Openings */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "#0F172A" }}
                      >
                        Number of Openings *
                      </label>
                      <input
                        type="number"
                        name="openings"
                        value={formData.openings}
                        onChange={handleInputChange}
                        disabled={submitting}
                        min="1"
                        className="w-full px-3 py-2 rounded-lg text-sm"
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: `1px solid ${formErrors.openings ? "#EF4444" : "#E2E8F0"}`,
                          color: "#0F172A",
                        }}
                      />
                      {formErrors.openings && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: "#EF4444" }}
                        >
                          {formErrors.openings}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Employment Type */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "#0F172A" }}
                      >
                        Employment Type *
                      </label>
                      <select
                        name="employment_type"
                        value={formData.employment_type}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="w-full px-3 py-2 rounded-lg text-sm"
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: `1px solid ${formErrors.employment_type ? "#EF4444" : "#E2E8F0"}`,
                          color: "#0F172A",
                        }}
                      >
                        {employmentTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {formErrors.employment_type && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: "#EF4444" }}
                        >
                          {formErrors.employment_type}
                        </p>
                      )}
                    </div>

                    {/* Priority */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "#0F172A" }}
                      >
                        Priority *
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="w-full px-3 py-2 rounded-lg text-sm"
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: `1px solid ${formErrors.priority ? "#EF4444" : "#E2E8F0"}`,
                          color: "#0F172A",
                        }}
                      >
                        {priorityLevels.map((priority) => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                      {formErrors.priority && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: "#EF4444" }}
                        >
                          {formErrors.priority}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => !submitting && setShowModal(false)}
                      disabled={submitting}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                      style={{ backgroundColor: "#2563EB" }}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Create Requirement</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Approval Modal */}
        {showApprovalModal && selectedRequirement && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div
                className="fixed inset-0 bg-black/50"
                onClick={() => !submitting && setShowApprovalModal(false)}
              ></div>

              <div
                className="relative bg-white rounded-lg w-full max-w-md p-6"
                style={{
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#0F172A" }}
                  >
                    Review Requirement
                  </h3>
                  <button
                    onClick={() => !submitting && setShowApprovalModal(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                    disabled={submitting}
                  >
                    <X className="w-5 h-5" style={{ color: "#64748B" }} />
                  </button>
                </div>

                <div
                  className="mb-4 p-3 rounded-lg"
                  style={{ backgroundColor: "#F8FAFC" }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#0F172A" }}
                  >
                    {selectedRequirement.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                    {selectedRequirement.organization?.name} -{" "}
                    {selectedRequirement.department?.name}
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleApproval(selectedRequirement.id);
                  }}
                >
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#0F172A" }}
                    >
                      Action *
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="action"
                          value="approve"
                          checked={approvalData.action === "approve"}
                          onChange={handleApprovalChange}
                          className="w-4 h-4"
                        />
                        <span style={{ color: "#22C55E" }}>Approve</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="action"
                          value="reject"
                          checked={approvalData.action === "reject"}
                          onChange={handleApprovalChange}
                          className="w-4 h-4"
                        />
                        <span style={{ color: "#EF4444" }}>Reject</span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "#0F172A" }}
                    >
                      Remarks
                    </label>
                    <textarea
                      name="remarks"
                      value={approvalData.remarks}
                      onChange={handleApprovalChange}
                      rows="3"
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        color: "#0F172A",
                      }}
                      placeholder="Add your remarks here..."
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowApprovalModal(false)}
                      disabled={submitting}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                      style={{
                        backgroundColor:
                          approvalData.action === "approve"
                            ? "#22C55E"
                            : "#EF4444",
                      }}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <ThumbsUp className="w-4 h-4" />
                          <span>
                            {approvalData.action === "approve"
                              ? "Approve"
                              : "Reject"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Publish Modal */}
        {showPublishModal && selectedRequirement && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div
                className="fixed inset-0 bg-black/50"
                onClick={() => !submitting && setShowPublishModal(false)}
              ></div>

              <div
                className="relative bg-white rounded-lg w-full max-w-md p-6"
                style={{
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#0F172A" }}
                  >
                    Publish Requirement
                  </h3>
                  <button
                    onClick={() => !submitting && setShowPublishModal(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                    disabled={submitting}
                  >
                    <X className="w-5 h-5" style={{ color: "#64748B" }} />
                  </button>
                </div>

                <div
                  className="mb-4 p-3 rounded-lg"
                  style={{ backgroundColor: "#F8FAFC" }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#0F172A" }}
                  >
                    {selectedRequirement.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                    {selectedRequirement.organization?.name} -{" "}
                    {selectedRequirement.department?.name}
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePublish(selectedRequirement.id);
                  }}
                >
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "#0F172A" }}
                    >
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      name="expiry_date"
                      value={publishData.expiry_date}
                      onChange={handlePublishChange}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: `1px solid ${formErrors.expiry_date ? "#EF4444" : "#E2E8F0"}`,
                        color: "#0F172A",
                      }}
                      required
                    />
                    {formErrors.expiry_date && (
                      <p className="mt-1 text-xs" style={{ color: "#EF4444" }}>
                        {formErrors.expiry_date}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="is_urgent"
                        checked={publishData.is_urgent}
                        onChange={handlePublishChange}
                        className="w-4 h-4 rounded"
                        style={{ color: "#2563EB" }}
                      />
                      <span style={{ color: "#0F172A" }}>Mark as Urgent</span>
                    </label>
                    {publishData.is_urgent && (
                      <div
                        className="mt-2 flex items-center space-x-1 text-xs"
                        style={{ color: "#EF4444" }}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>
                          This will highlight the requirement as urgent
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowPublishModal(false)}
                      disabled={submitting}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                      style={{ backgroundColor: "#2563EB" }}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4" />
                          <span>Publish</span>
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
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => !submitting && setDeleteConfirm(null)}
              ></div>

              <div className="relative bg-white rounded-lg w-full max-w-md p-6">
                <div className="text-center">
                  <AlertCircle
                    className="w-12 h-12 mx-auto mb-4"
                    style={{ color: "#EF4444" }}
                  />
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "#0F172A" }}
                  >
                    Confirm Delete
                  </h3>
                  <p className="text-sm mb-6" style={{ color: "#64748B" }}>
                    Are you sure you want to delete this requirement? This
                    action cannot be undone.
                  </p>

                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      disabled={submitting}
                      className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                      style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(deleteConfirm)}
                      disabled={submitting}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                      style={{ backgroundColor: "#EF4444" }}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        "Delete"
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

export default HandleRequirements;
