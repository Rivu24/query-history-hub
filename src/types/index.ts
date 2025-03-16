
export type Message = {
  id: string;
  content: string;
  isQuery: boolean;
  timestamp: string;
};

export type UserChatHistory = {
  userId: string;
  name: string;
  messages: Message[];
};

export type CompanyData = {
  companyId: string;
  name: string;
  users: UserChatHistory[];
};

export type InputMode = 'text' | 'audio';

// Backend API types
export type BackendMessage = {
  content: string;
  isQuery: boolean;
  timestamp: string;
};

export type ContextData = {
  context: string;
  lastUpdated: string;
};

export type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
};
