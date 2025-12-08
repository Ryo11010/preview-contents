import { basePath, metadataBase, siteOrigin, withBasePath } from '@/utils/paths';

export const siteMetadata = {
  title: '鶴谷 陵 | FunterU CEO / Full-stack Engineer',
  description:
    '学生エンジニアとしてFunterUを創業し、AI×モバイルを軸にShiftScanner・RemoVision・CodeClipper・MHLabをリードする鶴谷 陵のポートフォリオ。',
  basePath,
  siteOrigin,
  metadataBase,
  ogImage: withBasePath('images/projects/dialect-museum/dialectmuseum-screenshot-01-home.webp'),
  contactEmail: 'contact@funteru.co.jp',
};
