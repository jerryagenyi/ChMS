# Attendance App MVP Specification

## Main Interfaces

### 1. Desktop Landing Page

```yaml
name: DesktopLanding
type: Web Component
props:
  orgId: string
  serviceId: string
state:
  searchQuery: string
  selectedMember: Member | null
  qrDisplayActive: boolean
  animationState: 'idle' | 'success' | 'error'

functions:
  handleSearch:
    - Debounced autocomplete (200ms)
    - Fuzzy search implementation
    - Keyboard navigation support
    - Clear button + shortcuts

  handleQRDisplay:
    - Generate service QR code
    - Manage display states
    - Handle success animation
    - Reset for next check-in

  handleManualSubmit:
    - Validate selected member
    - Record attendance
    - Trigger success animation

ui:
  layout: centered-single-column
  components:
    - Service QR code display (centered)
      - Fade animations
      - Success animation overlay
    - Search input field (below QR)
    - Recent check-ins list (bottom left)
    - Success animation
      - Checkmark scale + fade (400ms spring)
      - Name text slide up + fade (300ms)
      - 1.5s total animation cycle

animations:
  qrCode:
    - Initial mount: Fade in (300ms ease-in)
    - Pre-scan: Subtle pulse
    - Post-scan: Fade out (200ms ease-out)

  success:
    - Centered checkmark animation
    - Name display integration
    - Smooth transition timing
```

## Component: QRCheckInScanner

```yaml
name: QRCheckInScanner
type: PWA Component
props:
  orgId: string
  locationData: {
    latitude: number
    longitude: number
    radius: number  # in meters
    required: boolean # whether geofencing is strictly required
  }
state:
  isScanning: boolean
  lastScanResult: string | null
  offlineQueue: Array<ScanResult>
  currentLocation: {
    latitude: number
    longitude: number
    accuracy: number
    timestamp: number
  }
  locationStatus: 'checking' | 'within-range' | 'out-of-range' | 'error'

functions:
  initializeScanner:
    - Check camera permissions
    - Initialize QR scanner library
    - Set up offline storage
    - Start location monitoring

  checkLocation:
    - Get current position
    - Calculate distance from church
    - Verify within radius
    - Handle location errors
    - Update location status

  handleScan:
    - Validate QR code format
    - Verify location requirements
    - Store attendance record
    - Queue for sync if offline
    - Show appropriate feedback

  syncOfflineData:
    - Check connection status
    - Upload queued attendance records
    - Include location data
    - Clear successfully synced records

ui:
  layout: mobile-first
  components:
    - Camera viewport
    - Location status indicator
    - Scan status indicator
    - Offline mode indicator
    - Error messages
    - Distance indicator (optional)
```

### 2. Mobile Interface

```yaml
name: MobileApp
type: PWA Component
props:
  orgId: string
state:
  isLoggedIn: boolean
  userProfile: Member | null
  currentView: 'scanner' | 'profile'

functions:
  handleLogin:
    - SSO authentication (NextAuth.js)
    - Load user profile
    - Set up offline data

  handleScan:
    - Scan service QR code
    - Validate and process
    - Show success feedback
    - Handle offline queue

ui:
  layout: mobile-optimized
  components:
    - Bottom sheet navigation
    - QR scanner view (main)
    - Profile view
    - Offline status indicator
    - Haptic feedback support
```

### 3. Admin Interface

```yaml
name: AdminInterface
type: Web Component
props:
  churchId: string
  userRole: 'admin' | 'staff'
state:
  currentSection: 'dashboard' | 'members' | 'reports' | 'settings'
  sidebarCollapsed: boolean

functions:
  navigateSection:
    - Update current view
    - Load section data
    - Update URL

  handleMemberManagement:
    - CRUD operations for members
    - Approve registrations
    - Manage roles
    - Generate/revoke QR codes

  handleReporting:
    - Generate various reports
    - Export data
    - Analyze trends

ui:
  layout: admin-dashboard
  components:
    - Sidebar navigation
    - Top header with quick actions
    - Main content area
    - Data tables/forms
    - Action buttons
    - Notification center
```

## Component: AdminDashboard

```yaml
name: AdminDashboard
type: Web Component
props:
  churchId: string
  userRole: 'admin' | 'staff'
state:
  attendanceData: Array<AttendanceRecord>
  membersList: Array<Member>
  dateRange: DateRange

functions:
  fetchAttendanceData:
    - Load attendance records for date range
    - Calculate attendance metrics
    - Update charts and tables

  exportReport:
    - Generate CSV/PDF report
    - Include basic analytics

  manageMember:
    - Add/Edit member details
    - Update family relationships
    - Manage access levels

ui:
  layout: responsive-grid
  components:
    - Attendance summary cards
    - Weekly trend chart
    - Members table
    - Quick actions menu
```

## Data Models

