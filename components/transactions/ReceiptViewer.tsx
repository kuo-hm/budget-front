'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Download, Eye, FileText, Trash } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface ReceiptViewerProps {
  receiptUrl: string
  receiptType: 'image' | 'pdf'
  onDelete?: () => Promise<void>
  transactionId: string
}

export function ReceiptViewer({
  receiptUrl,
  receiptType,
  onDelete,
}: ReceiptViewerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) return

    setIsDeleting(true)
    try {
      await onDelete()
      setIsOpen(false)
    } catch (error) {
      console.error('Delete failed', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2"
          onClick={() => setIsOpen(true)}
        >
          <Eye className="h-4 w-4" />
          View Receipt
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex h-[80vh] w-full max-w-3xl flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Transaction Receipt</span>
              <div className="mr-6 flex items-center gap-2">
                <Button variant="outline" size="icon" asChild>
                  <a
                    href={receiptUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => void handleDelete()}
                    disabled={isDeleting}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="bg-muted/20 relative mt-4 flex flex-1 items-center justify-center overflow-hidden rounded-lg border p-4">
            {receiptType === 'image' ? (
              <div className="relative h-full min-h-[400px] w-full">
                <Image
                  src={receiptUrl}
                  alt="Receipt"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="bg-primary/10 rounded-full p-6">
                  <FileText className="text-primary h-12 w-12" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">PDF Document</h3>
                  <Button asChild>
                    <a
                      href={receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open PDF in New Tab
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
