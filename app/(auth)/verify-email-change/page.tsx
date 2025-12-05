"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useVerifyEmailChange } from "@/lib/hooks/useUser";

function VerifyEmailChangeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutate: verify, isPending, isSuccess, isError, error } = useVerifyEmailChange();
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const code = searchParams.get("code");

    if (token && code && !attempted) {
      setAttempted(true);
      verify({ token, code });
    }
  }, [searchParams, verify, attempted]);

  if (!searchParams.get("token") || !searchParams.get("code")) {
    return (
      <Card className="w-full max-w-md mx-auto">
         <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <XCircle className="h-6 w-6" /> Invalid Link
          </CardTitle>
          <CardDescription>
            The verification link is missing required parameters.
          </CardDescription>
        </CardHeader>
        <CardFooter>
            <Button className="w-full" onClick={() => router.push("/settings")}>
                Return to Settings
            </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            {isPending && <Loader2 className="h-6 w-6 animate-spin" />}
            {isSuccess && <CheckCircle className="h-6 w-6 text-green-500" />}
            {isError && <XCircle className="h-6 w-6 text-destructive" />}
            {isPending ? "Verifying..." : isSuccess ? "Verified!" : "Verification Failed"}
        </CardTitle>
        <CardDescription>
          {isPending && "Please wait while we verify your new email address."}
          {isSuccess && "Your email has been successfully updated."}
          {isError && (error as any)?.response?.data?.message || "An error occurred during verification."}
        </CardDescription>
      </CardHeader>
      <CardContent>
         {/* Optional Content */}
      </CardContent>
      <CardFooter>
        <Button 
            className="w-full" 
            onClick={() => router.push(isSuccess ? "/settings" : "/settings")}
            disabled={isPending}
        >
            {isSuccess ? "Continue" : "Back to Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailChangePage() {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <VerifyEmailChangeContent />
            </Suspense>
        </div>
    );
}
