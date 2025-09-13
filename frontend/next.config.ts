import type { NextConfig } from "next";

import loadEnvConfig from "@/utils/env";
loadEnvConfig();

const nextConfig: NextConfig = {
    experimental: {
        externalDir: true,
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                'reflect-metadata': require.resolve('reflect-metadata'),
            };
        }

        return config;
    },
};

export default nextConfig;
