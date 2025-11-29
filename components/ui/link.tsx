import * as React from "react";
import NextLink from "next/link";
import { Link as LocalizedLink } from "@/i18n/routing";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { buttonVariants } from "./button";

const linkVariants = cva(
  "inline-flex items-center gap-2 touch-manipulation [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring transition-colors",
  {
    variants: {
      variant: {
        inline: [
          "text-foreground/80 hover:text-foreground",
          "underline-offset-4 hover:underline",
          "font-medium",
          "transition-all duration-200",
        ],
        subtle: [
          "text-muted-foreground hover:text-foreground",
          "no-underline hover:underline",
          "underline-offset-4",
          "font-normal",
          "transition-all duration-200",
        ],
        unstyled: "",
      },
    },
    defaultVariants: {
      variant: "inline",
    },
  }
);

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    VariantProps<typeof linkVariants> {
  href: string;
  asButton?: boolean;
  buttonVariant?: "default" | "primary" | "ghost";
  buttonSize?: "sm" | "md" | "lg" | "icon";
  external?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant,
      href,
      asButton = false,
      buttonVariant,
      buttonSize,
      external,
      children,
      ...props
    },
    ref
  ) => {
    const isExternal =
      external !== undefined
        ? external
        : href.startsWith("http") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:");
    const isNextLink = !isExternal && href.startsWith("/");
    if (asButton) {
      const buttonClasses = twMerge(
        buttonVariants({ variant: buttonVariant, size: buttonSize }),
        className
      );

      if (isNextLink) {
        return (
          <LocalizedLink href={href} className={buttonClasses} ref={ref} {...props}>
            {children}
          </LocalizedLink>
        );
      }

      return (
        <a
          href={href}
          className={buttonClasses}
          ref={ref}
          {...(isExternal && {
            target: "_blank",
            rel: "noopener noreferrer",
          })}
          {...props}
        >
          {children}
        </a>
      );
    }

    const linkClasses = twMerge(linkVariants({ variant }), className);

    if (isNextLink) {
      return (
        <LocalizedLink href={href} className={linkClasses} ref={ref} {...props}>
          {children}
        </LocalizedLink>
      );
    }

    return (
      <a
        href={href}
        className={linkClasses}
        ref={ref}
        {...(isExternal && {
          target: "_blank",
          rel: "noopener noreferrer",
        })}
        {...props}
      >
        {children}
      </a>
    );
  }
);
Link.displayName = "Link";

export { Link, linkVariants };
