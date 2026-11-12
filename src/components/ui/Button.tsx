import React, { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      isLoading = false,
      variant = "primary",
      size = "md",
      fullWidth = false,
      disabled,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    // Estética Industrial Pesada (Anti-Look IA: sin bordes redondeados, bordes mecánicos)
    const baseStyles =
      "inline-flex items-center justify-center font-heading font-bold uppercase tracking-wider rounded-none select-none transition-all duration-75 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

    const variantStyles = {
      primary:
        "bg-primary text-secondary border-2 border-slate-900 border-b-4 border-r-2 hover:bg-amber-400 active:translate-y-1 active:border-b-2 active:bg-amber-500",
      secondary:
        "bg-slate-900 text-primary border-2 border-slate-950 border-b-4 border-b-primary hover:bg-slate-800 active:translate-y-1 active:border-b-2",
      outline:
        "bg-white text-slate-900 border-2 border-slate-900 border-b-4 hover:bg-neutral-200 active:translate-y-1 active:border-b-2",
      danger:
        "bg-red-600 text-white border-2 border-slate-950 border-b-4 border-b-slate-950 hover:bg-red-500 active:translate-y-1 active:border-b-2",
      ghost:
        "bg-transparent text-slate-900 border-2 border-transparent hover:border-slate-900 hover:bg-neutral-200 active:translate-y-0.5",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-7 py-3.5 text-base gap-2.5",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        <span>{isLoading ? "CARGANDO..." : children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
