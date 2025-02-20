interface FormAnalytics {
  formId: string;
  startTime: number;
  fieldInteractions: Record<string, number>;
  errors: Array<{
    field: string;
    error: string;
    timestamp: number;
  }>;
  completionTime?: number;
}

class FormAnalyticsTracker {
  private analytics: Map<string, FormAnalytics> = new Map();

  startTracking(formId: string) {
    this.analytics.set(formId, {
      formId,
      startTime: Date.now(),
      fieldInteractions: {},
      errors: [],
    });
  }

  trackFieldInteraction(formId: string, fieldName: string) {
    const analytics = this.analytics.get(formId);
    if (!analytics) return;

    analytics.fieldInteractions[fieldName] = 
      (analytics.fieldInteractions[fieldName] || 0) + 1;
  }

  trackError(formId: string, field: string, error: string) {
    const analytics = this.analytics.get(formId);
    if (!analytics) return;

    analytics.errors.push({
      field,
      error,
      timestamp: Date.now(),
    });
  }

  completeTracking(formId: string) {
    const analytics = this.analytics.get(formId);
    if (!analytics) return;

    analytics.completionTime = Date.now() - analytics.startTime;

    // Here you would typically send the analytics data to your backend
    console.log('Form Analytics:', analytics);

    this.analytics.delete(formId);
  }

  getAnalytics(formId: string) {
    return this.analytics.get(formId);
  }
}

export const formAnalytics = new FormAnalyticsTracker();