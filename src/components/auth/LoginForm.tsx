import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../ui/Input';

const loginSchema = z.object({
  email: z.string()
    .email('Ingrese un correo electrónico válido')
    .min(1, 'El correo electrónico es requerido'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(50, 'La contraseña no puede exceder 50 caracteres'),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (data: LoginFormData) => {
    if (isBlocked) {
      setError('root', {
        message: 'Demasiados intentos fallidos. Por favor, espere 5 minutos.',
      });
      return;
    }

    try {
      await login(data);
      setLoginAttempts(0);
    } catch (error) {
      setLoginAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 5) {
          setIsBlocked(true);
          setTimeout(() => {
            setIsBlocked(false);
            setLoginAttempts(0);
          }, 5 * 60 * 1000); // 5 minutos
        }
        return newAttempts;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Correo Electrónico"
        type="email"
        autoComplete="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <div className="relative">
        <Input
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          {...register('password')}
          error={errors.password?.message}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            {...register('rememberMe')}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 block text-sm text-gray-900"
          >
            Recordarme
          </label>
        </div>

        <Link
          to="/forgot-password"
          className="text-sm font-medium text-primary hover:text-primary-600"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {errors.root && (
        <p className="text-sm text-error">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isBlocked}
        className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-600 disabled:opacity-50"
      >
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>

      <p className="text-center text-sm text-gray-600">
        ¿No tienes una cuenta?{' '}
        <Link
          to="/register"
          className="font-medium text-primary hover:text-primary-600"
        >
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
};