import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import { hearingSchema, type HearingFormSchema } from '../../schemas/hearing';
import { ParticipantList } from './ParticipantList';
import { ClaimAmountModal } from './ClaimAmountModal';
import { departments, cities } from '../../data/colombia';
import { formatDate, getMinDate, getMaxDate, isWeekDay } from '../../utils/date';

interface ClaimAmountDetails {
  damages: number;
  deductible: number;
  subrogation: number;
}

export const TransitHearingForm = () => {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimDetails, setClaimDetails] = useState<ClaimAmountDetails>({
    damages: 0,
    deductible: 0,
    subrogation: 0,
  });
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [dateError, setDateError] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HearingFormSchema>({
    resolver: zodResolver(hearingSchema),
    defaultValues: {
      type: 'Transito',
      date: formatDate(new Date()),
      participants: [],
      claimAmount: 0,
    },
  });

  const claimAmount = watch('claimAmount');
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
      const dateOnly = hearingDateTime.split('T')[0];
      if (!isWeekDay(dateOnly)) {
        setDateError('No se pueden programar audiencias en fines de semana');
        setValue('hearingDateTime', '');
      } else {
        setDateError('');
      }
    }
  }, [hearingDateTime, setValue]);

  const handleClaimAmountClick = () => {
    setIsClaimModalOpen(true);
  };

  const handleClaimAmountSubmit = (total: number, details: ClaimAmountDetails) => {
    setValue('claimAmount', total, { shouldValidate: true });
    setClaimDetails(details);
  };

  const onSubmit = (data: HearingFormSchema) => {
    console.log({ ...data, claimDetails });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Fecha Actual"
          type="text"
          value={formatDate(new Date())}
          readOnly
          disabled
        />

        <div className="space-y-1">
          <Input
            label="Fecha y Hora de Audiencia"
            type="datetime-local"
            min={`${getMinDate()}T09:00`}
            max={`${getMaxDate()}T17:00`}
            {...register('hearingDateTime')}
            error={dateError || errors.hearingDateTime?.message}
          />
          <p className="text-sm text-gray-500">
            Las audiencias solo se pueden programar de lunes a viernes
          </p>
        </div>

        <div className="space-y-2">
          <Input
            label="Monto de Reclamación (COP)"
            type="number"
            value={claimAmount}
            onClick={handleClaimAmountClick}
            readOnly
            error={errors.claimAmount?.message}
            className="cursor-pointer"
          />
          <p className="text-sm text-gray-500">
            Haga clic para desglosar el monto
          </p>
        </div>

        <Input
          label="Número de Vehículos"
          type="number"
          {...register('vehicleCount', { valueAsNumber: true })}
          error={errors.vehicleCount?.message}
          min={0}
          max={99}
        />

        <Input
          label="Dirección"
          type="text"
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
          {availableCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
      </div>

      <TextArea
        label="Descripción del Incidente"
        {...register('description')}
        error={errors.description?.message}
        rows={4}
        minLength={100}
        maxLength={1000}
      />

      <ParticipantList />

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Enviar Solicitud
        </button>
      </div>

      <ClaimAmountModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onSubmit={handleClaimAmountSubmit}
        initialData={claimDetails}
      />
    </motion.form>
  );
};