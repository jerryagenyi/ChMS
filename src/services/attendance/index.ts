import { generateQR } from './qr';
import { validateCheckIn } from './check-in';
import { getServiceAttendance } from './service';

export const attendanceService = {
  // QR Code operations
  generateQR,
  
  // Check-in operations
  validateCheckIn,
  
  // Service operations
  getServiceAttendance,
  
  // Combined operations
  async checkIn(data: CheckInData) {
    // Validate the check-in
    const validated = await validateCheckIn(data);
    
    // Process the attendance
    const attendance = await db.attendance.create({
      ...validated,
      timestamp: new Date(),
    });
    
    return attendance;
  },
  
  async getReport(params: ReportParams) {
    const attendance = await db.attendance.findMany({
      where: {
        serviceId: params.serviceId,
        timestamp: {
          gte: params.startDate,
          lte: params.endDate,
        },
      },
      include: {
        member: true,
        service: true,
      },
    });
    
    return attendance;
  },
}; 