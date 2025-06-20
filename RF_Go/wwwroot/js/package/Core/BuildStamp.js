"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBuildStamp = exports.libraryVersion = void 0;
var buildStamp = "2025-06-02T00:00:00";
var result;
// tslint:disable-next-line:no-var-requires
exports.libraryVersion = "3.5.762";
var checkBuildStamp = function (wasmContext) {
    if (result !== undefined)
        return result;
    if (!wasmContext)
        return false;
    if (wasmContext.SCRTCredentials.GetBuildStamp) {
        var wasmBuildStamp = wasmContext.SCRTCredentials.GetBuildStamp();
        if (wasmBuildStamp === buildStamp) {
            result = true;
            return result;
        }
        else {
            console.warn("Build stamp diff: JS - ".concat(buildStamp, "; WASM - ").concat(wasmBuildStamp));
        }
    }
    console.warn("The SciChart webassembly module is from a different version than the javascript that is calling it.\n    Ensure that your build process is copying the correct wasm and data files.");
    result = false;
    return result;
};
exports.checkBuildStamp = checkBuildStamp;
