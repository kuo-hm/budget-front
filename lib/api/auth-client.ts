import axios from 'axios'

const authApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default authApiClient
