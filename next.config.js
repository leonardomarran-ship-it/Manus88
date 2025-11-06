/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuración para desarrollo
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:8000',
  },
}

module.exports = nextConfig