'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { userApi, type UserProfile } from '@/lib/api/user'
import { cn } from '@/lib/utils'
import { Edit2, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface AvatarUploadProps {
  currentAvatarUrl?: string
  name?: string
  onUploadSuccess: (user: UserProfile) => void
  disabled?: boolean
  className?: string
}

export function AvatarUpload({
  currentAvatarUrl,
  name,
  onUploadSuccess,
  disabled,
  className,
}: AvatarUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(currentAvatarUrl || null)
  }, [currentAvatarUrl])

  const handleUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, etc.)')
      return
    }

    // Validate size (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setIsLoading(true)
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl) // Optimistic preview

    try {
      const updatedUser = await userApi.uploadAvatar(file)
      onUploadSuccess(updatedUser)
      toast.success('Avatar updated successfully')
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      toast.error('Failed to upload avatar')
      setPreview(currentAvatarUrl || null) // Revert
    } finally {
      setIsLoading(false)
      URL.revokeObjectURL(objectUrl)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      if (disabled || isLoading) return

      const file = e.dataTransfer.files[0]
      if (file) {
        handleUpload(file)
      }
    },
    [disabled, isLoading],
  )

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (disabled || isLoading) return

      const items = e.clipboardData?.items
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile()
            if (file) {
              handleUpload(file)
              break // Only upload one image
            }
          }
        }
      }
    },
    [disabled, isLoading],
  )

  // Global paste handler when this component is mounted
  useEffect(() => {
    window.addEventListener('paste', handlePaste)
    return () => {
      window.removeEventListener('paste', handlePaste)
    }
  }, [handlePaste])

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0])
    }
    // Reset input so same file can be selected again if needed
    e.target.value = ''
  }

  console.log(currentAvatarUrl)

  return (
    <div
      className={cn(
        'group relative flex flex-col items-center gap-4',
        className,
      )}
    >
      <div
        className={cn(
          'ring-offset-background focus:ring-ring relative h-32 w-32 cursor-pointer overflow-hidden rounded-full transition-all hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:outline-none',
          isDragging && 'ring-primary scale-105 opacity-80 ring-2',
          isLoading && 'opacity-50',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Avatar className="h-full w-full">
          <AvatarImage
            src={preview || currentAvatarUrl}
            className="object-cover"
          />
          <AvatarFallback className="text-2xl">
            {name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>

        {/* Overlay when hovering or dragging */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          ) : (
            <Edit2 className="h-8 w-8 text-white" />
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onFileInputChange}
        disabled={disabled || isLoading}
      />

      <div className="text-muted-foreground text-center text-sm">
        <p>Click, drag & drop, or paste to upload</p>
      </div>
    </div>
  )
}
