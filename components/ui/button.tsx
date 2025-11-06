import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium relative isolate touch-manipulation [-webkit-tap-highlight-color:transparent] focus-visible:outline-none cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: [
          "rounded-glass",
          "transition-all duration-300 ease-glass",
          "shadow-glass",
          "backdrop-blur-glass-light [-webkit-backdrop-filter:blur(1px)]",
          "border border-white/30",
          "text-white font-semibold",
          "before:content-[''] before:absolute before:inset-0 before:z-0 before:rounded-glass before:shadow-glass-inset before:bg-white/5",
          "after:content-[''] after:absolute after:inset-0 after:-z-10 after:rounded-[28px] after:backdrop-blur-glass",
          "hover:scale-[1.02]",
          "active:scale-[0.98]",
          "disabled:opacity-40",
          "[&>*]:relative [&>*]:z-10",
        ],
        destructive: [
          "rounded-[14px]",
          "bg-red-500/80 backdrop-blur-xl",
          "border border-red-400/30",
          "text-white font-semibold",
          "shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.15)]",
          "hover:bg-red-500/90 hover:border-red-400/40 hover:shadow-[0_2px_8px_rgba(239,68,68,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]",
          "active:scale-[0.98] active:bg-red-500/95",
          "disabled:opacity-40 disabled:bg-red-500/30 disabled:border-red-400/10 disabled:shadow-none",
          "touch-manipulation",
          "[-webkit-tap-highlight-color:transparent]",
        ],
        outline: [
          "rounded-[14px]",
          "bg-transparent backdrop-blur-md",
          "border border-gray-300/50",
          "text-gray-900 dark:text-white font-medium",
          "shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
          "hover:bg-white/10 hover:border-gray-400/60",
          "active:scale-[0.98] active:bg-white/20",
          "disabled:opacity-40 disabled:border-gray-300/20 disabled:shadow-none",
          "touch-manipulation",
          "[-webkit-tap-highlight-color:transparent]",
        ],
        ghost: [
          "rounded-[14px]",
          "bg-transparent",
          "text-gray-700 dark:text-gray-200 font-medium",
          "hover:bg-white/10 hover:backdrop-blur-md",
          "active:scale-[0.98] active:bg-white/15",
          "disabled:opacity-40",
          "touch-manipulation",
          "[-webkit-tap-highlight-color:transparent]",
        ],
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={twMerge(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
