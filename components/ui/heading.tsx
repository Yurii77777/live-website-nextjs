import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const headingVariants = cva("font-semibold tracking-tight text-foreground", {
  variants: {
    variant: {
      h1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
      h2: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
      h3: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
      h4: "text-base sm:text-lg md:text-xl lg:text-2xl",
      h5: "text-sm sm:text-base md:text-lg lg:text-xl",
      h6: "text-sm sm:text-base md:text-lg",
      title: [
        "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
        "font-bold",
        "bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70",
        "bg-clip-text text-transparent",
        "leading-tight",
      ],
      subtitle: [
        "text-lg sm:text-xl md:text-2xl",
        "font-medium",
        "text-muted-foreground",
      ],
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    variant: "h1",
    align: "left",
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, align, as, children, ...props }, ref) => {
    const Comp = as || (variant === "title" ? "h1" : variant === "subtitle" ? "p" : variant) || "h1";

    return (
      <Comp
        className={twMerge(headingVariants({ variant, align }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
