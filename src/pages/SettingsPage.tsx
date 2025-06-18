import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Custom Layout Components
import AppHeader from '@/components/layout/AppHeader';
import CollapsibleAppSidebar from '@/components/layout/CollapsibleAppSidebar';
import AppFooter from '@/components/layout/AppFooter';

// Shadcn/ui Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// Icons (optional, but good for settings)
import { User, Bell, Lock, Palette, Save } from 'lucide-react';

const SettingsPage = () => {
  console.log('SettingsPage loaded');

  // States for controlled inputs (example)
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane.doe@example.com");
  const [phone, setPhone] = useState("555-123-4567");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <div className="flex flex-1">
        <CollapsibleAppSidebar />
        <ScrollArea className="flex-1">
          <main className="p-6 md:p-8 lg:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Accordion type="multiple" defaultValue={['profile', 'notifications']} className="w-full space-y-6">
              {/* Profile Information Section */}
              <AccordionItem value="profile">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center">
                    <User className="mr-3 h-5 w-5 text-primary" /> Profile Information
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Profile</CardTitle>
                      <CardDescription>Update your personal details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" />
                      </div>
                      <Button className="mt-4">
                        <Save className="mr-2 h-4 w-4" /> Save Profile Changes
                      </Button>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <Separator />

              {/* Notification Preferences Section */}
              <AccordionItem value="notifications">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center">
                    <Bell className="mr-3 h-5 w-5 text-primary" /> Notification Preferences
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Manage Notifications</CardTitle>
                      <CardDescription>Choose how you receive updates from us.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive updates and alerts via email.</p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label htmlFor="sms-notifications" className="font-medium">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive critical alerts via SMS.</p>
                        </div>
                        <Switch
                          id="sms-notifications"
                          checked={smsNotifications}
                          onCheckedChange={setSmsNotifications}
                        />
                      </div>
                       <Button variant="outline" className="mt-4">
                        Save Notification Settings
                      </Button>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <Separator />

              {/* Security Settings Section */}
              <AccordionItem value="security">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center">
                    <Lock className="mr-3 h-5 w-5 text-primary" /> Security Settings
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Security</CardTitle>
                      <CardDescription>Manage your password and account security features.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Button variant="outline" className="w-full sm:w-auto">Change Password</Button>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label htmlFor="two-factor-auth" className="font-medium">Two-Factor Authentication (2FA)</Label>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                        </div>
                        <Switch
                          id="two-factor-auth"
                          checked={twoFactorAuth}
                          onCheckedChange={setTwoFactorAuth}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        For advanced security options, please contact support or visit our help center.
                      </p>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <Separator />

              {/* App Display Preferences Section */}
              <AccordionItem value="display">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center">
                    <Palette className="mr-3 h-5 w-5 text-primary" /> App Display Preferences
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Display Settings</CardTitle>
                      <CardDescription>Customize the look and feel of the application.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                          <p className="text-sm text-muted-foreground">Reduce eye strain with a darker interface.</p>
                        </div>
                        <Switch
                          id="dark-mode"
                          checked={darkMode}
                          onCheckedChange={setDarkMode}
                        />
                      </div>
                      {/* Placeholder for other display settings like font size, theme color etc. */}
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </main>
        </ScrollArea>
      </div>
      <AppFooter />
    </div>
  );
};

export default SettingsPage;