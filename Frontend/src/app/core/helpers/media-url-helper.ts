export function resolveMediaUrl(url: string | null | undefined, mediaUrl: string) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/brand/')) return url;

  return mediaUrl + url.replace(/^\//, '');
}
