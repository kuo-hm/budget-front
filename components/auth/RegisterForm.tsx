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
import { useAuth } from '@/lib/hooks/useAuth'
import { slideInFromRight } from '@/lib/utils/animations'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function RegisterForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const { register, isLoading, error, refreshAccessToken } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep1 = () => {
    return formData.name.length >= 2 && formData.email.includes('@')
  }

  const validateStep2 = () => {
    return (
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 2 && validateStep2()) {
      const performRegister = async () => {
        try {
          await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          })
        } catch (err) {
          console.error('Registration error:', err)
        }
      }
      void performRegister()
    }
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const openOAuthPopup = (provider: 'google' | 'github') => {
    setOauthLoading(provider)
    const width = 500
    const height = 600
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    const url = `${
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
    }/auth/${provider}`

    const popup = window.open(
      url,
      'OAuth',
      `width=${width},height=${height},left=${left},top=${top}`,
    )

    // console.log('OAuth popup opened', popup)

    // --- Listen for success from popup ---
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_SUCCESS') {
        // console.log('OAuth success message received')
        setOauthLoading(null)
        popup?.close()
        window.removeEventListener('message', handleMessage)
      }
    }

    window.addEventListener('message', handleMessage)

    // --- Fallback: detect if user manually closes the popup ---
    // We removed the polling check because it was unreliable with cross-origin redirects.
    // Instead, we provide a manual "Cancel" button in the UI.
  }

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        await refreshAccessToken()
        window.location.href = '/dashboard'
      } catch (err) {
        console.error('OAuth success received but session refresh failed:', err)
      }
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data.type === 'OAUTH_SUCCESS') {
        handleSuccess()
      }
    }

    // Listen to window messages (legacy/backup)
    window.addEventListener('message', handleMessage)

    // Listen to BroadcastChannel (robust)
    const channel = new BroadcastChannel('auth_channel')
    channel.onmessage = (event) => {
      if (event.data.type === 'OAUTH_SUCCESS') {
        handleSuccess()
      }
    }

    return () => {
      window.removeEventListener('message', handleMessage)
      channel.close()
    }
  }, [refreshAccessToken])

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
            <User className="text-primary h-6 w-6" />
          </motion.div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            {step === 1
              ? 'Step 1 of 2: Personal Information'
              : 'Step 2 of 2: Security Settings'}
          </CardDescription>
          <div className="mt-4 flex justify-center gap-2">
            <div
              className={`h-1 flex-1 rounded-full ${
                step >= 1 ? 'bg-primary' : 'bg-muted'
              }`}
            />
            <div
              className={`h-1 flex-1 rounded-full ${
                step >= 2 ? 'bg-primary' : 'bg-muted'
              }`}
            />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-destructive bg-destructive/10 border-destructive/20 rounded-md border p-3 text-sm"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <User className="h-4 w-4" />
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
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
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep1() || isLoading}
                    className="w-full"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <Lock className="h-4 w-4" />
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange('password', e.target.value)
                        }
                        required
                        disabled={isLoading}
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Must be at least 8 characters long
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <Lock className="h-4 w-4" />
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange('confirmPassword', e.target.value)
                        }
                        required
                        disabled={isLoading}
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {formData.password &&
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <p className="text-destructive text-xs">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={!validateStep2() || isLoading}
                      className="flex-1"
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="border-border w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card text-muted-foreground px-2">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                type="button"
                disabled={isLoading || !!oauthLoading}
                onClick={() => openOAuthPopup('google')}
                className="cursor-pointer"
              >
                {oauthLoading === 'google' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                Google
              </Button>
              <Button
                variant="outline"
                type="button"
                disabled={isLoading || !!oauthLoading}
                onClick={() => openOAuthPopup('github')}
                className="cursor-pointer"
              >
                {oauthLoading === 'github' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                )}
                GitHub
              </Button>
            </div>

            {!!oauthLoading && (
              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={() => setOauthLoading(null)}
                  className="text-muted-foreground hover:text-primary text-xs underline"
                >
                  Cancel connection
                </button>
              </div>
            )}

            <div className="text-muted-foreground pt-4 text-center text-sm">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
