"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.licenseManager = exports.updateLicenseDisplay = exports.getLicenseInfo = exports.applyLicense = exports.forceReapplyLicense2D = exports.getLicenseCookie = exports.setCallbacks3D = exports.setUseLicenseWizard = exports.setRuntimeLicenseKey = exports.setLicenseCallback = exports.setIsDebugLicensing = exports.setDependencies = void 0;
var app_1 = require("../../constants/app");
var BuildStamp_1 = require("../../Core/BuildStamp");
var Dictionary_1 = require("../../Core/Dictionary");
var Globals_1 = require("../../Core/Globals");
var localStorageApi_1 = require("../../Core/storage/localStorageApi");
var Telemetry_1 = require("../../Core/Telemetry");
var Color_1 = require("../../types/Color");
var licensingClasses_1 = require("../../types/licensingClasses");
var cookie_1 = require("../../utils/cookie");
var licenseManager2dState_1 = require("./licenseManager2dState");
var licenseWizardPort = 24278;
var licenseWizardAlternatePort = 24279;
var portOverride = localStorageApi_1.localStorageApi.getLicenseWizardPort();
if (portOverride) {
    licenseWizardPort = portOverride;
    licenseWizardAlternatePort = licenseWizardPort + 1;
}
var fetchFromWizard = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var wizardUrl, response, err_1, maxport, wizardUrl, response, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 9]);
                wizardUrl = "http://localhost:" + licenseWizardPort.toString() + path;
                return [4 /*yield*/, fetch(wizardUrl)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response];
            case 2:
                err_1 = _a.sent();
                debug("Could not connect to license wizard on port " + licenseWizardPort.toString());
                if (!(typeof localStorage !== "undefined")) return [3 /*break*/, 8];
                maxport = localStorageApi_1.localStorageApi.getLicenseWizardMaxPort();
                if (!maxport) return [3 /*break*/, 8];
                _a.label = 3;
            case 3:
                if (!(licenseWizardAlternatePort <= maxport)) return [3 /*break*/, 8];
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                wizardUrl = "http://localhost:" + licenseWizardAlternatePort.toString() + path;
                return [4 /*yield*/, fetch(wizardUrl)];
            case 5:
                response = _a.sent();
                licenseWizardPort = licenseWizardAlternatePort;
                return [2 /*return*/, response];
            case 6:
                err_2 = _a.sent();
                debug("Could not connect to license wizard on port " + licenseWizardAlternatePort.toString());
                licenseWizardAlternatePort = licenseWizardAlternatePort + 1;
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 3];
            case 8: throw err_1;
            case 9: return [2 /*return*/];
        }
    });
}); };
var licenseDependencies = {
    fetchFromWizard: function (url) { return fetchFromWizard(url); },
    setCookie: function (name, val, validDays) { return (0, cookie_1.setCookie)(name, val, validDays); },
    getCookie: function (name) { return (0, cookie_1.getCookie)(name); },
    fetchForChallenge: function (url) { return fetch(url); },
    updateLicenseDisplay: function (licenseInfo, sciChartSurface, is2D, applyToOther) { return updateLicenseDisplayInternal(licenseInfo, sciChartSurface, is2D, applyToOther); },
    debug: function (message) { return console.log(message); }
};
var setDependencies = function (dependencies) { return (licenseDependencies = dependencies); };
exports.setDependencies = setDependencies;
var isDebug = null;
var setIsDebugLicensing = function (value, persist) {
    if (persist === void 0) { persist = false; }
    isDebug = value;
    if (persist || !value) {
        localStorageApi_1.localStorageApi.setIsLicenseDebug(value);
    }
};
exports.setIsDebugLicensing = setIsDebugLicensing;
var debug = function (message) {
    if (isDebug === null) {
        isDebug = localStorageApi_1.localStorageApi.getIsLicenseDebug();
    }
    if (app_1.IS_TEST_ENV || isDebug) {
        licenseDependencies.debug(message);
    }
};
debug("SciChart version " + BuildStamp_1.libraryVersion);
// tslint:disable: no-console
var licenseCallback;
var setLicenseCallback = function (callback) {
    licenseCallback = callback;
};
exports.setLicenseCallback = setLicenseCallback;
var runtimeLicenseKey = "";
var getRuntimeLicenseKey = function () { return runtimeLicenseKey; };
var setRuntimeLicenseKey = function (value) {
    var prev = runtimeLicenseKey;
    runtimeLicenseKey = value;
    if (runtimeLicenseKey !== prev && runtimeLicenseKey !== "") {
        if (Globals_1.sciChartDestinations.length > 0) {
            var sciChartSurface = Globals_1.sciChartDestinations[0].sciChartSurface;
            // @ts-ignore
            (0, exports.applyLicense)(sciChartSurface.sharedWasmContext, sciChartSurface);
        }
    }
};
exports.setRuntimeLicenseKey = setRuntimeLicenseKey;
var useLicenseWizard = true;
var setUseLicenseWizard = function (value) {
    useLicenseWizard = value;
};
exports.setUseLicenseWizard = setUseLicenseWizard;
var retryTime = app_1.IS_TEST_ENV ? 0.1 : 5;
var maxretries = app_1.IS_TEST_ENV ? 12 : 10;
var serverLicenseEndpoint = "api/license";
var getServerLicenseEndpoint = function () { return serverLicenseEndpoint; };
var setServerLicenseEndpoint = function (value) {
    serverLicenseEndpoint = value;
};
var getLicenseFailCounts = 0;
// TODO cleanup on surface delete
var wizardTimer;
var licenseChallengeTimeout;
var callbacks3DInitialValue = {
    getLicenseChallenge3D: function () { return undefined; },
    setChallengeResponse3D: function (token) { return undefined; },
    setNewLicense3D: function (keyCode) { return undefined; },
    updateLicenseDisplay3D: function () { return undefined; }
};
var callbacks3D = callbacks3DInitialValue;
var setCallbacks3D = function (callbacks) { return (callbacks3D = callbacks); };
exports.setCallbacks3D = setCallbacks3D;
var getlicenseFromWizard = function (licenseContext, sciChartSurface) { return __awaiter(void 0, void 0, void 0, function () {
    var response, keyCode, _a, requiresValidation, trialExpired, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (sciChartSurface.isDeleted) {
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                if (checkStatus !== licensingClasses_1.LicenseCheckStatus.StartLookingForLicenseWizard &&
                    checkStatus !== licensingClasses_1.LicenseCheckStatus.LookingForLicenseWizard &&
                    checkStatus !== licensingClasses_1.LicenseCheckStatus.NoLicenseInWizard)
                    return [2 /*return*/];
                debug("Trying to get license from local license wizard");
                response = void 0;
                return [4 /*yield*/, licenseDependencies.fetchFromWizard("/license")];
            case 2:
                response = _b.sent();
                if (!response.ok) return [3 /*break*/, 4];
                return [4 /*yield*/, response.text()];
            case 3:
                keyCode = _b.sent();
                _a = setNewLicense(keyCode, licenseContext, sciChartSurface), requiresValidation = _a.requiresValidation, trialExpired = _a.trialExpired;
                if (requiresValidation) {
                    debug("Got a developer license from local license wizard.  Validating...");
                    checkStatus = licensingClasses_1.LicenseCheckStatus.ValidatingDeveloperLicense;
                    dolicenseChallenge(licenseContext, sciChartSurface);
                }
                else if (trialExpired) {
                    checkStatus = licensingClasses_1.LicenseCheckStatus.NoLicenseInWizard;
                    debug("No valid license available in licensing wizard. Trying again in ".concat(retryTime, " seconds"));
                    wizardTimer = setTimeout(function () { return getlicenseFromWizard(licenseContext, sciChartSurface); }, retryTime * 1000);
                }
                else {
                    debug("Got a valid license from local license wizard.");
                    checkStatus = licensingClasses_1.LicenseCheckStatus.LicenseOK;
                }
                return [3 /*break*/, 5];
            case 4:
                checkStatus = licensingClasses_1.LicenseCheckStatus.NoLicenseInWizard;
                debug("No license available in licensing wizard. Trying again in ".concat(retryTime, " seconds"));
                wizardTimer = setTimeout(function () { return getlicenseFromWizard(licenseContext, sciChartSurface); }, retryTime * 1000);
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_3 = _b.sent();
                checkStatus = licensingClasses_1.LicenseCheckStatus.LookingForLicenseWizard;
                // Failed to connect.  Retry
                getLicenseFailCounts += 1;
                if (getLicenseFailCounts < maxretries) {
                    debug("Could not find licensing wizard. Trying again in ".concat(retryTime, " seconds"));
                    wizardTimer = setTimeout(function () { return getlicenseFromWizard(licenseContext, sciChartSurface); }, retryTime * 1000);
                }
                else {
                    // give up.
                    console.log("Failed to connect to licensing wizard. Refresh page to retry.");
                    getLicenseFailCounts = 0;
                    checkStatus = licensingClasses_1.LicenseCheckStatus.FailedToFindLicenseWizard;
                }
                return [3 /*break*/, 7];
            case 7:
                if (licenseContext !== undefined && !sciChartSurface.isDeleted) {
                    (0, exports.updateLicenseDisplay)((0, exports.getLicenseInfo)(licenseContext), sciChartSurface, true, true);
                    callbacks3D.updateLicenseDisplay3D();
                }
                return [2 /*return*/];
        }
    });
}); };
var setLicenseCookie = function (key, token, expirySeconds, lastValidated) {
    var cookieVal = "".concat(key, ",").concat(token, ",").concat(expirySeconds, ",").concat(lastValidated);
    return licenseDependencies.setCookie("scLicense", cookieVal, 365);
};
var getLicenseCookie = function () {
    var cookie;
    cookie = licenseDependencies.getCookie("scLicense");
    var parts = cookie.split(",");
    if (parts.length === 4)
        /// TODO worry about UTC here
        return {
            key: parts[0],
            token: parts[1],
            expiry: new Date(Number.parseInt(parts[2], 10) * 1000),
            lastValidated: new Date(Number.parseInt(parts[3], 10) * 1000)
        };
    else
        return { key: parts[0], token: null, expiry: null, lastValidated: null };
};
exports.getLicenseCookie = getLicenseCookie;
var setChallengeResponse = function (token, licenseContext) {
    var expirySeconds = -1;
    if (licenseContext !== undefined) {
        expirySeconds = licenseContext.SCRTCredentials.ApplyLicenseResponse(token);
    }
    var expirySeconds3D = callbacks3D.setChallengeResponse3D(token);
    if (expirySeconds3D !== undefined && expirySeconds3D > 0) {
        return expirySeconds3D;
    }
    return expirySeconds;
};
var challengeFailCounts = 0;
var dolicenseChallenge = function (licenseContext, sciChartSurface) { return __awaiter(void 0, void 0, void 0, function () {
    var server, challenge, orderId, response, queryString, url, url, token, expirySeconds, key, timeNow, timeToExpiry, err_4, sciChartSurface2D, expiry, msg;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (sciChartSurface.isDeleted) {
                    return [2 /*return*/];
                }
                server = licenseManager2dState_1.licenseManager2dState.getIsDev() ? "license wizard" : "server";
                _b.label = 1;
            case 1:
                _b.trys.push([1, 11, , 12]);
                if (checkStatus !== licensingClasses_1.LicenseCheckStatus.ValidatingDeveloperLicense)
                    return [2 /*return*/];
                debug("Attempting to validate license with ".concat(server));
                challenge = void 0;
                orderId = void 0;
                if (licenseContext !== undefined) {
                    challenge = licenseContext.SCRTCredentials.GetLicenseChallenge();
                    orderId = licenseContext.SCRTCredentials.GetOrderId();
                }
                else {
                    (_a = callbacks3D.getLicenseChallenge3D(), challenge = _a.challenge, orderId = _a.orderId);
                }
                response = void 0;
                queryString = "orderid=".concat(orderId, "&challenge=").concat(challenge);
                if (!licenseManager2dState_1.licenseManager2dState.getIsDev()) return [3 /*break*/, 3];
                url = "/validate?".concat(queryString);
                return [4 /*yield*/, licenseDependencies.fetchFromWizard(url)];
            case 2:
                response = _b.sent();
                return [3 /*break*/, 7];
            case 3:
                if (!(typeof licenseCallback !== "undefined")) return [3 /*break*/, 5];
                return [4 /*yield*/, licenseCallback(queryString)];
            case 4:
                response = _b.sent();
                return [3 /*break*/, 7];
            case 5:
                url = "/" + serverLicenseEndpoint + (serverLicenseEndpoint.indexOf("?") > 0 ? "&" : "?") + queryString;
                return [4 /*yield*/, licenseDependencies.fetchForChallenge(url)];
            case 6:
                response = _b.sent();
                _b.label = 7;
            case 7:
                if (!response.ok) return [3 /*break*/, 9];
                return [4 /*yield*/, response.text()];
            case 8:
                token = _b.sent();
                if (!token.startsWith("Error")) {
                    expirySeconds = setChallengeResponse(token, licenseContext);
                    if (expirySeconds > 0) {
                        key = (0, exports.getLicenseCookie)().key;
                        if (!key)
                            key = getRuntimeLicenseKey();
                        timeNow = Math.floor(new Date().getTime() / 1000);
                        setLicenseCookie(key, token, expirySeconds, timeNow);
                        debug("License validated");
                        checkStatus = licensingClasses_1.LicenseCheckStatus.LicenseOK;
                        timeToExpiry = expirySeconds - timeNow;
                        challengeFailCounts = 0;
                        licenseChallengeTimeout = setTimeout(function () { return dolicenseChallenge(licenseContext, sciChartSurface); }, Math.floor(timeToExpiry * 0.95 * 1000)); // Allow 5%
                    }
                    else {
                        // Something went wrong with the apply
                        debug("license challenge response was invalid: ".concat(token, " ").concat(expirySeconds));
                        checkStatus = licensingClasses_1.LicenseCheckStatus.FailedToValidateDeveloperLicense;
                    }
                }
                else {
                    // Challenge rejected by server
                    debug("Server rejected the license challenge: " + token);
                    checkStatus = licensingClasses_1.LicenseCheckStatus.FailedToValidateDeveloperLicense;
                }
                return [3 /*break*/, 10];
            case 9:
                // Server error or network failure
                if (licenseManager2dState_1.licenseManager2dState.getIsDev()) {
                    console.warn("Error during license validation: " + response.statusText);
                    checkStatus = licensingClasses_1.LicenseCheckStatus.FailedToValidateDeveloperLicense;
                }
                else {
                    // switch to license wizard
                    throw new Error(response.statusText);
                }
                _b.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                err_4 = _b.sent();
                // switch to license wizard
                if (!licenseManager2dState_1.licenseManager2dState.getIsDev()) {
                    console.warn("Server license validation failed.  Looking for local developer license");
                    runtimeLicenseKey = "";
                    checkStatus = licensingClasses_1.LicenseCheckStatus.NoLicense;
                    licenseContext.SCRTCredentials.ResetRuntimeLicense();
                    isRuntimeKey = false;
                    licenseManager2dState_1.licenseManager2dState.setIsDev(true);
                    checkStatus = licensingClasses_1.LicenseCheckStatus.StartLookingForLicenseWizard;
                    getlicenseFromWizard(licenseContext, sciChartSurface);
                    if (Globals_1.sciChartDestinations.length > 0 && !sciChartSurface.isDeleted) {
                        sciChartSurface2D = Globals_1.sciChartDestinations[0].sciChartSurface;
                        (0, exports.updateLicenseDisplay)(
                        //@ts-ignore
                        (0, exports.getLicenseInfo)(sciChartSurface2D.sharedWasmContext), sciChartSurface2D, true, false);
                        callbacks3D.updateLicenseDisplay3D();
                    }
                    return [2 /*return*/];
                }
                // Failed to connect.  Retry
                challengeFailCounts += 1;
                if (challengeFailCounts < maxretries) {
                    debug("Could not find ".concat(server, "/").concat(serverLicenseEndpoint, ". Trying again in ").concat(retryTime, " seconds"));
                    licenseChallengeTimeout = setTimeout(function () { return dolicenseChallenge(licenseContext, sciChartSurface); }, retryTime * 1000);
                }
                else {
                    expiry = (0, exports.getLicenseCookie)().expiry;
                    msg = licenseManager2dState_1.licenseManager2dState.getIsDev()
                        ? "Please run the license wizard, ensure your license is activated, then refresh page to retry."
                        : "Please check that the endpoint is configured correctly.";
                    console.error("Failed to connect to ".concat(server, "/").concat(serverLicenseEndpoint, ".  License must be revalidated before ").concat(expiry.toLocaleString(), ". ").concat(msg));
                    challengeFailCounts = 0;
                    // Only actually show failure message if token has expired
                    if (new Date() > expiry)
                        checkStatus = licensingClasses_1.LicenseCheckStatus.FailedToFindLicenseWizard;
                }
                return [3 /*break*/, 12];
            case 12:
                if (licenseContext !== undefined && !sciChartSurface.isDeleted) {
                    (0, exports.updateLicenseDisplay)((0, exports.getLicenseInfo)(licenseContext), sciChartSurface, true, true);
                    callbacks3D.updateLicenseDisplay3D();
                }
                return [2 /*return*/];
        }
    });
}); };
var shouldApplyLicense2D = true;
var forceReapplyLicense2D = function () {
    shouldApplyLicense2D = true;
};
exports.forceReapplyLicense2D = forceReapplyLicense2D;
var checkStatus = licensingClasses_1.LicenseCheckStatus.NoLicense;
// let licenseContext2D: TLicenseContext;
// let sciChartSurface2D: SciChartSurfaceBase;
var isRuntimeKey = false;
var communityNotice = false;
var applyLicense2D = function (licenseContext, sciChartSurface, isSingle) {
    debug("applyLicense 2D");
    // if (shouldApplyLicense2D) {
    //     sciChartSurface2D = sciChartSurface;
    //     licenseContext2D = licenseContext;
    // }
    if (isSingle || shouldApplyLicense2D) {
        (0, exports.applyLicense)(licenseContext, sciChartSurface);
    }
    else {
        if (checkStatus !== licensingClasses_1.LicenseCheckStatus.LicenseOK) {
            (0, exports.updateLicenseDisplay)((0, exports.getLicenseInfo)(licenseContext), sciChartSurface, true, false);
        }
    }
    if (!isSingle)
        shouldApplyLicense2D = false;
};
var applyLicense = function (licenseContext, sciChartSurface) {
    var _a, _b, _c, _d;
    debug("applyLicense running");
    var licenseKey = "";
    var lt = licenseContext.SCRTCredentials.GetLicenseType();
    debug("Initial license status is " + licensingClasses_1.LicenseType[convertLicenseType(lt, licenseContext)]);
    // Get from global store
    var runtimelicense = getRuntimeLicenseKey();
    if ((checkStatus === licensingClasses_1.LicenseCheckStatus.NoLicense ||
        checkStatus === licensingClasses_1.LicenseCheckStatus.LicenseOK ||
        checkStatus === licensingClasses_1.LicenseCheckStatus.StartLookingForLicenseWizard ||
        checkStatus === licensingClasses_1.LicenseCheckStatus.LookingForLicenseWizard) &&
        //lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_COMMUNITY &&
        runtimelicense) {
        debug("Runtime license found");
        var sep = runtimelicense.indexOf(";");
        if (sep > 0) {
            var timeNow = Math.floor(new Date().getTime() / 1000);
            var token = runtimelicense.substring(sep + 1);
            setLicenseCookie(runtimelicense.substr(0, sep), token, timeNow + 60, timeNow);
        }
        else {
            licenseContext.SCRTCredentials.SetRuntimeLicenseKeyW(runtimelicense);
            lt = licenseContext.SCRTCredentials.GetLicenseType();
            var licenseType = convertLicenseType(lt, licenseContext);
            debug("Runtime license status is " + licensingClasses_1.LicenseType[licenseType]);
            if (lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_FULL ||
                lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_TRIAL ||
                lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_COMMUNITY ||
                lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_REQUIRES_VALIDATION) {
                isRuntimeKey = true;
                licenseKey = runtimelicense;
            }
            else {
                var errorMsg = licenseContext.SCRTCredentials.GetLicenseErrors();
                if ((window && ((_a = window.location) === null || _a === void 0 ? void 0 : _a.hostname) && !((_c = (_b = window.location) === null || _b === void 0 ? void 0 : _b.hostname) === null || _c === void 0 ? void 0 : _c.includes("localhost"))) ||
                    !errorMsg.startsWith("License is not valid for this domain")) {
                    if (isDebug) {
                        debug("Runtime license is invalid: " + errorMsg);
                    }
                    else {
                        console.warn("Runtime license is invalid.  Call setIsDebugLicensing(true) for details.");
                    }
                }
                else {
                    debug("Runtime license is invalid: " + errorMsg);
                }
                licenseKey = "";
            }
        }
    }
    // Get from cookie store
    var licenseCookie = (0, exports.getLicenseCookie)();
    if (licenseKey === "" && licenseCookie && licenseCookie.key !== "") {
        debug("Found license in cookie.");
        licenseKey = licenseCookie.key;
        licenseContext.SCRTCredentials.SetRuntimeLicenseKeyW(licenseKey);
        lt = licenseContext.SCRTCredentials.GetLicenseType();
        // if the license in cookie is bad, remove it
        if (!(lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_FULL ||
            lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_TRIAL ||
            lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_REQUIRES_VALIDATION)) {
            debug("License cookie is invalid. " + licenseContext.SCRTCredentials.GetLicenseErrors());
            (0, cookie_1.deleteCookie)("scLicense");
            licenseKey = "";
            lt = licenseContext.SCRTLicenseType.LICENSE_TYPE_COMMUNITY;
        }
    }
    else if (checkStatus === licensingClasses_1.LicenseCheckStatus.FetchingFromServer) {
        checkStatus = licensingClasses_1.LicenseCheckStatus.NoLicense;
    }
    if (licenseKey !== "") {
        if (lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_COMMUNITY) {
            // Set the license if we haven't already
            licenseContext.SCRTCredentials.SetRuntimeLicenseKeyW(licenseKey);
            lt = licenseContext.SCRTCredentials.GetLicenseType();
        }
        licenseManager2dState_1.licenseManager2dState.setIsDev(licenseContext.SCRTCredentials.GetAllowDebugging());
        if (lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_FULL ||
            lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_TRIAL ||
            lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_COMMUNITY) {
            checkStatus = licensingClasses_1.LicenseCheckStatus.LicenseOK;
            debug("license ok");
            if (lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_COMMUNITY && isRuntimeKey && !communityNotice) {
                console.log("Using SciChart Community Edition. To use a license from the License Wizard, remove the call to UseCommunityLicense");
                var daysRemaining = licenseContext.SCRTCredentials.GetLicenseDaysRemaining();
                console.log("The community license is valid for 6 months from the date the version in use was released.  This version ".concat(BuildStamp_1.libraryVersion, " has ").concat(daysRemaining, " day").concat(daysRemaining === 1 ? "" : "s", " remaining"));
                communityNotice = true;
            }
        }
        else if (licenseContext.SCRTCredentials.RequiresValidation()) {
            debug("license requires validation");
            if (isRuntimeKey && licenseManager2dState_1.licenseManager2dState.getIsDev()) {
                // clear key
                licenseContext.SCRTCredentials.ResetRuntimeLicense();
                (0, cookie_1.deleteCookie)("scLicense");
                checkStatus = licensingClasses_1.LicenseCheckStatus.DevKeyInRuntimeKey;
            }
            else if (licenseCookie.expiry > new Date() && licenseCookie.key === licenseKey) {
                debug("current token in cookie");
                var expirySeconds = setChallengeResponse(licenseCookie.token, licenseContext);
                lt = licenseContext.SCRTCredentials.GetLicenseType();
                if (lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_FULL ||
                    lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_TRIAL) {
                    checkStatus = licensingClasses_1.LicenseCheckStatus.LicenseOK;
                }
                var timeNow = Math.floor(new Date().getTime() / 1000);
                if (expirySeconds * 1000 > licenseCookie.expiry.getTime()) {
                    setLicenseCookie(licenseKey, licenseCookie.token, expirySeconds, timeNow);
                }
                var validationInterval = 60 * 60 * 24; // Once a day
                var secondsSinceValidated = (new Date().getTime() - licenseCookie.lastValidated.getTime()) / 1000;
                debug("License expires in ".concat(expirySeconds - timeNow, " seconds.  Last validated ").concat(secondsSinceValidated, " seconds ago"));
                if (secondsSinceValidated > validationInterval &&
                    checkStatus !== licensingClasses_1.LicenseCheckStatus.ValidatingDeveloperLicense) {
                    checkStatus = licensingClasses_1.LicenseCheckStatus.ValidatingDeveloperLicense;
                    dolicenseChallenge(licenseContext, sciChartSurface);
                }
            }
            else if (checkStatus === licensingClasses_1.LicenseCheckStatus.NoLicense) {
                checkStatus = licensingClasses_1.LicenseCheckStatus.ValidatingDeveloperLicense;
                dolicenseChallenge(licenseContext, sciChartSurface);
            }
        }
        else {
            debug("license is invalid: " + licenseContext.SCRTCredentials.GetLicenseErrors());
        }
    }
    debug("checkstatus: " + licensingClasses_1.LicenseCheckStatus[checkStatus]);
    if (checkStatus === licensingClasses_1.LicenseCheckStatus.NoLicense) {
        if (lt === licenseContext.SCRTLicenseType.LICENSE_TYPE_COMMUNITY && !communityNotice) {
            console.log("Defaulting to SciChart Community Edition. Usage constitutes acceptance of our EULA and terms at https://www.scichart.com/community-licensing. See https://store.scichart.com for commercial licensing options.");
            var daysRemaining = licenseContext.SCRTCredentials.GetLicenseDaysRemaining();
            console.log("The community license is valid for 6 months from the date the version in use was released.  This version ".concat(BuildStamp_1.libraryVersion, " has ").concat(daysRemaining, " day").concat(daysRemaining === 1 ? "" : "s", " remaining"));
            if (!app_1.IS_TEST_ENV && ((_d = document === null || document === void 0 ? void 0 : document.location) === null || _d === void 0 ? void 0 : _d.hostname.startsWith("localhost")) && useLicenseWizard) {
                console.log("SciChart is looking for a paid developer activation from the scichart licensing wizard... To disable this call SciChartSurface.UseCommunityLicense()");
            }
            communityNotice = true;
        }
        if (wizardTimer === undefined && useLicenseWizard) {
            checkStatus = licensingClasses_1.LicenseCheckStatus.StartLookingForLicenseWizard;
            licenseManager2dState_1.licenseManager2dState.setIsDev(true);
            getlicenseFromWizard(licenseContext, sciChartSurface);
        }
    }
    if (licenseContext !== undefined) {
        (0, exports.updateLicenseDisplay)((0, exports.getLicenseInfo)(licenseContext), sciChartSurface, true, false);
        callbacks3D.updateLicenseDisplay3D();
    }
};
exports.applyLicense = applyLicense;
var licenseModal;
var openLicenseModal = function () {
    console.error("Modal not initialized");
};
var setNewLicense = function (keyCode, licenseContext, sciChartSurface) {
    var requiresValidation = false;
    var trialExpired;
    if (licenseModal) {
        licenseModal.style.display = "none";
    }
    isRuntimeKey = false;
    setLicenseCookie(keyCode, null, null, null);
    if (licenseContext !== undefined) {
        licenseContext.SCRTCredentials.SetRuntimeLicenseKeyW(keyCode);
        requiresValidation = licenseContext.SCRTCredentials.RequiresValidation();
        trialExpired =
            licenseContext.SCRTCredentials.GetLicenseType() ===
                licenseContext.SCRTLicenseType.LICENSE_TYPE_TRIAL_EXPIRED;
        (0, exports.updateLicenseDisplay)((0, exports.getLicenseInfo)(licenseContext), sciChartSurface, true, true);
    }
    var result3D = callbacks3D.setNewLicense3D(keyCode);
    if (result3D !== undefined) {
        requiresValidation = result3D.requiresValidation;
        trialExpired = result3D.trialExpired;
    }
    return { requiresValidation: requiresValidation, trialExpired: trialExpired };
};
var insertedRules = new Dictionary_1.Dictionary();
var insertStyleSheetRule = function (ruleName, ruleText) {
    if (insertedRules.containsKey(ruleName))
        return;
    var sheets = document.styleSheets;
    if (sheets.length === 0) {
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
    }
    var sheet = sheets[sheets.length - 1];
    // @ts-ignore
    var index = sheet.insertRule(ruleText, sheet.cssRules.length);
    insertedRules.add(ruleName, index);
};
var createCloseDivStyles = function () {
    insertStyleSheetRule("licenseModalClose", ".licenseModalClose {\n        color: #aaa;\n        float: right;\n        font-size: 28px;\n        font-weight: bold;\n      }");
    insertStyleSheetRule("licenseModalClose:hover", ".licenseModalClose:hover {\n        color: black;\n        text-decoration: none;\n        cursor: pointer;\n      }");
    insertStyleSheetRule("licenseModalClose:focus", ".licenseModalClose:focus {\n        color: black;\n        text-decoration: none;\n        cursor: pointer;\n      }");
};
var createLicenseModal = function (message, postFormMessage) {
    licenseModal = document.createElement("div");
    licenseModal.id = "scichartLicenseModal";
    licenseModal.style.display = "none"; /* Hidden by default */
    licenseModal.style.position = "fixed"; /* Stay in place */
    licenseModal.style.zIndex = "100"; /* Sit on top */
    licenseModal.style.left = "0";
    licenseModal.style.top = "0";
    licenseModal.style.width = "100%"; /* Full width */
    licenseModal.style.height = "100%"; /* Full height */
    licenseModal.style.overflow = "auto"; /* Enable scroll if needed */
    licenseModal.style.backgroundColor = "rgb(0,0,0)"; /* Fallback color */
    licenseModal.style.backgroundColor = "rgba(0,0,0,0.4)"; /* Black w/ opacity */
    var modalContent = document.createElement("div");
    modalContent.style.backgroundColor = "#fefefe";
    modalContent.style.position = "absolute";
    modalContent.style.left = "50%";
    modalContent.style.top = "50%";
    modalContent.style.transform = "translate(-50%, -50%)";
    modalContent.style.borderRadius = "4px";
    modalContent.style.padding = "20px";
    modalContent.style.maxWidth = "460px";
    licenseModal.appendChild(modalContent);
    var modalContentForm = document.createElement("div");
    modalContentForm.style.display = "block";
    modalContent.appendChild(modalContentForm);
    var modalContentMessage = document.createElement("div");
    modalContentMessage.style.display = "none";
    modalContent.appendChild(modalContentMessage);
    openLicenseModal = function () {
        licenseModal.style.display = "block";
        modalContentForm.style.display = "block";
        modalContentMessage.style.display = "none";
    };
    var modalHeader = document.createElement("div");
    modalHeader.style.display = "flex";
    modalHeader.style.padding = "8px 16px";
    modalHeader.style.backgroundColor = "#5cb85c";
    modalHeader.style.color = "white";
    modalContentForm.appendChild(modalHeader);
    var modalHeaderTitle = document.createElement("div");
    modalHeaderTitle.style.flexGrow = "1";
    modalHeaderTitle.innerHTML = message;
    modalHeader.appendChild(modalHeaderTitle);
    createCloseDivStyles();
    var closeDiv = document.createElement("span");
    closeDiv.innerHTML = "&times;";
    closeDiv.className = "licenseModalClose";
    modalHeader.appendChild(closeDiv);
    var buttonLabel = document.createElement("div");
    buttonLabel.innerHTML = "If you contact support with a licensing issue, we will ask you to send us the license debug log.\n    To toggle License debug mode use the button below and refresh the page, then check the console output.  \n    When copying the log, make sure to start from the beginning, indicated by the reported version number";
    var toggleDebugModeButton = document.createElement("button");
    toggleDebugModeButton.style.margin = "10px";
    var setDebugModeSwitchLabel = function () {
        toggleDebugModeButton.textContent = isDebug ? "Disable licensing debug mode" : "Enable licensing debug mode";
    };
    setDebugModeSwitchLabel();
    toggleDebugModeButton.onclick = function () {
        (0, exports.setIsDebugLicensing)(!isDebug, true);
        setDebugModeSwitchLabel();
    };
    modalContentForm.appendChild(buttonLabel);
    modalContentForm.appendChild(toggleDebugModeButton);
    var modalFooter = document.createElement("div");
    modalFooter.innerHTML = postFormMessage;
    modalFooter.style.padding = "8px 16px";
    modalFooter.style.backgroundColor = "#5cb85c";
    modalFooter.style.color = "white";
    modalContentForm.appendChild(modalFooter);
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target === licenseModal) {
            licenseModal.style.display = "none";
        }
    };
    var oldModal = document.querySelector("[id='".concat(licenseModal.id, "']"));
    if (oldModal == null)
        document.body.appendChild(licenseModal);
    else
        document.body.replaceChild(licenseModal, oldModal);
    // When the user clicks on <div> (x), close the modal
    closeDiv.onclick = function () {
        licenseModal.style.display = "none";
    };
    return licenseModal;
};
var LICENSE_MSG_CLASS = "licenseMessage";
var LICENSE_MSG_CLASS_CHILD = "licenseMessageChild";
var licenseMessageDiv = null;
var licenseMessageDivChild = null;
var updateLicenseMessageDOM = function (divContainer, licenseMsgDiv) {
    if (!divContainer) {
        return;
    }
    var msgCloneOther = licenseMsgDiv.cloneNode(true);
    var lms = divContainer.getElementsByClassName(LICENSE_MSG_CLASS);
    if (lms.length > 0) {
        var lm = lms[0];
        divContainer.replaceChild(msgCloneOther, lm);
    }
    else {
        divContainer.appendChild(msgCloneOther);
    }
    if (useLicenseWizard)
        msgCloneOther.onclick = openLicenseModal;
};
var convertLicenseType = function (sclt, licenseContext) {
    var licenseType = licensingClasses_1.LicenseType.NoLicense;
    switch (sclt) {
        case licenseContext.SCRTLicenseType.LICENSE_TYPE_NO_LICENSE: {
            licenseType = licensingClasses_1.LicenseType.NoLicense;
            break;
        }
        case licenseContext.SCRTLicenseType.LICENSE_TYPE_TRIAL: {
            licenseType = licensingClasses_1.LicenseType.Trial;
            break;
        }
        case licenseContext.SCRTLicenseType.LICENSE_TYPE_COMMUNITY: {
            licenseType = licensingClasses_1.LicenseType.Community;
            break;
        }
        case licenseContext.SCRTLicenseType.LICENSE_TYPE_FULL: {
            licenseType = licensingClasses_1.LicenseType.Full;
            break;
        }
        case licenseContext.SCRTLicenseType.LICENSE_TYPE_FULL_EXPIRED: {
            licenseType = licensingClasses_1.LicenseType.Full_Expired;
            break;
        }
        case licenseContext.SCRTLicenseType.LICENSE_TYPE_TRIAL_EXPIRED: {
            licenseType = licensingClasses_1.LicenseType.Trial_Expired;
            break;
        }
        case licenseContext.SCRTLicenseType.LICENSE_TYPE_SUBSCRIPTION_EXPIRED: {
            licenseType = licensingClasses_1.LicenseType.Subscription_Expired;
            break;
        }
        case licenseContext.SCRTLicenseType.LICENSE_TYPE_INVALID_DEVELOPER_LICENSE: {
            licenseType = licensingClasses_1.LicenseType.Invalid_Developer;
            break;
        }
        case licenseContext.SCRTLicenseType.LICENSE_TYPE_REQUIRES_VALIDATION: {
            licenseType = licensingClasses_1.LicenseType.Requres_Validation;
            break;
        }
        case licenseContext.SCRTLicenseType.LICENSE_TYPE_INVALID_LICENSE: {
            licenseType = licensingClasses_1.LicenseType.Invalid;
            break;
        }
    }
    return licenseType;
};
var getLicenseInfo = function (licenseContext) {
    var sclt = licenseContext.SCRTCredentials.GetLicenseType();
    var licenseType = convertLicenseType(sclt, licenseContext);
    var daysRemaining = licenseContext.SCRTCredentials.GetLicenseDaysRemaining();
    if ((checkStatus === licensingClasses_1.LicenseCheckStatus.LicenseOK || licenseType === licensingClasses_1.LicenseType.Community) &&
        licenseManager2dState_1.licenseManager2dState.getLicenseType() !== licenseType) {
        if (licenseType === licensingClasses_1.LicenseType.Community) {
            licenseManager2dState_1.licenseManager2dState.setOrderId("Community");
        }
        else {
            licenseManager2dState_1.licenseManager2dState.setOrderId(licenseContext.SCRTCredentials.GetEncryptedOrderId());
        }
        licenseManager2dState_1.licenseManager2dState.setProductCode(licenseContext.SCRTCredentials.GetProductCode());
        licenseManager2dState_1.licenseManager2dState.setLicenseType(licenseType);
        licenseManager2dState_1.licenseManager2dState.setDevCount(licenseContext.SCRTCredentials.GetDeveloperCount());
        // Telemetry is enabled based on a license feature
        var teFeature = licenseContext.SCRTCredentials.HasFeature("TE");
        licenseManager2dState_1.licenseManager2dState.setTelemetry(teFeature === licenseContext.SCRTLicenseType.LICENSE_TYPE_FULL ||
            teFeature === licenseContext.SCRTLicenseType.LICENSE_TYPE_TRIAL);
    }
    if (isDebug) {
        debug(licenseContext.SCRTCredentials.Dump());
    }
    var error = licenseContext.SCRTCredentials.GetLicenseErrors();
    return { licenseType: licenseType, daysRemaining: daysRemaining, error: error };
};
exports.getLicenseInfo = getLicenseInfo;
var licenseType2D;
var licenseType3D;
var previousCheckStatus;
var updateLicenseDisplayInternal = function (licenseInfo, sciChartSurface, is2D, applyToOther) {
    if (licenseMessageDiv == null) {
        licenseMessageDiv = document.createElement("div");
        licenseMessageDiv.className = LICENSE_MSG_CLASS;
        licenseMessageDivChild = document.createElement("div");
        licenseMessageDivChild.className = LICENSE_MSG_CLASS_CHILD;
        licenseMessageDivChild.innerHTML = "";
        licenseMessageDiv.appendChild(licenseMessageDivChild);
    }
    var premsg = "";
    var chartmsg = "";
    var postMsg = "";
    var licenseType = licenseInfo.licenseType, daysRemaining = licenseInfo.daysRemaining, error = licenseInfo.error;
    if ((is2D && licenseType !== licenseType2D) ||
        (!is2D && licenseType !== licenseType3D) ||
        checkStatus !== previousCheckStatus) {
        previousCheckStatus = checkStatus;
        if (is2D)
            licenseType2D = licenseType;
        else
            licenseType3D = licenseType;
        // if (licenseType === LicenseType.Trial || licenseType === LicenseType.Full)
        //    checkStatus = LicenseCheckStatus.LicenseOK;
        debug("".concat(is2D ? "2D" : "3D", " license status changed"));
        sciChartSurface.invalidateElement();
        sciChartSurface.otherSurfaces.map(function (s) { return s.invalidateElement(); });
        if (checkStatus === licensingClasses_1.LicenseCheckStatus.StartLookingForLicenseWizard) {
            return;
        }
        // Update license message text
        var licensingLink = "<a href=\"https://www.scichart.com/licensing-scichart-js\"  target=\"_blank\" style=\"color: white\">www.scichart.com/licensing-scichart-js</a>";
        var contactSupportLink = "<a href=\"https://www.scichart.com/contact-us/\"  target=\"_blank\" style=\"color: orange\">contact support</a>";
        if (licenseType === licensingClasses_1.LicenseType.NoLicense) {
            premsg = "You need to have a license to use SciChart.  ";
            postMsg = "Instructions can be seen at ".concat(licensingLink);
        }
        else if (licenseType === licensingClasses_1.LicenseType.Invalid) {
            if (error.startsWith("License is not valid for this domain"))
                premsg = "Sorry! The runtime license key is not valid for this domain</br>\n                Please ".concat(contactSupportLink, " with your OrderID if you believe this to be incorrect. <u>Click for more information</u></br>\n                For local development, make sure the Licensing Wizard is running and activated.</br>\n                To use Community Edition, remove the call to setRuntimeLicenseKey");
            else if (error.startsWith("This version of SciChart can no longer be trialed"))
                premsg = "Sorry! This version of SciChart is too old to be trialed.  Please update to the latest version";
            else if (error.startsWith("This version of SciChart can no longer be used for the community edition"))
                premsg = "Sorry! This version of SciChart is too old to be used for the community edition.  Please update to the latest version";
            else
                premsg = "Sorry! Your license key appears to be invalid</br>Please ".concat(contactSupportLink, " with your OrderID if you believe this to be incorrect.");
            postMsg = "Instructions can be seen at ".concat(licensingLink);
        }
        else if (licenseType === licensingClasses_1.LicenseType.Invalid_Developer) {
            premsg = "Sorry! You need a developer license to use SciChart on a domain not included in your runtime key.";
            postMsg = "Instructions can be seen at ".concat(licensingLink, "</br>\n                    Please ").concat(contactSupportLink, " with your OrderID if you are experiencing issues.");
        }
        else if (licenseType === licensingClasses_1.LicenseType.Requres_Validation) {
            if (licenseManager2dState_1.licenseManager2dState.getIsDev()) {
                premsg = "Your developer license must be validated by the SciChart Licensing Wizard running locally";
            }
            else {
                premsg = "This runtime key must be validated by a server side key.";
            }
            postMsg = "Instructions can be seen at ".concat(licensingLink, "</br>\n                    Please ").concat(contactSupportLink, " with your OrderID if you are experiencing issues.");
        }
        else if (licenseType === licensingClasses_1.LicenseType.Subscription_Expired) {
            premsg = "Sorry! Your support subscription has expired.<br>";
            postMsg = "Please ".concat(contactSupportLink, " us if you would like to renew your subscription.");
        }
        else if (licenseType === licensingClasses_1.LicenseType.Trial_Expired && daysRemaining < 1) {
            premsg = "Sorry! Your trial has expired.";
            postMsg = "Please ".concat(contactSupportLink, " if you require an extension.");
        }
        else if (licenseType === licensingClasses_1.LicenseType.Trial_Expired && daysRemaining > 1) {
            premsg = "This version is too old to trial.";
            postMsg = "Please ".concat(contactSupportLink, " if you require an extension.");
        }
        else if (licenseType === licensingClasses_1.LicenseType.Trial && daysRemaining <= 7) {
            premsg = "You have ".concat(daysRemaining, " day").concat(daysRemaining === 1 ? "" : "s", " remaining of the trial.");
        }
        else if (licenseType === licensingClasses_1.LicenseType.Community && daysRemaining <= 7) {
            premsg = "You have ".concat(daysRemaining, " day").concat(daysRemaining === 1 ? "" : "s", " remaining on the community license for this version.  Please update to the latest version of SciChart");
        }
        else if (licenseType === licensingClasses_1.LicenseType.Full ||
            ((licenseType === licensingClasses_1.LicenseType.Trial || licenseType === licensingClasses_1.LicenseType.Community) && daysRemaining > 7)) {
            licenseMessageDiv.style.display = "none";
            licenseMessageDivChild.innerHTML = "";
        }
        if (checkStatus !== licensingClasses_1.LicenseCheckStatus.LicenseOK) {
            if (checkStatus === licensingClasses_1.LicenseCheckStatus.FetchingFromServer)
                chartmsg = "<br>Fetching license from server...";
            if (checkStatus === licensingClasses_1.LicenseCheckStatus.LookingForLicenseWizard) {
                if (licenseType === licensingClasses_1.LicenseType.Community) {
                    (0, Telemetry_1.sendTelemetry)();
                }
                chartmsg = "<br>Looking for Licensing Wizard...";
            }
            else if (checkStatus === licensingClasses_1.LicenseCheckStatus.FailedToFindLicenseWizard)
                if (licenseManager2dState_1.licenseManager2dState.getIsDev()) {
                    chartmsg = "<br><u>Could not connect to the Licensing Wizard.  Please run it, then reload this page.</u>";
                }
                else {
                    chartmsg = "<br><u>Could not connect to the server licensing endpoint</u>";
                }
            else if (checkStatus === licensingClasses_1.LicenseCheckStatus.ValidatingDeveloperLicense)
                if (licenseManager2dState_1.licenseManager2dState.getIsDev()) {
                    chartmsg = "<br><u>Trying to validate your license...";
                }
                else {
                    chartmsg = "<br><u>Trying to validate your license with the server...</u>.";
                }
            else if (checkStatus === licensingClasses_1.LicenseCheckStatus.FailedToValidateDeveloperLicense)
                if (licenseManager2dState_1.licenseManager2dState.getIsDev()) {
                    chartmsg = "<br><u>Failed to validate your developer license with the Licensing Wizard.  If you have changed your activated license, try clearing your cookies for this site.</u>.";
                }
                else {
                    chartmsg = "<br><u>Failed to validate the runtime license with the server</u>.";
                }
            else if (checkStatus === licensingClasses_1.LicenseCheckStatus.NoLicenseInWizard && licenseType === licensingClasses_1.LicenseType.NoLicense)
                chartmsg = "<br><u>Please use the Licensing wizard to start a trial or activate a serial key.  Click for more information</u>.";
            else if (checkStatus === licensingClasses_1.LicenseCheckStatus.DevKeyInRuntimeKey)
                chartmsg = "<br><u>You have set a developer key as a runtime key, which will not work on any other machine.  Click for more information</u>";
            // tslint:disable-next-line: max-line-length
            else if (licenseType === licensingClasses_1.LicenseType.Trial_Expired && daysRemaining > 1)
                chartmsg = "<br><u>Please update to the latest version of SciChart. Click for more information</u>.";
            else if (checkStatus === licensingClasses_1.LicenseCheckStatus.NoLicenseInWizard &&
                licenseType === licensingClasses_1.LicenseType.Trial_Expired) {
                chartmsg = "<br><u>Please activate a serial key in the Licensing Wizard, or contact sales for an extension.  Click for more information</u>.";
            }
            if (premsg) {
                licenseMessageDiv.style.width = "100%";
                licenseMessageDiv.style.height = "100%";
                licenseMessageDiv.style.top = "0";
                licenseMessageDiv.style.left = "0";
                licenseMessageDiv.style.position = "absolute";
                licenseMessageDiv.style.pointerEvents = "auto";
                licenseMessageDiv.style.cursor = "pointer";
                licenseMessageDiv.style.background = Color_1.EColor.BackgroundColor;
                licenseMessageDiv.style.zIndex = "10";
                licenseMessageDivChild.style.display = "block";
                licenseMessageDivChild.style.color = "orange";
                licenseMessageDivChild.style.width = "80%";
                licenseMessageDivChild.style.position = "absolute";
                licenseMessageDivChild.style.left = "50%";
                licenseMessageDivChild.style.top = "50%";
                licenseMessageDivChild.style.transform = "translate(-50%, -50%)";
                licenseMessageDivChild.style.textAlign = "center";
                licenseMessageDivChild.style.pointerEvents = "auto";
                if (useLicenseWizard) {
                    licenseMessageDivChild.innerHTML = premsg + chartmsg;
                    createLicenseModal(premsg, postMsg);
                }
                else {
                    licenseMessageDivChild.innerHTML =
                        premsg +
                            "<br><a href=\"https://www.scichart.com/licensing-scichart-js/\"  target=\"_blank\" style=\"color: white\">Click here for licensing information</a>";
                }
            }
        }
        else {
            (0, Telemetry_1.sendTelemetry)();
        }
    }
    updateLicenseMessageDOM(sciChartSurface.domDivContainer, licenseMessageDiv);
    if (applyToOther) {
        sciChartSurface.otherSurfaces.forEach(function (element) {
            updateLicenseMessageDOM(element.domDivContainer, licenseMessageDiv);
        });
    }
};
var clear = function () {
    if (!Globals_1.sciChartDestinations.length && !Globals_1.sciChartSingleDestinations.length && !Globals_1.sciChart3DDestinations.length) {
        clearTimeout(wizardTimer);
        clearTimeout(licenseChallengeTimeout);
        (0, exports.setCallbacks3D)(callbacks3DInitialValue);
        licenseMessageDivChild = null;
        licenseMessageDiv = null;
    }
};
var updateLicenseDisplay = function (licenseInfo, sciChartSurface, is2D, applyToOther) { return licenseDependencies.updateLicenseDisplay(licenseInfo, sciChartSurface, is2D, applyToOther); };
exports.updateLicenseDisplay = updateLicenseDisplay;
exports.licenseManager = {
    clear: clear,
    setRuntimeLicenseKey: function (value) { return (0, exports.setRuntimeLicenseKey)(value); },
    setIsDebugLicensing: function (value) { return (0, exports.setIsDebugLicensing)(value); },
    setLicenseCallback: function (callback) { return (0, exports.setLicenseCallback)(callback); },
    setServerLicenseEndpoint: function (value) { return setServerLicenseEndpoint(value); },
    applyLicense2D: function (licenseContext, sciChartSurface, isSingle) {
        return applyLicense2D(licenseContext, sciChartSurface, isSingle);
    }
};
