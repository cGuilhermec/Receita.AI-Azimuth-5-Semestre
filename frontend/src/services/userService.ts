// services/userService.ts

import { api } from "../components/api/api";


export const userService = {
  async createUser(userData: any) {
    const response = await api.post("/user", userData); // ✅ Usa a baseURL
    return response.data;
  },

  async getUserById(id: string) {
    const response = await api.get(`/users/${id}`); // ✅ URL completa: http://localhost:3001/users/123
    return response.data;
  },
};
