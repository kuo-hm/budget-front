'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Loader2, MailCheck } from 'lucide-react';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async () => {
        if (!token) {
            toast.error('Invalid verification link. Missing token.');
            return;
        }

        if (code.length !== 6) {
            toast.error('Please enter a valid 6-digit code.');
            return;
        }

        setIsLoading(true);
        try {
            await authApi.verifyEmail({ token, code });
            toast.success('Email verified successfully!');
            router.push('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to verify email.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <Card className="w-full max-w-md mx-auto mt-20">
                <CardHeader>
                    <CardTitle className="text-destructive">Invalid Link</CardTitle>
                    <CardDescription>
                        This verification link is invalid or has expired. Please request a new one.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push('/login')} className="w-full">
                        Back to Login
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-20">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MailCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Verify your Email</CardTitle>
                <CardDescription>
                    Enter the 6-digit code sent to your email address.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col items-center">
                <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={(value) => setCode(value)}
                    disabled={isLoading}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>

                <Button
                    onClick={handleVerify}
                    className="w-full"
                    disabled={isLoading || code.length !== 6}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify Email
                </Button>
            </CardContent>
        </Card>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
