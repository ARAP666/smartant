export type ReceiptPhoto = {
  uri: string;
  mimeType?: string | null;
  fileSize?: number | null;
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
