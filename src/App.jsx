import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AppLayout from "./layout/AppLayout";
import LandingPage from "./pages/landing/LandingPage";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import SiteSettings from "./pages/admin/settings/SiteSettings";
import AdminProfile from "./pages/admin/profile/AdminProfile";
import { Toaster } from "react-hot-toast";
import SessionMonitor from "./component/SessionMonitor";
import HandleOrganizations from "./pages/admin/organizations/HandleOrganizations";
import HandleOrganizationsDetails from "./pages/admin/organizations/HandleOrganizationsDetails";
import HandleDepartments from "./pages/admin/organizations/HandleDepartments";
import HandleDepartmentsDetails from "./pages/admin/organizations/HandleDepartmentsDetails";
import HandleRequirements from "./pages/admin/organizations/HandleRequirements";
import HandleRequirementsDetails from "./pages/admin/organizations/HandleRequirementsDetails";
import HandleOrgUser from "./pages/org/HandleOrgUser";
import HandleCandidates from "./pages/admin/organizations/HandleCandidates";
import HandleViewCandidates from "./pages/admin/organizations/HandleViewCandidates";
import HandleListOfFollowUps from "./pages/admin/organizations/HandleListOfFollowUps";
import HandleApplication from "./pages/admin/organizations/HandleApplication";
import HandleDispositionOptions from "./pages/admin/organizations/HandleDispositionOptions";
import HandleInterviews from "./pages/admin/organizations/HandleInterviews";
import JobsPage from "./pages/jobos/JobsPage";
import JobDetailsPage from "./pages/jobos/JobDetailsPage";
import CompaniesPage from "./pages/companies/CompaniesPage";
import AboutPage from "./pages/about/AboutPage";
import ContactPage from "./pages/contact/ContactPage";

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <SessionMonitor>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<AppLayout />}>
            <Route index path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<JobsPage/>}/>
            <Route path="/jobs/:id" element={<JobDetailsPage/>}/>
            <Route path="/companies" element={<CompaniesPage/>}/>
            <Route path="/about" element={<AboutPage/>}/>
            <Route path="/contact" element={<ContactPage/>}/>
          </Route>

          {/* Admin Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            <Route path="organizations" element={<HandleOrganizations/>}/>
            <Route path="organizations/:id" element={<HandleOrganizationsDetails/>}/>

            <Route path="departments" element={<HandleDepartments/>}/>
            <Route path="departments/:id" element={<HandleDepartmentsDetails/>}/>

            <Route path="requirements" element={<HandleRequirements/>}/>
            <Route path="requirements/:id" element={<HandleRequirementsDetails/>}/>

            <Route path="users" element={<HandleOrgUser/>}/>
            <Route path="candidates" element={<HandleCandidates/>}/>
            <Route path="candidates/:id" element={<HandleViewCandidates/>}/>
            <Route path="follow-ups" element={<HandleListOfFollowUps/>}/>
            <Route path="applications" element={<HandleApplication/>}/>
            <Route path="disposition-options" element={<HandleDispositionOptions/>}/>
            <Route path="interviews" element={<HandleInterviews/>}/>



            {/* Additional admin routes can be added here */}
            <Route path="site-settings" element={<SiteSettings />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Routes>
      </SessionMonitor>
    </Router>
  );
};

export default App;
