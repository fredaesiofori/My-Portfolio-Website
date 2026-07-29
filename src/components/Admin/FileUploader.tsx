import React, { useState, useRef } from 'react';
import { auth, db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Copy,
  Check,
  Lock,
  ExternalLink,
  PlusCircle,
  Building2,
  Tag
} from 'lucide-react';

export interface FileUploaderProps {
  /** Target folder in Cloudinary, e.g. 'certificates' or 'projects' */
  folder?: string;
  /** Accepted file formats for input, e.g. "image/*,.pdf" */
  accept?: string;
  /** Max allowed file size in MB. Default: 10 */
  maxSizeMB?: number;
  /** Custom UI title/label */
  label?: string;
  /** Helper text displayed below input */
  helperText?: string;
  /** Existing image/file URL for preview when editing */
  initialUrl?: string;
  /** Cloudinary Cloud Name (default: rxvsugga) */
  cloudName?: string;
  /** Cloudinary Upload Preset (default: FoodBridge-image) */
  uploadPreset?: string;
  /** Callback triggered when upload succeeds and download URL is retrieved */
  onUploadSuccess?: (
    downloadUrl: string,
    fileInfo: { name: string; type: string; size: number; path: string }
  ) => void;
  /** Callback triggered when file is cleared */
  onClear?: () => void;
  /** Mode for standalone Firestore record creation */
  mode?: 'standalone' | 'embedded';
  /** Target Firestore collection when in standalone mode */
  collectionName?: 'certifications' | 'projects';
  /** Preset title for standalone mode */
  defaultTitle?: string;
  /** Preset issuer/organization for standalone mode */
  defaultIssuer?: string;
  /** Callback on standalone Firestore save */
  onFirestoreSaved?: (docId: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  folder = 'uploads',
  accept = 'image/*,.pdf',
  maxSizeMB = 10,
  label = 'Upload Image or PDF Certificate',
  helperText = 'Supports PNG, JPG, WebP, SVG or PDF documents (Max 10MB)',
  initialUrl = '',
  cloudName = 'rxvsugga',
  uploadPreset = 'FoodBridge-image',
  onUploadSuccess,
  onClear,
  mode = 'embedded',
  collectionName = 'certifications',
  defaultTitle = '',
  defaultIssuer = '',
  onFirestoreSaved
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null);
  const [isPdf, setIsPdf] = useState<boolean>(
    initialUrl ? initialUrl.toLowerCase().includes('.pdf') : false
  );

  // Upload state
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [bytesTransferred, setBytesTransferred] = useState<number>(0);
  const [totalBytes, setTotalBytes] = useState<number>(0);
  const [uploadSuccessUrl, setUploadSuccessUrl] = useState<string | null>(initialUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Standalone Firestore fields
  const [title, setTitle] = useState<string>(defaultTitle);
  const [issuer, setIssuer] = useState<string>(defaultIssuer);
  const [savingToFirestore, setSavingToFirestore] = useState<boolean>(false);
  const [firestoreSavedSuccess, setFirestoreSavedSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Check auth
  const currentUser = auth.currentUser;

  // File size formatter
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle native file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUploadSuccessUrl(null);
    setFirestoreSavedSuccess(false);

    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File size (${formatBytes(file.size)}) exceeds maximum limit of ${maxSizeMB}MB.`);
      return;
    }

    setSelectedFile(file);
    const isPdfType = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    setIsPdf(isPdfType);

    // Create local thumbnail preview
    if (!isPdfType && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setError(null);
    setUploadSuccessUrl(null);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File size (${formatBytes(file.size)}) exceeds limit of ${maxSizeMB}MB.`);
      return;
    }

    setSelectedFile(file);
    const isPdfType = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    setIsPdf(isPdfType);

