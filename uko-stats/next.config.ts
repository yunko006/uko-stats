/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour la prise en charge des modules natifs
  webpack: (config, { isServer }) => {
    // Configuration pour les modules natifs qui utilisent lzma
    if (isServer) {
      config.externals.push("lzma");
    }

    return config;
  },
  // Utiliser le Standalone Output pour faciliter le déploiement avec des dépendances natives
  output: "standalone",

  // Augmenter le temps de timeout pour les API routes qui interagissent avec Steam
  experimental: {
    serverComponentsExternalPackages: ["steam-user", "globaloffensive"],
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

module.exports = nextConfig;
