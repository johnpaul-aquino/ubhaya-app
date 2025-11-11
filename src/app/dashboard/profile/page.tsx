/**
 * Profile Page
 * /dashboard/profile
 */

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/profile/profile-form';
import { PasswordChangeForm } from '@/components/profile/password-change-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Settings - Ubhaya Supply Chain',
  description: 'Manage your profile and account settings',
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch full user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    TEAM_LEADER: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    MEMBER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    VIEWER: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    {user.firstName} {user.lastName}
                  </h2>
                  <Badge className={roleColors[user.role]}>
                    {user.role.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{user.email}</p>
                {user.whatsappNumber && (
                  <p className="text-sm text-muted-foreground">
                    WhatsApp: {user.whatsappNumber}
                  </p>
                )}
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>
                    Joined{' '}
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  {user.lastLoginAt && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <span>
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

        {/* Team Information */}
        {user.team && (
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
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
        )}

        {/* Edit Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
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

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Change your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordChangeForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
