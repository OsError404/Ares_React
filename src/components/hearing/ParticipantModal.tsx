import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { participantSchema, type ParticipantFormSchema } from '../../schemas/hearing';

interface ParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ParticipantFormSchema) => void;
  initialData?: ParticipantFormSchema;
}

export const ParticipantModal: React.FC<ParticipantModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ParticipantFormSchema>({
    resolver: zodResolver(participantSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: ParticipantFormSchema) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>

              <h2 className="mb-6 text-xl font-semibold">
                {initialData ? 'Editar' : 'Agregar'} Participante
              </h2>

              <div className="space-y-4">
                <Input
                  label="Nombre Completo"
                  {...register('name')}
                  error={errors.name?.message}
                />

                <Input
                  label="Número de Documento"
                  {...register('documentId')}
                  error={errors.documentId?.message}
                />

                <Select
                  label="Tipo de Entidad"
                  {...register('entityType')}
                  error={errors.entityType?.message}
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="natural">Persona Natural</option>
                  <option value="legal">Persona Jurídica</option>
                </Select>

                <Input
                  label="Correo Electrónico"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                />

                <Select
                  label="Rol"
                  {...register('role')}
                  error={errors.role?.message}
                >
                  <option value="">Seleccione un rol</option>
                  <option value="convener">Convocante</option>
                  <option value="convened">Convocado</option>
                  <option value="conciliator">Conciliador</option>
                </Select>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(handleFormSubmit)}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    {initialData ? 'Actualizar' : 'Agregar'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};