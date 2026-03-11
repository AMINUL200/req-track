import React, { useState, useEffect } from "react";
import {
  Building2,
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
  Users,
  Briefcase,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { api } from "../../../utils/app";
import { useNavigate } from "react-router-dom";

const HandleDepartments = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [selectedDept, setSelectedDept] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOrg, setFilterOrg] = useState("all");
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
    name: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Organization search state
  const [orgSearchTerm, setOrgSearchTerm] = useState("");
  const [orgSearchResults, setOrgSearchResults] = useState([]);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  // Fetch departments
  const fetchDepartments = async (page = 1) => {
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

      if (filterOrg !== "all") {
        params.append("organization_id", filterOrg);
      }

      const response = await api.get(`/departments?${params.toString()}`);

      if (response.data) {
        setDepartments(response.data.data || []);
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
      console.error("Error fetching departments:", error);
      setApiError(error.message || "Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  // Fetch organizations for filter and selection
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
        setOrgSearchResults(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoadingOrgs(false);
    }
  };

  // Search organizations for dropdown
  const searchOrganizations = async (search) => {
    setOrgSearchTerm(search);
    setLoadingOrgs(true);
    try {
      const params = new URLSearchParams();
      if (search) {
        params.append("search", search);
      }

      const response = await api.get(`/organizations?${params.toString()}`);
      if (response.data) {
        setOrgSearchResults(response.data.data || []);
      }
    } catch (error) {
      console.error("Error searching organizations:", error);
    } finally {
      setLoadingOrgs(false);
    }
  };

  // Debounced organization search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (showOrgDropdown) {
        searchOrganizations(orgSearchTerm);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [orgSearchTerm, showOrgDropdown]);

  // Initial fetch
  useEffect(() => {
    fetchDepartments();
    fetchOrganizations();
  }, []);

  // Debounce search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchDepartments(1);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterOrg]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
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
    }));
    setOrgSearchTerm(org.name);
    setShowOrgDropdown(false);
    // Clear error
    if (formErrors.organization_id) {
      setFormErrors((prev) => ({
        ...prev,
        organization_id: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.organization_id) {
      errors.organization_id = "Organization is required";
    }
    if (!formData.name?.trim()) {
      errors.name = "Department name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Department name must be at least 2 characters";
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
        name: formData.name.trim(),
      };

      console.log("Submitting data:", submitData);

      let response;
      if (modalMode === "add") {
        response = await api.post("/departments", submitData);
        setSuccessMessage("Department created successfully!");
      } else {
        response = await api.put(`/departments/${selectedDept.id}`, submitData);
        setSuccessMessage("Department updated successfully!");
      }

      setShowModal(false);
      resetForm();

      setTimeout(() => setSuccessMessage(""), 3000);
      fetchDepartments(pagination.current_page);
    } catch (error) {
      console.error("Error submitting form:", error);

      if (error.status === 422 && error.data?.errors) {
        const backendErrors = {};
        Object.keys(error.data.errors).forEach((key) => {
          backendErrors[key] = error.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setApiError(error.message || "Failed to save department");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit click
  const handleEdit = (dept) => {
    setSelectedDept(dept);
    setSelectedOrganization(dept.organization);
    setFormData({
      organization_id: dept.organization_id,
      name: dept.name,
    });
    setOrgSearchTerm(dept.organization?.name || "");
    setModalMode("edit");
    setShowModal(true);
    setApiError("");
  };

  // Handle delete
  const handleDelete = async (id) => {
    setSubmitting(true);
    setApiError("");

    try {
      await api.delete(`/departments/${id}`);

      setDeleteConfirm(null);
      setSuccessMessage("Department deleted successfully!");

      setTimeout(() => setSuccessMessage(""), 3000);

      const newPage =
        departments.length === 1 && pagination.current_page > 1
          ? pagination.current_page - 1
          : pagination.current_page;

      fetchDepartments(newPage);
    } catch (error) {
      console.error("Error deleting department:", error);
      setApiError(error.message || "Failed to delete department");
      setDeleteConfirm(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchDepartments(page);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      organization_id: "",
      name: "",
    });
    setFormErrors({});
    setSelectedDept(null);
    setSelectedOrganization(null);
    setOrgSearchTerm("");
    setModalMode("add");
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get organization name by ID
  const getOrganizationName = (orgId) => {
    const org = organizations.find((o) => o.id === orgId);
    return org ? org.name : "Unknown";
  };

  const handleDetails = (id) => {
    navigate(`/admin/departments/${id}`);
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
                Departments
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
                onClick={() => fetchDepartments(pagination.current_page)}
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
                <span className="text-sm font-medium">Add Department</span>
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
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search
                className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: "#94A3B8" }}
              />
              <input
                type="text"
                placeholder="Search departments..."
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

            {/* Organization Filter */}
            <select
              value={filterOrg}
              onChange={(e) => setFilterOrg(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                color: "#0F172A",
              }}
            >
              <option value="all">All Organizations</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
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

        {/* Departments Table */}
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
            <div className="overflow-x-auto">
              <table className="w-full">
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
                      Department Name
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
                      Organization Type
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
                  {departments.length > 0 ? (
                    departments.map((dept) => (
                      <tr
                        key={dept.id}
                        className="border-t hover:bg-gray-50"
                        style={{ borderColor: "#E2E8F0" }}
                      >
                        <td className="px-6 py-4">
                          <span
                            className="text-sm"
                            style={{ color: "#64748B" }}
                          >
                            #{dept.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="text-sm font-medium"
                            style={{ color: "#0F172A" }}
                          >
                            {dept.name}
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
                              {dept.organization?.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-2 py-1 text-xs rounded-full"
                            style={{
                              backgroundColor:
                                dept.organization?.type === "government"
                                  ? "#DBEAFE"
                                  : dept.organization?.type === "private"
                                    ? "#CCFBF1"
                                    : dept.organization?.type === "consultancy"
                                      ? "#EDE9FE"
                                      : "#FEF3C7",
                              color:
                                dept.organization?.type === "government"
                                  ? "#2563EB"
                                  : dept.organization?.type === "private"
                                    ? "#14B8A6"
                                    : dept.organization?.type === "consultancy"
                                      ? "#8B5CF6"
                                      : "#F59E0B",
                            }}
                          >
                            {dept.organization?.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="text-sm"
                            style={{ color: "#64748B" }}
                          >
                            {formatDate(dept.created_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(dept)}
                              className="p-1 rounded hover:bg-gray-100"
                              title="Edit"
                              disabled={submitting}
                            >
                              <Edit
                                className="w-4 h-4"
                                style={{ color: "#64748B" }}
                              />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(dept.id)}
                              className="p-1 rounded hover:bg-gray-100"
                              title="Delete"
                              disabled={submitting}
                            >
                              <Trash2
                                className="w-4 h-4"
                                style={{ color: "#EF4444" }}
                              />
                            </button>
                            <button
                              onClick={() => handleDetails(dept.id)}
                              className="p-1 rounded hover:bg-gray-100"
                              title="View Details"
                            >
                              <Eye
                                className="w-4 h-4"
                                style={{ color: "#64748B" }}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <Briefcase
                          className="w-12 h-12 mx-auto mb-3"
                          style={{ color: "#94A3B8" }}
                        />
                        <p style={{ color: "#94A3B8" }}>No departments found</p>
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
                  {pagination.total} departments
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

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div
                className="fixed inset-0 bg-black/50"
                onClick={() => !submitting && setShowModal(false)}
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
                    {modalMode === "add"
                      ? "Add New Department"
                      : "Edit Department"}
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

                <form onSubmit={handleSubmit}>
                  {/* Organization Selection */}
                  <div className="mb-4 relative">
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
                        {orgSearchResults.length > 0 ? (
                          orgSearchResults.map((org) => (
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
                              <Mail
                                className="w-3 h-3"
                                style={{ color: "#94A3B8" }}
                              />
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
                      <p className="mt-1 text-xs" style={{ color: "#EF4444" }}>
                        {formErrors.organization_id}
                      </p>
                    )}

                    {/* Selected Organization Preview */}
                    {selectedOrganization && (
                      <div
                        className="mt-2 p-2 rounded-lg"
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
                                    : selectedOrganization.type ===
                                        "consultancy"
                                      ? "#EDE9FE"
                                      : "#FEF3C7",
                              color:
                                selectedOrganization.type === "government"
                                  ? "#2563EB"
                                  : selectedOrganization.type === "private"
                                    ? "#14B8A6"
                                    : selectedOrganization.type ===
                                        "consultancy"
                                      ? "#8B5CF6"
                                      : "#F59E0B",
                            }}
                          >
                            {selectedOrganization.type}
                          </span>
                        </div>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "#64748B" }}
                        >
                          {selectedOrganization.email}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Department Name */}
                  <div className="mb-6">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "#0F172A" }}
                    >
                      Department Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: `1px solid ${formErrors.name ? "#EF4444" : "#E2E8F0"}`,
                        color: "#0F172A",
                      }}
                      placeholder="Enter department name (e.g., IT, HR, Finance)"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-xs" style={{ color: "#EF4444" }}>
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  

                  {/* Buttons */}
                  <div className="flex items-center justify-end space-x-3">
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
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>
                            {modalMode === "add" ? "Create" : "Update"}
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
                    Are you sure you want to delete this department? This action
                    cannot be undone.
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

export default HandleDepartments;
