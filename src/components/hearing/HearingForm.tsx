import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { FormField } from '../ui/FormField';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import { TextAreaWithCounter } from '../ui/TextAreaWithCounter';
import { ParticipantList } from './ParticipantList';
import { departments, cities } from '../../data/colombia';
import { formatDate, getMinDate, getMaxDate, isWeekDay, isValidHearingTime } from '../../utils/date';
import { hearingSchema, type HearingFormSchema } from '../../schemas/hearing';
import { api } from '../../lib/api';
import { saveFormData, loadFormData, clearFormData, markFormCompleted } from '../../lib/formStorage';
import { useFormAnalytics } from '../../hooks/useFormAnalytics';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const FORM_ID = 'hearing-request';

const HearingForm = () => {
  const navigate = useNavigate();
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [dateError, setDateError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRecoveryPrompt, setShowRecoveryPrompt] = useState(false);

  const methods = useForm<HearingFormSchema>({
    resolver: zodResolver(hearingSchema),
    defaultValues: {
      type: 'Otros',
      date: formatDate(new Date()),
      participants: [],
      additionalDetails: '',
    },
  });

  const { formState, watch, setValue, reset } = methods;
  const { isDirty, touchedFields } = formState;

  useFormAnalytics(FORM_ID);

  useEffect(() => {
    const savedSession = loadFormData(FORM_ID);
    if (savedSession?.data) {
      setShowRecoveryPrompt(true);
    }
  }, []);

  useEffect(() => {
    if (isDirty) {
      const formData = methods.getValues();
      saveFormData(FORM_ID, formData);
    }
  }, [isDirty, methods]);

  const submitMutation = useMutation({
    mutationFn: async (data: HearingFormSchema) => {
      setIsSubmitting(true);
      try {
        const response = await api.post('/hearing-requests', data);
        return response.data;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      toast.success('Solicitud de audiencia enviada exitosamente');
      markFormCompleted(FORM_ID);
      clearFormData(FORM_ID);
      reset();
      navigate('/solicitadas');
    },
    onError: (error: any) => {
      console.error('Error al enviar solicitud:', error);
      toast.error(error.response?.data?.message || 'Error al enviar la solicitud');
    },
  });

  const selectedDepartment = watch('department');
  const hearingDateTime = watch('hearingDateTime');

  useEffect(() => {
    if (selectedDepartment) {
      setAvailableCities(cities[selectedDepartment] || []);
      setValue('city', '');
    }
  }, [selectedDepartment, setValue]);

  useEffect(() => {
    if (hearingDateTime) {
      const date = new Date(hearingDateTime);
      
      if (!isWeekDay(hearingDateTime.split('T')[0])) {
        setDateError('No se pueden programar audiencias en fines de semana');
        setValue('hearingDateTime', '');
        return;
      }

      if (!isValidHearingTime(date)) {
        setDateError('Las audiencias solo se pueden programar entre las 9:00 AM y 5:00 PM');
        setValue('hearingDateTime', '');
        return;
      }

      setDateError('');
    }
  }, [hearingDateTime, setValue]);

  const onSubmit = (data: HearingFormSchema) => {
    if (!isDirty) {
      toast.error('No hay cambios para enviar');
      return;
    }
    submitMutation.mutate(data);
  };

  const handleRecoverSession = () => {
    const savedSession = loadFormData(FORM_ID);
    if (savedSession?.data) {
      methods.reset(savedSession.data);
      setShowRecoveryPrompt(false);
      toast.success('Formulario recuperado exitosamente');
    }
  };

  const handleDiscardSession = () => {
    clearFormData(FORM_ID);
    setShowRecoveryPrompt(false);
  };

  return (
    <FormProvider {...methods}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        {showRecoveryPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-blue-50 p-4"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  Se encontró un formulario sin completar. ¿Desea recuperarlo?
                </p>
                <div className="mt-3 flex space-x-3 md:mt-0 md:ml-6">
                  <button
                    onClick={handleRecoverSession}
                    className="text-sm font-medium text-blue-700 hover:text-blue-600"
                  >
                    Recuperar
                  </button>
                  <button
                    onClick={handleDiscardSession}
                    className="text-sm font-medium text-blue-700 hover:text-blue-600"
                  >
                    Descartar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Fecha Actual"
              touched={touchedFields.date}
            >
              <Input
                type="text"
                value={formatDate(new Date())}
                readOnly
                disabled
              />
            </FormField>

            <FormField
              label="Fecha y Hora de Audiencia"
              error={dateError || formState.errors.hearingDateTime?.message}
              touched={touchedFields.hearingDateTime}
              required
              helperText="Las audiencias solo se pueden programar de lunes a viernes entre las 9:00 AM y 5:00 PM"
            >
              <Input
                type="datetime-local"
                min={`${getMinDate()}T09:00`}
                max={`${getMaxDate()}T17:00`}
                {...methods.register('hearingDateTime')}
              />
            </FormField>

            <FormField
              label="Monto de Reclamación (COP)"
              error={formState.errors.claimAmount?.message}
              touched={touchedFields.claimAmount}
              required
            >
              <Input
                type="number"
                placeholder="$0"
                {...methods.register('claimAmount', { valueAsNumber: true })}
              />
            </FormField>

            <FormField
              label="Dirección"
              error={formState.errors.address?.message}
              touched={touchedFields.address}
              required
            >
              <Input
                type="text"
                {...methods.register('address')}
              />
            </FormField>

            <FormField
              label="Departamento"
              error={formState.errors.department?.message}
              touched={touchedFields.department}
              required
            >
              <Select {...methods.register('department')}>
                <option value="">Seleccione un departamento</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Ciudad"
              error={formState.errors.city?.message}
              touched={touchedFields.city}
              required
            >
              <Select
                {...methods.register('city')}
                disabled={!selectedDepartment}
              >
                <option value="">
                  {selectedDepartment
                    ? 'Seleccione una ciudad'
                    : 'Primero seleccione un departamento'}
                </option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField
            label="Descripción del Incidente"
            error={formState.errors.description?.message}
            touched={touchedFields.description}
            required
          >
            <TextArea
              {...methods.register('description')}
              rows={4}
              minLength={100}
              maxLength={1000}
            />
          </FormField>

          <FormField
            label="Detalle su petición (opcional)"
            error={formState.errors.additionalDetails?.message}
            touched={touchedFields.additionalDetails}
          >
            <TextAreaWithCounter
              maxLength={500}
              rows={3}
              placeholder="Especifique cualquier petición o detalle adicional que considere relevante para su solicitud de audiencia..."
              {...methods.register('additionalDetails')}
            />
          </FormField>

          <ParticipantList />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className={`relative rounded-lg px-4 py-2 font-medium text-white transition-all ${
                isSubmitting || !isDirty
                  ? 'bg-primary/70 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-600'
              }`}
            >
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
              <span className={isSubmitting ? 'opacity-0' : ''}>
                Enviar Solicitud
              </span>
            </button>
          </div>
        </form>
      </motion.div>
    </FormProvider>
  );
};

export default HearingForm;

export { HearingForm }