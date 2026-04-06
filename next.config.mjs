/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.pap.fr' },
      { protocol: 'https', hostname: '**.bienici.com' },
      { protocol: 'https', hostname: '**.paruvendu.fr' },
      { protocol: 'https', hostname: '**.ouestfrance-immo.com' },
      { protocol: 'https', hostname: '**.orpi.com' },
      { protocol: 'https', hostname: '**.immonot.com' },
      { protocol: 'https', hostname: '**.green-acres.fr' },
      { protocol: 'https', hostname: '**.green-acres.com' },
      { protocol: 'https', hostname: '**.fnaim.fr' },
      { protocol: 'https', hostname: '**.etreproprio.com' },
      { protocol: 'https', hostname: '**.leboncoin.fr' },
      { protocol: 'https', hostname: '**.seloger.com' },
      { protocol: 'https', hostname: '**.logic-immo.com' },
      { protocol: 'https', hostname: '**.avendrealouer.fr' },
      { protocol: 'https', hostname: 'photos.*.com' },
    ],
  },
};

export default nextConfig;
