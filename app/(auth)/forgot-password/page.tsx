'use client';

import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/utils/animations';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="relative z-10 w-full px-4"
      >
        <ForgotPasswordForm />
      </motion.div>
    </div>
  );
}
