import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Constrain output file tracing to this project folder to avoid scanning monorepo root.
  outputFileTracingRoot: rootDir,
};

export default nextConfig;
