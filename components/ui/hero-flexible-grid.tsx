import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const heroFlexibleGridVariants = cva(
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

export interface HeroFlexibleGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof heroFlexibleGridVariants>,
    VariantProps<typeof gridVariants> {
  leftColumnRows?: "1" | "2";
  rightColumnRows?: "1" | "2";
  leftColumnTop?: React.ReactNode;
  leftColumnBottom?: React.ReactNode;
  rightColumnTop?: React.ReactNode;
  rightColumnBottom?: React.ReactNode;
  containerClassName?: string;
  rowSpacing?: "none" | "sm" | "md" | "lg" | "xl";
}

const rowSpacingMap = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const HeroFlexibleGrid = React.forwardRef<HTMLDivElement, HeroFlexibleGridProps>(
  (
    {
      className,
      containerClassName,
      spacing,
      padding,
      columns,
      leftColumnRows = "1",
      rightColumnRows = "1",
      leftColumnTop,
      leftColumnBottom,
      rightColumnTop,
      rightColumnBottom,
      rowSpacing = "md",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={twMerge(heroFlexibleGridVariants({ padding }), className)}
        ref={ref}
        {...props}
      >
        <div className={twMerge(gridVariants({ columns }), heroFlexibleGridVariants({ spacing }), containerClassName)}>
          {/* Left Column */}
          <div className={twMerge("flex flex-col", rowSpacingMap[rowSpacing])}>
            {leftColumnTop && <div className="flex flex-col">{leftColumnTop}</div>}
            {leftColumnRows === "2" && leftColumnBottom && (
              <div className="flex flex-col">{leftColumnBottom}</div>
            )}
          </div>

          {/* Right Column */}
          <div className={twMerge("flex flex-col", rowSpacingMap[rowSpacing])}>
            {rightColumnTop && <div className="flex flex-col">{rightColumnTop}</div>}
            {rightColumnRows === "2" && rightColumnBottom && (
              <div className="flex flex-col">{rightColumnBottom}</div>
            )}
          </div>
        </div>
        {children}
      </div>
    );
  }
);
HeroFlexibleGrid.displayName = "HeroFlexibleGrid";

export { HeroFlexibleGrid, heroFlexibleGridVariants, gridVariants };
