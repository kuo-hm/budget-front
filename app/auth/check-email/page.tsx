'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { authApi } from '@/lib/api/auth'
import { slideInFromRight } from '@/lib/utils/animations'
import { AxiosError } from 'axios'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Send } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { toast } from 'sonner'

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [isResending, setIsResending] = useState(false)

  const handleResend = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!email) return
    setIsResending(true)
    try {
      await authApi.resendVerification({ email })
      toast.success('Verification email sent!')
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Failed to resend email.')
      }
      toast.error('Failed to resend email.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <motion.div
      variants={slideInFromRight}
      initial="initial"
      animate="animate"
      className="mx-auto w-full max-w-md"
    >
      <Card className="bg-card/80 border-border/50 shadow-2xl backdrop-blur-xl">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3"
          >
            <Mail className="text-primary h-6 w-6" />
          </motion.div>
          <CardTitle className="text-2xl font-bold">Check your inbox</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to <br />
            <span className="text-foreground font-medium">
              {email || 'your email'}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-muted-foreground text-center text-sm">
            <p>Click the link in the email to verify your account.</p>
            <p className="mt-2">
              If you don&apos;t see the email, check your spam folder.
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={(e) => void handleResend(e)}
              disabled={!email || isResending}
            >
              <Send className="mr-2 h-4 w-4" />
              {isResending ? 'Sending...' : 'Resend Email'}
            </Button>

            <Button asChild className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function CheckEmailPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <CheckEmailContent />
      </Suspense>
    </div>
  )
}
