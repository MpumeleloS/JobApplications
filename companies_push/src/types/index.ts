export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Company {
  id: string;
  name: string;
  website?: string;
  location?: string;
  industry?: string;
  notes?: string;
  userId?: string;
  applicationCount?: number;
}

export interface CV {
  id: string;
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  version?: string;
  notes?: string;
  userId?: string;
  createdAt: string;
  usageCount?: number;
}

export type ApplicationStatus = 
  | 'applied' 
  | 'shortlisted' 
  | 'interview_scheduled' 
  | 'rejected' 
  | 'offer_received' 
  | 'withdrawn';

export type WorkType = 'remote' | 'onsite' | 'hybrid';

export interface Application {
  id: string;
  jobTitle: string;
  jobDescription?: string;
  jobUrl?: string;
  salaryRange?: string;
  location?: string;
  workType?: WorkType;
  status: ApplicationStatus;
  appliedDate: string;
  notes?: string;
  userId?: string;
  companyId: string;
  companyName?: string;
  companyWebsite?: string;
  companyLocation?: string;
  cvId?: string;
  cvFilename?: string;
  cvOriginalName?: string;
  createdAt: string;
  updatedAt: string;
}

export type InterviewType = 'phone' | 'video' | 'in_person' | 'technical' | 'assessment';

export interface Interview {
  id: string;
  scheduledDate: string;
  duration?: number;
  interviewType?: InterviewType;
  interviewerName?: string;
  interviewerEmail?: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
  reminderSent: boolean;
  userId?: string;
  applicationId: string;
  jobTitle?: string;
  companyName?: string;
  createdAt?: string;
}

export interface StatusHistory {
  id: string;
  oldStatus?: ApplicationStatus;
  newStatus: ApplicationStatus;
  changedAt: string;
  notes?: string;
}

export interface ApplicationStats {
  totalApplications: number;
  applied: number;
  shortlisted: number;
  interviewScheduled: number;
  rejected: number;
  offersReceived: number;
  withdrawn: number;
  totalInterviews: number;
  monthlyData: { month: string; count: number }[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
}
