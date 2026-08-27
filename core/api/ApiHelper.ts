import { APIRequestContext, APIResponse } from '@playwright/test';
import { Logger } from '@core/utils/logger';

/**
 * Lightweight API helper wrapping Playwright's APIRequestContext.
 *
 * Provides common patterns for API testing:
 * - GET, POST, PUT, PATCH, DELETE convenience methods
 * - Automatic response logging
 * - JSON response parsing
 *
 * This is scaffolding for future API testing integration.
 * Products can extend this class to add product-specific headers or auth logic.
 *
 * @example
 * ```typescript
 * const api = new ApiHelper(this.request, this.logger);
 * const response = await api.get('/api/users/1');
 * const data = await api.parseJson(response);
 * ```
 */
export class ApiHelper {
  constructor(
    private request: APIRequestContext,
    private logger: Logger,
  ) {}

  async get(url: string, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    this.logger.http(`GET ${url}`);
    const response = await this.request.get(url, options);
    this.logger.http(`GET ${url} → ${response.status()}`);
    return response;
  }

  async post(
    url: string,
    data?: unknown,
    options?: { headers?: Record<string, string> },
  ): Promise<APIResponse> {
    this.logger.http(`POST ${url}`);
    const response = await this.request.post(url, { data, ...options });
    this.logger.http(`POST ${url} → ${response.status()}`);
    return response;
  }

  async put(
    url: string,
    data?: unknown,
    options?: { headers?: Record<string, string> },
  ): Promise<APIResponse> {
    this.logger.http(`PUT ${url}`);
    const response = await this.request.put(url, { data, ...options });
    this.logger.http(`PUT ${url} → ${response.status()}`);
    return response;
  }

  async patch(
    url: string,
    data?: unknown,
    options?: { headers?: Record<string, string> },
  ): Promise<APIResponse> {
    this.logger.http(`PATCH ${url}`);
    const response = await this.request.patch(url, { data, ...options });
    this.logger.http(`PATCH ${url} → ${response.status()}`);
    return response;
  }

  async delete(url: string, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    this.logger.http(`DELETE ${url}`);
    const response = await this.request.delete(url, options);
    this.logger.http(`DELETE ${url} → ${response.status()}`);
    return response;
  }

  /** Parse JSON response body with error handling */
  async parseJson<T = unknown>(response: APIResponse): Promise<T> {
    try {
      return (await response.json()) as T;
    } catch (err) {
      this.logger.error('Failed to parse response as JSON', err as Error);
      throw err;
    }
  }
}
