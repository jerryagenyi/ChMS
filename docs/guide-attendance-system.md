# Attendance Management System Guide

Hey there! 👋 This guide will help you understand how our attendance system works in a simple way.

## 1. Overview

Think of our attendance system like a digital register that helps track who's present at church services, classes and events. It's like taking attendance in school, but way cooler with QR codes! 😎

## 2. Main Features

### 2.1 Check-in System

- **QR Code Check-in**: Like scanning a ticket at the cinema
- **Manual Check-in**: For when QR scanning isn't possible (like when someone forgets their code)
- **Family Check-in**: Makes it easy to check in multiple family members at once

### 2.2 Attendance Tracking

- **Service Attendance**: Track who comes to church services
- **Class Attendance**: Keep record of who attends different classes
- **Event Attendance**: Keep record of who came for our events
- **Reports**: See attendance patterns and statistics

## 3. Components Breakdown

### 3.1 QR Code Components

Located in `src/components/attendance/`:

- `QRCodeGenerator.tsx`

  - What it does: Creates unique QR codes for members
  - When to use: When registering new members or need to replace a QR code
  - Think of it as: A digital ID card maker
  - Key files:
    - `src/components/attendance/QRCodeGenerator.tsx`
    - `src/lib/qrcode/generate.ts` (QR code generation logic)
    - `src/types/qrcode.ts` (Type definitions)

- `QRDisplay.tsx`

  - What it does: Shows the QR code to members
  - When to use: When members need to see their QR code
  - Think of it as: The screen that displays your cinema ticket's QR code
  - Key files:
    - `src/components/attendance/QRDisplay.tsx`
    - `src/hooks/useQRCode.ts` (QR code data fetching)

- `QRScanner.tsx`
  - What it does: Reads member QR codes for check-in
  - When to use: At entry points when members arrive
  - Think of it as: The scanner at the supermarket checkout
  - Key files:
    - `src/components/attendance/QRScanner.tsx`
    - `src/lib/qrcode/scan.ts` (QR code scanning logic)
    - `src/hooks/useQRScanner.ts` (Scanner state management)

### 3.2 Check-in Components

- `CheckInButton.tsx`

  - What it does: A simple button to trigger check-in
  - When to use: For quick manual check-ins
  - Think of it as: The "I'm here!" button
  - Key files:
    - `src/components/attendance/CheckInButton.tsx`
    - `src/hooks/useCheckIn.ts` (Check-in logic)

- `CheckInForm.tsx`
  - What it does: Form for manual attendance entry
  - When to use: When QR scanning isn't possible
  - Think of it as: The paper register backup
  - Key files:
    - `src/components/attendance/CheckInForm.tsx`
    - `src/lib/attendance/check-in.ts` (Check-in processing)
    - `src/types/attendance.ts` (Type definitions)

### 3.3 Display and Reporting Components

- `AttendanceList.tsx`

  - What it does: Shows who's present/absent
  - When to use: To see today's attendance
  - Think of it as: The digital class register
  - Key files:
    - `src/components/attendance/AttendanceList.tsx`
    - `src/hooks/useAttendance.ts` (Attendance data fetching)

- `AttendanceStats.tsx`

  - What it does: Shows attendance numbers and patterns
  - When to use: To understand attendance trends
  - Think of it as: Your attendance dashboard
  - Key files:
    - `src/components/attendance/AttendanceStats.tsx`
    - `src/lib/attendance/stats.ts` (Statistics calculation)

- `AttendanceReport.tsx`

  - What it does: Creates detailed attendance reports
  - When to use: For monthly/yearly attendance reviews
  - Think of it as: Your attendance report card generator
  - Key files:
    - `src/components/attendance/AttendanceReport.tsx`
    - `src/lib/attendance/report.ts` (Report generation)
    - `src/lib/export/csv.ts` (CSV export functionality)

- `ServiceSelector.tsx`
  - What it does: Lets you pick which service to track
  - When to use: When recording attendance for different services
  - Think of it as: Choosing which event you're taking attendance for
  - Key files:
    - `src/components/attendance/ServiceSelector.tsx`
    - `src/hooks/useService.ts` (Service management)

## 4. Process Flow

### 4.1 Member Check-in Process

1. **Initial Access**:

   ```
   Visit church.africa/[org-name] → Sign In → Member Dashboard
   ```

