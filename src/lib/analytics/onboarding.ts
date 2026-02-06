// Analytics utility for tracking user behavior during testing
type EventData = {
  [key: string]: string | number | boolean;
};

interface OnboardingEvent {
  userId?: string;
  step: number;
  action: string;
  data?: EventData;
  timestamp: string;
  userAgent: string;
  viewport: string;
  sessionId: string;
}

class OnboardingAnalytics {
  private sessionId: string;
  private events: OnboardingEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private getViewport(): string {
    if (typeof window === 'undefined') return 'unknown';
    return `${window.innerWidth}x${window.innerHeight}`;
  }

  // Track step progression
  trackStepView(step: number, data?: EventData) {
    this.addEvent({
      step,
      action: 'step_view',
      data,
    });
  }

  // Track step completion
  trackStepComplete(step: number, data?: EventData) {
    this.addEvent({
      step,
      action: 'step_complete',
      data,
    });
  }

  // Track validation errors
  trackValidationError(step: number, field: string, error: string) {
    this.addEvent({
      step,
      action: 'validation_error',
      data: { field, error },
    });
  }

  // Track form abandonment
  trackFormAbandon(step: number, timeOnStep: number) {
    this.addEvent({
      step,
      action: 'form_abandon',
      data: { timeOnStep },
    });
  }

  // Track successful submission
  trackSubmissionSuccess(userId: string, totalTime: number) {
    this.addEvent({
      step: 5,
      action: 'submission_success',
      userId,
      data: { totalTime },
    });
  }

  // Track submission errors
  trackSubmissionError(error: string, attempt: number) {
    this.addEvent({
      step: 5,
      action: 'submission_error',
      data: { error, attempt },
    });
  }

  // Track OCR performance
  trackOCRPerformance(success: boolean, processingTime: number, confidence?: number) {
    this.addEvent({
      step: 2,
      action: 'ocr_performance',
      data: { 
        success, 
        processingTime, 
        ...(confidence !== undefined && { confidence })
      },
    });
  }

  // Track device/browser issues
  trackTechnicalError(error: string, step: number, context?: string) {
    this.addEvent({
      step,
      action: 'technical_error',
      data: { 
        error, 
        ...(context && { context })
      },
    });
  }

  // Track user feedback
  trackFeedback(rating: number, comment: string, step?: number) {
    this.addEvent({
      step: step || 0,
      action: 'user_feedback',
      data: { rating, comment },
    });
  }

  private addEvent(eventData: Omit<OnboardingEvent, 'timestamp' | 'userAgent' | 'viewport' | 'sessionId'>) {
    const event: OnboardingEvent = {
      ...eventData,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      viewport: this.getViewport(),
      sessionId: this.sessionId,
    };

    this.events.push(event);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
    }

    // Send to analytics service (implement based on your preference)
    this.sendToAnalytics(event);
  }

  private async sendToAnalytics(event: OnboardingEvent) {
    try {
      // Option 1: Send to your own analytics endpoint
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });

      // Option 2: Send to Google Analytics 4 (if configured)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event.action, {
          custom_parameter_step: event.step,
          custom_parameter_session: event.sessionId,
          ...event.data,
        });
      }

      // Option 3: Send to Supabase for storage
      // await supabase.from('analytics_events').insert(event);

    } catch (error) {
      console.warn('Failed to send analytics event:', error);
    }
  }

  // Get session summary for debugging
  getSessionSummary() {
    const stepCounts = this.events.reduce((acc, event) => {
      acc[event.step] = (acc[event.step] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const errorCount = this.events.filter(e => 
      e.action.includes('error') || e.action.includes('abandon')
    ).length;

    return {
      sessionId: this.sessionId,
      totalEvents: this.events.length,
      stepCounts,
      errorCount,
      duration: this.events.length > 0 
        ? Date.now() - new Date(this.events[0].timestamp).getTime()
        : 0,
    };
  }

  // Export events for analysis
  exportEvents() {
    return [...this.events];
  }
}

// Singleton instance
const analytics = new OnboardingAnalytics();

export default analytics;

// Convenience exports
export const trackStepView = analytics.trackStepView.bind(analytics);
export const trackStepComplete = analytics.trackStepComplete.bind(analytics);
export const trackValidationError = analytics.trackValidationError.bind(analytics);
export const trackFormAbandon = analytics.trackFormAbandon.bind(analytics);
export const trackSubmissionSuccess = analytics.trackSubmissionSuccess.bind(analytics);
export const trackSubmissionError = analytics.trackSubmissionError.bind(analytics);
export const trackOCRPerformance = analytics.trackOCRPerformance.bind(analytics);
export const trackTechnicalError = analytics.trackTechnicalError.bind(analytics);
export const trackFeedback = analytics.trackFeedback.bind(analytics);