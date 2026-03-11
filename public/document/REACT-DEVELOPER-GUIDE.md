
# ReqTrack – React Developer Guide

This document describes what the **React frontend** should build and how it talks to the Laravel API. Use it alongside the [API Documentation](./API-DOCUMENTATION.md) for request/response details.

---

## 1. What You Are Building

A **Requirement CRM & Recruitment Management** web app used by:

- **Super Admin** – Manage organizations and system config
- **Organization Admin** – Approve requirements, manage HR access
- **HR / Recruiter** – Create jobs, manage candidates, follow-ups, interviews
- **Department Manager** – Raise manpower requirements, track approval
- **Vendor / Consultancy** – Submit candidates, track status
- **Interview Panel** – Submit interview feedback
- **Candidate (public)** – Browse jobs and apply

The API is Laravel (Sanctum). The React app will consume it with `Authorization: Bearer <token>` for all authenticated routes.

---

## 2. Auth & API Client Setup

- **Base URL:** `http://localhost:8000/api` (or your `.env` value).
- **Login:** `POST /api/login` with `{ email, password }` → store `token` and optionally `user` (with `organization`, `role`).
- **Register:** `POST /api/register` with `name`, `email`, `password`, `password_confirmation`, optional `phone`, `organization_id`, `role_id`.
- **Logout:** `POST /api/logout` with Bearer token.
- **Current user:** `GET /api/user` with Bearer token.

**Suggested React flow:**

- After login/register, save `token` (e.g. in memory + localStorage/cookie) and set default header `Authorization: Bearer <token>` for axios/fetch.
- On app load, optionally call `GET /api/user` to restore session; if 401, clear token and redirect to login.
- Role/organization from `user.role.slug` and `user.organization_id` drive which screens and API calls are allowed.

---

## 3. Screens & Features (What to Build)

### 3.1 Public (no login)

- **Job listing** – List published jobs: `GET /api/public/jobs` (optional query: `expiry=1`, `per_page`).
- **Job detail** – Single job: `GET /api/public/jobs/{id}`.
- **Apply** – Form (name, phone, email, etc.) → `POST /api/public/jobs/{id}/apply`. Show success or error (e.g. already applied, closed, expired). Optionally send `source` (website, whatsapp, linkedin, etc.) for analytics.

### 3.2 Login / Register

- **Login** – Email + password → `POST /api/login` → store token and user, redirect by role.
- **Register** – Form → `POST /api/register`; if your product allows self-registration, optionally pass `organization_id` / `role_id` from invite or dropdown.

### 3.3 Dashboard (after login)

- **Stats** – `GET /api/dashboard/stats` → show:
  - Open requirements
  - Candidates in pipeline
  - Follow-ups due today
  - Interviews today  
  Use these for cards/widgets. All scoped to the user’s organization.

### 3.4 Organizations (Super Admin)

- **List** – `GET /api/organizations` (optional `type`).
- **Create** – Form → `POST /api/organizations`.
- **View** – `GET /api/organizations/{id}` (departments, users).
- **Edit** – `PUT /api/organizations/{id}`.
- **Delete** – `DELETE /api/organizations/{id}`.

### 3.5 Departments

- **List** – `GET /api/departments` (optional `organization_id`).
- **Create** – `POST /api/departments` (organization_id, name).
- **View / Edit / Delete** – Standard CRUD with `/api/departments/{id}`.

### 3.6 Requirements (Manpower / Jobs)

- **List** – `GET /api/requirements` (optional `organization_id`, `status`: draft, pending_approval, approved, published, closed). Show department, org, createdBy.
- **Create** – Form with all requirement fields → `POST /api/requirements` (API sets `created_by`).
- **View** – `GET /api/requirements/{id}` (approvals, applications). Show workflow and “Submit for approval” / “Approve” / “Publish” when allowed by role.
- **Edit** – `PUT /api/requirements/{id}` (draft only or as per policy).
- **Submit for approval** – Button → `POST /api/requirements/{id}/submit-approval`.
- **Approve / Reject / Return** – Form (action + remarks) → `POST /api/requirements/{id}/approve`.
- **Publish** – Form (expiry_date, is_urgent, applications_enabled) → `POST /api/requirements/{id}/publish`. After publish, show shareable URL and “Copy link / Share (WhatsApp, LinkedIn, etc.)”.

