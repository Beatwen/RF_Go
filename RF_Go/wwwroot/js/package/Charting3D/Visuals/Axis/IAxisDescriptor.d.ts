import { eSCRTTextAlignement } from "../../../types/TSciChart3D";
import { TArgb } from "../../../utils/parseColor";
import { ILineStyle } from "./ILineStyle";
/**
 * Defines the interface to an {@link IAxisDescriptor} - contains properties, data and
 * parameters to pass to the WebAssembly engine for drawing an {@link AxisBase3D}
 */
export interface IAxisDescriptor {
    /**
     * The axis title string
     */
    axisTitle: string;
    /**
     * The axis size in one dimension (X,Y,Z) in world-coordinates
     */
    axisSize: number;
    /**
     * The background color as an ARGB color represented as UInt32
     */
    backgroundColor: TArgb;
    /**
     * The Axis Band color as ARGB represented as UInt32
     */
    bandColor: TArgb;
    /**
     * The Axis Border color as ARGB represented as UInt32
     */
    borderColor: TArgb;
    /**
     * Major tick / gridline and label coordinates in world-coordinates
     */
    majorCoordinates: number[];
    /**
     * Minor tick / gridline and label coordinates in world-coordinates
     */
    minorCoordinates: number[];
    /**
     * An array of strings for the axis labels at Major gridline locations
     */
    tickLabels: string[];
    /**
     * Style object of type {@link ILineStyle} to define the Major gridlines
     */
    majorLineStyle: ILineStyle;
    /**
     * Style object of type {@link ILineStyle} to define the Minor gridlines
     */
    minorLineStyle: ILineStyle;
    /**
     * Style object of type {@link ILineStyle} to define the Major ticklines
     */
    majorTickStyle: ILineStyle;
    /**
     * Style object of type {@link ILineStyle} to define the Minor ticklines
     */
    minorTickStyle: ILineStyle;
    /**
     * Style object of type {@link ITextStyle} to define the Axis Title style
     */
    titleStyle: ITextStyle;
    /**
     * Style object of type {@link ITextStyle} to define the Axis Label style
     */
    labelStyle: ITextStyle;
    /**
     * When true, draws the major gridlines on the axis
     */
    drawMajorGridlines: boolean;
    /**
     * When true, draws the minor gridlines on the axis
     */
    drawMinorGridlines: boolean;
    /**
     * When true, draws the major ticks on the axis
     */
    drawMajorTicks: boolean;
    /**
     * When true, draws the minor ticks on the axis
     */
    drawMinorTicks: boolean;
    /**
     * When true, draw the axis bands
     */
    drawBands: boolean;
    /**
     * When true, draw the axis labels
     */
    drawLabels: boolean;
    /**
     * When true, the axis is visible
     */
    isVisible: boolean;
    /**
     * Gets the Border thickness in world coordinates
     */
    borderThickness: number;
    /**
     * When true, Labels are depth-tested and may be behind other objects in the chart, else they are always on-top
     */
    labelDepthTestEnabled: boolean;
    /**
     * Gets a title offset in world coordinates
     */
    titleOffset: number;
    /**
     * Get an offset for Axis labels in world coordinates
     */
    tickLabelsOffset: number;
    /**
     * When true, attempt to avoid label overlap
     */
    smoothLabelOverlapAvoidance: boolean;
}
/**
 * An interface to define the style of text labels on 3D Chart axis
 */
export interface ITextStyle {
    /**
     * Webassembly type {@link eSCRTTextAlignment} defines the text label alignment
     */
    alignment: eSCRTTextAlignement;
    /**
     * Gets or sets the DPI scaling
     */
    dpiScaling: number;
    /**
     * Gets or sets the font as a string
     */
    fontFamily: string;
    /**
     * Gets or sets the Font size
     */
    fontSize: number;
    /**
     * Gets or sets the font foreground as an ARGB UInt32 color
     */
    foreground: number;
}
/**
 * Returns true if descriptors are deeply equal, else false
 * @param a
 * @param b
 */
export declare function getDescriptorsEqual(a: IAxisDescriptor, b: IAxisDescriptor): boolean;
export declare function getLineStylesEqual(a: ILineStyle, b: ILineStyle): boolean;
export declare function getTArgbEqual(a: TArgb, b: TArgb): boolean;
export declare function getTextStylesEqual(a: ITextStyle, b: ITextStyle): boolean;
export declare function getArraysEqual<T>(a: T[], b: T[]): boolean;
