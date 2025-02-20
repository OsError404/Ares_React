import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

const roles = [
  'Conciliador',
  'Recepcionista',
  'Archivo',
  'Solicitudes',
  'Notificaciones',
] as const;

const registerSchema = z.object({
  fullName: z.string()
    .min(5, 'El nombre completo debe tener al menos 5 caracteres')
    .regex(/^[\p{L}\s]{2,}\s+[\p{L}\s]{2,}$/u, 'Ingrese nombres y apellidos completos'),
  documentType: z.enum(['CC', 'CE', 'PE'], {
    required_error: 'Seleccione un tipo de documento',
  }),
  documentNumber: z.string()
    .min(5, 'El número de documento debe tener al menos 5 caracteres')
    .max(20, 'El número de documento no puede exceder 20 caracteres')
    .regex(/^[0-9]+$/, 'Solo se permiten números'),
  email: z.string()
    .email('Ingrese un correo electrónico válido'),
  roles: z.array(z.enum(roles))
    .min(1, 'Seleccione al menos un rol'),
  locationId: z.string({
    required_error: 'Seleccione una sede',
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      roles: [],
    },
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data } = await api.get('/locations');
      return data;
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post('/auth/register', data);
      toast.success('Usuario registrado exitosamente. Se han enviado las credenciales al correo electrónico.');
      reset();
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      toast.error('Error al registrar el usuario');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-lg rounded-lg bg-white p-8 shadow-lg"
    >
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
        Registro de Usuario
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Nombres y Apellidos"
          {...register('fullName')}
          error={errors.fullName?.message}
          placeholder="Ej: Juan Pablo Pérez Rodríguez"
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo de Documento"
            {...register('documentType')}
            error={errors.documentType?.message}
          >
            <option value="">Seleccione...</option>
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="CE">Cédula de Extranjería</option>
            <option value="PE">Permiso Especial</option>
          </Select>

          <Input
            label="Número de Documento"
            {...register('documentNumber')}
            error={errors.documentNumber?.message}
            placeholder="Ej: 1234567890"
          />
        </div>

        <Input
          label="Correo Electrónico"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="correo@ejemplo.com"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Roles
          </label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((role) => (
              <label key={role} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={role}
                  {...register('roles')}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{role}</span>
              </label>
            ))}
          </div>
          {errors.roles && (
            <p className="text-sm text-error">{errors.roles.message}</p>
          )}
        </div>

        <Select
          label="Sede"
          {...register('locationId')}
          error={errors.locationId?.message}
        >
          <option value="">Seleccione una sede</option>
          {locations.map((location: any) => (
            <option key={location._id} value={location._id}>
              {location.name}
            </option>
          ))}
        </Select>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Usuario'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};