import type { TSciChart } from "../types/TSciChart";
import { IDeletable } from "./IDeletable";
/** @ignore */
export declare const createTrackableProxy: <T extends IDeletable>(target: T, isWasmObject?: boolean) => T;
/** Utility class responsible for adding its instance to {@link MemoryUsageHelper.objectRegistry} when Memory Usage Debug Mode is enabled
 * @remarks
 * It wraps the returned instance into a proxy object, so internal reference comparisons may fail
 * */
export declare abstract class DeletableEntity implements IDeletable {
    constructor(entity?: IDeletable);
    abstract delete(): void;
}
/** @ignore */
export declare class DeletableEntityProxyHandler implements ProxyHandler<any> {
    protected disposableEntityId: string;
    constructor(id: string);
    construct(real: any, constructParams: any[]): any;
    apply(target: any, thisArg: any, argArray: any[]): void;
    get(constructedEntity: any, propertyName: string, receiver: any): any;
}
/** @ignore */
export declare class WasmObjectConstructorProxyHandler implements ProxyHandler<any> {
    construct(targetFunction: any, constructParams: any[], newTarget: Function): object;
}
/** @ignore */
export declare class WasmContextProxyHandler implements ProxyHandler<TSciChart> {
    protected constructorProxyHandler: WasmObjectConstructorProxyHandler;
    get(target: any, name: string, receiver: any): any;
}
/** @ignore */
export declare const createWasmContextRevocableProxy: <TContextType extends object>(wasmContext: TContextType, id: string) => {
    proxy: TContextType;
    revoke: () => void;
};
