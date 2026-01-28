/**
 * Avatar Upload Component
 * Allows users to upload and manage their profile picture
 */

'use client';

import { useState, useRef, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera, Trash2, Upload, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  validateAvatarFile,
  MAX_AVATAR_SIZE,
  ALLOWED_AVATAR_TYPES,
} from '@/lib/validations/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  initials: string;
  onAvatarChange: (url: string | null) => void;
}

export function AvatarUpload({
  currentAvatarUrl,
  initials,
  onAvatarChange,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    const validation = validateAvatarFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
      setSelectedFile(file);
      setShowConfirmDialog(true);
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Upload avatar
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.error || 'Failed to upload avatar');
        return;
      }

      toast.success('Avatar uploaded successfully!');
      onAvatarChange(result.avatarUrl);
      setShowConfirmDialog(false);
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  // Delete avatar
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/user/avatar', {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.error || 'Failed to remove avatar');
        return;
      }

      toast.success('Avatar removed');
      onAvatarChange(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel preview
  const handleCancelPreview = () => {
    setShowConfirmDialog(false);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        {/* Avatar with overlay */}
        <div
          className={`relative group cursor-pointer rounded-full transition-all ${
            isDragging ? 'ring-4 ring-primary ring-offset-2' : ''
          }`}
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
            {currentAvatarUrl ? (
              <AvatarImage src={currentAvatarUrl} alt="Profile picture" />
            ) : null}
            <AvatarFallback className="text-3xl font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-8 w-8 text-white" />
          </div>

          {/* Loading overlay */}
          {(isUploading || isDeleting) && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_AVATAR_TYPES.join(',')}
          className="hidden"
          onChange={handleInputChange}
          disabled={isUploading || isDeleting}
        />

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={triggerFileInput}
            disabled={isUploading || isDeleting}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          {currentAvatarUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isUploading || isDeleting}
              className="text-destructive hover:text-destructive"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Remove
            </Button>
          )}
        </div>

        {/* Help text */}
        <p className="text-xs text-muted-foreground text-center max-w-[200px]">
          Click or drag to upload. Max {MAX_AVATAR_SIZE / 1024 / 1024}MB. JPG, PNG, or WebP.
        </p>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Preview your new profile picture before saving.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-6">
            {previewUrl ? (
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                <AvatarImage src={previewUrl} alt="Preview" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ) : (
              <Skeleton className="h-32 w-32 rounded-full" />
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancelPreview}
              disabled={isUploading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
