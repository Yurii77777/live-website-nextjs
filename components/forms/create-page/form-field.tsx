import { Paragraph } from "@/components/ui/paragraph";
import { Input } from "@/components/ui/input";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  errorMessage?: string;
  hint?: string;
  autoFocus?: boolean;
  className?: string;
}

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  register,
  error,
  errorMessage,
  hint,
  autoFocus,
  className,
}: FormFieldProps) {
  return (
    <fieldset className={`border-0 p-0 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium mb-2 text-white">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        {...register}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-invalid={error ? "true" : "false"}
        data-invalid={error ? "true" : "false"}
      />
      {error && errorMessage ? (
        <Paragraph variant="small" className="text-red-400 mt-1">
          {errorMessage}
        </Paragraph>
      ) : hint ? (
        <Paragraph variant="small" className="text-white/60 mt-1">
          {hint}
        </Paragraph>
      ) : null}
    </fieldset>
  );
}
