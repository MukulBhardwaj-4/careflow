===============================================================================
                    CAREFLOW AI - FRONTEND DOCUMENTATION
===============================================================================

FRONTEND OVERVIEW:
Modern, clean React frontend for CareFlow AI hospital management system.
Built with Vite, React, Redux Toolkit, Tailwind CSS, and Axios.

===============================================================================
                              TECH STACK
===============================================================================

Framework: React 19.3.1
Build Tool: Vite 8.3.5
State Management: Redux Toolkit 2.13.0
Styling: Tailwind CSS 4.3.3
HTTP Client: Axios 1.21.0
Routing: React Router 7.18.5
UI Icons: Lucide React 1.66.0
Real-time: Socket.IO Client 4.8.4
CSS Utilities: clsx, class-variance-authority

Node: v24.4.0
npm: Latest

===============================================================================
                           PROJECT STRUCTURE
===============================================================================

frontend/
├── src/
│   ├── pages/                    # Page components
│   │   ├── LoginPage.jsx         # Login for all roles
│   │   ├── SignupPage.jsx        # Signup for doctor/nurse
│   │   ├── DoctorDashboard.jsx   # Doctor dashboard
│   │   ├── NurseDashboard.jsx    # Nurse dashboard
│   │   ├── PatientDashboard.jsx  # Patient dashboard
│   │   └── AdminDashboard.jsx    # Admin dashboard
│   ├── store/                    # Redux store
│   │   ├── store.js              # Redux store config
│   │   └── authSlice.js          # Auth state & actions
│   ├── App.jsx                   # Main routing
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global Tailwind styles
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
└── package.json

===============================================================================
                              FEATURES
===============================================================================

AUTHENTICATION:
✅ Role-based login (Admin, Doctor, Nurse, Patient)
✅ Doctor & Nurse signup with role selection
✅ JWT token management with localStorage
✅ Auto token attachment to requests
✅ Logout functionality
✅ Persistent login state
✅ Error handling with user feedback

DASHBOARDS:
✅ Doctor Dashboard
   - View assigned patients
   - Manage prescriptions
   - Profile updates

✅ Nurse Dashboard
   - View assigned patients
   - Track medication reminders
   - Manage escalations

✅ Patient Dashboard
   - View condition & severity
   - Track prescriptions
   - View medication schedules
   - Acknowledge reminders

✅ Admin Dashboard
   - View registration requests
   - Manage patient assignments
   - System overview

STYLING:
✅ Tailwind CSS for responsive design
✅ Mobile-first approach
✅ Consistent color scheme
✅ Professional UI components
✅ Lucide icons for visual clarity

===============================================================================
                          AUTHENTICATION FLOW
===============================================================================

1. LOGIN
   - User selects role (admin/doctor/nurse/patient)
   - Enters email & password
   - Redux action dispatches POST /api/v1/auth/login
   - Success: Token stored in localStorage
   - Redirected to role dashboard
   - Error: Displayed on page

2. SIGNUP (Doctor/Nurse)
   - Select role tab (Doctor/Nurse)
   - Fill form (name, email, password, dob)
   - Nurse adds: experience, shift
   - Doctor adds: specialties (optional)
   - Redux action dispatches POST /api/v1/auth/signup/{role}
   - Success: Token stored, redirected to dashboard
   - Error: Displayed on page

3. LOGOUT
   - Click logout button
   - Redux action dispatches POST /api/v1/auth/logout
   - Token & user data cleared
   - Redirected to login

4. TOKEN MANAGEMENT
   - Token stored in localStorage
   - Auto-attached to all API requests via axios interceptor
   - No refresh token handling in UI (backend manages)
   - Persistent across page refreshes

===============================================================================
                         REDUX STATE STRUCTURE
===============================================================================

auth State:
{
  user: {
    _id: "userId",
    name: "User Name",
    email: "user@email.com",
    role: "doctor|nurse|patient|admin",
    ...other fields
  },
  accessToken: "jwt_token_string",
  role: "doctor|nurse|patient|admin",
  loading: false,
  error: null
}

Actions:
- signupDoctor(data) → POST /auth/signup/doctor
- signupNurse(data) → POST /auth/signup/nurse
- login(data) → POST /auth/login
- logout() → POST /auth/logout
- clearError() → Clear error message

===============================================================================
                          COMPONENT HIERARCHY
===============================================================================

