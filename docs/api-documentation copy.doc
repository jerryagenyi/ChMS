# API Documentation

## Authentication

All API routes require authentication using NextAuth.js. Include the session token in the request headers:

```typescript
headers: {
  'Authorization': `Bearer ${session.token}`
}
```

## Attendance Routes

### GET /api/attendance

Fetches attendance records with optional filtering.

**Query Parameters:**

- `serviceId` (string, optional): Filter by service ID
- `date` (string, optional): Filter by date (ISO format)
- `status` (string, optional): Filter by attendance status

**Response:**

```typescript
{
  id: string;
  serviceId: string;
  memberId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}[]
```

### POST /api/attendance

Creates a new attendance record.

**Request Body:**

```typescript
{
  serviceId: string;
  memberId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}
```

**Response:**

```typescript
{
  id: string;
  serviceId: string;
  memberId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### POST /api/attendance/bulk

Creates multiple attendance records in a transaction.

**Request Body:**

```typescript
{
  records: {
    serviceId: string;
    memberId: string;
    date: string;
    status: 'present' | 'absent' | 'late';
    notes?: string;
  }[]
}
```

**Response:**

```typescript
{
  id: string;
  serviceId: string;
  memberId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}[]
```

### POST /api/attendance/report

Generates attendance reports based on specified parameters.

**Request Body:**

```typescript
{
  startDate: string;
  endDate: string;
  serviceId?: string;
  memberId?: string;
  groupBy: 'day' | 'week' | 'month';
}
```

**Response:**

```typescript
{
  period: string;
  total: number;
  present: number;
  absent: number;
  late: number;
}
[];
```

## Member Routes

### GET /api/members

Fetches member records with optional filtering.

**Query Parameters:**

- `search` (string, optional): Search by name or email
- `status` (string, optional): Filter by member status
- `gender` (string, optional): Filter by gender

**Response:**

```typescript
{
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  occupation?: string;
  status: 'active' | 'inactive' | 'deceased';
  createdAt: string;
  updatedAt: string;
}[]
```

### POST /api/members

Creates a new member record.

**Request Body:**

```typescript
{
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  occupation?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
}
```

**Response:**

```typescript
{
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  occupation?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  status: 'active';
  createdAt: string;
  updatedAt: string;
}
```

### POST /api/members/register

Registers a new member with additional validation.

**Request Body:**

```typescript
{
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  occupation?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  familyId?: string;
  familyRole?: 'head' | 'spouse' | 'child' | 'other';
  baptismDate?: string;
  confirmationDate?: string;
  membershipDate?: string;
}
```

**Response:**

```typescript
{
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  occupation?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  familyId?: string;
  familyRole?: 'head' | 'spouse' | 'child' | 'other';
  baptismDate?: string;
  confirmationDate?: string;
  membershipDate?: string;
  status: 'active';
  createdAt: string;
  updatedAt: string;
}
```

### GET /api/members/[id]

Fetches a specific member's details.

**Response:**

```typescript
{
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  occupation?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  familyId?: string;
  familyRole?: 'head' | 'spouse' | 'child' | 'other';
  baptismDate?: string;
  confirmationDate?: string;
  membershipDate?: string;
  status: 'active' | 'inactive' | 'deceased';
  createdAt: string;
  updatedAt: string;
  family?: {
    id: string;
    name: string;
    members: {
      id: string;
      name: string;
      familyRole: string;
    }[];
  };
  attendance: {
    id: string;
    date: string;
    status: string;
    service: {
      id: string;
      name: string;
      date: string;
    };
  }[];
}
```

### PUT /api/members/[id]

Updates a member's details.

**Request Body:**

```typescript
{
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  occupation?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  status?: 'active' | 'inactive' | 'deceased';
  familyId?: string;
  familyRole?: 'head' | 'spouse' | 'child' | 'other';
}
```

**Response:**

```typescript
{
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  occupation?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  status: 'active' | 'inactive' | 'deceased';
  familyId?: string;
  familyRole?: 'head' | 'spouse' | 'child' | 'other';
  createdAt: string;
  updatedAt: string;
}
```

### DELETE /api/members/[id]

Soft deletes a member by setting their status to 'inactive'.

**Response:**

```typescript
204 No Content
```

## Service Routes

### GET /api/services

Fetches service records with optional filtering.

**Query Parameters:**

- `search` (string, optional): Search by name or description
- `type` (string, optional): Filter by service type
- `startDate` (string, optional): Filter by start date
- `endDate` (string, optional): Filter by end date
- `isRecurring` (boolean, optional): Filter by recurrence status

**Response:**

```typescript
{
  id: string;
  name: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'sunday' | 'wednesday' | 'special';
  location?: string;
  notes?: string;
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: 'weekly' | 'monthly' | 'yearly';
    interval: number;
    daysOfWeek?: number[];
    endDate?: string;
  };
  attendance: {
    id: string;
    memberId: string;
    status: string;
  }[];
  createdAt: string;
  updatedAt: string;
}[]
```

### POST /api/services

Creates a new service record.

**Request Body:**

```typescript
{
  name: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'sunday' | 'wednesday' | 'special';
  location?: string;
  notes?: string;
  isRecurring?: boolean;
  recurrencePattern?: {
    frequency: 'weekly' | 'monthly' | 'yearly';
    interval: number;
    daysOfWeek?: number[];
    endDate?: string;
  };
}
```

**Response:**

```typescript
{
  id: string;
  name: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'sunday' | 'wednesday' | 'special';
  location?: string;
  notes?: string;
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: 'weekly' | 'monthly' | 'yearly';
    interval: number;
    daysOfWeek?: number[];
    endDate?: string;
  };
  attendance: [];
  createdAt: string;
  updatedAt: string;
}
```

### GET /api/services/[id]

Fetches a specific service's details.

**Response:**

```typescript
{
  id: string;
  name: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'sunday' | 'wednesday' | 'special';
  location?: string;
  notes?: string;
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: 'weekly' | 'monthly' | 'yearly';
    interval: number;
    daysOfWeek?: number[];
    endDate?: string;
  };
  attendance: {
    id: string;
    memberId: string;
    status: string;
    member: {
      id: string;
      name: string;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}
```

### PUT /api/services/[id]

Updates a service's details.

**Request Body:**

```typescript
{
  name?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  type?: 'sunday' | 'wednesday' | 'special';
  location?: string;
  notes?: string;
  isRecurring?: boolean;
  recurrencePattern?: {
    frequency: 'weekly' | 'monthly' | 'yearly';
    interval: number;
    daysOfWeek?: number[];
    endDate?: string;
  };
}
```

**Response:**

```typescript
{
  id: string;
  name: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'sunday' | 'wednesday' | 'special';
  location?: string;
  notes?: string;
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: 'weekly' | 'monthly' | 'yearly';
    interval: number;
    daysOfWeek?: number[];
    endDate?: string;
  };
  attendance: {
    id: string;
    memberId: string;
    status: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
```

### DELETE /api/services/[id]

Deletes a service and its related records.

**Response:**

```typescript
204 No Content
```

## Error Handling

All API routes follow a consistent error response format:

```typescript
{
  error: string | {
    message: string;
    code: string;
    details?: unknown;
  }[];
}
```

Common HTTP status codes:

- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 405: Method Not Allowed
- 500: Internal Server Error

## Rate Limiting

API routes are rate limited to prevent abuse:

- 100 requests per minute per IP
- 1000 requests per hour per user

Rate limit headers are included in responses:

```typescript
{
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
}
```
