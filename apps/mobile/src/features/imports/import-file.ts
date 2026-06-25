export type ImportFile = {
  name: string;
  uri: string;
  mimeType?: string | null;
  size?: number | null;
};

const maxImportFileBytes = 2 * 1024 * 1024;
const acceptedExtensions = [".csv"];
const acceptedMimeTypes = new Set(["text/csv"]);

export function validateImportFile(file: ImportFile) {
  const lowerName = file.name.toLowerCase();
  const validExtension = acceptedExtensions.some((extension) =>
    lowerName.endsWith(extension),
  );
  const validMime = file.mimeType ? acceptedMimeTypes.has(file.mimeType) : true;
  if (!validExtension || !validMime) return "Selecciona un archivo CSV";
  if (file.size && file.size > maxImportFileBytes) {
    return "El archivo debe pesar 2 MB o menos";
  }
  return "";
}
