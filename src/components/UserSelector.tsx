
import { useState } from 'react';
import { CompanyData, UserChatHistory } from '@/types';
import { useDelayedAppear } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';
import AddUserButton from './AddUserButton';

interface UserSelectorProps {
  company: CompanyData | null;
  selectedUser: UserChatHistory | null;
  onSelectUser: (userId: string) => void;
  onAddUser: (userName: string) => void;
}

const UserSelector = ({ company, selectedUser, onSelectUser, onAddUser }: UserSelectorProps) => {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const isVisible = useDelayedAppear(200);
  
  if (!company) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-custom-user-panel/90 rounded-lg backdrop-blur-lg">
        <p className="text-white/70 text-lg font-light">Select a company first</p>
      </div>
    );
  }
  
  const handleAddUser = (userName: string) => {
    onAddUser(userName);
    setIsAddingUser(false);
  };
  
  return (
    <div className={cn(
      "h-full w-full flex flex-col p-6 transition-opacity duration-500",
      "bg-custom-user-panel/90 rounded-lg backdrop-blur-lg",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white/90">Users</h2>
        <button 
          onClick={() => setIsAddingUser(true)}
          className="text-white/80 hover:text-white focus:outline-none
                    transition-transform duration-300 hover:scale-110 active:scale-95"
          aria-label="Add user"
        >
          <PlusCircle className="h-5 w-5" />
        </button>
      </div>
      
      {isAddingUser ? (
        <AddUserButton 
          onAddUser={handleAddUser}
          onCancel={() => setIsAddingUser(false)}
        />
      ) : null}
      
      <div className="flex flex-col space-y-3 mt-2">
        {company.users.length === 0 ? (
          <p className="text-white/60 text-center py-8">No users available</p>
        ) : (
          company.users.map((user, index) => (
            <button
              key={user.userId}
              onClick={() => onSelectUser(user.userId)}
              className={cn(
                "rounded-lg py-3 px-4 text-left transition-all duration-300",
                "hover:bg-white/10 hover:shadow-md",
                "active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
                selectedUser?.userId === user.userId 
                  ? "bg-custom-text-button/30 shadow-md" 
                  : "bg-custom-text-button/10",
                "animate-slide-up",
                { "opacity-0": !isVisible }
              )}
              style={{ animationDelay: `${150 + index * 80}ms` }}
            >
              <span className="block text-white font-medium">{user.name}</span>
              <span className="block text-white/60 text-sm mt-1">
                {user.messages.length} {user.messages.length === 1 ? 'message' : 'messages'}
              </span>
            </button>
          ))
        )}
      </div>
      
      <div className="mt-auto">
        <div className="text-center text-white/70 text-sm">
          <p>{company.name}</p>
          <p className="mt-1 text-xs text-white/50">
            {company.users.length} {company.users.length === 1 ? 'user' : 'users'} total
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSelector;
