import { API_BASE_URL } from '@/config/config'
import axios from 'axios'

interface AddVideoPayload {
  video_url: string
  video_title: string
  estimated_duration_seconds: number
  video_source?: string
}

interface VideoStreamToken {
  stream_token: string
  expires_in: number
  video_title: string
}

class VideoService {
  /**
   * Add a video to a course module
   */
  async addVideo(courseId: number, moduleId: number, payload: AddVideoPayload, token: string) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/courses/${courseId}/modules/${moduleId}/add-video`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return { success: true, data: response.data }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      }
    }
  }

  /**
   * Update a video in a course module
   */
  async updateVideo(
    courseId: number,
    moduleId: number,
    payload: AddVideoPayload,
    token: string
  ) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/courses/${courseId}/modules/${moduleId}/video`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return { success: true, data: response.data }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      }
    }
  }

  /**
   * Delete a video from a course module
   */
  async deleteVideo(courseId: number, moduleId: number, token: string) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/courses/${courseId}/modules/${moduleId}/video`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return { success: true, data: response.data }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      }
    }
  }

  /**
   * Get stream token for video playback
   */
  async getStreamToken(
    courseId: number,
    moduleId: number,
    token: string
  ): Promise<VideoStreamToken | null> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/courses/${courseId}/modules/${moduleId}/video-stream-token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error: any) {
      console.error('Failed to get stream token:', error.response?.data?.error)
      return null
    }
  }

  /**
   * Get video proxy URL for streaming
   */
  getVideoProxyUrl(token: string): string {
    return `${API_BASE_URL}/videos/stream?token=${token}`
  }
}

export default new VideoService()
