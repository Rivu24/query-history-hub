
import { useQueryHistory } from '@/hooks/useQueryHistory';
import CompanySelector from '@/components/CompanySelector';
import UserSelector from '@/components/UserSelector';
import ChatDisplay from '@/components/ChatDisplay';
import ChatInput from '@/components/ChatInput';
import AudioTextToggle from '@/components/AudioTextToggle';

const Index = () => {
  const {
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
  } = useQueryHistory();

  return (
    <div className="min-h-screen w-full flex flex-col bg-background overflow-hidden p-4">
      {/* Main content grid */}
      <div className="relative flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 w-full max-w-[1800px] mx-auto">
        {/* Company selector (left) */}
        <div className="md:col-span-3 h-[calc(100vh-2rem)]">
          <CompanySelector
            companies={companies}
            selectedCompany={selectedCompany}
            onSelectCompany={selectCompany}
          />
        </div>

        {/* User selector (middle) */}
        <div className="md:col-span-3 h-[calc(100vh-2rem)]">
          <UserSelector
            company={selectedCompany}
            selectedUser={selectedUser}
            onSelectUser={selectUser}
            onAddUser={addUser}
          />
        </div>

        {/* Chat display/input (right) */}
        <div className="md:col-span-6 h-[calc(100vh-2rem)] flex flex-col">
          <div className="flex-1 bg-custom-data-panel/70 rounded-lg p-4 flex flex-col gap-4">
            {/* Controls */}
            <div className="flex justify-end pt-1 px-2">
              <AudioTextToggle 
                mode={inputMode} 
                onToggle={toggleInputMode} 
              />
            </div>

            {/* Chat display area */}
            <div className="flex-1 overflow-hidden rounded-lg">
              <ChatDisplay user={selectedUser} />
            </div>

            {/* Chat input area */}
            <div className="mt-4">
              <ChatInput 
                mode={inputMode}
                onSendMessage={saveQuery}
                disabled={!selectedUser || loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
