
import { useState, useCallback, useEffect } from 'react';
import { CompanyData, Message, UserChatHistory } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Mock data to start with
const initialCompanies: CompanyData[] = [
  {
    companyId: '1',
    name: 'Company 1',
    users: [
      {
        userId: '1',
        name: 'user 1',
        messages: [
          { id: '1', content: 'How do I reset my password?', isQuery: true, timestamp: '2023-06-15T10:30:00Z' },
          { id: '2', content: 'You can reset your password by clicking on the "Forgot Password" link on the login page.', isQuery: false, timestamp: '2023-06-15T10:31:00Z' },
        ]
      },
      {
        userId: '2',
        name: 'user 2',
        messages: [
          { id: '1', content: 'What are the business hours?', isQuery: true, timestamp: '2023-06-16T14:20:00Z' },
          { id: '2', content: 'Our business hours are 9 AM to 5 PM, Monday through Friday.', isQuery: false, timestamp: '2023-06-16T14:21:00Z' },
        ]
      },
      {
        userId: '3',
        name: 'user 3',
        messages: []
      }
    ]
  },
  {
    companyId: '2',
    name: 'Company 2',
    users: [
      {
        userId: '1',
        name: 'user 1',
        messages: [
          { id: '1', content: 'I need help with my account', isQuery: true, timestamp: '2023-06-17T09:15:00Z' },
          { id: '2', content: 'Please provide your account number and I can assist you further.', isQuery: false, timestamp: '2023-06-17T09:16:00Z' },
        ]
      }
    ]
  },
  {
    companyId: '3',
    name: 'Company 3',
    users: []
  }
];

export const useQueryHistory = () => {
  const [companies, setCompanies] = useState<CompanyData[]>(initialCompanies);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserChatHistory | null>(null);
  const [inputMode, setInputMode] = useState<'text' | 'audio'>('text');
  const [loading, setLoading] = useState(false);

  // Set initial selections
  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0]);
      
      if (companies[0].users.length > 0) {
        setSelectedUser(companies[0].users[0]);
      }
    }
  }, [companies, selectedCompany]);

  // Select a company
  const selectCompany = useCallback((companyId: string) => {
    const company = companies.find(c => c.companyId === companyId) || null;
    setSelectedCompany(company);
    
    // Reset user selection or select the first user
    setSelectedUser(company && company.users.length > 0 ? company.users[0] : null);
  }, [companies]);

  // Select a user
  const selectUser = useCallback((userId: string) => {
    if (!selectedCompany) return;
    
    const user = selectedCompany.users.find(u => u.userId === userId) || null;
    setSelectedUser(user);
  }, [selectedCompany]);

  // Add a new user to selected company
  const addUser = useCallback((userName: string) => {
    if (!selectedCompany) return;
    
    setCompanies(prev => {
      const updatedCompanies = [...prev];
      const companyIndex = updatedCompanies.findIndex(c => c.companyId === selectedCompany.companyId);
      
      if (companyIndex !== -1) {
        // Generate a new ID based on the count of users
        const newUserId = String(updatedCompanies[companyIndex].users.length + 1);
        
        // Create new user
        const newUser: UserChatHistory = {
          userId: newUserId,
          name: userName,
          messages: []
        };
        
        // Add the user
        updatedCompanies[companyIndex].users.push(newUser);
        
        // Update selected company reference
        setSelectedCompany(updatedCompanies[companyIndex]);
        
        // Select the new user
        setSelectedUser(newUser);
        
        toast({
          title: 'User Added',
          description: `Added ${userName} to ${selectedCompany.name}`,
        });
      }
      
      return updatedCompanies;
    });
  }, [selectedCompany]);

  // Toggle input mode
  const toggleInputMode = useCallback(() => {
    setInputMode(prev => prev === 'text' ? 'audio' : 'text');
  }, []);

  // Save a query
  const saveQuery = useCallback((query: string) => {
    if (!selectedCompany || !selectedUser) return;
    
    setLoading(true);
    
    setTimeout(() => {
      setCompanies(prev => {
        const updatedCompanies = [...prev];
        const companyIndex = updatedCompanies.findIndex(c => c.companyId === selectedCompany.companyId);
        
        if (companyIndex !== -1) {
          const userIndex = updatedCompanies[companyIndex].users.findIndex(u => u.userId === selectedUser.userId);
          
          if (userIndex !== -1) {
            // Generate a new message ID
            const newMessageId = String(updatedCompanies[companyIndex].users[userIndex].messages.length + 1);
            
            // Add the query
            const newMessage: Message = {
              id: newMessageId,
              content: query,
              isQuery: true,
              timestamp: new Date().toISOString()
            };
            
            updatedCompanies[companyIndex].users[userIndex].messages.push(newMessage);
            
            // Add a mock response
            setTimeout(() => {
              setCompanies(prevCompanies => {
                const updatedCompaniesWithResponse = [...prevCompanies];
                const companyIdx = updatedCompaniesWithResponse.findIndex(c => c.companyId === selectedCompany.companyId);
                
                if (companyIdx !== -1) {
                  const userIdx = updatedCompaniesWithResponse[companyIdx].users.findIndex(u => u.userId === selectedUser.userId);
                  
                  if (userIdx !== -1) {
                    const responseId = String(updatedCompaniesWithResponse[companyIdx].users[userIdx].messages.length + 1);
                    
                    const response: Message = {
                      id: responseId,
                      content: `This is a simulated response to: "${query}"`,
                      isQuery: false,
                      timestamp: new Date().toISOString()
                    };
                    
                    updatedCompaniesWithResponse[companyIdx].users[userIdx].messages.push(response);
                  }
                }
                
                return updatedCompaniesWithResponse;
              });
              
              setLoading(false);
            }, 1000);
          }
        }
        
        return updatedCompanies;
      });
    }, 500);
  }, [selectedCompany, selectedUser]);

  return {
    companies,
    selectedCompany,
    selectedUser,
    inputMode,
    loading,
    selectCompany,
    selectUser,
    addUser,
    toggleInputMode,
    saveQuery
  };
};