2. **Member Dashboard**:

   - View personal details
   - Edit profile information
   - Access QR code
   - View attendance history
   - Sign out option

3. **Check-in Options**:

   ```
   Member Dashboard
   ├── QR Code Scan (Mobile)
   │   └── Camera Activation → Scan → Location Selection → Confirm
   └── Manual Check-in (Desktop)
       └── Form Fill → Location Selection → Submit
   ```

4. **Location Selection**:
   - Select service/event
   - Choose specific location/venue
   - Confirm attendance

### 4.2 Admin Process Flow

1. **Attendance Management**:

   ```
   Admin Dashboard
   ├── View Attendance
   │   ├── Real-time counts
   │   └── Detailed lists
   ├── Generate Reports
   │   ├── Daily summaries
   │   └── Monthly analytics
   └── Manage Services
       ├── Create new services
       └── Configure locations
   ```

2. **QR Code Management**:
   ```
   QR Code System
   ├── Generate New Codes
   ├── Replace Lost Codes
   └── Bulk Generation
   ```

## 5. Database Tables Used

Our system uses these main tables (think of them as Excel sheets):

1. **Attendance**:

   ```prisma
   model Attendance {
     id        String   @id @default(cuid())
     memberId  String
     serviceId String
     timestamp DateTime @default(now())
     type      String   // INDIVIDUAL, FAMILY
     // ... other fields
   }
   ```

2. **Member**:

   ```prisma
   model Member {
     id        String   @id @default(cuid())
     name      String
     qrCode    String   @unique
     // ... other fields
   }
   ```

3. **Service**:
   ```prisma
   model Service {
     id        String   @id @default(cuid())
     name      String
     date      DateTime
     // ... other fields
   }
   ```

## 6. Testing Tips

When testing the system, try these scenarios:

1. **QR Code Flow**:

   - Test QR code generation
   - Test QR code scanning
   - Test error handling
   - Test offline scenarios

2. **Manual Check-in Flow**:

   - Test form validation
   - Test data submission
   - Test error states
   - Test success feedback

3. **Reports Testing**:
   - Test data aggregation
   - Test date filtering
   - Test export functionality
   - Test performance with large datasets

## 7. Common Issues and Solutions

1. **QR Code Won't Scan?**

   - Check camera permissions
   - Verify QR code format
   - Test with different lighting conditions
   - Implement fallback options

2. **Can't Find a Member?**

   - Check search functionality
   - Verify database queries
   - Test with different search criteria
   - Implement fuzzy search

3. **Reports Not Showing?**
   - Check data fetching
   - Verify date ranges
   - Test with different data sets
   - Implement error boundaries

Remember: The system is designed to be flexible - if one method doesn't work, there's always a backup way! 😊

Need more help? Feel free to ask! We're here to make this easy for you. 🚀

## 8. Domain Management

### 8.1 Domain Structure

We follow a multi-tenant architecture with subdomains:

```
[church-name].church.africa
```

Example:

```
gracebaptist.church.africa
```

### 8.2 Benefits of Subdomain Approach

1. **Isolation**: Each church gets its own isolated environment
2. **Security**: Separate SSL certificates and security contexts
3. **Scalability**: Easy to add new churches without affecting others
4. **Branding**: Churches can use their own domain names if preferred

### 8.3 Domain Configuration

1. **DNS Setup**:

   ```
   *.church.africa.  IN  A  [your-server-ip]
   ```

2. **SSL Certificates**:

   - Wildcard certificate for \*.church.africa
   - Automatic renewal via Let's Encrypt

3. **Routing**:

   ```typescript
   // src/middleware.ts
   export function middleware(request: NextRequest) {
     const hostname = request.headers.get('host') || '';
     const subdomain = hostname.split('.')[0];

     // Route to appropriate church instance
     return NextResponse.rewrite(new URL(`/church/${subdomain}`, request.url));
   }
   ```

### 8.4 Church Registration Process

1. **Initial Registration**:

   - Choose church name
   - Verify availability
   - Complete registration form
   - Set up admin account

2. **Domain Activation**:

   - Automatic subdomain creation
   - SSL certificate generation
   - Initial setup completion

3. **Custom Domain Option**:
   - Churches can use their own domain
   - DNS configuration guide provided
   - SSL certificate management