### 3.7 Candidates (CRM)

- **List** – `GET /api/candidates` (optional `organization_id`, `search`, `per_page`). Show assigned recruiter, tags.
- **Create** – Form → `POST /api/candidates` (include `tag_ids` if you have a tag selector).
- **View** – `GET /api/candidates/{id}` (applications per requirement, pipeline stage). Show timeline of applications and “Add follow-up” / “Move stage” from application list.
- **Edit** – `PUT /api/candidates/{id}` (and `tag_ids` for tags).
- **Follow-ups** – List: `GET /api/candidates/{id}/follow-ups`. Add: `POST /api/candidates/{id}/follow-ups` (date, contact_mode, notes, next_follow_up_date, disposition_option_id, etc.).

### 3.8 Applications (Candidate ↔ Requirement)

- **List** – `GET /api/applications` (optional `requirement_id`, `candidate_id`, `pipeline_stage_id`). Use for “Applications for this job” or “Applications of this candidate”.
- **Create** – When linking candidate to requirement: `POST /api/applications` (candidate_id, requirement_id, pipeline_stage_id, source, consultancy_id, cover_letter).
- **View** – `GET /api/applications/{id}` (candidate, requirement, pipeline stage, interviews). Use for application detail and scheduling interviews.
- **Move stage** – Dropdown/kanban → `POST /api/applications/{id}/move-stage` with `pipeline_stage_id`. Pipeline stages: applied → shortlisted → … → joined / rejected / hold (see API doc).

### 3.9 Follow-ups (Recruiter)

- **List** – `GET /api/follow-ups` (optional `candidate_id`, `recruiter_id`).
- **Due today** – `GET /api/follow-ups/due-today` for a “Due today” widget or list.

### 3.10 Disposition options

- **List** – `GET /api/disposition-options` (optional `organization_id`) for dropdowns when adding follow-ups (e.g. “Interested”, “Call later”, “No response”).

### 3.11 Interviews

- **List** – `GET /api/interviews` (optional `application_id`, `date`). Use for “Interviews for this application” or “Interviews today”.
- **Schedule** – Form → `POST /api/interviews` (application_id, scheduled_at, mode, panel_name, meeting_link).
- **View** – `GET /api/interviews/{id}` (application.candidate, application.requirement, feedbacks).
- **Edit** – `PUT /api/interviews/{id}` (scheduled_at, mode, status, etc.).
- **Submit feedback** – Form (ratings 1–5, recommendation: selected|rejected|hold, notes) → `POST /api/interviews/{id}/feedback`. API sets panel_member_id from auth and marks interview completed.

### 3.12 Consultancies (Vendors)

- **List** – `GET /api/consultancies` (optional `organization_id`).
- **Create** – `POST /api/consultancies`.
- **View** – `GET /api/consultancies/{id}` (applications).
- **Submit candidate** – Form (requirement_id, name, email, phone, resume_path, cover_letter) → `POST /api/consultancies/{id}/submit-candidate`. Creates/updates candidate and application with source=consultancy.

### 3.13 Custom fields (Admin)

- **List** – `GET /api/custom-field-definitions` (optional `entity_type`: requirement, candidate, follow_up, lead).
- **Create** – `POST /api/custom-field-definitions` (entity_type, field_key, label, field_type, options, is_required, etc.). Use to build dynamic forms per entity type on requirements, candidate profile, follow-up, or lead forms.

### 3.14 Users (Org Admin)

- **List** – `GET /api/users` (optional `organization_id`, `role_id`).
- **Create** – `POST /api/users` (name, email, password, organization_id, role_id).
- **View / Edit** – `GET /api/users/{id}`, `PUT /api/users/{id}`.

---

## 4. Data Shapes (for state and forms)

Use these as a guide for TypeScript interfaces or PropTypes. Exact fields come from API responses.

**User (from login/register or GET /user):**

```ts
{
  id: number;
  name: string;
  email: string;
  phone?: string;
  organization_id?: number;
  role_id?: number;
  organization?: { id, name, type, ... };
  role?: { id, name, slug };
}
```

**Requirement (job):**

