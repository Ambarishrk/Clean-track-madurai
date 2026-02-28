# Clean-Track | Madurai Municipal Sanitation Governance

Clean-Track is a unified dashboard designed for the Madurai City Municipal Corporation to monitor sanitation metrics and achieve Swachh Bharat Mission 2.0 (SBM 2.0) "Garbage Free City" (GFC) certification.

## User Roles & Feature Matrix

The application enforces strict role-based access control (RBAC). Below is the breakdown of what each person can do:

### 1. Municipal Commissioner (Superadmin)
*   **Scope**: City-Wide (All 100 Wards / 4 Zones).
*   **Key Features**:
    *   **City Command**: Monitor aggregated KPIs (Segregation, D2D, Hygiene, Processing) for the entire city.
    *   **Ward Heatmap**: Visual 10-by-10 grid of all wards colored by performance.
    *   **GFC Tracker**: Manage all 49 MoHUA certification indicators and view composite readiness scores.
    *   **Staff Management**: Onboard new officers, assign roles, and manage permissions.
    *   **Official Reporting**: Generate and download municipal reports for state/central government.
    *   **Global Alerts**: Monitor all critical system alerts and escalations.

### 2. Zonal Officer
*   **Scope**: Zonal (assigned North, South, East, or West).
*   **Key Features**:
    *   **Zonal Command**: Filtered view of the dashboard showing only wards within their jurisdiction.
    *   **Task Management**: Create and assign corrective action tasks to Ward Supervisors.
    *   **Alert Resolution**: Address alerts triggered by KPI breaches in their zone.
    *   **Issue Escalation**: Raise critical zonal issues directly to the Commissioner.

### 3. Ward Supervisor
*   **Scope**: Local (assigned to a specific Ward ID).
*   **Key Features**:
    *   **Daily Field Audits**: Submit daily metrics for segregation and collection with photo evidence.
    *   **Task Execution**: Receive and mark tasks as "In Resolution" or "Completed" for their ward.
    *   **Ward History**: View 30-day performance trends to identify local bottlenecks.
    *   **Local Alerts**: Monitor alerts specifically affecting their assigned ward.

## Test Credentials

Log in with these pre-seeded accounts (password set in Firebase Console):

| Role | Email | Scope |
| :--- | :--- | :--- |
| Commissioner | `commissioner@cleantrack.in` | City-Wide |
| Zonal Officer | `north@cleantrack.in` | North Zone |
| Ward Supervisor | `ward1@cleantrack.in` | Ward W001 |

## Getting Started

1.  **Authentication**: Enable Email/Password and Google Sign-In in your Firebase Console.
2.  **Seeding**: Run `npm run seed` to populate the 100-ward grid and test metrics.
3.  **Onboarding**: Use the `/signup` page to manually provision new staff accounts.
