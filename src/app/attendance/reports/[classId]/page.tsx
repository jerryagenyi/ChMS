import { AttendanceReport } from '@/components/attendance/AttendanceReport';

interface AttendanceReportPageProps {
  params: {
    classId: string;
  };
}

export default function ClassAttendanceReportPage({ params }: AttendanceReportPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <AttendanceReport classId={params.classId} />
    </div>
  );
}
