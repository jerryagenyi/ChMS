# Visitor and Event Management Guide

Hey there! 👋 Let's talk about how we handle visitors and events in our system.

## Current System

Right now, we have a basic `Visitor` model that tracks:

- First and last name
- Email and phone
- Visit date
- Follow-up date
- Status (NEW, CONTACTED, CONVERTED)

However, for events and better visitor management, we need some improvements!

## Proposed Improvements

### 1. Enhanced Visitor Types

We should treat visitors differently based on their context:

1. **Church Visitors**

   - First-time church attendees
   - Tracked in the current `Visitor` model
   - Focus on follow-up and conversion

2. **Event Guests**
   - People attending specific events
   - May or may not be church members
   - Need event-specific tracking

### 2. New Event Management System

We need to add these models to our database:

```prisma
model Event {
  id             String    @id @default(cuid())
  name           String
  description    String?
  startDate      DateTime
  endDate        DateTime?
  venue          String?
  capacity       Int?
  isPublic       Boolean   @default(true)
  organisationId String
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  organisation   Organisation @relation(fields: [organisationId], references: [id])
  registrations  EventRegistration[]
}

model EventRegistration {
  id        String   @id @default(cuid())
  eventId   String
  guestType String   // MEMBER, VISITOR
  status    String   @default("REGISTERED") // REGISTERED, ATTENDED, NO_SHOW
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  event     Event    @relation(fields: [eventId], references: [id])
  member    Member?  @relation(fields: [memberId], references: [id])
  memberId  String?
  guest     EventGuest? @relation(fields: [guestId], references: [id])
  guestId   String?
}

model EventGuest {
  id          String   @id @default(cuid())
  firstName   String
  lastName    String
  email       String?
  phone       String?
  organisation String?
  dietaryRestrictions String?
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  registrations EventRegistration[]
}
```

## How It Works

### 1. For Church Visitors

1. When someone visits the church:
   - Record their details in the `Visitor` model
   - Track their follow-up status
   - Monitor if they become members

### 2. For Event Guests

1. Create an event in the `Event` model
2. When someone registers:
   - If they're a church member:
     - Use their existing Member record
     - Create an EventRegistration linked to their Member ID
   - If they're a guest:
     - Create a new EventGuest record
     - Create an EventRegistration linked to their Guest ID

### 3. Event Check-in Process

1. Guest arrives at event
2. Look up their registration:
   - By name
   - By email
   - By phone
3. Mark their EventRegistration status as "ATTENDED"

### 4. After the Event

1. Get attendance reports
2. For non-member guests:
   - Option to convert EventGuest to Visitor
   - Start follow-up process if interested in church

## Benefits of This Approach

1. **Clear Separation**

   - Church visitors tracked separately from event guests
   - Different follow-up processes for each

2. **Flexible Registration**

   - Handle both members and non-members
   - Collect event-specific information

3. **Better Reporting**
   - Track event attendance separately
   - Monitor visitor conversion rates
   - Analyze event success

## Example Scenarios

### Scenario 1: Church Conference

1. Create conference event
2. Church members register with member ID
3. Outside guests register with contact details
4. Track attendance for both groups
5. Follow up with interested guests

### Scenario 2: Community Event

1. Create public event
2. Anyone can register
3. Collect basic contact info
4. Track attendance
5. Identify potential visitors for church

## Testing Tips

1. **Event Creation**

   - Create events with different settings
   - Test public vs private events
   - Verify capacity limits

2. **Registration Process**

   - Register existing members
   - Register new guests
   - Test validation rules

3. **Check-in Process**

   - Test member check-in
   - Test guest check-in
   - Verify attendance marking

4. **Reporting**
   - Test attendance reports
   - Check guest lists
   - Verify follow-up lists

Need help implementing any of this? Just ask! 😊
