import { db } from '../db';

export const organizationService = {
  // Organization operations
  async getCurrentOrg() {
    return db.organization.findFirst();
  },
  
  async updateOrg(data: OrganizationUpdate) {
    return db.organization.update(data);
  },
  
  // Member operations
  async getMembers(params: MemberFindMany) {
    return db.members.findMany({
      ...params,
      where: {
        ...params.where,
        organizationId: (await this.getCurrentOrg())?.id,
      },
    });
  },
  
  // Service operations
  async getServices(params: ServiceFindMany) {
    return db.services.findMany({
      ...params,
      where: {
        ...params.where,
        organizationId: (await this.getCurrentOrg())?.id,
      },
    });
  },
  
  // Attendance operations
  async getAttendance(params: AttendanceFindMany) {
    return db.attendance.findMany({
      ...params,
      where: {
        ...params.where,
        organizationId: (await this.getCurrentOrg())?.id,
      },
    });
  },
}; 