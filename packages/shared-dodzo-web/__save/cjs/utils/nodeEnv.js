"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProdEnv = isProdEnv;
exports.isDevEnv = isDevEnv;
exports.getEnvFileDir = getEnvFileDir;
exports.isCrossEnv = isCrossEnv;
exports.getEnvFilePath = getEnvFilePath;
const fs = __importStar(require("fs"));
function isProdEnv() {
    return process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'prod';
}
function isDevEnv() {
    return process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'dev';
}
function getEnvFileDir() {
    return process.env.npm_config_local_prefix || process.cwd();
}
function isCrossEnv() {
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
function getEnvFilePath() {
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