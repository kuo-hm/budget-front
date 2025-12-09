import { API_URL } from '@/lib/constants/api'
import axios from 'axios'

const authApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default authApiClient
