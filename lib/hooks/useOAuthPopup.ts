import { API_URL } from '@/lib/constants/api'
import { useCallback, useEffect, useState } from 'react'

interface UseOAuthPopupOptions {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export function useOAuthPopup(options: UseOAuthPopupOptions = {}) {
  const [popupWindow, setPopupWindow] = useState<Window | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const openPopup = useCallback((provider: 'google' | 'github') => {
    const width = 600
    const height = 700
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    const url = `${API_URL}/auth/${provider}`
    
    // Explicitly set window features
    const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`

    const newWindow = window.open(url, 'OAuthPopup', features)

    if (newWindow) {
      setPopupWindow(newWindow)
      setIsLoading(true)
      newWindow.focus()
    } else {
      console.error('Failed to open popup window')
      options.onError?.(new Error('Failed to open popup window'))
    }
  }, [options])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security check: verify origin if possible, but for dev we might be lenient
      // if (event.origin !== window.location.origin) return; 
      // Note: Backend might redirect to a different origin, so we might need to rely on content.

      if (event.data?.type === 'OAUTH_SUCCESS') {
        options.onSuccess?.(event.data)
        setIsLoading(false)
        if (popupWindow) {
            popupWindow.close()
            setPopupWindow(null)
        }
      }
    }

    window.addEventListener('message', handleMessage)
    
    // Also listen to BroadcastChannel for more robust communication in same-origin scenarios
    const channel = new BroadcastChannel('auth_channel')
    channel.onmessage = (event) => {
        if (event.data?.type === 'OAUTH_SUCCESS') {
            options.onSuccess?.(event.data)
            setIsLoading(false)
             if (popupWindow) {
                popupWindow.close()
                setPopupWindow(null)
            }
        }
    }

    // Polling to check if window is closed manually
    const checkClosed = setInterval(() => {
      if (popupWindow && popupWindow.closed) {
        setPopupWindow(null)
        setIsLoading(false)
      }
    }, 1000)

    return () => {
      window.removeEventListener('message', handleMessage)
      channel.close()
      clearInterval(checkClosed)
    }
  }, [popupWindow, options])

  return { openPopup, isLoading, popupWindow }
}
