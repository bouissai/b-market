
const nextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: true, // Active les source maps en prod
  compress: true, // Active la compression Gzip/Brotli
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
