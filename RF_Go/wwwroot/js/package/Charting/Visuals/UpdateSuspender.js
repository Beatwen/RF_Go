"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSuspender = void 0;
var DeletableEntity_1 = require("../../Core/DeletableEntity");
var Dictionary_1 = require("../../Core/Dictionary");
var Guard_1 = require("../../Core/Guard");
/**
 * A class which allows nested suspend/resume operations on an {@link ISuspendable} target
 */
var UpdateSuspender = /** @class */ (function (_super) {
    __extends(UpdateSuspender, _super);
    /**
     * Creates an instance of an {@link UpdateSuspender}
     * @param target The target that we want to suspend. Multiple nested suspend/resumes are permitted
     * @param shouldResumeTarget This flag is passed through to the target on resume
     */
    function UpdateSuspender(target, shouldResumeTarget) {
        if (shouldResumeTarget === void 0) { shouldResumeTarget = true; }
        var _this = _super.call(this) || this;
        _this.resumeTargetProperty = shouldResumeTarget;
        _this.targetProperty = target;
        if (!UpdateSuspender.suspendedInstances.containsKey(_this.targetProperty.suspendableId)) {
            UpdateSuspender.suspendedInstances.add(target.suspendableId, {
                id: target.suspendableId,
                suspendable: target,
                suspendCount: 1
            });
        }
        else {
            _this.increment(target);
        }
        return _this;
    }
    /**
     * Get whether the provided {@link ISuspendable} instance is suspended or not
     * @param target The target {@link ISuspendable}
     */
    UpdateSuspender.getIsSuspended = function (target) {
        return UpdateSuspender.suspendedInstances.containsKey(target.suspendableId);
    };
    /**
     * A helper function to perform multiple operations in a single batch with a single redraw at the end
     * @remarks Implements the .suspendUpdates() and .resume() pattern around a function.
     * Equivalent to calling target.suspendUpdates(), batchOperation() then .resume()
     * @param target The target that we want to suspend and resume around a batch operation
     * @param batchOperation
     */
    UpdateSuspender.using = function (target, batchOperation) {
        Guard_1.Guard.notNull(target, "target");
        var s = target.suspendUpdates();
        try {
            batchOperation();
        }
        finally {
            s.resume();
        }
    };
    Object.defineProperty(UpdateSuspender.prototype, "isSuspended", {
        /**
         * Gets whether the current instance is suspended
         */
        get: function () {
            return UpdateSuspender.getIsSuspended(this.targetProperty);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UpdateSuspender.prototype, "shouldResumeTarget", {
        /**
         * Gets whether the target should resume once updates are resumed
         */
        get: function () {
            return this.resumeTargetProperty;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Call this to resume drawing on the target {@link ISuspendable}
     */
    UpdateSuspender.prototype.resume = function () {
        this.targetProperty.decrementSuspend();
        this.delete();
        if (this.decrement(this.targetProperty) === 0) {
            this.remove();
            this.targetProperty.resumeUpdates(this);
        }
    };
    UpdateSuspender.prototype.delete = function () { };
    UpdateSuspender.prototype.destroy = function () {
        this.remove();
        this.delete();
        this.targetProperty = undefined;
    };
    UpdateSuspender.prototype.remove = function () {
        UpdateSuspender.suspendedInstances.remove(this.targetProperty.suspendableId);
    };
    UpdateSuspender.prototype.increment = function (target) {
        UpdateSuspender.suspendedInstances.item(target.suspendableId).suspendCount++;
    };
    UpdateSuspender.prototype.decrement = function (target) {
        var current = UpdateSuspender.suspendedInstances.item(target.suspendableId).suspendCount;
        current--;
        UpdateSuspender.suspendedInstances.item(target.suspendableId).suspendCount = current;
        return current;
    };
    /**
     * USED INTERNALLY: A map of string Id to Suspended instances
     */
    UpdateSuspender.suspendedInstances = new Dictionary_1.Dictionary();
    return UpdateSuspender;
}(DeletableEntity_1.DeletableEntity));
exports.UpdateSuspender = UpdateSuspender;
