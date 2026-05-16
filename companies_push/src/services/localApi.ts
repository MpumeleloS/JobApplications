import type { 
  User, 
  Company, 
  CV, 
  Application, 
  Interview, 
  ApplicationStats,
  RegisterData 
} from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Simulated delay for realism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Storage keys
const STORAGE_KEYS = {
  USERS: 'jobtracker_users',
  CURRENT_USER: 'jobtracker_current_user',
  COMPANIES: 'jobtracker_companies',
  CVS: 'jobtracker_cvs',
  APPLICATIONS: 'jobtracker_applications',
  INTERVIEWS: 'jobtracker_interviews',
};

// Helper functions
function getItem<T>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Auth API
export const authAPI = {
  login: async (email: string, _password?: string) => {
    await delay(500);
    const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const token = `token-${uuidv4()}`;
    setItem(STORAGE_KEYS.CURRENT_USER, { token, user });
    
    return { data: { token, user } };
  },
  
  register: async (data: RegisterData) => {
    await delay(500);
    const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
    
    if (users.some(u => u.email === data.email)) {
      throw new Error('User already exists with this email');
    }
    
    const newUser: User = {
      id: uuidv4(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };
    
    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);
    
    const token = `token-${uuidv4()}`;
    setItem(STORAGE_KEYS.CURRENT_USER, { token, user: newUser });
    
    return { data: { token, user: newUser } };
  },
};

// Companies API
export const companiesAPI = {
  getAll: async () => {
    await delay(300);
    const user = getItem<{ user: User } | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) throw new Error('Not authenticated');
    
    const companies = getItem<Company[]>(STORAGE_KEYS.COMPANIES, [])
      .filter(c => c.userId === user.user.id);
    
    // Add application count
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const companiesWithCount = companies.map(c => ({
      ...c,
      applicationCount: applications.filter(a => a.companyId === c.id).length
    }));
    
    return { data: companiesWithCount };
  },
  
  create: async (data: Omit<Company, 'id'>) => {
    await delay(300);
    const user = getItem<{ user: User } | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) throw new Error('Not authenticated');
    
    const companies = getItem<Company[]>(STORAGE_KEYS.COMPANIES, []);
    const newCompany: Company = {
      ...data,
      id: uuidv4(),
      userId: user.user.id,
    };
    
    companies.push(newCompany);
    setItem(STORAGE_KEYS.COMPANIES, companies);
    
    return { data: newCompany };
  },
  
  update: async (id: string, data: Partial<Company>) => {
    await delay(300);
    const companies = getItem<Company[]>(STORAGE_KEYS.COMPANIES, []);
    const index = companies.findIndex(c => c.id === id);
    
    if (index === -1) throw new Error('Company not found');
    
    companies[index] = { ...companies[index], ...data };
    setItem(STORAGE_KEYS.COMPANIES, companies);
    
    return { data: companies[index] };
  },
  
  delete: async (id: string) => {
    await delay(300);
    const companies = getItem<Company[]>(STORAGE_KEYS.COMPANIES, []);
    const filtered = companies.filter(c => c.id !== id);
    setItem(STORAGE_KEYS.COMPANIES, filtered);
    
    return { data: { message: 'Company deleted' } };
  },
};

