import { z } from 'zod';

const phoneRegex = /^(\+57|57)?[1-9][0-9]{9}$/;
const nitRegex = /^[0-9]{9,10}-[0-9]$/;

export const userSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .regex(/^[\p{L}\s]{2,}\s+[\p{L}\s]{2,}$/u, 'Ingrese nombre y apellido'),
  email: z.string()
    .email('Ingrese un correo electrónico válido'),
  role: z.enum(['admin', 'conciliador', 'secretario', 'usuario'], {
    required_error: 'Seleccione un rol',
  }),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
});

export const companySchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido'),
  nit: z.string()
    .regex(nitRegex, 'Ingrese un NIT válido (ej: 123456789-0)'),
  address: z.string()
    .min(1, 'La dirección es requerida'),
  phone: z.string()
    .regex(phoneRegex, 'Ingrese un número de teléfono válido'),
  email: z.string()
    .email('Ingrese un correo electrónico válido'),
  type: z.enum(['aseguradora', 'empresa'], {
    required_error: 'Seleccione un tipo de empresa',
  }),
});

export const locationSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido'),
  address: z.string()
    .min(1, 'La dirección es requerida'),
  city: z.string()
    .min(1, 'Seleccione una ciudad'),
  department: z.string()
    .min(1, 'Seleccione un departamento'),
});

export const roomSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido'),
  locationId: z.string()
    .min(1, 'Seleccione una sede'),
  capacity: z.number()
    .min(1, 'La capacidad debe ser mayor a 0')
    .max(100, 'La capacidad no puede exceder 100 personas'),
});

export const holidaySchema = z.object({
  date: z.date({
    required_error: 'Seleccione una fecha',
  }),
  description: z.string()
    .min(1, 'La descripción es requerida'),
  recurring: z.boolean()
    .default(false),
});

export type UserFormSchema = z.infer<typeof userSchema>;
export type CompanyFormSchema = z.infer<typeof companySchema>;
export type LocationFormSchema = z.infer<typeof locationSchema>;
export type RoomFormSchema = z.infer<typeof roomSchema>;
export type HolidayFormSchema = z.infer<typeof holidaySchema>;