```prisma
// Aligned with tracker schema
model Organization {
  id          String    @id @default(cuid())
  name        String
  locations   Location[]
  services    Service[]
  members     Member[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Member {
  id          String    @id @default(cuid())
  name        String
  email       String?   @unique
  phone       String?   // Added field
  orgId       String
  org         Organization @relation(fields: [orgId], references: [id])
  checkIns    CheckIn[]
  role        Role      @default(MEMBER)
}

// ... rest of schema as in tracker
```

## API Endpoints

```yaml
attendance:
  - POST /api/attendance/check-in
  - GET /api/attendance/records
  - POST /api/attendance/bulk-sync

members:
  - GET /api/members
  - POST /api/members
  - PUT /api/members/:id

reports:
  - GET /api/reports/attendance
  - GET /api/reports/members
```

## MVP Features Priority

1. Essential (Launch Requirements):

   - Service QR code generation
   - Mobile QR code scanning
   - Basic member management
   - Offline support
   - Real-time check-in updates

2. Important (Post-Launch):

   - Advanced reporting
   - Multi-location support
   - Family unit tracking
   - Export capabilities

3. Future Enhancements:
   - Geofencing
   - Push notifications
   - Advanced analytics
   - Bulk operations

## Technical Implementation

1. Authentication:

   - NextAuth.js with multiple providers
   - JWT + secure session management
   - Role-based access control

2. Performance:

   - First contentful paint < 1.5s
   - Time to interactive < 2s
   - Animation frame rate > 55fps

3. Offline Support:

   - Service worker implementation
   - Local storage strategy
   - Background sync

4. Security:
   - OWASP compliance
   - Rate limiting
   - CSRF/XSS prevention

## Development Phases

[As detailed in attendance-tracker.md]

## MVP Full Features

### 1. Desktop Landing Page Features

- **Quick Check-in**
  - Autocomplete member search (primary interaction)
  - QR code scanning (prominent left panel)
  - Recent check-ins display (minimal, bottom section)
  - Success notifications (unobtrusive toast messages)
- **Layout & Design**
  - Clean, minimal interface
  - Split view (QR scanner left, search right)
  - Dark/Light mode support
  - Responsive design
- **Error Handling**
  - Invalid member handling
  - Duplicate check-in prevention
  - Offline mode indicators
  - Graceful degradation

### Initial Setup & Configuration

- **Organization Setup**

  - Basic Information

    - Church name
    - Logo upload
    - Contact information

  - **Location Setup**

    - Physical address
    - GPS coordinates (required)
    - Check-in radius (in meters)
    - Multiple locations support
    - Geofencing settings
      - Strict mode (reject if outside)
      - Flexible mode (warn if outside)
      - Offline fallback behavior

  - **Branding**

    - Primary color
    - Secondary color
    - Dark/Light mode defaults

  - **Data Management**
    - Member import/export
    - Batch QR code generation
    - Data backup/restore

### 2. Mobile App Features

- **Check-in Capabilities**
  - QR code scanner (no login required)
  - Geolocation verification
  - Offline scanning
  - Sync status indicator
- **Optional Member Features**
  - Simple profile view (no login required)
  - View attendance history
  - Download personal QR code
- **Registration**
  - Basic member registration
  - Profile photo (optional)
  - Admin approval workflow

### 3. Admin Dashboard Features

- **Dashboard Overview**
  - Today's attendance summary
  - Weekly/Monthly trends
  - Recent activities
  - Quick actions
- **Member Management**

  - Member directory

    - Search and filters
    - Bulk operations
    - Export functionality
    - Status management

  - Profile Management

    - Detailed member profiles
    - Family unit management
    - QR code generation
    - Attendance history

  - Registration Management
    - Pending approvals
    - Bulk approve/reject
    - Custom fields configuration

- **Attendance Management**

  - Service Management

    - Service types setup
    - Schedule configuration
    - Location settings

  - Attendance Records

    - Daily/Weekly/Monthly views
    - Custom date ranges
    - Export options
    - Bulk corrections

  - Reports & Analytics
    - Attendance trends
    - Member participation
    - Growth metrics
    - Custom reports

- **System Settings**

  - User Management

    - Admin/Staff accounts
    - Role management
    - Permission settings

  - Church Profile

    - Basic information
    - Service schedules
    - Location settings

  - System Configuration
    - Email templates
    - Notification settings
    - Backup/Restore
    - API access

### 4. Cross-Cutting Features

- **Location Services**

  - Real-time location monitoring
  - Distance calculation
  - Offline location caching
  - Accuracy requirements
  - Battery optimization

- **Offline Capabilities**

  - Offline data storage
  - Background sync
  - Location data caching
  - Conflict resolution

- **Security**

  - Role-based access control
  - Audit logging
  - Session management
  - Data encryption

- **Performance**

  - Lazy loading
  - Image optimization
  - Caching strategies
  - Database indexing

- **Integration**
  - REST API
  - Webhook support
  - Export/Import functionality
  - Backup/Restore tools
