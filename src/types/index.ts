// User types
export interface User {
  id: number;
  username: string;
  name: string;
}

// Sheet types
export interface Sheet {
  id: number;
  name: string;
  number: string;
  parasha: string;
  subscriberCount: number;
}

// Subscriber types
export interface Subscriber {
  filingNumber: number;
  subscriberCode: string;
  name: string;
  idNumber: string;
  yeshiva: string;
  locality: string;
  numberOfWins: number;
  scholarshipFund: number;
  parashaAnswersCode: string;
  yiunHalacha: boolean;
  yiunHalachaAnswersCode: string;
  answersText: string;
}

// Dropdown option types
export interface DropdownOption {
  value: string;
  label: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  hasMore: boolean;
  page: number;
}

// Search filters
export interface SearchFilters {
  filingNumber?: string;
  subscriberCode?: string;
  name?: string;
  idNumber?: string;
}

// Form types
export interface AddSubscriberForm {
  subscriberCode: string;
  name: string;
  idNumber: string;
  numberOfWins: number;
  scholarshipFund: number;
  parashaAnswersCode: string;
  yiunHalacha: boolean;
  yiunHalachaAnswersCode: string;
  answersText: string;
}

// Dashboard stats
export interface DashboardStats {
  totalSheets: number;
  totalSubscribers: number;
  activeSheets: number;
  monthlyGrowth: number;
}

// Recent activity
export interface RecentActivity {
  id: number;
  type: 'sheet_created' | 'subscriber_added' | 'subscriber_updated';
  description: string;
  timestamp: string;
  sheetName?: string;
}