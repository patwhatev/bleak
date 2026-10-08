/** @type {import('next').NextConfig} */
const nextConfig = {
  // fully static site: `npm run build` writes plain html to /out
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;
