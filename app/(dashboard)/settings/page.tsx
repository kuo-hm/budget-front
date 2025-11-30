"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { CategoryManager } from "@/components/settings/CategoryManager";
import { DangerZone } from "@/components/settings/DangerZone";
import { motion } from "framer-motion";
import { User, Shield, Tag } from "lucide-react";

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-medium">Profile Information</h3>
              <p className="text-sm text-muted-foreground">
                Update your account profile details and public information.
              </p>
            </div>
            <ProfileForm />
          </div>
          <DangerZone />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <CategoryManager />
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
