import { z } from 'zod';
import { isWeekDay } from '../utils/date';

const colombianDocumentRegex = /^[0-9]{8,10}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const participantSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .regex(/^[\p{L}\s]{2,}\s+[\p{L}\s]{2,}$/u, 'Ingrese al menos dos palabras'),
  documentId: z.string()
    .regex(colombianDocumentRegex, 'Ingrese un número de documento válido'),
  entityType: z.enum(['natural', 'juridico'], {
    required_error: 'Seleccione un tipo de entidad',
  }),
  email: z.string()
    .regex(emailRegex, 'Ingrese un correo electrónico válido'),
  role: z.enum(['convocado', 'convocador', 'conciliador'], {
    required_error: 'Seleccione un rol',
  }),
});

export const hearingSchema = z.object({
  type: z.enum(['Transito', 'Otros'], {
    required_error: 'Seleccione un tipo de audiencia',
  }),
  date: z.string(),
  hearingDateTime: z.string({
    required_error: 'Seleccione fecha y hora de la audiencia',
  }).refine((date) => {
    const dateOnly = date.split('T')[0];
    return isWeekDay(dateOnly);
  }, 'No se pueden programar audiencias en fines de semana')
  .refine((date) => {
    const time = new Date(date).getHours();
    return time >= 9 && time < 17;
  }, 'Las audiencias solo se pueden programar entre las 9:00 AM y 5:00 PM'),
  claimAmount: z.number()
    .min(1, 'El monto debe ser mayor a 0')
    .max(999999999, 'El monto no puede exceder 999,999,999'),
  vehicleCount: z.number()
    .min(0, 'El número de vehículos no puede ser negativo')
    .max(99, 'El número de vehículos no puede exceder 99'),
  address: z.string()
    .min(1, 'La dirección es requerida'),
  department: z.string()
    .min(1, 'Seleccione un departamento'),
  city: z.string()
    .min(1, 'Seleccione una ciudad'),
  description: z.string()
    .min(100, 'La descripción debe tener al menos 100 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  additionalDetails: z.string()
    .max(500, 'Los detalles adicionales no pueden exceder 500 caracteres')
    .optional()
    .transform(val => val || ''),
  participants: z.array(participantSchema)
    .min(1, 'Debe agregar al menos un participante'),
});

export type HearingFormSchema = z.infer<typeof hearingSchema>;
export type ParticipantFormSchema = z.infer<typeof participantSchema>;