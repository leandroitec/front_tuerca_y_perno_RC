import React, { InputHTMLAttributes, forwardRef } from "react";
import { FieldError } from "react-hook-form";

export interface InputFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | string;
  helperText?: string;
  containerClassName?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      error,
      helperText,
      id,
      name,
      className = "",
      containerClassName = "",
      disabled,
      ...props
    },
    ref
  ) => {
    // Extraer mensaje de error ya sea que venga como string o como objeto FieldError de react-hook-form
    const errorMessage = typeof error === "string" ? error : error?.message;
    const inputId = id || name;

    const baseInputStyles =
      "w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all duration-150 outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed";

    const stateStyles = errorMessage
      ? "border-red-500 bg-red-50/20 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-slate-300 bg-white text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

    return (
      <div className={`flex flex-col w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 text-sm font-medium text-slate-700 select-none flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            name={name}
            disabled={disabled}
            aria-invalid={!!errorMessage}
            aria-describedby={errorMessage ? `${inputId}-error` : undefined}
            className={`${baseInputStyles} ${stateStyles} ${className}`}
            {...props}
          />
        </div>

        {errorMessage && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="mt-1.5 text-xs sm:text-sm font-medium text-red-600 flex items-center gap-1"
          >
            <svg
              className="w-4 h-4 shrink-0 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{errorMessage}</span>
          </p>
        )}

        {!errorMessage && helperText && (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
