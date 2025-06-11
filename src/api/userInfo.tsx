import { getItem } from "../store/useStore";

export const getUserInfo = async () => {
    const token = await getItem('token');
    const response = await fetch("http://10.0.2.2:8000/api/v1/users/set-time", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data.reset_time;
}