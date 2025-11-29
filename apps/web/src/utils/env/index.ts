'use server'

import 'reflect-metadata'

import { loadEnvConfig } from '@next/env'
import { getEnvFileDir, getEnvFilePath, isDevEnv } from "@dodzo-web/shared";

import dotenv from 'dotenv'

console.log(getEnvFilePath())

export default async function loadEnv() {
    dotenv.config(
        {
            path: getEnvFilePath()
        }
    )

    loadEnvConfig(getEnvFileDir(), isDevEnv())
}
