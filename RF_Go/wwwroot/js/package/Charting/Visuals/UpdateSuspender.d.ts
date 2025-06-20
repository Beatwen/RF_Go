import { DeletableEntity } from "../../Core/DeletableEntity";
import { Dictionary } from "../../Core/Dictionary";
import { IDeletable } from "../../Core/IDeletable";
/**
 * Types which implement ISuspendable can have updates suspended/resumed. Useful for batch operations.
 */
export interface ISuspendable {
    /**
     * Gets a value indicating whether updates for the target are currently suspended
     */
    readonly isSuspended: boolean;
    /**
     * A unique ID for this suspendable instance. Consider using the {@link generateGuid} function to ensure this is unique
     */
    readonly suspendableId: string;
    /**
     * Suspends drawing updates on the target until the returned object {@link IUpdateSuspender.resume}
     * is called, when a final draw call will be issued
     */
    suspendUpdates(): IUpdateSuspender;
    /**
     * USED INTERNALLY. Resumes updates on the target
     * @param suspender
     */
    resumeUpdates(suspender: IUpdateSuspender): void;
    /**
     * Called by IUpdateSuspender each time a target suspender is resumed. When the final
     * target suspender has been resumed, resumeUpdates is called
     */
    decrementSuspend(): void;
}
/**
 * Defines the interface to an {@link UpdateSuspender}, a class which allows nested suspend/resume operations on an {@link ISuspendable} target
 */
export interface IUpdateSuspender extends IDeletable {
    /**
     * Gets or sets a value indicating whether the target will resume when the
     * {@link IUpdateSuspender.resume} function is called is disposed. Default is True
     */
    readonly shouldResumeTarget: boolean;
    /**
     * Call to resume updates on the target. Note this MUST be called or your target will stay suspended forever!
     */
    resume(): void;
}
/**
 * Internal type used to track suspendable instances and number of nested suspend calls
 */
declare type SuspendedInstance = {
    id: string;
    suspendable: ISuspendable;
    suspendCount: number;
};
/**
 * A class which allows nested suspend/resume operations on an {@link ISuspendable} target
 */
export declare class UpdateSuspender extends DeletableEntity implements IUpdateSuspender {
    /**
     * USED INTERNALLY: A map of string Id to Suspended instances
     */
    static readonly suspendedInstances: Dictionary<SuspendedInstance>;
    /**
     * Get whether the provided {@link ISuspendable} instance is suspended or not
     * @param target The target {@link ISuspendable}
     */
    static getIsSuspended(target: ISuspendable): boolean;
    /**
     * A helper function to perform multiple operations in a single batch with a single redraw at the end
     * @remarks Implements the .suspendUpdates() and .resume() pattern around a function.
     * Equivalent to calling target.suspendUpdates(), batchOperation() then .resume()
     * @param target The target that we want to suspend and resume around a batch operation
     * @param batchOperation
     */
    static using(target: ISuspendable, batchOperation: () => void): void;
    private readonly resumeTargetProperty;
    private targetProperty;
    /**
     * Creates an instance of an {@link UpdateSuspender}
     * @param target The target that we want to suspend. Multiple nested suspend/resumes are permitted
     * @param shouldResumeTarget This flag is passed through to the target on resume
     */
    constructor(target: ISuspendable, shouldResumeTarget?: boolean);
    /**
     * Gets whether the current instance is suspended
     */
    get isSuspended(): boolean;
    /**
     * Gets whether the target should resume once updates are resumed
     */
    get shouldResumeTarget(): boolean;
    /**
     * Call this to resume drawing on the target {@link ISuspendable}
     */
    resume(): void;
    delete(): void;
    destroy(): void;
    protected remove(): void;
    private increment;
    private decrement;
}
export {};