```ts
{
  id: number;
  organization_id: number;
  department_id: number;
  title: string;
  location?: string;
  openings: number;
  employment_type: 'permanent' | 'contract' | 'govt_post';
  job_description?: string;
  skills?: string[];
  experience_min?: number;
  experience_max?: number;
  salary_min?: number;
  salary_max?: number;
  education?: string;
  joining_deadline?: string; // date
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'pending_approval' | 'approved' | 'published' | 'closed';
  shareable_url?: string;
  expiry_date?: string;
  is_urgent: boolean;
  applications_enabled: boolean;
  published_at?: string;
  department?: { id, name };
  organization?: { id, name };
  approvals?: Array<{ level, status, remarks, approver?: User }>;
  applications?: Application[];
}
```

**Candidate:**

```ts
{
  id: number;
  organization_id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  education?: string;
  total_experience?: number;
  current_company?: string;
  current_salary?: number;
  expected_salary?: number;
  notice_period?: string;
  skills?: string[];
  source?: string;
  assigned_recruiter_id?: number;
  assignedRecruiter?: User;
  tags?: Array<{ id, name }>;
  applications?: Application[];
}
```

**Application:**

```ts
{
  id: number;
  candidate_id: number;
  requirement_id: number;
  pipeline_stage_id: number;
  source?: string;
  consultancy_id?: number;
  cover_letter?: string;
  candidate?: Candidate;
  requirement?: Requirement;
  pipelineStage?: { id, name, slug };
  interviews?: Interview[];
}
```

**Follow-up:**

```ts
{
  id: number;
  candidate_id: number;
  requirement_id?: number;
  follow_up_date: string; // YYYY-MM-DD
  follow_up_time?: string; // HH:mm
  contact_mode?: 'call' | 'whatsapp' | 'email' | 'sms';
  discussion_notes?: string;
  candidate_response?: string;
  next_follow_up_date?: string;
  recruiter_id: number;
  disposition_option_id?: number;
  recruiter?: User;
  dispositionOption?: { id, name };
}
```

**Interview:**

```ts
{
  id: number;
  application_id: number;
  scheduled_at: string; // datetime
  mode: 'online' | 'offline';
  panel_name?: string;
  meeting_link?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  application?: { candidate, requirement };
  feedbacks?: Array<{ technical_rating, communication_rating, recommendation, notes, panelMember }>;
}
```

**Dashboard stats:**

```ts
{
  open_requirements: number;
  candidates_in_pipeline: number;
  follow_ups_due_today: number;
  interviews_today: number;
}
```

**Pagination (Laravel default):**

```ts
{
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}
```

---

## 5. Role-Based Visibility (suggested)

- **Super Admin:** Organizations, system config, custom fields, all reports.
- **Org Admin:** Dashboard, requirements (approve/publish), departments, users in org, consultancies.
- **HR / Recruiter:** Dashboard, requirements (create/edit, submit approval), candidates, applications, follow-ups, interviews (schedule + feedback), disposition options.
- **Dept Manager:** Requirements (create, view own), approval status.
- **Vendor:** Requirements (view open), submit candidate, view own submissions’ status.
- **Interview Panel:** Interviews (view, submit feedback).
- **Candidate (public):** Only public job list, job detail, apply.

Use `user.role.slug` and `user.organization_id` to show/hide menus and call only the APIs that the backend allows for that role.

---

## 6. File Uploads (resume, photo, documents)

The API currently accepts **paths** for `resume_path`, `photo_path`, and document paths (e.g. in apply form or consultancy submit). So either:

- Implement file upload in Laravel (e.g. `POST /api/upload` returning a path/URL), then send that path in the apply/candidate payloads, or  
- Keep storing files in your React app (e.g. S3/local) and send the resulting URL/path in those fields.

Align with the backend team on a single upload endpoint and response shape.

---

## 7. Postman & Environment

- Import **Postman collection:** `postman/ReqTrack-API.postman_collection.json`.
- Import **Postman environment:** `postman/ReqTrack-Local.postman_environment.json`.
- Select the **ReqTrack Local** environment, run **Auth → Login** (token is saved to the environment), then use other requests. Base URL and token are in the environment.

For more detail on every endpoint, request body, and response, see [API-DOCUMENTATION.md](./API-DOCUMENTATION.md).
