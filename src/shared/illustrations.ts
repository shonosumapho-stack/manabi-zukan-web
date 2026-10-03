export function illustrationUrl(key: string): string {
  if (!key) return '';
  return `/assets/illustrations/${key}.png`;
}