// CVs API
export const cvsAPI = {
  getAll: async () => {
    await delay(300);
    const user = getItem<{ user: User } | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) throw new Error('Not authenticated');
    
    const cvs = getItem<CV[]>(STORAGE_KEYS.CVS, [])
      .filter(c => c.userId === user.user.id);
    
    // Add usage count
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const cvsWithCount = cvs.map(c => ({
      ...c,
      usageCount: applications.filter(a => a.cvId === c.id).length
    }));
    
    return { data: cvsWithCount };
  },
  
  upload: async (formData: FormData) => {
    await delay(500);
    const user = getItem<{ user: User } | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) throw new Error('Not authenticated');
    
    const file = formData.get('cv') as File;
    const version = formData.get('version') as string;
    const notes = formData.get('notes') as string;
    
    if (!file) throw new Error('No file uploaded');
    
    // Convert file to base64 for storage
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
    
    const cvs = getItem<CV[]>(STORAGE_KEYS.CVS, []);
    const newCV: CV = {
      id: uuidv4(),
      filename: file.name,
      originalName: file.name,
      filePath: base64,
      fileSize: file.size,
      version: version || undefined,
      notes: notes || undefined,
      userId: user.user.id,
      createdAt: new Date().toISOString(),
    };
    
    cvs.push(newCV);
    setItem(STORAGE_KEYS.CVS, cvs);
    
    return { data: newCV };
  },
  
  update: async (id: string, data: Partial<CV>) => {
    await delay(300);
    const cvs = getItem<CV[]>(STORAGE_KEYS.CVS, []);
    const index = cvs.findIndex(c => c.id === id);
    
    if (index === -1) throw new Error('CV not found');
    
    cvs[index] = { ...cvs[index], ...data };
    setItem(STORAGE_KEYS.CVS, cvs);
    
    return { data: cvs[index] };
  },
  
  delete: async (id: string) => {
    await delay(300);
    const cvs = getItem<CV[]>(STORAGE_KEYS.CVS, []);
    const filtered = cvs.filter(c => c.id !== id);
    setItem(STORAGE_KEYS.CVS, filtered);
    
    return { data: { message: 'CV deleted' } };
  },
  
  download: async (id: string) => {
    await delay(300);
    const cvs = getItem<CV[]>(STORAGE_KEYS.CVS, []);
    const cv = cvs.find(c => c.id === id);
    
    if (!cv) throw new Error('CV not found');
    
    // Create download from base64
    const link = document.createElement('a');
    link.href = cv.filePath;
    link.download = cv.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return { data: null };
  },
};

// Applications API
export const applicationsAPI = {
  getAll: async () => {
    await delay(300);
    const user = getItem<{ user: User } | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) throw new Error('Not authenticated');
    
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, [])
      .filter(a => a.userId === user.user.id);
    
    const companies = getItem<Company[]>(STORAGE_KEYS.COMPANIES, []);
    const cvs = getItem<CV[]>(STORAGE_KEYS.CVS, []);
    
    const enriched = applications.map(app => ({
      ...app,
      companyName: companies.find(c => c.id === app.companyId)?.name,
      companyWebsite: companies.find(c => c.id === app.companyId)?.website,
      companyLocation: companies.find(c => c.id === app.companyId)?.location,
      cvFilename: cvs.find(c => c.id === app.cvId)?.filename,
      cvOriginalName: cvs.find(c => c.id === app.cvId)?.originalName,
    }));
    
    return { data: enriched };
  },
  
  create: async (data: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'appliedDate'>) => {
    await delay(300);
    const user = getItem<{ user: User } | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) throw new Error('Not authenticated');
    
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const now = new Date().toISOString();
    
    const newApp: Application = {
      ...data,
      id: uuidv4(),
      userId: user.user.id,
      appliedDate: now,
      createdAt: now,
      updatedAt: now,
    };
    
    applications.push(newApp);
    setItem(STORAGE_KEYS.APPLICATIONS, applications);
    
    return { data: newApp };
  },
  
  update: async (id: string, data: Partial<Application>) => {
    await delay(300);
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const index = applications.findIndex(a => a.id === id);
    
    if (index === -1) throw new Error('Application not found');
    
    applications[index] = { 
      ...applications[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    setItem(STORAGE_KEYS.APPLICATIONS, applications);
    
    return { data: applications[index] };
  },
  
  delete: async (id: string) => {
    await delay(300);
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const filtered = applications.filter(a => a.id !== id);
    setItem(STORAGE_KEYS.APPLICATIONS, filtered);
    
    return { data: { message: 'Application deleted' } };
  },
  
  getStats: async () => {
    await delay(300);
    const user = getItem<{ user: User } | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) throw new Error('Not authenticated');
    
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, [])
      .filter(a => a.userId === user.user.id);
    
    const interviews = getItem<Interview[]>(STORAGE_KEYS.INTERVIEWS, [])
      .filter(i => i.userId === user.user.id);
    
    const stats: ApplicationStats = {
      totalApplications: applications.length,
      applied: applications.filter(a => a.status === 'applied').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      interviewScheduled: applications.filter(a => a.status === 'interview_scheduled').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      offersReceived: applications.filter(a => a.status === 'offer_received').length,
      withdrawn: applications.filter(a => a.status === 'withdrawn').length,
      totalInterviews: interviews.length,
      monthlyData: [],
    };
    
    return { data: stats };
  },
};

