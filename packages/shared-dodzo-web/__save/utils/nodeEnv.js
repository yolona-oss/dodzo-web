import * as fs from 'fs';
export function isProdEnv() {
    return process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'prod';
}
export function isDevEnv() {
    return process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'dev';
}
export function getEnvFileDir() {
    return process.env.npm_config_local_prefix || process.cwd();
}
export function isCrossEnv() {
    return isProdEnv() || isDevEnv();
}
const prodPostfixes = ['production', 'prod'];
const devPostfixes = ['development', 'dev'];
const avaliableEnvPostfixes = [...prodPostfixes, ...devPostfixes];
function getExistsEnvPostfix(postfixes) {
    for (const postfix of postfixes) {
        if (fs.existsSync(`${getEnvFileDir()}/.env.${postfix}`)) {
            return postfix;
        }
    }
    throw new Error('Unable to find .env file with avaliable postfixes: ' + postfixes.join(', '));
}
export function getEnvFilePath() {
    const basePath = getEnvFileDir();
    if (isCrossEnv()) {
        if (!avaliableEnvPostfixes.includes(process.env.NODE_ENV)) {
            throw new Error(`Unsupported NODE_ENV: ${process.env.NODE_ENV}`);
        }
        if (isDevEnv()) {
            return `${basePath}/.env.${getExistsEnvPostfix(devPostfixes)}`;
        }
        else {
            return `${basePath}/.env.${getExistsEnvPostfix(prodPostfixes)}`;
        }
    }
    return `${basePath}/.env`;
}
//# sourceMappingURL=nodeEnv.js.map