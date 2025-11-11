/**
 * Logout Button Component
 * Handles user sign out
 */

'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

export function LogoutButton({
  variant = 'outline',
  size = 'sm',
  showIcon = true,
  showText = true,
  className,
}: LogoutButtonProps) {
  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: '/login',
        redirect: true,
      });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={className}
    >
      {showIcon && <LogOut className="h-4 w-4" />}
      {showText && <span className={showIcon ? 'ml-2' : ''}>Logout</span>}
    </Button>
  );
}