// Interviews API
export const interviewsAPI = {
  getAll: async () => {
    await delay(300);
    const user = getItem<{ user: User } | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) throw new Error('Not authenticated');
    
    const interviews = getItem<Interview[]>(STORAGE_KEYS.INTERVIEWS, [])
      .filter(i => i.userId === user.user.id);
    
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const companies = getItem<Company[]>(STORAGE_KEYS.COMPANIES, []);
    
    const enriched = interviews.map(interview => {
      const app = applications.find(a => a.id === interview.applicationId);
      return {
        ...interview,
        jobTitle: app?.jobTitle,
        companyName: companies.find(c => c.id === app?.companyId)?.name,
      };
    });
    
    return { data: enriched };
  },
  
  getUpcoming: async () => {
    await delay(300);
    const user = getItem<{ user: User } | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) throw new Error('Not authenticated');
    
    const now = new Date().toISOString();
    const interviews = getItem<Interview[]>(STORAGE_KEYS.INTERVIEWS, [])
      .filter(i => i.userId === user.user.id && i.scheduledDate > now)
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
      .slice(0, 5);
    
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const companies = getItem<Company[]>(STORAGE_KEYS.COMPANIES, []);
    
    const enriched = interviews.map(interview => {
      const app = applications.find(a => a.id === interview.applicationId);
      return {
        ...interview,
        jobTitle: app?.jobTitle,
        companyName: companies.find(c => c.id === app?.companyId)?.name,
      };
    });
    
    return { data: enriched };
  },
  
  create: async (data: Omit<Interview, 'id' | 'reminderSent'>) => {
    await delay(300);
    const user = getItem<{ user: User } | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) throw new Error('Not authenticated');
    
    const interviews = getItem<Interview[]>(STORAGE_KEYS.INTERVIEWS, []);
    
    const newInterview: Interview = {
      ...data,
      id: uuidv4(),
      userId: user.user.id,
      reminderSent: false,
      createdAt: new Date().toISOString(),
    };
    
    interviews.push(newInterview);
    setItem(STORAGE_KEYS.INTERVIEWS, interviews);
    
    // Update application status
    const applications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    const appIndex = applications.findIndex(a => a.id === data.applicationId);
    if (appIndex !== -1) {
      applications[appIndex].status = 'interview_scheduled';
      applications[appIndex].updatedAt = new Date().toISOString();
      setItem(STORAGE_KEYS.APPLICATIONS, applications);
    }
    
    return { data: newInterview };
  },
  
  update: async (id: string, data: Partial<Interview>) => {
    await delay(300);
    const interviews = getItem<Interview[]>(STORAGE_KEYS.INTERVIEWS, []);
    const index = interviews.findIndex(i => i.id === id);
    
    if (index === -1) throw new Error('Interview not found');
    
    interviews[index] = { ...interviews[index], ...data };
    setItem(STORAGE_KEYS.INTERVIEWS, interviews);
    
    return { data: interviews[index] };
  },
  
  delete: async (id: string) => {
    await delay(300);
    const interviews = getItem<Interview[]>(STORAGE_KEYS.INTERVIEWS, []);
    const filtered = interviews.filter(i => i.id !== id);
    setItem(STORAGE_KEYS.INTERVIEWS, filtered);
    
    return { data: { message: 'Interview deleted' } };
  },
};
