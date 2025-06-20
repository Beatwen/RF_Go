import { DeletableEntity } from "../../../../Core/DeletableEntity";
import { IDeletable } from "../../../../Core/IDeletable";
import { SCRTBrush, SCRTDoubleVector, TSciChart, UIntVector } from "../../../../types/TSciChart";
import { PaletteCache } from "../../../Drawing/PaletteCache";
import { WebGlRenderContext2D } from "../../../Drawing/WebGlRenderContext2D";
import { IPaletteProvider } from "../../../Model/IPaletteProvider";
import { IPointMetadata } from "../../../Model/IPointMetadata";
import { IPointSeries } from "../../../Model/PointSeries/IPointSeries";
import { RenderPassData } from "../../../Services/RenderPassData";
import { TDpiChangedEventArgs } from "../../TextureManager/DpiHelper";
import { IRenderableSeries } from "../IRenderableSeries";
import { ISeriesDrawingProvider } from "./ISeriesDrawingProvider";
/** @ignore */
export interface ISCRTPen {
    m_bGradient: boolean;
    m_uiColor: number;
}
/** @ignore */
export interface ISCRTBrush {
    GetColor(): number;
    SetColor(uiColor: number): void;
}
/** @ignore */
export interface ISCRTPalette extends IDeletable {
    GetOptimizedIndex(colorIndex: number): number;
}
export declare type TPalettingState = {
    palettedColors: UIntVector;
    palettedColorsHashCode: number;
    gradientPaletting: boolean;
    paletteTextureCache?: PaletteCache;
    originalPenColor?: number;
    originalPenGradient?: boolean;
    originalBrushColor?: number;
    lastStartIndex?: number;
    lastCount?: number;
    lastResamplingHash?: number;
    paletteStartIndex?: number;
    requiresUpdate: boolean;
};
/**
 * Used internally - a drawing provider performs drawing for a specific chart-type or series using
 * our WebAssembly WebGL rendering engine
 */
export declare abstract class BaseSeriesDrawingProvider<T extends IRenderableSeries> extends DeletableEntity implements ISeriesDrawingProvider {
    /**
     * The {@link TSciChart | SciChart 2D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     */
    protected webAssemblyContext: TSciChart;
    /**
     * The Parent {@link IRenderableSeries | RenderableSeries}
     */
    protected parentSeries: T;
    /**
     * The Colour Paletting State object.
     */
    protected palettingState: TPalettingState;
    protected xSelector: (ds: IPointSeries) => SCRTDoubleVector;
    protected ySelector: (ds: IPointSeries) => SCRTDoubleVector;
    private parentDataSeries;
    /**
     * Creates an instance of the {@link BaseSeriesDrawingProvider}
     * @param webAssemblyContext The {@link TSciChart | SciChart 2D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     * @param parentSeries the parent {@link IRenderableSeries | Renderable Series} which this drawing provider is attached to
     */
    protected constructor(webAssemblyContext: TSciChart, parentSeries: T, ySelector?: (ps: IPointSeries) => SCRTDoubleVector, xSelector?: (ps: IPointSeries) => SCRTDoubleVector);
    /**
     * Returns the startIndex and count to be passed to the native drawing provider.
     * If renderPassData exists and contains an indexRange, this will be used, otherwise the full size of the xValues will be used
     * @param renderPassData
     * @param xValues
     * @returns
     */
    getStartAndCount(renderPassData: RenderPassData, xValues: SCRTDoubleVector): {
        startIndex: number;
        count: number;
    };
    /**
     * Helper function to apply color-paletting to a {@link UIntVector} - where each element in the vector
     * is an ARGB color that defines stroke of the series
     * @param strokePen the current pen, as type {@link SCRTPen}
     * @param renderPassData optional renderPassData.  If not supplied, the current renderPassData for the parent series will be used
     * @returns the new {@link UIntVector} with ARGB colors
     */
    applyStrokePaletting(strokePen: ISCRTPen, renderPassData?: RenderPassData): void;
    applyStrokeFillPaletting(stroke: string, strokePen: ISCRTPen | undefined, fill: string, fillBrush: ISCRTBrush | undefined, opacity: number, usePalette?: boolean, resetPenBrushColors?: boolean, renderPassData?: RenderPassData): void;
    /**
     * Creates a native {@link SCRTBrush} Solid Color Brush from html color code string passed in
     * @param htmlColorCode The HTML Color code
     * @param opacity The opacity factor
     */
    createSolidBrush(htmlColorCode: string, opacity: number): SCRTBrush;
    /**
     * @inheritDoc
     */
    delete(): void;
    /**
     * @inheritDoc
     */
    abstract draw(renderContext: WebGlRenderContext2D, renderPassData: RenderPassData): void;
    /**
     * @inheritDoc
     */
    onSeriesPropertyChange(propertyName: string): void;
    /**
     * @inheritDoc
     */
    onDpiChanged(args: TDpiChangedEventArgs): void;
    /**
     * @inheritDoc
     */
    onAttachSeries(): void;
    /**
     * @inheritDoc
     */
    onDetachSeries(): void;
    protected seriesHasDataChanges(): void;
    protected shouldUpdatePalette(renderPassData: RenderPassData, paletteProvider: IPaletteProvider, startIndex: number, count: number, isDoubled: boolean): void;
    protected overridePaletteProviderColors(rs: IRenderableSeries, xValue: number, yValue: number, index: number, opacity?: number, metadata?: IPointMetadata): {
        stroke: number | undefined;
        fill: number | undefined;
    };
    protected isGradientFillPaletting(rs: IRenderableSeries): boolean;
}
