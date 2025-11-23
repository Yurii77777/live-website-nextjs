import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const heroTwoColumnVariants = cva(
  "w-full",
  {
    variants: {
      spacing: {
        none: "gap-0",
        sm: "gap-4",
        md: "gap-6",
        lg: "gap-8",
        xl: "gap-12",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6 md:p-8",
        lg: "p-8 md:p-12",
        xl: "p-12 md:p-16",
      },
    },
    defaultVariants: {
      spacing: "lg",
      padding: "md",
    },
  }
);

const gridVariants = cva(
  "grid",
  {
    variants: {
      columns: {
        "1-1": "grid-cols-1 md:grid-cols-2",
        "2-1": "grid-cols-1 md:grid-cols-[2fr_1fr]",
        "1-2": "grid-cols-1 md:grid-cols-[1fr_2fr]",
      },
    },
    defaultVariants: {
      columns: "1-1",
    },
  }
);

export interface HeroTwoColumnProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof heroTwoColumnVariants>,
    VariantProps<typeof gridVariants> {
  leftColumn?: React.ReactNode;
  rightColumn?: React.ReactNode;
  containerClassName?: string;
}

const HeroTwoColumn = React.forwardRef<HTMLDivElement, HeroTwoColumnProps>(
  (
    {
      className,
      containerClassName,
      spacing,
      padding,
      columns,
      leftColumn,
      rightColumn,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={twMerge(heroTwoColumnVariants({ padding }), className)}
        ref={ref}
        {...props}
      >
        <div className={twMerge(gridVariants({ columns }), heroTwoColumnVariants({ spacing }), containerClassName)}>
          {leftColumn && <div className="flex flex-col">{leftColumn}</div>}
          {rightColumn && <div className="flex flex-col">{rightColumn}</div>}
        </div>
        {children}
      </div>
    );
  }
);
HeroTwoColumn.displayName = "HeroTwoColumn";

export { HeroTwoColumn, heroTwoColumnVariants, gridVariants };
