import { GenerateContentRequest, GeneratedContent } from '@/types/content.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

interface ApiError extends Error {
  status?: number;
  code?: string;
}

class ApiService {
  private createAbortController(): AbortController {
    return new AbortController();
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit & { timeout?: number }
  ): Promise<T> {
    const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options || {};
    const url = `${API_BASE_URL}${endpoint}`;
    
    const controller = this.createAbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    };

    const mergedOptions = {
      ...defaultOptions,
      ...fetchOptions,
      headers: {
        ...defaultOptions.headers,
        ...(fetchOptions?.headers || {}),
      },
    };

    try {
      const response = await fetch(url, mergedOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorCode = 'HTTP_ERROR';

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
          errorCode = errorData.code || errorCode;
        } catch {
          // If response is not JSON, use default error message
        }

        const error = new Error(errorMessage) as ApiError;
        error.status = response.status;
        error.code = errorCode;
        throw error;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          const timeoutError = new Error('Request timeout') as ApiError;
          timeoutError.code = 'TIMEOUT';
          throw timeoutError;
        }
        
        if (error.message.includes('fetch')) {
          const networkError = new Error('Network error - please check your connection') as ApiError;
          networkError.code = 'NETWORK_ERROR';
          throw networkError;
        }
      }

      console.error('API Error:', error);
      throw error;
    }
  }

  // Content Generation
  async generateContent(data: GenerateContentRequest): Promise<{ contentId: string; status: string; message: string }> {
    if (!data.userPrompt || data.userPrompt.trim().length < 10) {
      throw new Error('Promptul trebuie să aibă cel puțin 10 caractere');
    }

    if (data.numberOfScenes < 1 || data.numberOfScenes > 10) {
      throw new Error('Numărul de scene trebuie să fie între 1 și 10');
    }

    return this.request('/content/generate', {
      method: 'POST',
      body: JSON.stringify(data),
      timeout: 60000, // 1 minute for generation requests
    });
  }

  async getContent(id: string): Promise<GeneratedContent> {
    if (!id || typeof id !== 'string') {
      throw new Error('ID-ul conținutului este necesar');
    }

    return this.request(`/content/${encodeURIComponent(id)}`);
  }

  async getScene(contentId: string, sceneNumber: number) {
    if (!contentId || typeof contentId !== 'string') {
      throw new Error('ID-ul conținutului este necesar');
    }

    if (!Number.isInteger(sceneNumber) || sceneNumber < 1 || sceneNumber > 10) {
      throw new Error('Numărul scenei trebuie să fie între 1 și 10');
    }

    return this.request(`/content/${encodeURIComponent(contentId)}/scene/${sceneNumber}`);
  }

  async updateScene(contentId: string, sceneNumber: number, data: any) {
    if (!contentId || typeof contentId !== 'string') {
      throw new Error('ID-ul conținutului este necesar');
    }

    if (!Number.isInteger(sceneNumber) || sceneNumber < 1 || sceneNumber > 10) {
      throw new Error('Numărul scenei trebuie să fie între 1 și 10');
    }

    return this.request(`/content/${encodeURIComponent(contentId)}/scene/${sceneNumber}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAvailableModels() {
    return this.request('/content/settings/models');
  }

  // Polling pentru status cu improved error handling și cleanup
  async pollContentStatus(
    contentId: string,
    onUpdate: (content: GeneratedContent) => void,
    options: {
      interval?: number;
      maxRetries?: number;
      onError?: (error: Error) => void;
      onComplete?: () => void;
    } = {}
  ): Promise<() => void> {
    const {
      interval = 2000,
      maxRetries = 10,
      onError,
      onComplete
    } = options;

    let retryCount = 0;
    let isPolling = true;
    let timeoutId: NodeJS.Timeout;

    const stopPolling = () => {
      isPolling = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    const poll = async () => {
      if (!isPolling) return;

      try {
        const content = await this.getContent(contentId);
        onUpdate(content);
        retryCount = 0; // Reset retry count on success

        if (content.overallStatus !== 'processing') {
          stopPolling();
          onComplete?.();
          return;
        }

        if (isPolling) {
          timeoutId = setTimeout(poll, interval);
        }
      } catch (error) {
        console.error('Polling error:', error);
        retryCount++;

        if (retryCount >= maxRetries) {
          stopPolling();
          onError?.(error instanceof Error ? error : new Error('Unknown polling error'));
          return;
        }

        // Exponential backoff for retries
        const backoffDelay = Math.min(interval * Math.pow(2, retryCount), 30000);
        if (isPolling) {
          timeoutId = setTimeout(poll, backoffDelay);
        }
      }
    };

    // Start polling
    poll();

    // Return cleanup function
    return stopPolling;
  }
}

export const apiService = new ApiService(); 