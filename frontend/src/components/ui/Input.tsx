"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix"
> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, prefix, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] text-[var(--text-secondary)] uppercase tracking-widest font-medium"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-4 text-[var(--text-secondary)]">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-[var(--bg-raised)] border rounded-2xl px-4 py-3 text-sm text-[var(--text-primary)] font-mono placeholder:text-[var(--text-muted)] shadow-sm transition duration-200",
              "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-opacity-20 focus:border-transparent",
              error
                ? "border-[var(--status-error)] ring-1 ring-[var(--status-error)] ring-opacity-15"
                : "border-[var(--border-default)]",
              prefix && "pl-11",
              className,
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[11px] text-[var(--status-error)]">{error}</p>
        )}
        {hint && !error && (
          <p className="text-[11px] text-[var(--text-muted)]">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
