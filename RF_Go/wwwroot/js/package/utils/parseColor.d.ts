export declare type TArgb = {
    opacity: number;
    red: number;
    green: number;
    blue: number;
};
/**
 * Parse colors and convert them to hex string to use in c++
 * Examples: "#fff", "#ff0000", "rgba(255,255,0,1)", "#11333333"
 * @param input
 */
export declare function parseColorToHexStringArgb(input: string, opacityOverride?: number): string;
/**
 * Parse colors and convert them to hex string in ABGR format to use in c++
 * Examples: "#fff", "#ff0000", "rgba(255,255,0,1)", "#11333333"
 * @param input
 */
export declare function parseColorToHexStringAbgr(input: string, opacityOverride?: number): string;
export declare function parseColorToUIntArgb(input: string, opacity?: number): number;
export declare function parseColorToUIntAbgr(input: string, opacity?: number): number;
/**
 * Converts a UINT color number to a 8-digit hex code e.g. #FFAABBCC
 * @param value
 */
export declare function toHex(value: number): string;
/**
 * Converts an HTML color code to TArgb
 * @param input
 */
export declare function parseColorToTArgb(input: string): TArgb;
/**
 * Converts color from ARGB number format into HTML string format #FFFFFFFF
 * @param argbColor color in ARGB format
 */
export declare const parseArgbToHtmlColor: (argbColor: number) => string;
/**
 * Useful for debugging purposes. Converts {@link TArgb} to HTML Color code e.g. '#FF112233'=RGBA
 * @param targb
 */
export declare const parseTArgbToHtmlColor: (targb: TArgb) => string;
/** @ignore */
export declare const webColors: Record<string, string>;
