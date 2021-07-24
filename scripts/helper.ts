export function red(txt: string): string { return `\x1b[31m${txt}\x1b[0m`; }
export function yellow(txt: string): string { return `\x1b[33m${txt}\x1b[0m`; }
export function cyan(txt: string): string { return `\x1b[36m${txt}\x1b[0m`; }
export function blue(txt: string): string { return `\x1b[34m${txt}\x1b[0m`; }
export function bold(txt: string): string { return `\x1b[1m${txt}\x1b[0m`; }

export function capitilizeFirstLetter(txt: string) { return txt.charAt(0).toUpperCase() + txt.slice(1); }

import { TokenValue } from "./structures/token"

export function getType(value: TokenValue): string {
    if (value === null || value === "null") return "null";
    else return typeof value;
}