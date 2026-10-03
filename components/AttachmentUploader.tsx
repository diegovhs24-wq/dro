"use client";

import {useRef, useState} from "react";
import {
  MAX_FILES,
  MAX_FILE_SIZE_MB,
  formatFileSize,
  validateFile,
  type AttachmentResult,
} from "@/lib/attachments";

export type AttachmentItem = {
  id: string;
  file: File;
  status: "uploading" | "done" | "error";
  progress: number;
  errorMessage?: string;
  previewUrl?: string;
  result?: AttachmentResult;
};

type AttachmentUploaderProps = {
  items: AttachmentItem[];
  onChange: React.Dispatch<React.SetStateAction<AttachmentItem[]>>;
};

const ACCEPT = ".jpg,.jpeg,.png,.webp,.heic,.heif,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt,image/*,application/pdf";

function uploadOne(item: AttachmentItem, onProgress: (pct: number) => void): Promise<AttachmentResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", item.file);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });

    xhr.addEventListener("load", () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(data as AttachmentResult);
        else reject(new Error(data?.error || "Uploaden is mislukt."));
      } catch {
        reject(new Error("Uploaden is mislukt."));
      }
    });
    xhr.addEventListener("error", () => reject(new Error("Uploaden is mislukt. Controleer uw verbinding.")));

    xhr.open("POST", "/api/upload-attachment");
    xhr.send(formData);
  });
}

function FileIcon() {
  return (
    <svg className="h-6 w-6 text-neutral-400" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CrossIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M12 16V4m0 0L7 9m5-5l5 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CameraIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M4 7h3l2-2h6l2 2h3a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export default function AttachmentUploader({items, onChange}: AttachmentUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [limitError, setLimitError] = useState<string | null>(null);
  const pickerRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  function startUpload(item: AttachmentItem) {
    uploadOne(item, (pct) => {
      onChange((current) => current.map((i) => (i.id === item.id ? {...i, progress: pct} : i)));
    })
      .then((result) => {
        onChange((current) => current.map((i) => (i.id === item.id ? {...i, status: "done" as const, progress: 100, result} : i)));
      })
      .catch((err: Error) => {
        onChange((current) => current.map((i) => (i.id === item.id ? {...i, status: "error" as const, errorMessage: err.message} : i)));
      });
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setLimitError(null);

    const incoming = Array.from(fileList);
    const roomLeft = MAX_FILES - items.length;

    if (roomLeft <= 0) {
      setLimitError(`U kunt maximaal ${MAX_FILES} bestanden toevoegen.`);
      return;
    }

    const toAdd = incoming.slice(0, roomLeft);
    if (incoming.length > toAdd.length) {
      setLimitError(`Alleen de eerste ${toAdd.length} bestanden zijn toegevoegd (maximaal ${MAX_FILES}).`);
    }

    const newItems: AttachmentItem[] = toAdd.map((file) => {
      const validation = validateFile(file.name, file.size);
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;

      if (!validation.ok) {
        return {id, file, status: "error", progress: 0, errorMessage: validation.reason, previewUrl};
      }
      return {id, file, status: "uploading", progress: 0, previewUrl};
    });

    onChange((current) => [...current, ...newItems]);

    newItems.filter((i) => i.status === "uploading").forEach((item) => startUpload(item));
  }

  function removeItem(id: string) {
    const item = items.find((i) => i.id === id);
    if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
    onChange(items.filter((i) => i.id !== id));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <div
        className={`rounded-xl border-2 border-dashed p-5 text-center transition ${
          dragActive ? "border-brand-orange bg-brand-orange/5" : "border-black/15 bg-black/[0.015]"
        }`}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            className="inline-flex items-center gap-2 rounded-md border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-black/25"
            onClick={() => pickerRef.current?.click()}
            type="button"
          >
            <UploadIcon />
            Voeg foto&apos;s of documenten toe
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-md border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-black/25 sm:hidden"
            onClick={() => cameraRef.current?.click()}
            type="button"
          >
            <CameraIcon />
            Maak een foto
          </button>
        </div>
        <p className="mt-3 text-xs font-medium text-neutral-500">
          Sleep bestanden hierheen, of kies ze. Max {MAX_FILE_SIZE_MB} MB per bestand, tot {MAX_FILES} bestanden.
        </p>

        <input
          accept={ACCEPT}
          className="hidden"
          multiple
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
          ref={pickerRef}
          type="file"
        />
        <input
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
          ref={cameraRef}
          type="file"
        />
      </div>

      {limitError ? <p className="mt-2 text-xs font-semibold text-brand-orange">{limitError}</p> : null}

      {items.length > 0 ? (
        <div className="mt-4 grid gap-2.5">
          {items.map((item) => (
            <div className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-3" key={item.id}>
              {item.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" className="h-11 w-11 shrink-0 rounded-md object-cover" src={item.previewUrl} />
              ) : (
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-neutral-100">
                  <FileIcon />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-800">{item.file.name}</p>
                {item.status === "error" ? (
                  <p className="text-xs font-semibold text-brand-orange">{item.errorMessage}</p>
                ) : (
                  <p className="text-xs text-neutral-500">{formatFileSize(item.file.size)}</p>
                )}
                {item.status === "uploading" ? (
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-black/10">
                    <div className="h-full rounded-full bg-brand-orange transition-all" style={{width: `${item.progress}%`}} />
                  </div>
                ) : null}
              </div>
              <button
                aria-label="Verwijder bestand"
                className="shrink-0 rounded-full p-1.5 text-neutral-400 transition hover:bg-black/5 hover:text-neutral-700"
                onClick={() => removeItem(item.id)}
                type="button"
              >
                <CrossIcon />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
