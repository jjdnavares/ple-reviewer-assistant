import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxRows, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    
    // Handle auto-resize functionality for textarea
    React.useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      
      const adjustHeight = () => {
        textarea.style.height = 'auto';
        
        if (maxRows) {
          const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
          const maxHeight = lineHeight * maxRows;
          textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
          textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
        } else {
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
      };
      
      textarea.addEventListener('input', adjustHeight);
      adjustHeight();
      
      return () => {
        textarea.removeEventListener('input', adjustHeight);
      };
    }, [maxRows]);
    
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={(node) => {
          // Handle both refs
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          textareaRef.current = node;
        }}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
