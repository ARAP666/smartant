export type ReceiptPhoto = {
  uri: string;
  mimeType?: string | null;
  fileSize?: number | null;
  fileName?: string | null;
};

const maxReceiptPhotoBytes = 5 * 1024 * 1024;
const acceptedReceiptMimeTypes = new Set(["image/jpeg", "image/png"]);

export function validateReceiptPhoto(photo: ReceiptPhoto) {
  if (photo.mimeType && !acceptedReceiptMimeTypes.has(photo.mimeType)) {
    return "Usa una imagen JPG o PNG";
  }
  if (photo.fileSize && photo.fileSize > maxReceiptPhotoBytes) {
    return "La imagen debe pesar 5 MB o menos";
  }
  return "";
}

export type ReceiptDetection = {
  pendingMovement: {
    id: string;
    amountMinor: string;
    date: string;
    description: string;
    category: string;
    status: string;
  };
  detected: {
    amountMinor: string;
    date: string;
    description: string;
    category: string;
    confidence: { amount: boolean; date: boolean; description: boolean };
  };
};
