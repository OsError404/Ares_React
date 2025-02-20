import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { formAnalytics } from '../lib/analytics';

export const useFormAnalytics = (formId: string) => {
  const { formState } = useFormContext();
  const { errors, touchedFields, isSubmitting, isSubmitSuccessful } = formState;

  useEffect(() => {
    formAnalytics.startTracking(formId);
    
    return () => {
      if (isSubmitSuccessful) {
        formAnalytics.completeTracking(formId);
      }
    };
  }, [formId, isSubmitSuccessful]);

  useEffect(() => {
    if (Object.keys(touchedFields).length > 0) {
      Object.keys(touchedFields).forEach(field => {
        formAnalytics.trackFieldInteraction(formId, field);
      });
    }
  }, [formId, touchedFields]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, error]) => {
        if (error?.message) {
          formAnalytics.trackError(formId, field, error.message);
        }
      });
    }
  }, [formId, errors]);

  return {
    isSubmitting,
    isSubmitSuccessful,
  };
};