import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Input } from '../ui/Input';
import { z } from 'zod';

const claimAmountSchema = z.object({
  damages: z.number()
    .min(0, 'El monto debe ser mayor o igual a 0')
    .max(999999999, 'El monto no puede exceder 999,999,999'),
  deductible: z.number()
    .min(0, 'El monto debe ser mayor o igual a 0')
    .max(999999999, 'El monto no puede exceder 999,999,999'),
  subrogation: z.number()
    .min(0, 'El monto debe ser mayor o igual a 0')
    .max(999999999, 'El monto no puede exceder 999,999,999'),
});

type ClaimAmountFormData = z.infer<typeof claimAmountSchema>;

interface ClaimAmountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (total: number, details: ClaimAmountFormData) => void;
  initialData?: ClaimAmountFormData;
}

export const ClaimAmountModal: React.FC<ClaimAmountModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ClaimAmountFormData>({
    resolver: zodResolver(claimAmountSchema),
    defaultValues: initialData || {
      damages: 0,
      deductible: 0,
      subrogation: 0,
    },
  });

  const values = watch();
  const total = (values.damages || 0) + (values.deductible || 0) + (values.subrogation || 0);

  const handleFormSubmit = (data: ClaimAmountFormData) => {
    onSubmit(total, data);
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
                Desglose del Monto de Reclamación
              </h2>

              <div className="space-y-4">
                <Input
                  label="Daños"
                  type="number"
                  {...register('damages', { valueAsNumber: true })}
                  error={errors.damages?.message}
                  placeholder="$0"
                />

                <Input
                  label="Deducible"
                  type="number"
                  {...register('deductible', { valueAsNumber: true })}
                  error={errors.deductible?.message}
                  placeholder="$0"
                />

                <Input
                  label="Subrogación"
                  type="number"
                  {...register('subrogation', { valueAsNumber: true })}
                  error={errors.subrogation?.message}
                  placeholder="$0"
                />

                <div className="mt-4 rounded-md bg-gray-50 p-4">
                  <p className="text-lg font-semibold">
                    Total: ${total.toLocaleString('es-CO')}
                  </p>
                </div>

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
                    Confirmar
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