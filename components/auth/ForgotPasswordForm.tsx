'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { authApi } from '@/lib/api/auth'
import { slideInFromRight } from '@/lib/utils/animations'
import { AxiosError } from 'axios'
import { motion } from 'framer-motion'
import { ArrowLeft, KeyRound, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authApi.forgotPassword({ email })
      setIsSubmitted(true)
      toast.success('Reset link sent successfully!')
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ||
            'Failed to send reset link. Please try again.',
        )
      } else {
        toast.error('Failed to send reset link. Please try again.')
      }
    } finally {
      setIsLoading(false)
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
        <CardHeader className="space-y-1 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3"
          >
            <KeyRound className="text-primary h-6 w-6" />
          </motion.div>
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="space-y-4 text-center">
              <div className="bg-primary/10 text-primary rounded-lg p-4 text-sm">
                If an account exists for <strong>{email}</strong>, you will
                receive password reset instructions.
              </div>
              <Button asChild className="w-full" variant="outline">
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-primary flex items-center justify-center gap-2 text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
