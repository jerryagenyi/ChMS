# API Documentation

## Security Configuration

### Environment Variables

Required environment variables for API functionality:

```typescript
NEXTAUTH_SECRET=<min 32 characters>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
RECAPTCHA_SECRET_KEY=<your-recaptcha-secret>
DATABASE_URL=<your-database-url>
```

### Rate Limiting

All API routes are protected by rate limiting:

- 100 requests per 15 minutes per IP
- Headers included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

### Security Headers

All API responses include the following security headers:

```typescript
{
  'Content-Security-Policy': "default-src 'self'...",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}
```

## Authentication

All API routes require authentication using NextAuth.js. Include the session token in the request headers:

```typescript
headers: {
  'Authorization': `Bearer ${session.token}`
}
```

## API Endpoints

### Member Management

#### GET /api/members/[id]

Retrieves member details including profile image information.

**Response:**

```typescript
{
  id: string;
  name: string;
  email: string;
  profileImage: {
    url: string;
    thumbnailUrl: string;
    originalName: string;
    size: number;
    format: string;
    dimensions: {
      width: number;
      height: number;
    }
  }
  // ... other member fields
}
```

#### PUT /api/members/[id]

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
  profileImage?: File;  // multipart/form-data
  // ... other fields
}
```

### Image Management

#### POST /api/images/upload

Uploads and processes images.

**Request:**

- Content-Type: multipart/form-data
- Max file size: 5MB
- Supported formats: jpg, jpeg, png, webp

**Response:**

```typescript
{
  id: string;
  url: string;
  thumbnailUrl: string;
  originalName: string;
  size: number;
  format: string;
  dimensions: {
    width: number;
    height: number;
  }
}
```

#### GET /api/images/[id]

Retrieves image details and URLs.

#### DELETE /api/images/[id]

Deletes an image and its derivatives.

### Error Responses

Standard error responses follow this format:

```typescript
{
  error: string;  // One of the predefined SECURITY_MESSAGES
  status: number; // HTTP status code
  details?: any;  // Optional additional information
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

## Testing Guidelines

### API Testing

1. Authentication Tests

   ```typescript
   describe('POST /api/auth/login', () => {
     it('authenticates valid credentials', async () => {
       const response = await fetch('/api/auth/login', {
         method: 'POST',
         body: JSON.stringify({ email, password }),
       });
       expect(response.status).toBe(200);
     });
   });
   ```

2. Error Handling Tests

   ```typescript
   describe('Error Responses', () => {
     it('handles invalid input', async () => {
       const response = await fetch('/api/members', {
         method: 'POST',
         body: JSON.stringify({}),
       });
       expect(response.status).toBe(400);
       const data = await response.json();
       expect(data.error).toBeDefined();
     });
   });
   ```

3. Rate Limiting Tests
   ```typescript
   describe('Rate Limiting', () => {
     it('enforces rate limits', async () => {
       // Make multiple requests
       const responses = await Promise.all(
         Array(101)
           .fill(null)
           .map(() => fetch('/api/members'))
       );
       const lastResponse = responses[100];
       expect(lastResponse.status).toBe(429);
     });
   });
   ```
