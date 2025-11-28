'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function VerifiedPage() {
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        // Notify the opener window that authentication was successful
        if (window.opener) {
            window.opener.postMessage({ type: 'OAUTH_SUCCESS' }, window.location.origin);
        }

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        // Close the window after 3 seconds
        const closeTimer = setTimeout(() => {
            window.close();
        }, 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(closeTimer);
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md mx-auto text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-600">
                        Authentication Successful!
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        You have been successfully verified.
                    </p>
                    <p className="text-sm font-medium">
                        Closing window in {countdown} seconds...
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
