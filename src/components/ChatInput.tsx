
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Send, Mic, MicOff } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  mode: 'text' | 'audio';
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, mode, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleAudioToggle = () => {
    if (disabled) return;
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Simulate speech recognition
      setTimeout(() => {
        const simulatedTranscription = "This is a simulated voice message transcript.";
        onSendMessage(simulatedTranscription);
        setIsRecording(false);
      }, 3000);
    }
  };
  
  return (
    <div className="bg-custom-data-input/90 rounded-lg p-3 backdrop-blur-sm animate-slide-up">
      {mode === 'text' ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={disabled}
            className={cn(
              "flex-1 bg-white/10 rounded-lg border-0 px-4 py-2.5",
              "placeholder:text-white/40 text-white",
              "focus:ring-1 focus:ring-white/30 focus:outline-none",
              "transition-all duration-300",
              disabled ? "opacity-60 cursor-not-allowed" : ""
            )}
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className={cn(
              "p-2.5 rounded-full transition-all duration-300",
              "bg-white/10 hover:bg-white/20 disabled:bg-white/5",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "focus:outline-none focus:ring-1 focus:ring-white/30"
            )}
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </form>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={handleAudioToggle}
            disabled={disabled}
            className={cn(
              "p-5 rounded-full transition-all duration-300",
              isRecording 
                ? "bg-red-500/80 hover:bg-red-500 animate-pulse" 
                : "bg-custom-audio-button/90 hover:bg-custom-audio-button",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "focus:outline-none focus:ring-2 focus:ring-white/30"
            )}
          >
            {isRecording ? (
              <MicOff className="h-6 w-6 text-white" />
            ) : (
              <Mic className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
