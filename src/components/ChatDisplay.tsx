
import { useEffect, useRef } from 'react';
import { Message, UserChatHistory } from '@/types';
import { cn } from '@/lib/utils';
import { useDelayedAppear } from '@/lib/animations';
import { format } from 'date-fns';

interface ChatDisplayProps {
  user: UserChatHistory | null;
}

const ChatDisplay = ({ user }: ChatDisplayProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isVisible = useDelayedAppear(300);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [user?.messages]);
  
  if (!user) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-custom-data-display/90 rounded-lg backdrop-blur-lg">
        <p className="text-white/70 text-lg font-light">Select a user to view chat history</p>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "h-full w-full flex flex-col rounded-lg overflow-hidden",
      "bg-custom-data-display/90 backdrop-blur-lg transition-opacity duration-500",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      <div className="flex-1 overflow-y-auto p-5">
        {user.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-white/70 text-center">No chat history yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {user.messages.map((message, index) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                delay={index * 100}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
  delay: number;
}

const MessageBubble = ({ message, delay }: MessageBubbleProps) => {
  const isQuery = message.isQuery;
  
  return (
    <div 
      className={cn(
        "flex", 
        isQuery ? "justify-end" : "justify-start",
        "animate-fade-in opacity-0"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div 
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-md",
          isQuery 
            ? "bg-white/10 text-white mr-2" 
            : "bg-white/20 text-white ml-2"
        )}
      >
        <div className="text-sm">{message.content}</div>
        <div className="text-xs mt-1 opacity-60">
          {format(new Date(message.timestamp), 'h:mm a')}
        </div>
      </div>
    </div>
  );
};

export default ChatDisplay;
