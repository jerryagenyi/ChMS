import { createContext, useContext } from 'react';
import { AttendanceContextValue } from '../types';

const AttendanceContext = createContext<AttendanceContextValue | null>(null);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceRecorder');
  }
  return context;
};

export default AttendanceContext;
