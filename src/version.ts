// eslint-disable-next-line @typescript-eslint/no-var-requires
import {getBrowserExecutablePath} from "./core/abc/session.abc";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

export enum WAHAVersion {
    PLUS = "PLUS",
    CORE = "CORE",
}

export function getWAHAVersion(): WAHAVersion {
    // force core version if env variables set
    const waha_version = process.env.WAHA_VERSION;
    if (waha_version && waha_version === WAHAVersion.CORE) {
        return WAHAVersion.CORE
    }

    // Check the plus directory exists
    const plusExists = fs.existsSync(`${__dirname}/plus`)
    if (plusExists) {
        return WAHAVersion.PLUS
    }

    return WAHAVersion.CORE
}

export const VERSION = {
    version: "2023.3.1",
    tier: getWAHAVersion(),
    browser: getBrowserExecutablePath()
}