App.jsx (Main Router)
├── LoginPage
│   ├── Email Input
│   ├── Password Input
│   ├── Role Select
│   └── Login Button
├── SignupPage
│   ├── Role Tabs (Doctor/Nurse)
│   ├── Name Input
│   ├── Email Input
│   ├── DOB Input
│   ├── Password Input
│   ├── Experience Select (Nurse only)
│   ├── Shift Select (Nurse only)
│   └── Signup Button
├── DoctorDashboard
│   ├── Navbar (Logo, User, Logout)
│   ├── Welcome Header
│   ├── Stats Cards
│   │   ├── Assigned Patients
│   │   ├── Prescriptions
│   │   └── Profile
│   └── Coming Soon Message
├── NurseDashboard
│   ├── Navbar
│   ├── Welcome Header
│   ├── Stats Cards
│   │   ├── Assigned Patients
│   │   ├── Pending Reminders
│   │   └── Escalations
│   └── Coming Soon Message
├── PatientDashboard
│   ├── Navbar
│   ├── Welcome Header
│   ├── Stats Cards
│   │   ├── Condition
│   │   ├── Prescriptions
│   │   └── Severity
│   └── Coming Soon Message
└── AdminDashboard
    ├── Navbar
    ├── Admin Header
    ├── Stats Cards
    │   ├── Pending Registrations
    │   ├── Total Patients
    │   └── Users
    └── Coming Soon Message

===============================================================================
                            STYLING GUIDE
===============================================================================

