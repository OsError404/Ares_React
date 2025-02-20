import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';

const companySchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  nit: z.string()
    .regex(/^[0-9]{9,10}-[0-9]$/, 'Ingrese un NIT válido (ej: 123456789-0)'),
  address: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres'),
  phone: z.string()
    .regex(/^(\+57|57)?[1-9][0-9]{9}$/, 'Ingrese un número de teléfono válido'),
  email: z.string()
    .email('Ingrese un correo electrónico válido'),
  type: z.enum(['aseguradora', 'empresa'], {
    required_error: 'Seleccione un tipo de empresa',
  }),
  active: z.boolean().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CompanyFormData & { id: string };
}

export const CompanyForm: React.FC<CompanyFormProps> = ({ 
  onClose, 
  onSuccess,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: CompanyFormData) => {
    try {
      if (initialData) {
        await api.put(`/companies/${initialData.id}`, data);
        toast.success('Empresa actualizada exitosamente');
      } else {
        await api.post('/companies', data);
        toast.success('Empresa registrada exitosamente');
      }
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error al guardar empresa:', error);
      toast.error(error.response?.data?.message || `Error al ${initialData ? 'actualizar' : 'registrar'} la empresa`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nombre de la Empresa"
          {...register('name')}
          error={errors.name?.message}
          autoFocus
        />

        <Input
          label="NIT"
          {...register('nit')}
          error={errors.nit?.message}
          placeholder="123456789-0"
          disabled={!!initialData}
        />

        <Input
          label="Dirección"
          {...register('address')}
          error={errors.address?.message}
        />

        <Input
          label="Teléfono"
          {...register('phone')}
          error={errors.phone?.message}
          placeholder="+573001234567"
        />

        <Input
          label="Correo Electrónico"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <Select
          label="Tipo"
          {...register('type')}
          error={errors.type?.message}
          disabled={!!initialData}
        >
          <option value="">Seleccione un tipo</option>
          <option value="aseguradora">Aseguradora</option>
          <option value="empresa">Empresa Regular</option>
        </Select>

        {initialData && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active"
              {...register('active')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="active" className="text-sm text-gray-700">
              Empresa activa
            </label>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="relative rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}
            <span className={isSubmitting ? 'opacity-0' : ''}>
              {initialData ? 'Actualizar' : 'Registrar'}
            </span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};