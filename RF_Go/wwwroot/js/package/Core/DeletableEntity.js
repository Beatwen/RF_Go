"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWasmContextRevocableProxy = exports.WasmContextProxyHandler = exports.WasmObjectConstructorProxyHandler = exports.DeletableEntityProxyHandler = exports.DeletableEntity = exports.createTrackableProxy = void 0;
var MemoryUsageHelper_1 = require("../utils/MemoryUsageHelper");
/** @ignore */
var createTrackableProxy = function (target, isWasmObject) {
    if (isWasmObject === void 0) { isWasmObject = false; }
    var disposableEntityId = (0, MemoryUsageHelper_1.generateIdentifier)(target);
    var revocableToken = Proxy.revocable(target, new DeletableEntityProxyHandler(disposableEntityId));
    MemoryUsageHelper_1.MemoryUsageHelper.objectRegistry.add(target, disposableEntityId, {
        proxy: revocableToken.proxy,
        revocableToken: revocableToken,
        isWasmObject: isWasmObject
    });
    return revocableToken.proxy;
};
exports.createTrackableProxy = createTrackableProxy;
/** Utility class responsible for adding its instance to {@link MemoryUsageHelper.objectRegistry} when Memory Usage Debug Mode is enabled
 * @remarks
 * It wraps the returned instance into a proxy object, so internal reference comparisons may fail
 * */
var DeletableEntity = /** @class */ (function () {
    function DeletableEntity(entity) {
        try {
            if (process.env.NODE_ENV !== "production") {
                if (MemoryUsageHelper_1.MemoryUsageHelper.isMemoryUsageDebugEnabled) {
                    var target = entity !== null && entity !== void 0 ? entity : this;
                    return (0, exports.createTrackableProxy)(target, false);
                }
            }
        }
        catch (err) {
            console.warn("Error while creating an object proxy: ".concat(err, " "));
        }
    }
    return DeletableEntity;
}());
exports.DeletableEntity = DeletableEntity;
/** @ignore */
var DeletableEntityProxyHandler = /** @class */ (function () {
    function DeletableEntityProxyHandler(id) {
        this.disposableEntityId = id;
    }
    DeletableEntityProxyHandler.prototype.construct = function (real, constructParams) {
        console.warn("construct called on Deletable", this.disposableEntityId);
        return real;
    };
    DeletableEntityProxyHandler.prototype.apply = function (target, thisArg, argArray) {
        console.warn("apply called on Deletable", this.disposableEntityId);
    };
    DeletableEntityProxyHandler.prototype.get = function (constructedEntity, propertyName, receiver) {
        var _this = this;
        if (propertyName === "delete") {
            return function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                var removedSuccessfully = MemoryUsageHelper_1.MemoryUsageHelper.objectRegistry.remove(_this.disposableEntityId);
                if (!removedSuccessfully) {
                    console.warn("Failed to remove ".concat(_this.disposableEntityId, " from the Object Registry Probably it has been already deleted!"));
                }
                return constructedEntity[propertyName].apply(constructedEntity, params);
            };
        }
        return constructedEntity[propertyName];
    };
    return DeletableEntityProxyHandler;
}());
exports.DeletableEntityProxyHandler = DeletableEntityProxyHandler;
/** @ignore */
var WasmObjectConstructorProxyHandler = /** @class */ (function () {
    function WasmObjectConstructorProxyHandler() {
    }
    WasmObjectConstructorProxyHandler.prototype.construct = function (targetFunction, constructParams, newTarget) {
        var realConstructedEntity = new (targetFunction.bind.apply(targetFunction, __spreadArray([void 0], constructParams, false)))();
        //TODO check if DeletableEntityWrapper
        return (0, exports.createTrackableProxy)(realConstructedEntity, true);
    };
    return WasmObjectConstructorProxyHandler;
}());
exports.WasmObjectConstructorProxyHandler = WasmObjectConstructorProxyHandler;
// https://stackoverflow.com/a/48036194
var handler = {
    construct: function () {
        return handler;
    }
}; //Must return ANY object, so reuse one
var isConstructor = function (someObj) {
    try {
        return !!new new Proxy(someObj, handler)();
    }
    catch (e) {
        return false;
    }
};
/** @ignore */
var WasmContextProxyHandler = /** @class */ (function () {
    function WasmContextProxyHandler() {
        this.constructorProxyHandler = new WasmObjectConstructorProxyHandler();
    }
    WasmContextProxyHandler.prototype.get = function (target, name, receiver) {
        var originalExposedProperty = target[name];
        var isNativeObjectConstructor = isConstructor(originalExposedProperty);
        if (isNativeObjectConstructor) {
            return new Proxy(originalExposedProperty, this.constructorProxyHandler);
        }
        return originalExposedProperty;
    };
    return WasmContextProxyHandler;
}());
exports.WasmContextProxyHandler = WasmContextProxyHandler;
/** @ignore */
var createWasmContextRevocableProxy = function (wasmContext, id) {
    MemoryUsageHelper_1.MemoryUsageHelper.register(wasmContext, "wasmContext_".concat(id));
    var proxyHandler = {};
    try {
        if (process.env.NODE_ENV !== "production") {
            if (MemoryUsageHelper_1.MemoryUsageHelper.isMemoryUsageDebugEnabled) {
                proxyHandler = new WasmContextProxyHandler();
            }
        }
    }
    catch (err) {
        console.warn(err);
    }
    return Proxy.revocable(wasmContext, proxyHandler);
};
exports.createWasmContextRevocableProxy = createWasmContextRevocableProxy;
