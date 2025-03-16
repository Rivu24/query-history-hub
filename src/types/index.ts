
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
