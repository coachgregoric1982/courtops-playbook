import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-[12px] border border-[#e6dccb] bg-white px-3 text-sm text-[#07102c] placeholder:text-[#6b7391] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] disabled:opacity-40",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-[12px] border border-[#e6dccb] bg-white px-3 py-2 text-sm text-[#07102c] placeholder:text-[#6b7391] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] disabled:opacity-40",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export function NativeSelect({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-[12px] border border-[#e6dccb] bg-white px-3 text-sm text-[#07102c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
