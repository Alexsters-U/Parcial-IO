import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Genera un servidor autocontenido para la imagen de producción.
  output: "standalone",
  // En un monorepo pnpm, el trazado debe partir de la raíz del workspace.
  outputFileTracingRoot: path.resolve(process.cwd(), "../.."),
};

export default nextConfig;
