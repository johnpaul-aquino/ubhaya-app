/**
 * Profile Page
 * /dashboard/profile
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ProfileForm } from '@/components/profile/profile-form';
import { PasswordChangeForm } from '@/components/profile/password-change-form';
import { AvatarUpload } from '@/components/profile/avatar-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { BlurFade } from '@/components/ui/blur-fade';
import { User, Shield, Users, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  whatsappNumber?: string | null;
  avatar?: string | null;
  role: string;
  createdAt: string;
  lastLoginAt?: string | null;
  team?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  } | null;
}

const roleColors: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  TEAM_LEADER: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  MEMBER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  VIEWER: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();

      if (!data.success) {
        toast.error(data.error || 'Failed to load profile');
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle avatar change
  const handleAvatarChange = (url: string | null) => {
    if (user) {
      setUser({ ...user, avatar: url });
    }
  };

  // Generate initials
  const getInitials = () => {
    if (!user) return 'U';
    const firstInitial = user.firstName?.[0] || '';
    const lastInitial = user.lastName?.[0] || '';
    return (firstInitial && lastInitial)
      ? `${firstInitial}${lastInitial}`.toUpperCase()
      : (user.email?.[0] || 'U').toUpperCase();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="mb-6">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>

          {/* Profile card skeleton */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Skeleton className="h-28 w-28 rounded-full" />
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                  <Skeleton className="h-5 w-32 mx-auto md:mx-0" />
                  <Skeleton className="h-4 w-24 mx-auto md:mx-0" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form skeletons */}
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-32 ml-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Failed to load profile</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <BlurFade delay={0.1} inView>
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Profile Settings</h1>
            </div>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </BlurFade>

        <div className="space-y-6">
          {/* Profile Header Card */}
          <BlurFade delay={0.15} inView>
            <Card className="overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
              <CardContent className="-mt-12 pb-6">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                  {/* Avatar */}
                  <AvatarUpload
                    currentAvatarUrl={user.avatar}
                    initials={getInitials()}
                    onAvatarChange={handleAvatarChange}
                  />

                  {/* User Info */}
                  <div className="flex-1 text-center md:text-left space-y-2 md:pb-2">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                      <h2 className="text-2xl font-bold">
                        {user.firstName} {user.lastName}
                      </h2>
                      <Badge className={roleColors[user.role] || roleColors.VIEWER}>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{user.email}</p>
                    {user.whatsappNumber && (
                      <p className="text-sm text-muted-foreground">
                        WhatsApp: {user.whatsappNumber}
                      </p>
                    )}
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Joined{' '}
                        {formatDistanceToNow(new Date(user.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      {user.lastLoginAt && (
                        <>
                          <Separator orientation="vertical" className="h-4" />
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Last login{' '}
                            {formatDistanceToNow(new Date(user.lastLoginAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>

          {/* Team Information */}
          {user.team && (
            <BlurFade delay={0.2} inView>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Team
                  </CardTitle>
                  <CardDescription>Your team membership</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{user.team.name}</h3>
                    {user.team.description && (
                      <p className="text-sm text-muted-foreground">
                        {user.team.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Slug: {user.team.slug}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          )}

          {/* Personal Information */}
          <BlurFade delay={0.25} inView>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm
                  user={{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    whatsappNumber: user.whatsappNumber,
                  }}
                />
              </CardContent>
            </Card>
          </BlurFade>

          {/* Change Password */}
          <BlurFade delay={0.3} inView>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security
                </CardTitle>
                <CardDescription>
                  Change your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PasswordChangeForm />
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
    </DashboardLayout>
  );
}
