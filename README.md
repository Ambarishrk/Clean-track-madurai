# Clean-Track | Madurai Municipal Sanitation Governance

Clean-Track is a unified dashboard designed for the Madurai City Municipal Corporation to monitor sanitation metrics and achieve Swachh Bharat Mission 2.0 (SBM 2.0) "Garbage Free City" (GFC) certification.

## User Roles & Access

Access to the dashboard is scoped by role. Each role sees a different version of the Command Center:

1.  **Municipal Commissioner (Superadmin)**
    - **Visibility**: All 100 wards and all 4 zones.
    - **Actions**: Monitor city-wide KPIs, track GFC readiness, view predictive festival surge alerts, and generate official MoHUA reports.
2.  **Zonal Officer**
    - **Visibility**: Only the wards within their assigned Zone (North, South, East, or West).
    - **Actions**: Manage ward performance in their zone, create/assign corrective tasks, and escalate issues.
3.  **Ward Supervisor**
    - **Visibility**: Only their specific assigned Ward.
    - **Actions**: Submit daily field audits (KPIs) with photo evidence and manage local ward tasks.

## Test Credentials

If you have run the seed script (`npm run seed`), you can log in with the following accounts (all use the same password you set in the Firebase Console, or you can create new ones via the `/signup` page):

| Role | Email | Scope |
| :--- | :--- | :--- |
| Commissioner | `commissioner@cleantrack.in` | City-Wide |
| Zonal Officer | `north@cleantrack.in` | North Zone |
| Ward Supervisor | `ward1@cleantrack.in` | Ward W001 |

## Getting Started

1.  **Authentication**: Enable Email/Password and Google Sign-In in your Firebase Console.
2.  **Seeding**: Run `npm run seed` to populate the 100-ward grid and test metrics.
3.  **Onboarding**: Use the `/signup` page to manually provision new staff accounts.
