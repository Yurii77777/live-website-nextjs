import * as React from "react"
import { twMerge } from "tailwind-merge"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={twMerge(
          "flex h-11 w-full px-4 py-2.5 text-sm font-medium",
          "rounded-glass",
          "transition-all duration-300 ease-glass",
          "shadow-glass",
          "backdrop-blur-glass-light [-webkit-backdrop-filter:blur(1px)]",
          "border border-white/30",
          "text-white placeholder:text-white/60",
          "bg-white/5",
          "relative isolate",
          "focus-visible:outline-none focus-visible:border-white/50 focus-visible:shadow-[0_8px_32px_rgba(0,0,0,0.25)]",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
