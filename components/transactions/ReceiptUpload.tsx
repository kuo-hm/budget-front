'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { FileText, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'

interface ReceiptUploadProps {
  onUpload: (file: File) => Promise<void>
  transactionId: string
}

export function ReceiptUpload({ onUpload }: ReceiptUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('Please upload an image or PDF file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert('File size must be less than 5MB')
      return
    }
    setFile(file)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 100)

    try {
      await onUpload(file)
      setProgress(100)
      // Wait for success animation
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Upload failed', error)
    } finally {
      clearInterval(interval)
      setUploading(false)
      setFile(null)
      setProgress(0)
    }
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
              isDragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50',
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center gap-2">
              <div className="bg-muted rounded-full p-3">
                <Upload className="text-muted-foreground h-6 w-6" />
              </div>
              <p className="text-sm font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-muted-foreground text-xs">
                SVG, PNG, JPG or PDF (max. 5MB)
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-muted/30 rounded-lg border p-4"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded p-2">
                  <FileText className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="max-w-[200px] truncate text-sm font-medium">
                    {file.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!uploading && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {uploading ? (
              <div className="space-y-2">
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <motion.div
                    className="bg-primary h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <p className="text-muted-foreground text-center text-xs">
                  Uploading... {progress}%
                </p>
              </div>
            ) : (
              <Button onClick={() => void handleUpload()} className="w-full">
                Upload Receipt
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
