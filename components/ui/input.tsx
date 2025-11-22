import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const invalid =
      props["aria-invalid"] === true ||
      props["aria-invalid"] === "true" ||
      (props as any)["data-invalid"] === true ||
      (props as any)["data-invalid"] === "true";

    return (
      <input
        ref={ref}
        type={type}
        className={twMerge(
          [
            // layout / typography
            "flex h-11 w-full rounded-2xl px-4 py-2 text-[15px] leading-none",
            "transition-all duration-200 ease-out outline-none",
            "placeholder:text-white/55 dark:placeholder:text-white/45",
            "disabled:cursor-not-allowed disabled:opacity-60",

            // Liquid Glass base material
            "bg-white/10 dark:bg-white/5 backdrop-blur-xl",
            "border border-white/20 dark:border-white/10",
            "text-white/95 dark:text-white",

            // depth + subtle inner highlight
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_24px_rgba(0,0,0,0.20)]",

            // specular highlight layer
            "bg-linear-to-b from-white/20 via-white/5 to-transparent",

            // hover — slightly enhance border/material
            "hover:bg-white/12 dark:hover:bg-white/7",
            "hover:border-white/30 dark:hover:border-white/15",

            // focus — "frosted" + clear border
            "focus-visible:bg-white/18 dark:focus-visible:bg-white/10",
            "focus-visible:border-white/40 dark:focus-visible:border-white/20",
            "focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/25",
          ].join(" "),
          invalid &&
            [
              "border-red-400/60 focus-visible:border-red-300/80",
              "focus-visible:ring-red-300/60",
              "placeholder:text-red-100/70",
            ].join(" "),
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
