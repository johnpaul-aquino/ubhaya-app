/**
 * Import Facilities Dialog Component
 * Allows admins to import facilities from CSV files
 */

'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
  total: number;
}

interface ImportFacilitiesDialogProps {
  onSuccess?: () => void;
}

export function ImportFacilitiesDialog({ onSuccess }: ImportFacilitiesDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (!droppedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      setFile(droppedFile);
      setResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleImport = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const response = await fetch('/api/admin/facilities/import', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (data.success) {
        setResult(data);
        toast.success(`Successfully imported ${data.imported} facilities`);
        onSuccess?.();
      } else {
        toast.error(data.error || 'Import failed');
        setResult({
          success: false,
          imported: 0,
          skipped: 0,
          errors: [data.error || 'Unknown error'],
          total: 0,
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import facilities');
      setResult({
        success: false,
        imported: 0,
        skipped: 0,
        errors: ['Network error or server unavailable'],
        total: 0,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    // Prevent closing while uploading
    if (!isOpen && uploading) return;

    setOpen(isOpen);

    // Reset state when closing
    if (!isOpen) {
      setFile(null);
      setResult(null);
      setProgress(0);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Facilities from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import facilities into the database
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Area */}
          {!result && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                file ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
                disabled={uploading}
              />

              {file ? (
                <div className="space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-primary" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {!uploading && (
                    <Button variant="ghost" size="sm" onClick={resetForm}>
                      Choose different file
                    </Button>
                  )}
                </div>
              ) : (
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium">Drop your CSV file here</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse
                  </p>
                </label>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Importing facilities...</span>
              </div>
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground text-center">
                This may take a while for large files
              </p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className={`rounded-lg p-4 ${result.success ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30'}`}>
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                    {result.success ? 'Import Complete' : 'Import Failed'}
                  </p>
                  <div className="mt-2 text-sm space-y-1">
                    <p>Total rows processed: {result.total}</p>
                    <p className="text-green-700 dark:text-green-300">
                      Successfully imported: {result.imported}
                    </p>
                    {result.skipped > 0 && (
                      <p className="text-amber-700 dark:text-amber-300">
                        Skipped (duplicates): {result.skipped}
                      </p>
                    )}
                    {result.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-red-700 dark:text-red-300">Errors:</p>
                        <ul className="list-disc list-inside text-xs mt-1 max-h-24 overflow-y-auto">
                          {result.errors.slice(0, 5).map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                          {result.errors.length > 5 && (
                            <li>...and {result.errors.length - 5} more errors</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Expected Format */}
          <div className="text-xs text-muted-foreground bg-muted/50 rounded p-3">
            <p className="font-medium mb-1">Expected CSV columns:</p>
            <p className="font-mono">
              os_id, name, address, country_code, country_name, lat, lng, sector, number_of_workers, parent_company, facility_type, product_type, is_closed
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={uploading}>
              {result ? 'Close' : 'Cancel'}
            </Button>
            {!result && (
              <Button onClick={handleImport} disabled={!file || uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </>
                )}
              </Button>
            )}
            {result && (
              <Button onClick={resetForm}>
                Import Another
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