    if (!isPdfType && file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  // Trigger file upload to Cloudinary using unsigned upload preset
  const handleStartUpload = () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    if (!currentUser) {
      setError('Authentication required. Please log in via Firebase Auth.');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);
    setBytesTransferred(0);
    setTotalBytes(selectedFile.size);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', uploadPreset);
    if (folder) {
      formData.append('folder', folder);
    }

    const xhr = new XMLHttpRequest();
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    xhr.open('POST', endpoint, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setProgress(pct);
        setBytesTransferred(e.loaded);
        setTotalBytes(e.total);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          const downloadUrl = response.secure_url;
          setUploadSuccessUrl(downloadUrl);
          setPreviewUrl(downloadUrl);

          if (onUploadSuccess) {
            onUploadSuccess(downloadUrl, {
              name: selectedFile.name,
              type: selectedFile.type,
              size: selectedFile.size,
              path: response.public_id || ''
            });
          }
        } catch (err: any) {
          setError(`Failed to parse Cloudinary response: ${err.message}`);
        }
      } else {
        let errMsg = `Upload failed with status code ${xhr.status}.`;
        try {
          const errResponse = JSON.parse(xhr.responseText);
          if (errResponse.error && errResponse.error.message) {
            errMsg = `Cloudinary Upload Error: ${errResponse.error.message}`;
          }
        } catch (_) {}
        setError(errMsg);
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setError('Network error during Cloudinary upload. Please check your internet connection.');
    };