Color Scheme:
- Primary: Blue (#2563eb)
- Secondary: Indigo (#4f46e5)
- Success: Green (#16a34a)
- Warning: Yellow (#eab308)
- Danger: Red (#dc2626)
- Gray: Multiple shades (#f3f4f6 to #111827)

Typography:
- Headings: Bold, Large
- Body Text: Regular, Medium
- Small Text: 0.875rem
- Responsive text sizing

Spacing:
- 4px units (p-4 = 1rem)
- Consistent padding/margins
- Gap utilities for flex/grid

Components:
- Input fields: Border, focus ring, rounded corners
- Buttons: Filled, hover state, disabled state
- Cards: White bg, shadow, rounded, border
- Navbar: White bg, shadow, padding

Responsive:
- Mobile-first approach
- md breakpoint at 768px
- Grid: 1 col mobile, 3 cols desktop
- Full width on mobile, constrained on desktop

===============================================================================
                          HOW TO RUN
===============================================================================

1. INSTALL DEPENDENCIES
   cd frontend
   npm install

2. START DEVELOPMENT SERVER
   npm run dev
   
   Server runs on: http://localhost:3000

3. BUILD FOR PRODUCTION
   npm run build
   
   Output: dist/ folder

4. PREVIEW BUILD
   npm run preview

ENSURE BACKEND IS RUNNING:
Backend should be running on http://localhost:8000
All API calls proxy to http://localhost:8000/api/v1

===============================================================================
                          FRONTEND FLOW
===============================================================================

LANDING:
User visits http://localhost:3000
↓
If logged in → Redirect to /{role}/dashboard
If not logged in → Redirect to /login

LOGIN PAGE:
- Select role (admin/doctor/nurse/patient)
- Enter email & password
- Click "Login"
- Redux dispatches login action
- API call to /api/v1/auth/login
- Success: Token stored, redirect to dashboard
- Error: Show error message

SIGNUP PAGE:
- Toggle between Doctor/Nurse tabs
- Fill form with required fields
- Click "Sign Up"
- Redux dispatches signup action
- API call to /api/v1/auth/signup/{role}
- Success: Token stored, redirect to dashboard
- Error: Show error message

DASHBOARD:
- Navbar with user name & logout button
- Welcome message with role-specific content
- Stats cards showing counts/info
- Coming soon placeholders for features

LOGOUT:
- Click "Logout" button
- Redux dispatches logout action
- API call to /api/v1/auth/logout
- Token & user data cleared
- Redirect to /login

===============================================================================
                        API INTEGRATION
===============================================================================

Base URL: http://localhost:8000/api/v1

Axios Instance:
- Created in authSlice.js
- All requests go through this instance
- Token automatically attached to Authorization header
- Catches errors and returns user-friendly messages

Endpoints Used:

1. POST /auth/login
   Request: { email, password, role }
   Response: { user, accessToken }

2. POST /auth/signup/doctor
   Request: { name, email, password, dob, specialties }
   Response: { user, accessToken }

3. POST /auth/signup/nurse
   Request: { name, email, password, dob, experience, shift }
   Response: { user, accessToken }

4. POST /auth/logout
   Request: (empty, uses token from header)
   Response: { data: null }

Error Handling:
- Try-catch in async thunks
- Error message extracted from response
- User-friendly error display on page
- Redux error state managed

===============================================================================
                         LOCAL STORAGE
===============================================================================

Stored Data:
- accessToken: JWT token string
- user: JSON stringified user object
- role: User's role (admin/doctor/nurse/patient)

Persistent:
- Data persists across page refreshes
- Initial state loaded from localStorage on app start
- Cleared on logout

Usage:
- Login sets all three
- Signup sets all three
- Logout clears all three
- App reads from localStorage on mount

Security:
- Token stored as plain string (consider secure cookies in production)
- localStorage vulnerable to XSS
- For production: use httpOnly secure cookies

===============================================================================
                         ERROR HANDLING
===============================================================================

Validation:
- Email format validation
- Password minimum 8 characters
- Required field checks
- DOB date validation (via input type)

API Errors:
- Network errors caught
- Response errors extracted
- User-friendly messages shown
- Error state cleared on next action

Error Display:
- Red alert box with icon
- Error message text
- Visible on login/signup pages

Network Issues:
- Timeout handling
- Connection refused
- Invalid response
- All displayed as "operation failed"

===============================================================================
                       FUTURE ENHANCEMENTS
===============================================================================

Coming Soon:
✓ Patient prescription view
✓ Doctor prescription creation
✓ Nurse medication reminders
✓ Admin registration management
✓ Real-time notifications (Socket.IO)
✓ Push notifications (FCM integration)
✓ Profile management pages
✓ Patient assignment flow
✓ Medication acknowledgement
✓ Escalation resolution

Additional Features:
- Dark mode support
- Mobile app (React Native)
- Advanced filtering & search
- Data export/reporting
- Analytics dashboard
- Video consultation
- File upload (documents/images)
- Audit logs
- Two-factor authentication
- Role-based feature flags

===============================================================================
                         DEPLOYMENT
===============================================================================

Development:
npm run dev

Production Build:
npm run build
→ Creates dist/ folder

Hosting Options:
- Vercel (Recommended for Vite)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Self-hosted (nginx/Apache)

Environment Variables:
Create .env file:
VITE_API_BASE_URL=https://api.careflow.com
VITE_APP_NAME=CareFlow AI

Build Size:
~150KB (gzipped)

Performance:
- Code splitting automatic (Vite)
- Lazy loading for routes
- Tree-shaking unused code
- Minified CSS & JS in production

===============================================================================
                    TROUBLESHOOTING GUIDE
===============================================================================

Issue: "Cannot find module" errors
Solution: Run npm install, clear node_modules, reinstall

Issue: Port 3000 already in use
Solution: Change port in vite.config.js or kill process using 3000
Command: lsof -i :3000 | kill -9 <PID>

Issue: CORS errors
Solution: Ensure backend runs on 8000
Check proxy setting in vite.config.js

Issue: Token not persisting
Solution: Check browser localStorage is enabled
Check console for errors saving to localStorage

Issue: Blank page after login
Solution: Check browser console for errors
Verify backend API is running
Check if role exists in Redux state

Issue: API calls failing
Solution: Verify backend URL in authSlice.js
Check backend is running on port 8000
Ensure token header is being sent

===============================================================================
                         DEVELOPMENT TIPS
===============================================================================

Hot Module Replacement:
- Changes auto-refresh without losing state
- Editing components instantly visible
- Redux state persists during edits

Console Logging:
- Redux DevTools for state inspection
- Network tab to view API requests
- Console for JavaScript errors

Testing API Locally:
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password","role":"patient"}'

Browser DevTools:
- React DevTools extension
- Redux DevTools extension
- Network tab for API debugging
- localStorage in Application tab

Code Quality:
- ESLint via Vite (oxlint)
- Prettier for formatting (optional)
- PropTypes or TypeScript (optional)

===============================================================================
                         FILE REFERENCE
===============================================================================

src/main.jsx
- React entry point
- Redux Provider wrapper
- Root component rendering

src/App.jsx
- Main routing component
- Protected routes based on auth
- Role-based redirects

src/store/store.js
- Redux store configuration
- Reducer registration
- Store export

src/store/authSlice.js
- Axios instance with interceptors
- Authentication async thunks
- Auth reducer & actions
- Initial state

src/pages/LoginPage.jsx
- Login form component
- Role selection
- Error display
- Async login dispatch

src/pages/SignupPage.jsx
- Signup form component
- Role tabs (Doctor/Nurse)
- Conditional fields
- Async signup dispatch

src/pages/DoctorDashboard.jsx
- Doctor dashboard layout
- Navbar with logout
- Stats cards
- Placeholder content

src/pages/NurseDashboard.jsx
- Nurse dashboard layout
- Navbar with logout
- Escalation tracking
- Placeholder content

src/pages/PatientDashboard.jsx
- Patient dashboard layout
- Condition & severity display
- Placeholder content

src/pages/AdminDashboard.jsx
- Admin dashboard layout
- Registration overview
- Patient management
- Placeholder content

src/index.css
- Tailwind directives
- Global styles
- Custom utilities (if any)

===============================================================================
                            END OF DOCUMENT
===============================================================================
