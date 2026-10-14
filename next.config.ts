import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        // Las imágenes de personaje viven en un bucket privado de Supabase
        // Storage y se sirven con URLs firmadas que caducan. Sin esto,
        // next/image rechaza el host.
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
    outputFileTracingIncludes: {
    '/**/*': [
      './node_modules/.pnpm/@swc+helpers@*/node_modules/@swc/helpers/esm/**',
    ],
  },
  experimental: {
    serverActions: {
      // El límite por defecto de una Server Action es 1 MB, y el retrato del
      // personaje viaja en el mismo POST que el resto del formulario.
      // 5 MB deja hueco para los 4 MB que validamos más el overhead multipart.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
