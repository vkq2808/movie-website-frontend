import * as React from "react";
import { cn } from "@/utils/cn";
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium",
          "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400",
          "transition-all disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

