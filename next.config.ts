
const nextConfig = {
  productionBrowserSourceMaps: true, // Active les source maps en prod
  compress: true, // Active la compression Gzip/Brotli
  images: {
    domains: ["images.unsplash.com"],
  }
};

module.exports = nextConfig;
