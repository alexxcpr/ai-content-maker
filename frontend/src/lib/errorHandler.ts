// Tipuri de erori
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  API_ERROR = 'API_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// Funcții helper pentru crearea erorilor
export const createNetworkError = (message: string = 'Eroare de rețea'): AppError => ({
  type: ErrorType.NETWORK_ERROR,
  message,
  code: 'NETWORK_ERROR'
});

export const createValidationError = (message: string, details?: any): AppError => ({
  type: ErrorType.VALIDATION_ERROR,
  message,
  code: 'VALIDATION_ERROR',
  details
});

export const createApiError = (message: string, status?: number, code?: string): AppError => ({
  type: ErrorType.API_ERROR,
  message,
  status,
  code: code || 'API_ERROR'
});

export const createTimeoutError = (message: string = 'Cererea a expirat'): AppError => ({
  type: ErrorType.TIMEOUT_ERROR,
  message,
  code: 'TIMEOUT_ERROR'
});

export const createUnknownError = (message: string = 'A apărut o eroare neașteptată'): AppError => ({
  type: ErrorType.UNKNOWN_ERROR,
  message,
  code: 'UNKNOWN_ERROR'
});

// Funcție pentru normalizarea erorilor
export const normalizeError = (error: unknown): AppError => {
  if (error instanceof Error) {
    // Verifică dacă este o eroare de tip fetch
    if (error.message.includes('fetch')) {
      return createNetworkError('Nu se poate conecta la server. Verificați conexiunea la internet.');
    }
    
    // Verifică dacă este timeout
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return createTimeoutError('Cererea a durat prea mult. Încercați din nou.');
    }
    
    // Verifică dacă este o eroare API cu informații structurate
    const apiError = error as any;
    if (apiError.status && apiError.code) {
      return createApiError(error.message, apiError.status, apiError.code);
    }
    
    return createUnknownError(error.message);
  }
  
  if (typeof error === 'string') {
    return createUnknownError(error);
  }
  
  return createUnknownError();
};

// Funcție pentru obținerea mesajului user-friendly
export const getErrorMessage = (error: AppError): string => {
  switch (error.type) {
    case ErrorType.NETWORK_ERROR:
      return 'Nu se poate conecta la server. Verificați conexiunea la internet și încercați din nou.';
    
    case ErrorType.VALIDATION_ERROR:
      return error.message || 'Datele introduse nu sunt valide. Verificați și încercați din nou.';
    
    case ErrorType.API_ERROR:
      if (error.status === 429) {
        return 'Ați făcut prea multe cereri. Vă rugăm așteptați puțin și încercați din nou.';
      }
      if (error.status === 404) {
        return 'Resursa solicitată nu a fost găsită.';
      }
      if (error.status === 500) {
        return 'Eroare de server. Vă rugăm încercați din nou mai târziu.';
      }
      return error.message || 'A apărut o eroare la server.';
    
    case ErrorType.TIMEOUT_ERROR:
      return 'Cererea a durat prea mult. Verificați conexiunea și încercați din nou.';
    
    default:
      return error.message || 'A apărut o eroare neașteptată. Vă rugăm încercați din nou.';
  }
};

// Funcție pentru logging erorilor (poate fi extinsă cu servicii externe)
export const logError = (error: AppError, context?: string) => {
  const errorInfo = {
    type: error.type,
    message: error.message,
    code: error.code,
    status: error.status,
    context,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown'
  };
  
  console.error('Application Error:', errorInfo);
  
  // În producție, aici ai putea trimite eroarea către un serviciu de monitoring
  // cum ar fi Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // Exemplu: trimite către serviciu de monitoring
    // sendToMonitoringService(errorInfo);
  }
};

// Hook React pentru gestionarea erorilor
export const useErrorHandler = () => {
  const handleError = (error: unknown, context?: string) => {
    const normalizedError = normalizeError(error);
    logError(normalizedError, context);
    return normalizedError;
  };
  
  return { handleError, getErrorMessage, normalizeError };
};