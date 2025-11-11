import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { mockTeamMembers } from '@/lib/dashboard-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';

/**
 * Team Management Page
 * Manage team members and their permissions
 */
export default function TeamPage() {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'team-leader':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'member':
        return 'bg-yellow-100 text-yellow-900 border-yellow-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-900 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-900 border-gray-200';
    }
  };

  const stats = [
    { label: 'Total Members', value: 8 },
    { label: 'Team Leaders', value: 2 },
    { label: 'Active Now', value: 5 },
    { label: 'Shared Resources', value: 156 },
  ];

  return (
    <DashboardLayout>
      {/* Header Section with Stats */}
      <div className="mb-6 md:mb-8 p-6 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white">
        <h1 className="text-3xl font-bold mb-2">Team Management</h1>
        <p className="opacity-90 mb-6">Manage your team members and their permissions</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
              <div className="text-xs opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <div className="flex gap-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Invite Member</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>

      {/* Team Members */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {mockTeamMembers.map((member) => (
              <div
                key={member.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  member.name === 'John Doe'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                } transition-all`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                    style={{ backgroundColor: member.avatarBg }}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {member.name}
                      {member.name === 'John Doe' && ' (You)'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {member.role.replace('-', ' ')} • {member.department}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Badge
                        className={`capitalize text-xs ${getRoleBadgeVariant(member.role)}`}
                      >
                        {member.role.replace('-', ' ')}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          member.isOnline
                            ? 'bg-green-100 text-green-900 border-green-200'
                            : 'bg-gray-100 text-gray-900 border-gray-200'
                        }`}
                      >
                        {member.isOnline ? '🟢 Online' : '⚪ Offline'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {member.name !== 'John Doe' && (
                    <>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Permissions
                      </Button>
                    </>
                  )}
                  {member.name === 'John Doe' && (
                    <Button size="sm" variant="outline">
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Overview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>🔐 Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                role: 'Admin',
                color: 'from-purple-600',
                permissions: [
                  '✅ Full Access',
                  '✅ Manage Team',
                  '✅ Delete Resources',
                  '✅ System Settings',
                ],
              },
              {
                role: 'Team Leader',
                color: 'from-blue-600',
                permissions: [
                  '✅ Create/Edit Resources',
                  '✅ Share with Team',
                  '✅ Manage Members',
                  '❌ System Settings',
                ],
              },
              {
                role: 'Member',
                color: 'from-yellow-600',
                permissions: [
                  '✅ Create/Edit Own',
                  '✅ View Shared',
                  '❌ Manage Members',
                  '❌ System Settings',
                ],
              },
              {
                role: 'Viewer',
                color: 'from-gray-600',
                permissions: [
                  '✅ View Only',
                  '❌ Create/Edit',
                  '❌ Manage Members',
                  '❌ System Settings',
                ],
              },
            ].map((roleInfo) => (
              <div
                key={roleInfo.role}
                className="p-4 rounded-lg bg-muted/50 border border-border"
              >
                <h4 className={`font-semibold mb-3 ${roleInfo.color}`}>
                  {roleInfo.role}
                </h4>
                <div className="space-y-1 text-sm">
                  {roleInfo.permissions.map((perm, i) => (
                    <div key={i}>{perm}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
