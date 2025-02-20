import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { departments, cities } from '../../data/colombia';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';

const locationSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  prefix: z.string()
    .min(2, 'El prefijo debe tener al menos 2 caracteres')
    .max(5, 'El prefijo no puede exceder 5 caracteres')
    .regex(/^[A-Z]+$/, 'El prefijo debe contener solo letras mayúsculas'),
  address: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres'),
  department: z.string()
    .min(1, 'Seleccione un departamento'),
  city: z.string()
    .min(1, 'Seleccione una ciudad'),
});

type LocationFormData = z.infer<typeof locationSchema>;

interface LocationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const LocationForm: React.FC<LocationFormProps> = ({ onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
  });

  const selectedDepartment = watch('department');

  React.useEffect(() => {
    if (selectedDepartment) {
      setValue('city', '');
    }
  }, [selectedDepartment, setValue]);

  const onSubmit = async (data: LocationFormData) => {
    try {
      await api.post('/locations', data);
      toast.success('Sede registrada exitosamente');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al registrar sede:', error);
      toast.error('Error al registrar la sede');
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
          label="Nombre de la Sede"
          {...register('name')}
          error={errors.name?.message}
        />

        <Input
          label="Prefijo"
          {...register('prefix')}
          error={errors.prefix?.message}
          placeholder="BOG"
        />

        <Input
          label="Dirección"
          {...register('address')}
          error={errors.address?.message}
        />

        <Select
          label="Departamento"
          {...register('department')}
          error={errors.department?.message}
        >
          <option value="">Seleccione un departamento</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </Select>

        <Select
          label="Ciudad"
          {...register('city')}
          error={errors.city?.message}
          disabled={!selectedDepartment}
        >
          <option value="">
            {selectedDepartment 
              ? 'Seleccione una ciudad'
              : 'Primero seleccione un departamento'}
          </option>
          {selectedDepartment && cities[selectedDepartment]?.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Sede'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};