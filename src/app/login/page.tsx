"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { useAuth } from "@/context/AuthContext";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data.username, data.password);
      // Redireccionar al panel o inicio tras inicio de sesión exitoso
      router.push("/admin");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("No se pudo iniciar sesión. Verifica tus credenciales.");
      }
    }
  };

  // Función de ayuda para rellenar credenciales demo de prueba rápida
  const setDemoCredentials = (user: string, pass: string) => {
    setValue("username", user, { shouldValidate: true });
    setValue("password", pass, { shouldValidate: true });
    setServerError(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200">
        {/* Cabecera del formulario */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md mb-3">
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Acceso al Sistema
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Ingresá tus credenciales para acceder a la gestión de{" "}
            <span className="font-semibold text-brand-600">Tuerca y Perno RC</span>
          </p>
        </div>

        {/* Alerta de error del servidor o credenciales inválidas */}
        {serverError && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-sm text-red-800 animate-shake"
          >
            <svg
              className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1 font-medium">{serverError}</div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6" noValidate>
          <div className="space-y-4">
            <InputField
              label="Nombre de Usuario"
              id="username"
              type="text"
              placeholder="Ej: admin, vendedor, deposito"
              autoComplete="username"
              error={errors.username}
              disabled={isSubmitting || authLoading}
              {...register("username")}
            />

            <InputField
              label="Contraseña"
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password}
              disabled={isSubmitting || authLoading}
              {...register("password")}
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting || authLoading}
            >
              Iniciar Sesión
            </Button>
          </div>
        </form>

        {/* Acceso Rápido / Demo Hint Box */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center mb-3">
            Credenciales de Prueba Rápida
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials("admin", "admin123")}
              className="px-2.5 py-1.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold text-center transition-colors"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("vendedor", "vendedor123")}
              className="px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold text-center transition-colors"
            >
              Ventas
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("deposito", "deposito123")}
              className="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold text-center transition-colors"
            >
              Depósito
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          <Link href="/" className="text-brand-600 hover:text-brand-700 font-semibold">
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}
