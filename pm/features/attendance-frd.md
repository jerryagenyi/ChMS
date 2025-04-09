# Feature Requirements Document (FRD): Attendance Management

**Version:** 1.0
**Date:** YYYY-MM-DD
**Author(s):** [Your Name/Team]

## 1. Introduction & Goals

This document outlines the detailed requirements for the Attendance Management feature within the ChMS application.

**Goals:**

- Provide a simple, fast, and reliable method for recording attendance for church services and events.
- Enable administrators to easily view and analyze attendance data.
- Ensure the feature works effectively in low-bandwidth and potentially offline scenarios.
- Integrate seamlessly with the Member Management feature.

## 2. Scope

**In Scope (MVP - Minimum Viable Product):**

- Creating and managing trackable events (e.g., Sunday Service, Midweek Bible Study).
- Manually checking in registered members for an event.
- Viewing attendance lists for specific events.
- Basic reporting on attendance numbers per event.
- Ability to mark attendance while offline, syncing when connectivity returns.

**Out of Scope (Future Considerations):**

- QR Code based check-in.
- Visitor check-in (non-members).
- Automated reminders for events.
- Advanced analytics (e.g., attendance trends over time, demographic breakdowns).
- Self check-in options for members.
- Integration with small group attendance.

## 3. Functional Requirements

### 3.1 Event Creation & Management (Admin Role)

- **FR-ATT-001:** Admins must be able to create a new attendance event.
  - Required fields: Event Name (e.g., "Sunday Morning Service"), Event Date.
  - Optional fields: Event Time, Location, Description.
  - Events should be identifiable (e.g., by Name + Date).
- **FR-ATT-002:** Admins must be able to view a list of past and upcoming attendance events.
  - List should be sortable/filterable by date.
- **FR-ATT-003:** Admins must be able to edit basic details of an existing event (Name, Time, Location, Description).
  - Changing the Date might be restricted after attendance is recorded? (TBD)
- **FR-ATT-004:** Admins must be able to delete an event (if no attendance has been recorded? TBD - consider implications).

### 3.2 Attendance Recording (Admin/Designated Recorder Role)

- **FR-ATT-010:** Users with appropriate roles must be able to select an event to record attendance for.
- **FR-ATT-011:** The system must display a list of registered members eligible for check-in for the selected event.
  - List should be searchable/filterable by member name.
  - List should clearly indicate who has already been marked as present.
- **FR-ATT-012:** Recorders must be able to mark a member as present with a single action (e.g., clicking a checkbox or button next to their name).
- **FR-ATT-013:** Recorders must be able to undo a check-in (mark as not present) easily.
- **FR-ATT-014:** The system must provide clear visual feedback confirming a member has been checked in/out.
- **FR-ATT-015:** The system must display a running count of members marked as present for the current event.
- **FR-ATT-016:** Attendance recording must function when the device is offline. Changes must be queued locally.

### 3.3 Attendance Viewing & Reporting (Admin Role)

- **FR-ATT-020:** Admins must be able to view the list of attendees for any specific past event.
  - Display member names.
  - Show total attendance count for the event.
- **FR-ATT-021:** Admins must be able to view a simple report showing total attendance numbers for a series of events over a selected date range.
- **FR-ATT-022:** (Optional MVP) Admins must be able to export the attendee list for a specific event (e.g., to CSV).

### 3.4 Offline Functionality

- **FR-ATT-030:** Event lists and member lists (relevant for check-in) must be available offline after being initially loaded.
- **FR-ATT-031:** Marking attendance (check-in/check-out actions) must be possible while offline.
- **FR-ATT-032:** Offline attendance data must be stored locally and securely on the user's device.
- **FR-ATT-033:** The system must automatically sync locally stored attendance data to the server when network connectivity is restored.
- **FR-ATT-034:** The UI must clearly indicate when the application is operating offline.
- **FR-ATT-035:** The UI must clearly indicate the sync status (e.g., "Syncing...", "Up to date", "Offline changes pending").
- **FR-ATT-036:** Conflict resolution strategy needed if multiple recorders modify the same event offline (TBD - initial thought: last write wins, or flag conflicts for admin review).

## 4. Non-Functional Requirements

- **NFR-ATT-001 (Performance):** Member list for check-in should load quickly (e.g., < 2 seconds for typical church size).
- **NFR-ATT-002 (Performance):** Marking a member present/absent should feel instantaneous (< 200ms UI response).
- **NFR-ATT-003 (Usability):** The check-in process must be intuitive and require minimal clicks/taps.
- **NFR-ATT-004 (Reliability):** Offline data storage must be robust to prevent data loss.
- **NFR-ATT-005 (Scalability):** Should handle member lists of up to [Specify realistic max, e.g., 1000] members without significant performance degradation during check-in.
- **NFR-ATT-006 (Security):** Only authorized users (Admin/Recorder roles) can record or modify attendance data.

## 5. User Interface (UI) & User Experience (UX)

- _(Reference overall Design Specs in `pm/ui-elements-design-spec.md` and Chakra UI guidelines)_
- Clear distinction between upcoming and past events.
- Check-in interface optimized for speed and ease of use (potentially on mobile/tablet).
- Search/filter functionality for member lists must be prominent and easy to use.
- Clear indicators for offline status and sync progress.

## 6. Data Model Considerations

- `Event` model (name, date, time, location, description)
- `AttendanceRecord` model (linking `Member` to `Event`, timestamp, recorder user ID?)
- Consider indices on Member names and Event dates for performance.

## 7. Open Questions & TBDs

- Specific conflict resolution strategy for offline edits?
- Should event dates be editable after attendance recording begins?
- Should events be deletable? Under what conditions?
- Exact definition of "Recorder" role and permissions?
- Specific format for basic attendance reports?
- Details of offline data storage mechanism (e.g., IndexedDB via SWR cache helpers?).
