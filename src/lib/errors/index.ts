export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 400,
    public data?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AttendanceError extends AppError {
  constructor(message: string, data?: any) {
    super('ATTENDANCE_ERROR', message, 400, data);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, data?: any) {
    super('VALIDATION_ERROR', message, 400, data);
  }
}