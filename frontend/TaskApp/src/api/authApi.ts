import api from './axiosInstance.ts';

const LOGIN_API_URL = "http://127.0.0.1:8000/login";

async function UserLogin(username: string, password: string) {
  // convert data fromat from jason to application/x-www-form-urlencoded
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  try {
    const response = await api.post(LOGIN_API_URL, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default UserLogin;
