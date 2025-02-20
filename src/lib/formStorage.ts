import { debounce } from 'lodash';

const STORAGE_PREFIX = 'form_autosave_';
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export interface FormSession {
  formId: string;
  data: any;
  lastModified: number;
  completed: boolean;
}

// Helper function to handle localStorage operations with error handling
const safeLocalStorageGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error getting item from localStorage:', error);
    return null;
  }
};

const safeLocalStorageSet = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting item to localStorage:', error);
  }
};

const safeLocalStorageRemove = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item from localStorage:', error);
  }
};

// Save form data with debounce
export const saveFormData = debounce((formId: string, data: any) => {
  const session: FormSession = {
    formId,
    data,
    lastModified: Date.now(),
    completed: false,
  };
  safeLocalStorageSet(`${STORAGE_PREFIX}${formId}`, JSON.stringify(session));
}, 1000);

// Load form data from localStorage
export const loadFormData = (formId: string): FormSession | null => {
  const data = safeLocalStorageGet(`${STORAGE_PREFIX}${formId}`);
  if (!data) return null;

  try {
    const session: FormSession = JSON.parse(data);

    // Check if the session is expired or marked as completed
    const expired = Date.now() - session.lastModified > SESSION_EXPIRY;
    if (expired || session.completed) {
      clearFormData(formId);  // Cleanup expired or completed session
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error loading form data:', error);
    return null;
  }
};

// Clear form data from localStorage
export const clearFormData = (formId: string): void => {
  safeLocalStorageRemove(`${STORAGE_PREFIX}${formId}`);
};

// Mark the form as completed and update the session
export const markFormCompleted = (formId: string): void => {
  const data = safeLocalStorageGet(`${STORAGE_PREFIX}${formId}`);
  if (!data) return;

  try {
    const session: FormSession = JSON.parse(data);
    session.completed = true;
    safeLocalStorageSet(`${STORAGE_PREFIX}${formId}`, JSON.stringify(session));
  } catch (error) {
    console.error('Error marking form as completed:', error);
  }
};
