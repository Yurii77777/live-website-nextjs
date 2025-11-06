import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const paragraphVariants = cva("text-foreground", {
  variants: {
    variant: {
      default: [
        "text-sm sm:text-base md:text-lg",
        "leading-relaxed",
        "font-normal",
      ],
      lead: [
        "text-base sm:text-lg md:text-xl",
        "leading-relaxed",
        "font-medium",
        "text-foreground/90",
      ],
      small: [
        "text-xs sm:text-sm",
        "leading-normal",
        "font-normal",
      ],
      muted: [
        "text-sm sm:text-base md:text-lg",
        "leading-relaxed",
        "font-normal",
        "text-muted-foreground",
      ],
      caption: [
        "text-xs",
        "leading-tight",
        "font-normal",
        "text-muted-foreground",
      ],
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
  },
  defaultVariants: {
    variant: "default",
    align: "left",
  },
});

export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {
  as?: "p" | "span" | "div";
}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, variant, align, as, children, ...props }, ref) => {
    const Comp = as || "p";

    return (
      <Comp
        className={twMerge(paragraphVariants({ variant, align }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Paragraph.displayName = "Paragraph";

export { Paragraph, paragraphVariants };
