# Attendance Management System Guide

Hey there! 👋 This guide will help you understand how our attendance system works in a simple way.

## 1. Overview

Think of our attendance system like a digital register that helps track who's present at church services and classes. It's like taking attendance in school, but way cooler with QR codes! 😎

## 2. Main Features

### 2.1 Check-in System

- **QR Code Check-in**: Like scanning a ticket at the cinema
- **Manual Check-in**: For when QR scanning isn't possible (like when someone forgets their code)
- **Family Check-in**: Makes it easy to check in multiple family members at once

### 2.2 Attendance Tracking

- **Service Attendance**: Track who comes to church services
- **Class Attendance**: Keep record of who attends different classes
- **Reports**: See attendance patterns and statistics

## 3. Components Breakdown

### 3.1 QR Code Components

Located in `src/components/attendance/`:

- `QRCodeGenerator.tsx`

  - What it does: Creates unique QR codes for members
  - When to use: When registering new members or need to replace a QR code
  - Think of it as: A digital ID card maker

- `QRDisplay.tsx`

  - What it does: Shows the QR code to members
  - When to use: When members need to see their QR code
  - Think of it as: The screen that displays your cinema ticket's QR code

- `QRScanner.tsx`
  - What it does: Reads member QR codes for check-in
  - When to use: At entry points when members arrive
  - Think of it as: The scanner at the supermarket checkout

### 3.2 Check-in Components

- `CheckInButton.tsx`

  - What it does: A simple button to trigger check-in
  - When to use: For quick manual check-ins
  - Think of it as: The "I'm here!" button

- `CheckInForm.tsx`
  - What it does: Form for manual attendance entry
  - When to use: When QR scanning isn't possible
  - Think of it as: The paper register backup

### 3.3 Display and Reporting Components

- `AttendanceList.tsx`

  - What it does: Shows who's present/absent
  - When to use: To see today's attendance
  - Think of it as: The digital class register

- `AttendanceStats.tsx`

  - What it does: Shows attendance numbers and patterns
  - When to use: To understand attendance trends
  - Think of it as: Your attendance dashboard

- `AttendanceReport.tsx`

  - What it does: Creates detailed attendance reports
  - When to use: For monthly/yearly attendance reviews
  - Think of it as: Your attendance report card generator

- `ServiceSelector.tsx`
  - What it does: Lets you pick which service to track
  - When to use: When recording attendance for different services
  - Think of it as: Choosing which event you're taking attendance for

## 4. How It All Works Together

1. **Starting Point**:

   - Member gets registered in the system
   - System generates their unique QR code (`QRCodeGenerator.tsx`)
   - Member can view their QR code anytime (`QRDisplay.tsx`)

2. **Check-in Process**:

   - Church worker selects the service (`ServiceSelector.tsx`)
   - Member arrives and either:
     - Scans their QR code (`QRScanner.tsx`)
     - Or gets checked in manually (`CheckInForm.tsx`)

3. **During/After Service**:
   - View who's present (`AttendanceList.tsx`)
   - Check attendance numbers (`AttendanceStats.tsx`)
   - Generate reports (`AttendanceReport.tsx`)

## 5. Database Tables Used

Our system uses these main tables (think of them as Excel sheets):

1. **Attendance**:

   - Records who attended what and when
   - Like a big attendance log book

2. **Member**:

   - Stores member information
   - Like a church directory

3. **Service**:

   - Keeps track of different services
   - Like your church calendar

4. **Class**:
   - For different church classes/groups
   - Like your school class list

## 6. Testing Tips

When testing the system, try these scenarios:

1. **QR Code Flow**:

   - Generate a QR code for a member
   - Display it
   - Scan it for check-in
   - Check if attendance is recorded

2. **Manual Check-in Flow**:

   - Use the check-in form
   - Verify the attendance is recorded
   - Check if it shows up in the list

3. **Reports Testing**:
   - Add some attendance records
   - Generate different reports
   - Check if the numbers match

## 7. Common Issues and Solutions

1. **QR Code Won't Scan?**

   - Make sure there's good lighting
   - Check if the camera is working
   - Use manual check-in as backup

2. **Can't Find a Member?**

   - Check if they're registered
   - Try searching by different criteria
   - Use the manual form if needed

3. **Reports Not Showing?**
   - Verify the date range
   - Check if attendance was saved
   - Refresh the page

Remember: The system is designed to be flexible - if one method doesn't work, there's always a backup way! 😊

Need more help? Feel free to ask! We're here to make this easy for you. 🚀
