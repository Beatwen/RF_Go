import { TSciChart } from "../../types/TSciChart";
import { TSciChartSurfaceCanvases } from "../../types/TSciChartSurfaceCanvases";
import { IThemeProvider } from "../Themes/IThemeProvider";
import { I2DSurfaceOptions } from "./I2DSurfaceOptions";
import { SciChartSurface, TWebAssemblyChart } from "./SciChartSurface";
/** @ignore */
declare type TSciChartMaster = {
    id: string;
    wasmContext: TSciChart;
    createChildSurface: (divElementId: string, canvases: TSciChartSurfaceCanvases, theme: IThemeProvider) => SciChartSurface;
    getChildSurfaces: () => SciChartSurface[];
};
/** @ignore */
export declare const createMultichart: (divElement: string | HTMLDivElement, options?: I2DSurfaceOptions) => Promise<TWebAssemblyChart>;
export declare const getSharedWasmContext: () => Promise<TSciChart>;
export declare const initializeChartEngine2D: (options?: {
    destinationCanvas: HTMLCanvasElement;
}) => Promise<TSciChartMaster>;
/** @ignore */
export declare const disposeMultiChart: () => void;
/** @ignore */
export declare const monitorWebGL: (wasmContext: TSciChart) => void;
export {};
