import axios from 'axios';
import Cookies from 'js-cookie';
import { ILoginInput, IRegisterInput, ParentScheduleData } from '../types';
import { ScheduleEntry } from '../pages/Tables/ScheduleTable';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data: IRegisterInput) => api.post('/auth/register', data),

  login: (data: ILoginInput) => api.post('/auth/login', data),

  getCurrentUser: () => api.get('/auth/me'),

  logout: () => {
    Cookies.remove('token');
  },
};

export const uploadApi = {
  uploadAvatar: (formData: FormData) =>
    api.post('/uploadAvatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export interface ScheduleData {
  month: string;
  year: string;
  entries: ScheduleEntry[];
}

export const scheduleApi = {
  submitSchedule: async (scheduleData: ScheduleData) => {
    const response = await api.post(`/schedule`, scheduleData);
    return response.data;
  },

  getSchedule: async (month: string, year: string) => {
    const response = await api.get(`/schedule?month=${month}&year=${year}`);
    return response.data;
  },

  getScheduleStats: async (month: string, day: string, year: string) => {
    const response = await api.get(
      `/schedule/stats?month=${month}&day=${day}&year=${year}`
    );
    return response.data;
  },

  submitScheduleStats: async (
    month: string,
    day: string,
    year: string,
    scheduleData: ParentScheduleData[]
  ) => {
    const response = await api.post(`/schedule/stats`, {
      month,
      day,
      year,
      scheduleUpdates: scheduleData,
    });
    return response.data;
  },

  updateScheduleStats: async (
    month: string,
    year: string,
    day: string,
    scheduleUpdates: any[]
  ) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/schedule/stats?month=${month}&year=${year}&day=${day}`,
      { scheduleUpdates },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

export default api;
