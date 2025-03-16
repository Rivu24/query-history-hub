
import { cn } from '@/lib/utils';
import { Mic, MessageSquare } from 'lucide-react';

interface AudioTextToggleProps {
  mode: 'audio' | 'text';
  onToggle: () => void;
}

const AudioTextToggle = ({ mode, onToggle }: AudioTextToggleProps) => {
  return (
    <div className="inline-flex rounded-md shadow-sm transition-all duration-300">
      <button
        type="button"
        onClick={mode === 'text' ? undefined : onToggle}
        className={cn(
          "relative px-4 py-2 flex items-center justify-center gap-2 transition-all duration-300",
          "rounded-l-lg text-sm font-medium",
          mode === 'audio' 
            ? "bg-custom-audio-button text-white shadow-inner"
            : "bg-custom-audio-button/20 text-white/60 hover:bg-custom-audio-button/40"
        )}
      >
        <Mic className={cn("h-4 w-4", mode === 'audio' ? 'animate-pulse-subtle' : '')} />
        <span>audio</span>
      </button>
      <button
        type="button"
        onClick={mode === 'audio' ? onToggle : undefined}
        className={cn(
          "relative px-4 py-2 flex items-center justify-center gap-2 transition-all duration-300",
          "rounded-r-lg text-sm font-medium",
          mode === 'text' 
            ? "bg-custom-text-button text-white shadow-inner"
            : "bg-custom-text-button/20 text-white/60 hover:bg-custom-text-button/40"
        )}
      >
        <MessageSquare className="h-4 w-4" />
        <span>text</span>
      </button>
    </div>
  );
};

export default AudioTextToggle;
