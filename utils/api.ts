import axios from "axios";

const API_URL = "http://localhost:5000";

// here we set our post method to reduce the redancy
export const signup = async (email: string, password: string, name: string) => {
  return await axios.post(`${API_URL}/user`, { email, password, name });
};

export const login = async (email: string, password: string) => {
  return await axios.post(`${API_URL}/login`, { email, password });
};
