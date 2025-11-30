"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Try resizing the popup (ignored if blocked)
    try {
      window.resizeTo(500, 600);
    } catch {}

    // --- Notify parent via BroadcastChannel ---
    const channel = new BroadcastChannel("auth_channel");
    channel.postMessage({ type: "OAUTH_SUCCESS" });

    // --- Fallback: notify parent via window.opener ---
    if (window.opener) {
      try {
        window.opener.postMessage({ type: "OAUTH_SUCCESS" }, "*");
      } catch (err) {
        console.error("Fallback postMessage failed:", err);
      }
    }

    // --- Countdown timer (starts only after UI is fully rendered) ---
    let timer: NodeJS.Timeout;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Now UI is fully rendered + painted
        timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              window.close();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      });
    });

    return () => {
      clearInterval(timer);
      channel.close();
    };
  }, []);

  const handleManualClose = () => {
    window.close();
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4 max-w-[300px] w-full p-6 rounded-xl bg-card border border-border shadow-xl"
      >
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
            <CheckCircle className="h-12 w-12 text-green-500 relative z-10" />
          </motion.div>
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">Verified!</h1>
          <p className="text-sm text-muted-foreground leading-tight">
            Authentication successful. You can close this window.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs font-medium text-primary"
        >
          Closing in {countdown}s...
        </motion.div>

        <Button
          onClick={handleManualClose}
          variant="outline"
          className="w-full mt-4"
        >
          Close Window
        </Button>
      </motion.div>
    </div>
  );
}
