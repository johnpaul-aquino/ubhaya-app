/**
 * Password Strength Indicator Component
 * Shows visual feedback for password strength
 */

'use client';

import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthProps {
  password: string;
}

interface StrengthResult {
  score: number; // 0-4
  label: string;
  color: string;
  percentage: number;
}

function calculatePasswordStrength(password: string): StrengthResult {
  if (!password) {
    return { score: 0, label: '', color: '', percentage: 0 };
  }

  let score = 0;
  const checks = {
    length: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
    longLength: password.length >= 12,
  };

  // Base score from length
  if (checks.length) score++;
  if (checks.longLength) score++;

  // Character variety
  if (checks.hasUppercase) score++;
  if (checks.hasLowercase) score++;
  if (checks.hasNumber) score++;
  if (checks.hasSpecial) score++;

  // Normalize to 0-4 scale
  const normalizedScore = Math.min(Math.floor(score / 1.5), 4);

  const strengthLevels = [
    { label: 'Very Weak', color: 'oklch(0.55 0.22 15)', percentage: 20 },
    { label: 'Weak', color: 'oklch(0.65 0.20 60)', percentage: 40 },
    { label: 'Fair', color: 'oklch(0.75 0.15 90)', percentage: 60 },
    { label: 'Good', color: 'oklch(0.70 0.18 150)', percentage: 80 },
    { label: 'Strong', color: 'oklch(0.60 0.20 145)', percentage: 100 },
  ];

  return {
    score: normalizedScore,
    ...strengthLevels[normalizedScore],
  };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="relative h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full transition-all duration-300 ease-in-out"
          style={{
            width: `${strength.percentage}%`,
            backgroundColor: strength.color,
          }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span
          className="font-medium transition-colors"
          style={{ color: strength.color }}
        >
          {strength.label}
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {strength.score === 4
            ? '✓ Strong password'
            : strength.score >= 2
              ? 'Add special characters for better security'
              : 'Use 8+ characters, uppercase, lowercase, and numbers'}
        </span>
      </div>
    </div>
  );
}
