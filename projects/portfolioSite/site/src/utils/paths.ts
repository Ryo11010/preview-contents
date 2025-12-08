const normalizeBasePath = (value?: string | null) => {
  if (!value) return '';
  const trimmed = value.trim();
  if (!trimmed || trimmed === '/') return '';
  const leading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return leading.replace(/\/+$/, '');
};

export const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

export const siteOrigin =
  (process.env.NEXT_PUBLIC_SITE_ORIGIN || 'http://localhost:3000').replace(/\/+$/, '');

export const withBasePath = (input: string) => {
  if (!input) return '';
  if (/^(https?:)?\/\//.test(input) || input.startsWith('data:')) return input;
  const normalized = input.startsWith('/') ? input : `/${input}`;
  const merged = `${basePath}${normalized}`;
  return merged.replace(/\/{2,}/g, '/');
};

export const buildAbsoluteUrl = (input: string) => {
  const pathWithBase = withBasePath(input || '/');
  try {
    return new URL(pathWithBase, siteOrigin).toString();
  } catch {
    return `${siteOrigin}${pathWithBase}`;
  }
};

export const metadataBase = (() => {
  try {
    return new URL(siteOrigin);
  } catch {
    return new URL('http://localhost:3000');
  }
})();
