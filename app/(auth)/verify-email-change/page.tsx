'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useVerifyEmailChange } from '@/lib/hooks/useUser'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

function VerifyEmailChangeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const {
    mutate: verify,
    isPending,
    isSuccess,
    isError,
    error,
  } = useVerifyEmailChange()
  const attempted = useRef(false)

  useEffect(() => {
    const token = searchParams.get('token')
    const code = searchParams.get('code')

    if (token && code && !attempted.current) {
      attempted.current = true
      verify({ token, code })
    }
  }, [searchParams, verify])

  if (!searchParams.get('token') || !searchParams.get('code')) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <XCircle className="h-6 w-6" /> Invalid Link
          </CardTitle>
          <CardDescription>
            The verification link is missing required parameters.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" onClick={() => router.push('/settings')}>
            Return to Settings
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isPending && <Loader2 className="h-6 w-6 animate-spin" />}
          {isSuccess && <CheckCircle className="h-6 w-6 text-green-500" />}
          {isError && <XCircle className="text-destructive h-6 w-6" />}
          {isPending
            ? 'Verifying...'
            : isSuccess
              ? 'Verified!'
              : 'Verification Failed'}
        </CardTitle>
        <CardDescription>
          {isPending && 'Please wait while we verify your new email address.'}
          {isSuccess && 'Your email has been successfully updated.'}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(isError && (error as any)?.response?.data?.message) ||
            'An error occurred during verification.'}
        </CardDescription>
      </CardHeader>
      <CardContent>{/* Optional Content */}</CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => router.push(isSuccess ? '/settings' : '/settings')}
          disabled={isPending}
        >
          {isSuccess ? 'Continue' : 'Back to Settings'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function VerifyEmailChangePage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        <VerifyEmailChangeContent />
      </Suspense>
    </div>
  )
}
