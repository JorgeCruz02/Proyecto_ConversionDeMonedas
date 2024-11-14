/*
  Define las URL de la api web
*/

const BASE_URL = 'http://monsterballgo.com/api';
const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest/'; // Base URL de la API


export const Endpoints = {
  LOGIN:`${BASE_URL}/login.php`,
  REGISTER:`${BASE_URL}/register.php`,
  SET_PROFILE_PICTURE:`${BASE_URL}/setpfp.php`,
  DIVISA:`${API_BASE_URL}`,
  DIVISA_DEFAULT:`${API_BASE_URL}USD`
}