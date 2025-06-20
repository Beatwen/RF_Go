/** @ignore */
declare type TWeakRef<T = any> = {
    deref: () => T;
};
export declare type TObjectEntryInfo = {
    isWasmObject: boolean;
    /** WeakRef for the original object */
    objectRef: TWeakRef;
    /** WeakRef for the proxy of the object */
    proxyRef?: TWeakRef;
    /** revocableToken for the proxy of the object */
    revocableTokenRef?: TWeakRef<ReturnType<ProxyConstructor["revocable"]>>;
};
export declare type TObjectEntryOptions = {
    isWasmObject?: boolean;
    revocableToken?: ReturnType<ProxyConstructor["revocable"]>;
    proxy?: any;
};
/** ObjectRegistry represents a structure for storing object lifecycle info.
 * Adding an object to the registry will place it into a category of undeleted until it is remove from the registry.
 * Also the object will be placed into a category of uncollected until it is disposed by garbage collector.
 */
export declare class ObjectRegistry {
    weakMapRegistry: WeakMap<object, any>;
    undeletedObjectsMap: Map<string, TObjectEntryInfo>;
    uncollectedObjectsMap: Map<string, TObjectEntryInfo>;
    protected finalizationRegistry: any;
    /** Adds an object and its related info to the registry */
    add(obj: any, id: string, options?: TObjectEntryOptions): void;
    /** Removes the object from the undeleted objects collection */
    remove(id: string): boolean;
    getObjectId(obj: any): any;
    /** Calls `delete` on instances of {@link IDeletable} objects within the registry */
    deleteIDeletableObjects(): void;
    /** Calls `delete` on instances of Web Assembly objects within the registry */
    deleteWasmObjects(): void;
    /** Outputs the state of registry to the console */
    log(): void;
    /** Returns the state of the registry */
    getState(): any;
    /** Calls `delete` on a specific object within the registry */
    protected deleteEntry(entry: TObjectEntryInfo, key: string): void;
    /** The callback executed when an object is being garbage collected */
    protected onCollect(id: string): void;
}
/** @ignore */
export declare const generateIdentifier: (entity: any) => string;
/** {@link MemoryUsageHelper} provides tools for tracking, debugging, and testing common issus related to lifecycle of SciChart entities. */
export declare class MemoryUsageHelper {
    protected static isMemoryUsageDebugEnabledProperty: boolean;
    static objectRegistry: ObjectRegistry;
    /** Gets or sets the `Memory Usage Debug Mode`.
     * Enabling the mode, provides warnings about wrong usage or cleanup.
     * Also it wraps SciChart entities and adds them to the {@link objectRegistry} to track their lifecycle
     */
    static get isMemoryUsageDebugEnabled(): boolean;
    /** Gets or sets the `Memory Usage Debug Mode`.
     * Enabling the mode, provides warnings about wrong usage or cleanup.
     * Also it wraps SciChart entities and adds them to the {@link objectRegistry} to track their lifecycle
     */
    static set isMemoryUsageDebugEnabled(value: boolean);
    /**
     * Adds entity to the object registry to keep track of it being collected
     * @param entity
     * @param id optional custom ID of the entity
     */
    static register(entity: any, id?: string): void;
    /**
     * Removes entity from the object registry
     * @param id ID of the entity
     */
    static unregister(id: string): void;
    /**
     * Calls `delete` on all 2D and 3D charts instantiated with {@link SciChartSurface.create} or {@link SciChart3DSurface.create}
     */
    static destroyMultiChart(): void;
    /**
     * Calls `delete` on all 2D and 3D charts instantiated with {@link SciChartSurface.createSingle} or {@link SciChart3DSurface.createSingle}
     */
    static destroySingleCharts(): void;
    /**
     * Calls `delete` on all charts instantiated with {@link SciChartPieSurface.create}
     */
    static destroyPieCharts(): void;
    /**
     * Calls `delete` on all charts
     */
    static destroyAllCharts(): void;
}
export {};
