
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface AddUserButtonProps {
  onAddUser: (userName: string) => void;
  onCancel: () => void;
}

const AddUserButton = ({ onAddUser, onCancel }: AddUserButtonProps) => {
  const [userName, setUserName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      onAddUser(`user ${userName}`);
    }
  };
  
  return (
    <div className="mb-4 animate-fade-in">
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "bg-custom-add-user-button/20 rounded-lg p-3",
          "border border-custom-add-user-button/30",
          "transition-all duration-300"
        )}
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter number"
            className={cn(
              "flex-1 bg-transparent border-none focus:outline-none",
              "text-white placeholder:text-white/40",
              "text-sm rounded-md p-2"
            )}
            autoFocus
          />
          <button
            type="submit"
            disabled={!userName.trim()}
            className={cn(
              "p-1.5 rounded-full transition-colors duration-200",
              "bg-custom-add-user-button/80 hover:bg-custom-add-user-button",
              "disabled:opacity-50 disabled:pointer-events-none"
            )}
          >
            <Check className="h-4 w-4 text-white" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 
                      transition-colors duration-200"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserButton;
