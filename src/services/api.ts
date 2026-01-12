/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(config?: ApiConfig) {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      timeout: config?.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          switch (error.response.status) {
            case 403:
              console.error('Forbidden: You do not have permission to access this resource');
              break;
            case 404:
              console.error('Resource not found');
              break;
            case 500:
              console.error('Internal server error');
              break;
            default:
              console.error('An error occurred:', error.message);
          }
        } else if (error.request) {
          console.error('No response received from server');
        } else {
          console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response.data;
  }

  public getInstance(): AxiosInstance {
    return this.axiosInstance;
  } 
}   

const api = new ApiService();

export default api;
export { ApiService };
