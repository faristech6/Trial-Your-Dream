export const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const authTokenKey = 'trial_local_api_token';

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  const token = localStorage.getItem(authTokenKey);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${apiBase}${path}`, { ...options, headers });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.error || 'Request failed');
  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>;
}

/** Uploaded images are served by the API; seed images live in the frontend /public folder. */
export const assetSrc = (path: string) => (path.startsWith('/uploads/') ? `${apiBase}${path}` : path);

/** Reads an image file and downsizes it to a PNG/JPEG data URL small enough for the API (<800KB). */
export function fileToImageData(file: File, maxSize = 640): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return reject(new Error('Use a PNG, JPEG or WebP image.'));
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85));
    };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That image could not be read.')); };
    image.src = url;
  });
}
