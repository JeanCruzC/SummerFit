/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login', // Redirigir root a login, ya que el dashboard está protegido
        permanent: false,
      },
      {
        source: '/dashboard', // El usuario accederá a /dashboard y el middleware o layout redirigirá si no hay sesión
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