    xhr.send(formData);
  };

  // Handle saving directly to Firestore (Standalone mode)
  const handleSaveToFirestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadSuccessUrl) {
      setError('Please upload a file to Cloudinary first.');
      return;
    }

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    setSavingToFirestore(true);
    setError(null);

    try {
      const payload: Record<string, any> = {
        title: title.trim(),
        imageUrl: uploadSuccessUrl,
        createdAt: new Date().toISOString(),
        order: 1
      };

      if (collectionName === 'certifications') {
        payload.issuer = issuer.trim() || 'Freda Creations / AWS / Credly';
        payload.issueDate = new Date().toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        });
        payload.credentialUrl = uploadSuccessUrl;
      } else if (collectionName === 'projects') {
        payload.description = 'Project document with uploaded visual asset.';
        payload.category = 'Cloud & DevOps';
        payload.techStack = ['React', 'TypeScript', 'Firebase'];
        payload.liveUrl = uploadSuccessUrl;
        payload.githubUrl = 'https://github.com/fredaesiofori';
        payload.featured = true;
      }

      const docRef = await addDoc(collection(db, collectionName), payload);
      setSavingToFirestore(false);
      setFirestoreSavedSuccess(true);

      if (onFirestoreSaved) {
        onFirestoreSaved(docRef.id);
      }
    } catch (err: any) {
      setSavingToFirestore(false);
      setError(`Failed to save record to Firestore: ${err.message}`);
    }
  };

  // Reset/Clear file selection
  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadSuccessUrl(null);
    setError(null);
    setProgress(0);
    setFirestoreSavedSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onClear) onClear();
  };

  const handleCopyUrl = () => {
    if (uploadSuccessUrl) {
      navigator.clipboard.writeText(uploadSuccessUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // If user is NOT authenticated via Firebase Auth
  if (!currentUser) {
    return (
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-3">
        <Lock size={20} className="shrink-0 text-amber-400" />
        <div>
          <p className="font-bold uppercase tracking-wider text-[11px]">
            🔒 Admin Authentication Required
          </p>
          <p className="text-amber-300/80 mt-0.5">
            Log in via Firebase Auth in the Admin Console to upload files to Cloudinary.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2 uppercase tracking-wider">
          <UploadCloud size={16} className="text-[#E2725B]" />
          {label}
        </label>
        {selectedFile && !uploading && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] font-mono text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer"
          >
            <X size={12} /> Clear Selection
          </button>
        )}
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Dropzone & Preview Box */}
      {!selectedFile && !uploadSuccessUrl ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-white/15 hover:border-[#E2725B]/70 bg-slate-50 dark:bg-white/5 hover:bg-[#E2725B]/5 rounded-xl p-6 text-center transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/5 group-hover:bg-[#E2725B]/10 text-gray-600 dark:text-gray-300 group-hover:text-[#E2725B] mx-auto flex items-center justify-center mb-3 transition-colors">
            <UploadCloud size={24} />
          </div>
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
            Click to browse device file library or drag & drop file here
          </p>
          <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-1">{helperText}</p>
        </div>
      ) : (
        <div className="bg-slate-100 dark:bg-[#181818] border border-gray-200 dark:border-white/10 rounded-xl p-4 space-y-3">
          {/* File Selected Badge / Thumbnail Preview */}
          <div className="flex items-center gap-4">
            {previewUrl && !isPdf ? (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300 dark:border-white/20 bg-black/50 shrink-0">
                <img
                  src={previewUrl}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-[#E2725B]/10 border border-[#E2725B]/30 text-[#E2725B] flex flex-col items-center justify-center shrink-0">
                {isPdf ? <FileText size={28} /> : <ImageIcon size={28} />}
                <span className="text-[9px] font-mono font-bold uppercase mt-1">
                  {isPdf ? 'PDF' : 'IMAGE'}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                {selectedFile ? selectedFile.name : 'Uploaded File Asset'}
              </p>
              {selectedFile && (
                <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                  Size: {formatBytes(selectedFile.size)} • {selectedFile.type || 'Document'}
                </p>
              )}

              {uploadSuccessUrl && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                    <CheckCircle2 size={12} /> Cloudinary Hosted
                  </span>
                  <a
                    href={uploadSuccessUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-mono text-[#C5A059] hover:underline flex items-center gap-1"
                  >
                    View File <ExternalLink size={10} />
                  </a>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 min-h-[44px] rounded-lg bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 text-gray-800 dark:text-gray-300 text-xs font-mono cursor-pointer shrink-0 flex items-center justify-center"
              title="Select a different file"
            >
              Change
            </button>
          </div>

          {/* Upload Action Button */}
          {selectedFile && !uploadSuccessUrl && !uploading && (
            <button
              type="button"
              onClick={handleStartUpload}
              className="w-full py-3 px-4 min-h-[44px] rounded-lg bg-[#E2725B] hover:bg-[#c95d46] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <UploadCloud size={16} /> Upload to Cloudinary
            </button>
          )}

          {/* Progress Indicator */}
          {uploading && (
            <div className="space-y-1.5 bg-black/40 p-3 rounded-lg border border-white/5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-300 flex items-center gap-1.5 font-semibold">
                  <RefreshCw size={12} className="animate-spin text-[#E2725B]" />
                  Uploading to Cloudinary...
                </span>
                <span className="text-[#E2725B] font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#E2725B] to-[#C5A059] h-2 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] font-mono text-gray-400 text-right">
                {formatBytes(bytesTransferred)} / {formatBytes(totalBytes)}
              </p>
            </div>
          )}

          {/* Success State */}
          {uploadSuccessUrl && (
            <div className="p-3 rounded-lg bg-teal-950/60 border border-teal-800 text-teal-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-teal-400" />
                  Upload complete! Cloudinary URL generated.
                </span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-2 py-1 bg-teal-900/80 hover:bg-teal-800 text-teal-100 rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy URL'}
                </button>
              </div>

              <div className="p-2 rounded bg-black/50 border border-teal-900 font-mono text-[10px] break-all text-teal-300 select-all">
                {uploadSuccessUrl}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Alert Box */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Upload Notice / Error</p>
            <p className="text-rose-300/90 text-[11px] mt-0.5">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Standalone Mode: Title & Issuer Fields + Direct Save to Firestore */}
      {mode === 'standalone' && uploadSuccessUrl && (
        <form onSubmit={handleSaveToFirestore} className="pt-3 border-t border-white/10 space-y-3 bg-[#121212] p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider">
            <Tag size={14} /> Save Record directly to Firestore ({collectionName})
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={collectionName === 'certifications' ? 'e.g. AWS Certified Solutions Architect' : 'e.g. SmartSpend Finance Dashboard'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {collectionName === 'certifications' && (
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1 flex items-center gap-1">
                <Building2 size={12} className="text-[#C5A059]" />
                Issuing Organization
              </label>
              <input
                type="text"
                placeholder="e.g. Amazon Web Services (AWS) / Credly"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={savingToFirestore}
            className="w-full py-3 px-4 min-h-[44px] rounded-lg bg-[#C5A059] hover:bg-[#b08d47] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {savingToFirestore ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <PlusCircle size={14} />
            )}
            <span>Save to Firestore Database</span>
          </button>

          {firestoreSavedSuccess && (
            <div className="p-2.5 rounded bg-teal-950 border border-teal-700 text-teal-200 text-xs flex items-center gap-2">
              <CheckCircle2 size={14} className="text-teal-400" />
              <span>Record created in Firestore `{collectionName}` collection successfully!</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

