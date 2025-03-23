import api from "@/utils/api.util"

export const oauth2Google = async () => {
  try {
    const data = await api.get<{ url: string }>('/auth/google-oauth2', {
      headers: {
        "Access-Control-Allow-Origin                                                                         ": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, application/json",
      }
    })
    console.log('data', data)
  } catch (error) {
    console.error(error)
  }
}