import { format, isWeekend, addDays, isBefore, isAfter, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: es });
};

export const getMinDate = (): string => {
  let date = startOfDay(new Date());
  
  // Si la fecha actual es fin de semana, avanzar al próximo día hábil
  while (isWeekend(date)) {
    date = addDays(date, 1);
  }
  
  return date.toISOString().split('T')[0];
};

export const getMaxDate = (): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
};

export const isWeekDay = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isWeekend(date);
};

export const isValidHearingTime = (date: Date): boolean => {
  const hours = date.getHours();
  return hours >= 9 && hours < 17;
};

export const isValidHearingDate = (date: Date): boolean => {
  const today = startOfDay(new Date());
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  
  return (
    !isWeekend(date) &&
    !isBefore(date, today) &&
    !isAfter(date, maxDate)
  );
};