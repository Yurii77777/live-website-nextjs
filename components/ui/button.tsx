import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  [
    // base geometry/typography
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-2xl font-medium transition-all duration-200 ease-out",
    "select-none outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20",
    "disabled:pointer-events-none disabled:opacity-60",
    "cursor-pointer",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    // Liquid Glass "material"
    // 1) translucent background + backdrop blur
    "bg-white/10 dark:bg-white/5 backdrop-blur-xl",
    // 2) thin light border (outer highlight)
    "border border-white/20 dark:border-white/10",
    // 3) light inner glow for glass thickness feel
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_30px_rgba(0,0,0,0.25)]",
    // 4) careful "vibrancy" — slightly enhance text
    "text-white/95 dark:text-white",
    // pseudo-layer for "lensing"/glare
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]",
    "before:bg-gradient-to-b before:from-white/35 before:via-white/10 before:to-transparent",
    "before:opacity-60 dark:before:opacity-40",
    "[&>*]:relative [&>*]:z-10",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          // main state
          "hover:bg-white/14 dark:hover:bg-white/8",
          "hover:border-white/30 dark:hover:border-white/15",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_35px_rgba(0,0,0,0.35)]",
          // active more "frosted" (enhances contrast)
          "active:bg-white/20 dark:active:bg-white/12 active:scale-[0.98]",
        ].join(" "),
        primary: [
          // slightly more pronounced glass + accent
          "bg-white/14 dark:bg-white/8",
          "hover:bg-white/18 dark:hover:bg-white/10",
          "ring-1 ring-white/10",
          "active:bg-white/24 dark:active:bg-white/14",
          "active:scale-[0.98]",
        ].join(" "),
        ghost: [
          // minimal layer — for less important actions (sparing use)
          "bg-transparent backdrop-blur-md border-white/10",
          "hover:bg-white/8 dark:hover:bg-white/6 hover:border-white/20",
          "active:bg-white/12 dark:active:bg-white/8",
          "active:scale-[0.98]",
        ].join(" "),
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-[15px]",
        lg: "h-13 px-6 text-base",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
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
