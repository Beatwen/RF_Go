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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxisBase2D = exports.EClipMode = void 0;
var classFactory_1 = require("../../../Builder/classFactory");
var EasingFunctions_1 = require("../../../Core/Animations/EasingFunctions");
var NumberRangeAnimator_1 = require("../../../Core/Animations/NumberRangeAnimator");
var Deleter_1 = require("../../../Core/Deleter");
var NumberRange_1 = require("../../../Core/NumberRange");
var Thickness_1 = require("../../../Core/Thickness");
var AxisAlignment_1 = require("../../../types/AxisAlignment");
var BaseType_1 = require("../../../types/BaseType");
var DefaultRenderLayer_1 = require("../../../types/DefaultRenderLayer");
var LabelAlignment_1 = require("../../../types/LabelAlignment");
var XyDirection_1 = require("../../../types/XyDirection");
var parseColor_1 = require("../../../utils/parseColor");
var perfomance_1 = require("../../../utils/perfomance");
var Pen2DCache_1 = require("../../Drawing/Pen2DCache");
var SolidBrushCache_1 = require("../../Drawing/SolidBrushCache");
var WebGlRenderContext2D_1 = require("../../Drawing/WebGlRenderContext2D");
var DefaultTickCoordinatesProvider_1 = require("../../Numerics/TickCoordinateProviders/DefaultTickCoordinatesProvider");
var StaticTickCoordinatesProvider_1 = require("../../Numerics/TickCoordinateProviders/StaticTickCoordinatesProvider");
var createNativeRect_1 = require("../Helpers/createNativeRect");
var drawBorder_1 = require("../Helpers/drawBorder");
var NativeObject_1 = require("../Helpers/NativeObject");
var SciChartSurfaceBase_1 = require("../SciChartSurfaceBase");
var DpiHelper_1 = require("../TextureManager/DpiHelper");
var AxisCore_1 = require("./AxisCore");
var AxisLayoutState_1 = require("./AxisLayoutState");
var AxisRenderer_1 = require("./AxisRenderer");
var AxisTitleRenderer_1 = require("./AxisTitleRenderer");
var constants_1 = require("./constants");
/**
 * Defines the clipping mode for scrolling operations found on {@link AxisBase2D.scroll}
 */
var EClipMode;
(function (EClipMode) {
    /**
     * Do not clip when scrolling the Axis
     * @remarks
     * Use this to resolve issues such as scaling or stretching
     * when the user pans or scrolls outside of the range of the data.
     */
    EClipMode[EClipMode["None"] = 0] = "None";
    /**
     * Stretch the {@link AxisBase2D.visibleRange} when scrolling past the extents of the data.
     */
    EClipMode[EClipMode["StretchAtExtents"] = 1] = "StretchAtExtents";
    /**
     * Clips the {@link AxisBase2D.visibleRange} to not allow scrolling past the minimum of the Axis range
     */
    EClipMode[EClipMode["ClipAtMin"] = 2] = "ClipAtMin";
    /**
     * Clips the {@link AxisBase2D.visibleRange} to not allow scrolling past the maximum of the Axis range
     */
    EClipMode[EClipMode["ClipAtMax"] = 3] = "ClipAtMax";
    /**
     * Clips the {@link AxisBase2D.visibleRange} to not allow scrolling past the minimum or maximum of the Axis range
     */
    EClipMode[EClipMode["ClipAtExtents"] = 4] = "ClipAtExtents";
})(EClipMode = exports.EClipMode || (exports.EClipMode = {}));
/**
 * The base class for 2D Chart Axis within SciChart - High Performance {@link https://www.scichart.com/javascript-chart-features | JavaScript Charts}.
 * @description
 * AxisBase2D is a base class for both 2D Axis types in SciChart. Concrete types include:
 *
 *  - {@link NumericAxis}: a Numeric 2D value-axis
 *  - {@link CategoryAxis}: A category 2D axis used for stock chart applications
 *
 *  Set axis on the {@link SciChartSurface.xAxes} or {@link SciChartSurface.yAxes} collections in 2D Charts.
 */
var AxisBase2D = /** @class */ (function (_super) {
    __extends(AxisBase2D, _super);
    /**
     * Creates an instance of the {@link AxisBase2D}
     * @param webAssemblyContext The {@link TSciChart | SciChart 2D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     * @param options Optional parameters of type {@link IAxisBase2dOptions} used to configure the axis at instantiation time
     */
    function AxisBase2D(webAssemblyContext, options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        _this = _super.call(this, options) || this;
        /**
         * Gets the {@link AxisLayoutState} class which manages layout
         */
        _this.axisLayoutState = new AxisLayoutState_1.AxisLayoutState();
        _this.getlabelStyleProxy = function (newStyle) {
            return new Proxy(newStyle, {
                set: function (target, key, value) {
                    //@ts-ignore
                    target[key] = value;
                    _this.notifyPropertyChanged(constants_1.PROPERTY.TEXT_STYLE);
                    _this.dpiAdjustedLabelStyleCache = undefined;
                    return true;
                }
            });
        };
        _this.labelStyleProperty = _this.getlabelStyleProxy({
            fontSize: 14,
            fontFamily: "Arial",
            color: SciChartSurfaceBase_1.SciChartSurfaceBase.DEFAULT_THEME.tickTextBrush,
            fontWeight: "normal",
            fontStyle: "normal",
            padding: Thickness_1.Thickness.fromString("2 4 2 4"),
            alignment: LabelAlignment_1.ELabelAlignment.Auto
        });
        _this.isInnerAxisProperty = false;
        _this.isPrimaryAxisProperty = false;
        _this.axisBorderProperty = {
            borderBottom: 0,
            borderLeft: 0,
            borderRight: 0,
            borderTop: 0,
            color: SciChartSurfaceBase_1.SciChartSurfaceBase.DEFAULT_THEME.axisBorder,
            border: 0
        };
        _this.offsetProperty = 0;
        _this.offsetOverrideProperty = undefined;
        _this.tickCache = undefined;
        _this.clipToXRangeProperty = true;
        _this.isStaticAxisProperty = false;
        _this.webAssemblyContext2D = webAssemblyContext;
        _this.penCacheForMajorGridLines = new Pen2DCache_1.Pen2DCache(webAssemblyContext);
        _this.penCacheForMinorGridLines = new Pen2DCache_1.Pen2DCache(webAssemblyContext);
        _this.penCacheForMajorTickLines = new Pen2DCache_1.Pen2DCache(webAssemblyContext);
        _this.penCacheForMinorTickLines = new Pen2DCache_1.Pen2DCache(webAssemblyContext);
        _this.solidBrushCacheAxisBands = new SolidBrushCache_1.SolidBrushCache(webAssemblyContext);
        _this.solidBrushCacheAxisBackground = new SolidBrushCache_1.SolidBrushCache(webAssemblyContext);
        _this.axisRenderer = new AxisRenderer_1.AxisRenderer(webAssemblyContext);
        _this.axisRenderer.keepLabelsWithinAxis =
            (_a = options === null || options === void 0 ? void 0 : options.keepLabelsWithinAxis) !== null && _a !== void 0 ? _a : _this.axisRenderer.keepLabelsWithinAxis;
        _this.axisRenderer.hideOverlappingLabels =
            (_b = options === null || options === void 0 ? void 0 : options.hideOverlappingLabels) !== null && _b !== void 0 ? _b : _this.axisRenderer.hideOverlappingLabels;
        _this.axisRenderer.axisThickness = (_c = options === null || options === void 0 ? void 0 : options.axisThickness) !== null && _c !== void 0 ? _c : _this.axisRenderer.axisThickness;
        _this.axisTitleRenderer = new AxisTitleRenderer_1.AxisTitleRenderer(webAssemblyContext);
        _this.isStaticAxis = (_d = options === null || options === void 0 ? void 0 : options.isStaticAxis) !== null && _d !== void 0 ? _d : _this.isStaticAxisProperty;
        // setting isStaticAxis sets the tickCoordinatesProvider
        //this.tickCoordinatesProvider = new DefaultTickCoordinatesProvider();
        _this.visibleRangeLimit = (_e = NumberRange_1.NumberRange.hydrate(options === null || options === void 0 ? void 0 : options.visibleRangeLimit)) !== null && _e !== void 0 ? _e : _this.visibleRangeLimit;
        _this.visibleRangeSizeLimit = (_f = NumberRange_1.NumberRange.hydrate(options === null || options === void 0 ? void 0 : options.visibleRangeSizeLimit)) !== null && _f !== void 0 ? _f : _this.visibleRangeSizeLimit;
        _this.zoomExtentsRange = (options === null || options === void 0 ? void 0 : options.zoomExtentsToInitialRange)
            ? _this.visibleRange
            : NumberRange_1.NumberRange.hydrate(options === null || options === void 0 ? void 0 : options.zoomExtentsRange);
        _this.axisAlignment = (_g = options === null || options === void 0 ? void 0 : options.axisAlignment) !== null && _g !== void 0 ? _g : _this.axisAlignment;
        _this.axisTitle = (_h = options === null || options === void 0 ? void 0 : options.axisTitle) !== null && _h !== void 0 ? _h : _this.axisTitle;
        _this.labelStyle = _this.getlabelStyleProxy(__assign(__assign({}, _this.labelStyle), options === null || options === void 0 ? void 0 : options.labelStyle));
        _this.axisBorder = __assign(__assign({}, _this.axisBorder), options === null || options === void 0 ? void 0 : options.axisBorder);
        _this.isInnerAxis = (_j = options === null || options === void 0 ? void 0 : options.isInnerAxis) !== null && _j !== void 0 ? _j : _this.isInnerAxis;
        _this.stackedAxisLength = (_k = options === null || options === void 0 ? void 0 : options.stackedAxisLength) !== null && _k !== void 0 ? _k : _this.stackedAxisLength;
        _this.solidBrushCacheBorder = new SolidBrushCache_1.SolidBrushCache(webAssemblyContext);
        if (options === null || options === void 0 ? void 0 : options.labelProvider) {
            if (!("getLabels" in (options === null || options === void 0 ? void 0 : options.labelProvider))) {
                options.labelProvider = (0, classFactory_1.createType)(BaseType_1.EBaseType.LabelProvider, options.labelProvider.type, webAssemblyContext, options.labelProvider.options);
            }
        }
        _this.autoRangeAnimationProperty = options === null || options === void 0 ? void 0 : options.autoRangeAnimation;
        _this.backgroundColor = (_l = options === null || options === void 0 ? void 0 : options.backgroundColor) !== null && _l !== void 0 ? _l : _this.backgroundColor;
        _this.offsetOverrideProperty = options === null || options === void 0 ? void 0 : options.overrideOffset; // undefined if not set
        _this.clipToXRangeProperty = (_m = options === null || options === void 0 ? void 0 : options.clipToXRange) !== null && _m !== void 0 ? _m : _this.clipToXRange;
        return _this;
    }
    Object.defineProperty(AxisBase2D.prototype, "labelProvider", {
        /**
         * Gets or sets a {@link LabelProviderBase2D} - a class which is responsible for formatting axis labels and cursor labels from numeric values
         */
        get: function () {
            return this.labelProviderProperty;
        },
        /**
         * Gets or sets a {@link LabelProviderBase2D} - a class which is responsible for formatting axis labels and cursor labels from numeric values
         */
        set: function (labelProvider) {
            var _a;
            // TODO This duplicates logic in AxisCore.
            // Probably we could consider proper generics used for the inheritance to omit the duplication
            (_a = this.labelProviderProperty) === null || _a === void 0 ? void 0 : _a.detachedFromAxis();
            this.labelProviderProperty = labelProvider;
            this.notifyPropertyChanged(constants_1.PROPERTY.LABEL_PROVIDER);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "axisRenderer", {
        /**
         * Gets the {@link AxisRenderer} instance responsible for drawing the axis
         */
        get: function () {
            return this.axisRendererProperty;
        },
        /**
         * Sets the {@link AxisRenderer} instance responsible for drawing the axis
         */
        set: function (axisRenderer) {
            this.axisRendererProperty = axisRenderer;
            this.notifyPropertyChanged(constants_1.PROPERTY.AXIS_RENDERER);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "isHorizontalAxis", {
        /**
         * Gets whether the axis is currently horizontal or not
         */
        get: function () {
            return (0, AxisAlignment_1.getIsHorizontal)(this.axisAlignment);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "isAxisFlipped", {
        /**
         * Gets whether the axis is flipped or not
         */
        get: function () {
            if (this.isXAxis) {
                return false;
            }
            else {
                return true;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "axisAlignment", {
        /**
         * Gets or sets the Axis Alignment. See {@link EAxisAlignment} for a list of values
         * @remarks use this property to set whether the axis is on the Left, Right, Bottom Top of the chart.
         * SciChart also supports XAxis on the left and YAxis on the top to rotate / create vertical charts.
         */
        get: function () {
            return this.axisAlignmentProperty;
        },
        /**
         * Gets or sets the Axis Alignment. See {@link EAxisAlignment} for a list of values
         * @remarks use this property to set whether the axis is on the Left, Right, Bottom Top of the chart.
         * SciChart also supports XAxis on the left and YAxis on the top to rotate / create vertical charts.
         */
        set: function (axisAlignment) {
            if (this.axisAlignmentProperty !== axisAlignment) {
                this.axisAlignmentProperty = axisAlignment;
                this.notifyPropertyChanged(constants_1.PROPERTY.AXIS_ALIGNMENT);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "visibleRangeLimit", {
        /**
         * Gets or sets a property which limits {@link AxisCore.visibleRange}, meaning the chart cannot autorange outside that range
         */
        get: function () {
            return this.visibleRangeLimitProperty;
        },
        set: function (visibleRangeLimit) {
            if (!NumberRange_1.NumberRange.areEqual(this.visibleRangeLimitProperty, visibleRangeLimit)) {
                this.visibleRangeLimitProperty = visibleRangeLimit;
                this.notifyPropertyChanged(constants_1.PROPERTY.VISIBLE_RANGE_LIMIT);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "visibleRangeSizeLimit", {
        /**
         * Gets or sets a property which limits the size of {@link AxisCore.visibleRange}, meaning that the inequality must hold
         * visibleRangeSizeLimit.min <= visibleRange.max - visiblerRange.min <= visibleRangeSizeLimit.max
         */
        get: function () {
            return this.visibleRangeSizeLimitProperty;
        },
        set: function (value) {
            if (!NumberRange_1.NumberRange.areEqual(this.visibleRangeSizeLimitProperty, value)) {
                if (value.min < 0)
                    throw Error("visibleRangeSizeLimit min value must be more or equal 0");
                if (value.min >= value.max)
                    throw Error("visibleRangeSizeLimit min value must be less than max value");
                this.visibleRangeSizeLimitProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.VISIBLE_RANGE_SIZE_LIMIT);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "zoomExtentsRange", {
        /**
         * Gets or sets a property which, if it is set, will be used as the range when zooming extents, rather than the data max range
         */
        get: function () {
            return this.zoomExtentsRangeProperty;
        },
        /**
         * Gets or sets a property which, if it is set, will be used as the range when zooming extents, rather than the data max range
         */
        set: function (zoomExtentsRange) {
            if (!NumberRange_1.NumberRange.areEqual(this.zoomExtentsRangeProperty, zoomExtentsRange)) {
                this.zoomExtentsRangeProperty = zoomExtentsRange;
                this.notifyPropertyChanged(constants_1.PROPERTY.ZOOMEXTENTS_RANGE);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "isInnerAxis", {
        /**
         * Gets or sets whether this axis is placed inside the chart viewport
         * @remarks Center axis uses inner layout strategy
         */
        get: function () {
            return this.isInnerAxisProperty;
        },
        /**
         * Gets or sets whether this axis is placed inside the chart viewport
         * @remarks Center axis uses inner layout strategy
         */
        set: function (value) {
            if (this.isInnerAxisProperty !== value) {
                this.isInnerAxisProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.IS_INNER_AXIS);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "isPrimaryAxis", {
        /**
         * Gets or sets whether this axis is the Primary axis on the chart
         * @remarks In SciChart 2D Charts, multiple X,Y Axis are supported.
         * The primary axis is the one which draws the gridlines. By default, this is the first axis in the collection
         */
        get: function () {
            return this.isPrimaryAxisProperty;
        },
        /**
         * Gets or sets whether this axis is the Primary axis on the chart
         * @remarks In SciChart 2D Charts, multiple X,Y Axis are supported.
         * The primary axis is the one which draws the gridlines. By default, this is the first axis in the collection
         */
        set: function (value) {
            var _this = this;
            if (this.isPrimaryAxisProperty !== value) {
                this.isPrimaryAxisProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.IS_PRIMARY_AXIS);
            }
            if (value && !this.isStackedAxis) {
                var axes = this.isXAxis ? this.parentSurface.xAxes : this.parentSurface.yAxes;
                axes.asArray().forEach(function (a) {
                    if (a !== _this && !a.isStackedAxis) {
                        a.isPrimaryAxis = false;
                    }
                });
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "isStackedAxis", {
        /** Internal Use.  Gets or Sets if this axis is stacked
         * This is only used to allow multiple primary axes, so that all stacked axes can draw gridlines
         */
        get: function () {
            var layoutStrategy = this.parentSurface.layoutManager.getAxisLayoutStrategy(this.axisAlignment, this.isInnerAxis);
            return layoutStrategy.isStacked;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "backgroundColor", {
        /**
         * Gets the background color of separate Axis
         */
        get: function () {
            return this.backgroundColorProperty;
        },
        /**
         * Sets the background color of separate Axis
         */
        set: function (value) {
            this.backgroundColorProperty = value;
            if (this.invalidateParentCallback) {
                this.invalidateParentCallback();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "stackedAxisLength", {
        /** Gets or sets the length of a stacked axis as an absolute number or percentage, e.g. 100, or "30%".
         * A plain number will be interpreted as a number of pixels.
         * A number with % will take that percentage of the total length.
         * Stacked axes without a defined length will have the remaining unreserved spaced split between them.
         * @remarks The axis length doesn't include border sizes
         */
        get: function () {
            return this.stackedAxisLengthProperty;
        },
        /** Gets or sets the length of a stacked axis as an absolute number or percentage, e.g. 100, or "30%".
         * A plain number will be interpreted as a number of pixels.
         * A number with % will take that percentage of the total length.
         * Stacked axes without a defined length will have the remaining unreserved spaced split between them.
         * @remarks The axis length doesn't include border sizes
         */
        set: function (value) {
            if (this.stackedAxisLengthProperty !== value) {
                this.stackedAxisLengthProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.AXIS_LENGTH);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "axisLength", {
        /**
         * Called internally - Gets or sets the length the current Axis. E.g. width of horizontal axis or height of vertical axis.
         */
        get: function () {
            var _a, _b;
            var seriesViewRect = this.parentSurface.seriesViewRect;
            if (!seriesViewRect) {
                return (_a = this.axisLengthProperty) !== null && _a !== void 0 ? _a : 0;
            }
            var defaultAxisLength = this.isHorizontalAxis ? seriesViewRect.width : seriesViewRect.height;
            return (_b = this.axisLengthProperty) !== null && _b !== void 0 ? _b : defaultAxisLength;
        },
        set: function (value) {
            if (this.axisLengthProperty !== value) {
                this.axisLengthProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.AXIS_LENGTH);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "offset", {
        /**
         * Gets or sets the offset of the axis position.
         * Defines a position of the axis along the layout flow.
         */
        get: function () {
            var _a;
            return (_a = this.offsetOverrideProperty) !== null && _a !== void 0 ? _a : this.offsetProperty;
        },
        /**
         * Called internally by layout strategies when switching between stacked and non-stacked axes.
         * If you want to set a manual offset, call {@link overrideOffset}
         */
        set: function (value) {
            if (this.offsetProperty !== value) {
                this.offsetProperty = value;
                if (this.offsetOverrideProperty === undefined) {
                    this.clearCoordCalcCache();
                    this.notifyPropertyChanged(constants_1.PROPERTY.OFFSET);
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * set an offset value that overrides the one used by layout calculation
     */
    AxisBase2D.prototype.overrideOffset = function (value) {
        if (this.offsetOverrideProperty !== value) {
            this.offsetOverrideProperty = value;
            this.clearCoordCalcCache();
            this.notifyPropertyChanged(constants_1.PROPERTY.OFFSET);
        }
    };
    Object.defineProperty(AxisBase2D.prototype, "isVerticalChart", {
        /**
         * Gets whether the parent {@link SciChartSurface} is a vertical chart, when the XAxis is on the Left or Right,
         * and YAxis is on the Top or Bottom
         */
        get: function () {
            if (this.isXAxis) {
                return !![AxisAlignment_1.EAxisAlignment.Left, AxisAlignment_1.EAxisAlignment.Right].includes(this.axisAlignment);
            }
            else {
                return !![AxisAlignment_1.EAxisAlignment.Top, AxisAlignment_1.EAxisAlignment.Bottom].includes(this.axisAlignment);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "dpiAdjustedLabelStyle", {
        /**
         * Gets the {@link labelStyle} adjusted for current DPI / Browser zoom level
         */
        get: function () {
            if (!this.dpiAdjustedLabelStyleCache) {
                this.dpiAdjustedLabelStyleCache = DpiHelper_1.DpiHelper.adjustTextStyle(this.labelStyleProperty);
            }
            return this.dpiAdjustedLabelStyleCache;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "labelStyle", {
        /**
         * Gets or sets a {@link TTextStyle} object for styling axis labels
         */
        get: function () {
            return this.labelStyleProperty;
        },
        /**
         * Gets or sets a {@link TTextStyle} object for styling axis labels
         */
        set: function (textStyle) {
            var newStyle = __assign(__assign({}, this.labelStyle), textStyle);
            this.labelStyleProperty = this.getlabelStyleProxy(newStyle);
            // Notify here as well since we are replacing the whole property
            this.notifyPropertyChanged(constants_1.PROPERTY.TEXT_STYLE);
            this.dpiAdjustedLabelStyleCache = undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "axisBorder", {
        /**
         * Gets or sets the Axis Border properties
         */
        get: function () {
            return this.axisBorderProperty;
        },
        /**
         * Gets or sets the Axis Border properties
         */
        set: function (border) {
            var _a, _b, _c, _d, _e, _f;
            this.axisBorder.borderTop = (_a = border.borderTop) !== null && _a !== void 0 ? _a : this.axisBorder.borderTop;
            this.axisBorder.borderLeft = (_b = border.borderLeft) !== null && _b !== void 0 ? _b : this.axisBorder.borderLeft;
            this.axisBorder.borderBottom = (_c = border.borderBottom) !== null && _c !== void 0 ? _c : this.axisBorder.borderBottom;
            this.axisBorder.borderRight = (_d = border.borderRight) !== null && _d !== void 0 ? _d : this.axisBorder.borderRight;
            this.axisBorder.border = (_e = border.border) !== null && _e !== void 0 ? _e : this.axisBorder.border;
            this.axisBorder.color = (_f = border.color) !== null && _f !== void 0 ? _f : this.axisBorder.color;
            this.notifyPropertyChanged(constants_1.PROPERTY.BORDER);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "autoRangeAnimation", {
        /**
         * Gets or sets a {@link IAutoRangeAnimationOptions} object that controls if and how the visible range is animated during autoRanging
         */
        get: function () {
            return this.autoRangeAnimationProperty;
        },
        /**
         * Gets or sets a {@link IAutoRangeAnimationOptions} object that controls if and how the visible range is animated during autoRanging
         */
        set: function (autoRangeAnimation) {
            this.autoRangeAnimationProperty = __assign(__assign({}, this.autoRangeAnimation), autoRangeAnimation);
            // No need to trigger a redraw.  This will take effect anyway if the chart redraws.
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "clipToXRange", {
        /**
         * For an X Axis only - Determines whether the series will be clipped to the {@link visibleRange}.  Defaults true.
         * You may want to set this false if you have stacked horizontal axes, or are using {@link offsetOverride}.
         */
        get: function () {
            return this.clipToXRangeProperty;
        },
        /**
         * For an X Axis only - Determines whether the series will be clipped to the {@link visibleRange}.  Defaults true.
         * You may want to set this false if you have stacked horizontal axes, or are using {@link offsetOverride}.
         */
        set: function (clipToXRange) {
            if (this.clipToXRangeProperty !== clipToXRange) {
                this.clipToXRangeProperty = clipToXRange;
                this.notifyPropertyChanged(constants_1.PROPERTY.DRAW_ONLY_WITHIN_XRANGE);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase2D.prototype, "isStaticAxis", {
        /**
         * Gets whether the gridlines and axis labels keep their initial position when the visible range changes.
         */
        get: function () {
            return this.isStaticAxisProperty;
        },
        /**
         * Sets whether the gridlines and axis labels keep their initial position when the visible range changes.
         */
        set: function (value) {
            this.isStaticAxisProperty = value;
            if (value) {
                this.tickCoordinatesProvider = new StaticTickCoordinatesProvider_1.StaticTickCoordinatesProvider();
            }
            else {
                this.tickCoordinatesProvider = new DefaultTickCoordinatesProvider_1.DefaultTickCoordinatesProvider();
            }
        },
        enumerable: false,
        configurable: true
    });
    /** @inheritDoc */
    AxisBase2D.prototype.applyTheme = function (themeProvider) {
        var previousThemeProvider = this.parentSurface.previousThemeProvider;
        if (this.axisBandsFill === previousThemeProvider.axisBandsFill) {
            this.axisBandsFill = themeProvider.axisBandsFill;
        }
        if (this.labelStyle.color === previousThemeProvider.tickTextBrush) {
            this.labelStyle = { color: themeProvider.tickTextBrush };
        }
        if (this.minorGridLineStyle.color === previousThemeProvider.minorGridLineBrush) {
            this.minorGridLineStyle = { color: themeProvider.minorGridLineBrush };
        }
        if (this.majorGridLineStyle.color === previousThemeProvider.majorGridLineBrush) {
            this.majorGridLineStyle = { color: themeProvider.majorGridLineBrush };
        }
        if (this.minorTickLineStyle.color === previousThemeProvider.minorGridLineBrush) {
            this.minorTickLineStyle = { color: themeProvider.minorGridLineBrush };
        }
        if (this.majorTickLineStyle.color === previousThemeProvider.majorGridLineBrush) {
            this.majorTickLineStyle = { color: themeProvider.majorGridLineBrush };
        }
        if (this.axisTitleStyle.color === previousThemeProvider.axisTitleColor) {
            this.axisTitleStyle = { color: themeProvider.axisTitleColor };
        }
    };
    /**
     * Called when the {@link AxisBase2D} is attached to an {@link SciChartSurface}
     */
    AxisBase2D.prototype.onAttach = function (parentSurface, isXAxis, isPrimaryAxis) {
        this.parentSurface = parentSurface;
        this.axisTitleRenderer.parentSurface = parentSurface;
        this.setIsXAxis(isXAxis);
        this.isPrimaryAxisProperty = isPrimaryAxis;
    };
    /**
     * Called when the {@link AxisBase2D} is detached from an {@link SciChartSurface}
     */
    AxisBase2D.prototype.onDetach = function () {
        this.parentSurface = undefined;
        this.isPrimaryAxisProperty = false;
        this.invalidateParentCallback = undefined;
    };
    /**
     * Called internally - measures the axis as part of the layout phase
     */
    AxisBase2D.prototype.measure = function () {
        // TODO: updateTickProvider, updateLabelProvider
        // TODO: measure for category axes
        if (this.isVisible) {
            var majorTickLabels = this.getTicks(true).majorTickLabels;
            var drawTicks = this.drawMinorTickLines || this.drawMajorTickLines;
            if (SciChartSurfaceBase_1.DebugForDpi) {
                console.log("Measure. fontSize: ".concat(this.labelStyle.fontSize, ", dpiAdjusted: ").concat(this.dpiAdjustedLabelStyle.fontSize));
            }
            this.axisRenderer.measure(this.isHorizontalAxis, this.dpiAdjustedLabelStyle, majorTickLabels, this.getTicksMaxSize(), this.labelProvider, this.drawLabels, drawTicks);
            this.axisTitleRenderer.measure(this.axisTitle, this.dpiAdjustedAxisTitleStyle, this.axisAlignment);
        }
        else {
            this.axisRenderer.desiredHeight = 0;
            this.axisRenderer.desiredWidth = 0;
            this.axisTitleRenderer.desiredHeight = 0;
            this.axisTitleRenderer.desiredWidth = 0;
        }
        this.isMeasured = true;
    };
    /**
     * called internally - allow axis to respond to dpi changes
     */
    AxisBase2D.prototype.onDpiChanged = function () {
        this.dpiAdjustedLabelStyleCache = undefined;
    };
    /**
     * Called internally - prepares render data before a draw operation
     */
    AxisBase2D.prototype.prepareRenderData = function () {
        this.getCurrentCoordinateCalculator();
    };
    AxisBase2D.prototype.getCurrentCoordinateCalculator = function () {
        var coordCalc = _super.prototype.getCurrentCoordinateCalculator.call(this);
        return coordCalc;
    };
    /**
     * Called internally - draws the current axis using the {@link WebGL2RenderingContext}
     */
    AxisBase2D.prototype.draw = function (renderContext) {
        var _this = this;
        var _a, _b, _c;
        if (!this.getIsValidForDrawing()) {
            return;
        }
        // Draw the Axis borders
        var axisBordersLayer = (0, WebGlRenderContext2D_1.calculateAbsoluteRenderLayer)(this.parentSurface.layersOffset, this.parentSurface.stepBetweenLayers, DefaultRenderLayer_1.EDefaultRenderLayer.AxisBordersLayer);
        renderContext.enqueueLayeredDraw(function () {
            var _a, _b, _c;
            var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawAxisBorderStart, {
                contextId: _this.id,
                parentContextId: (_a = _this.parentSurface) === null || _a === void 0 ? void 0 : _a.id,
                level: perfomance_1.EPerformanceDebugLevel.Verbose
            });
            (0, drawBorder_1.drawBorder)(renderContext, _this.webAssemblyContext2D, _this.solidBrushCacheBorder, _this.viewRect, _this.axisBorder.borderLeft || _this.axisBorder.border, _this.axisBorder.borderTop || _this.axisBorder.border, _this.axisBorder.borderRight || _this.axisBorder.border, _this.axisBorder.borderBottom || _this.axisBorder.border, _this.axisBorder.color);
            perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawAxisBorderEnd, {
                contextId: _this.id,
                parentContextId: (_b = _this.parentSurface) === null || _b === void 0 ? void 0 : _b.id,
                relatedId: (_c = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _c === void 0 ? void 0 : _c.relatedId,
                level: perfomance_1.EPerformanceDebugLevel.Verbose
            });
        }, axisBordersLayer);
        var getTicksStartMark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.GetTicksStart, {
            contextId: this.id,
            parentContextId: (_a = this.parentSurface) === null || _a === void 0 ? void 0 : _a.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        var tickObject = this.getTicksWithCoords();
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.GetTicksEnd, {
            contextId: this.id,
            parentContextId: (_b = this.parentSurface) === null || _b === void 0 ? void 0 : _b.id,
            relatedId: (_c = getTicksStartMark === null || getTicksStartMark === void 0 ? void 0 : getTicksStartMark.detail) === null || _c === void 0 ? void 0 : _c.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        var minorGridStyle = this.minorGridLineStyle;
        var majorGridStyle = this.majorGridLineStyle;
        var minorTickStyle = this.minorTickLineStyle;
        var majorTickStyle = this.majorTickLineStyle;
        var penForMinorGridlines = getPenForLines(this.penCacheForMinorGridLines, minorGridStyle.color, minorGridStyle.strokeThickness, minorGridStyle.strokeDashArray);
        var penForMajorGridlines = getPenForLines(this.penCacheForMajorGridLines, majorGridStyle.color, majorGridStyle.strokeThickness, majorGridStyle.strokeDashArray);
        var penForMinorTickLines = getPenForLines(this.penCacheForMinorTickLines, minorTickStyle.color, minorTickStyle.strokeThickness);
        var penForMajorTickLines = getPenForLines(this.penCacheForMajorTickLines, majorTickStyle.color, majorTickStyle.strokeThickness);
        // TODO HERE
        // pass tick pens to drawTicks, and then adjust this function to draw ticks as well as gridlines
        if (this.isPrimaryAxis) {
            // Draw axes and gridlines
            this.drawAxisBandsAndGridLines(renderContext, tickObject, penForMinorGridlines, penForMajorGridlines);
        }
        var axisLayer = (0, WebGlRenderContext2D_1.calculateAbsoluteRenderLayer)(this.parentSurface.layersOffset, this.parentSurface.stepBetweenLayers, DefaultRenderLayer_1.EDefaultRenderLayer.AxesLayer);
        // make sure axes is drawn at the last stage
        renderContext.enqueueLayeredDraw(function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            // Draw background
            if (_this.backgroundColorProperty) {
                var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawAxisBackgroundStart, {
                    contextId: _this.id,
                    parentContextId: (_a = _this.parentSurface) === null || _a === void 0 ? void 0 : _a.id,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
                var viewAxisRect = _this.axisRenderer.viewRect;
                var viewTitleRect = _this.axisTitleRenderer.viewRect;
                var brush = _this.solidBrushCacheAxisBackground.newBrush(_this.backgroundColorProperty, false);
                var nativeAxisRect = void 0;
                // Empty space covering for axis coloring
                // let shift: number = 0;
                // let additionalSize: number = 0;
                // if (this.isHorizontalAxis) {
                //     this.parentSurface.yAxes.asArray().forEach((yAxis: AxisBase2D, index: number) => {
                //         const size: number = yAxis.axisRenderer.viewAxisRect.width + yAxis.axisTitleRenderer.viewAxisRect.width;
                //         if (index === 0) {
                //             shift += size;
                //         } else {
                //             additionalSize += size;
                //         }
                //     });
                //     nativeAxisRect = createNativeRect(this.webAssemblyContext2D, 0 - shift, 0, viewAxisRect.width + additionalSize, viewAxisRect.height);
                //     nativeTitleRect = createNativeRect(this.webAssemblyContext2D, 0 - shift, 0, viewTitleRect.width + additionalSize, viewTitleRect.height);
                // } else {
                //     this.parentSurface.xAxes.asArray().forEach((xAxis: AxisBase2D, index: number) => {
                //         const size: number = xAxis.axisRenderer.viewAxisRect.height + xAxis.axisTitleRenderer.viewAxisRect.height;
                //         if (index === 0) {
                //             shift += size;
                //         } else {
                //             additionalSize += size;
                //         }
                //     });
                //     nativeAxisRect = createNativeRect(this.webAssemblyContext2D, 0, 0 - shift, viewAxisRect.width, viewAxisRect.height + additionalSize);
                //     nativeTitleRect = createNativeRect(this.webAssemblyContext2D, 0, 0 - shift, viewTitleRect.width, viewTitleRect.height + additionalSize);
                // }
                nativeAxisRect = (0, createNativeRect_1.createNativeRect)(_this.webAssemblyContext2D, 0, 0, _this.viewRect.width, _this.viewRect.height);
                if (nativeAxisRect) {
                    var vecRects = (0, NativeObject_1.getVectorRectVertex)(_this.webAssemblyContext2D);
                    vecRects.push_back(nativeAxisRect);
                    renderContext.drawRects(vecRects, brush, _this.viewRect.x, _this.viewRect.y);
                }
                perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawAxisBackgroundEnd, {
                    contextId: _this.id,
                    parentContextId: (_b = _this.parentSurface) === null || _b === void 0 ? void 0 : _b.id,
                    relatedId: (_c = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _c === void 0 ? void 0 : _c.relatedId,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
            }
            // Draw axis labels
            if (_this.drawLabels) {
                if (SciChartSurfaceBase_1.DebugForDpi) {
                    console.log("Draw. fontSize: ".concat(_this.labelStyle.fontSize, ", dpiAdjusted: ").concat(_this.dpiAdjustedLabelStyle.fontSize));
                }
                var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawAxisLabelsStart, {
                    contextId: _this.id,
                    parentContextId: (_d = _this.parentSurface) === null || _d === void 0 ? void 0 : _d.id,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
                _this.axisRenderer.drawLabels(renderContext, _this.axisAlignment, _this.isInnerAxis, tickObject.majorTickLabels, tickObject.majorTickCoords, _this.offset, _this.dpiAdjustedLabelStyle, _this.isVerticalChart, _this.flippedCoordinates, _this.labelProvider);
                perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawAxisLabelsEnd, {
                    contextId: _this.id,
                    parentContextId: (_e = _this.parentSurface) === null || _e === void 0 ? void 0 : _e.id,
                    relatedId: (_f = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _f === void 0 ? void 0 : _f.relatedId,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
            }
            // Draw ticks
            if (_this.drawMinorTickLines) {
                var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawMinorTicksStart, {
                    contextId: _this.id,
                    parentContextId: (_g = _this.parentSurface) === null || _g === void 0 ? void 0 : _g.id,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
                _this.axisRenderer.drawTicks(renderContext, _this.axisAlignment, _this.isInnerAxis, tickObject.minorTickCoords, _this.offset, penForMinorTickLines, minorTickStyle);
                perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawMinorTicksEnd, {
                    contextId: _this.id,
                    parentContextId: (_h = _this.parentSurface) === null || _h === void 0 ? void 0 : _h.id,
                    relatedId: (_j = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _j === void 0 ? void 0 : _j.relatedId,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
            }
            if (_this.drawMajorTickLines) {
                var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawMajorTicksStart, {
                    contextId: _this.id,
                    parentContextId: (_k = _this.parentSurface) === null || _k === void 0 ? void 0 : _k.id,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
                _this.axisRenderer.drawTicks(renderContext, _this.axisAlignment, _this.isInnerAxis, tickObject.majorTickCoords, _this.offset, penForMajorTickLines, majorTickStyle);
                perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawMajorTicksEnd, {
                    contextId: _this.id,
                    parentContextId: (_l = _this.parentSurface) === null || _l === void 0 ? void 0 : _l.id,
                    relatedId: (_m = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _m === void 0 ? void 0 : _m.relatedId,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
            }
            // Draw axis title
            _this.axisTitleRenderer.draw(renderContext);
            if (_this.labelProvider.useNativeText && _this.parentSurface.renderNativeAxisLabelsImmediately) {
                renderContext.endFonts(true);
            }
        }, axisLayer);
    };
    /**
     * Function to draw axis areas with red color
     * @param renderContext
     */
    AxisBase2D.prototype.drawDebug = function (renderContext) {
        var _this = this;
        this.axisRenderer.drawDebug = true;
        var drawTickViewRects = function () {
            var viewRect = _this.axisRenderer.viewRect;
            var vecRects = (0, NativeObject_1.getVectorRectVertex)(_this.webAssemblyContext2D);
            var brush = new _this.webAssemblyContext2D.SCRTSolidBrush((0, parseColor_1.parseColorToUIntArgb)("rgba(255,0,0,0.7)"), false);
            var nativeRect = (0, createNativeRect_1.createNativeRect)(_this.webAssemblyContext2D, 0, 0, viewRect.width, viewRect.height);
            vecRects.push_back(nativeRect);
            renderContext.drawRects(vecRects, brush, viewRect.left, viewRect.top);
            brush.delete();
        };
        drawTickViewRects();
        var drawTitleViewRects = function () {
            var viewRect = _this.axisTitleRenderer.viewRect;
            var vecRects = (0, NativeObject_1.getVectorRectVertex)(_this.webAssemblyContext2D);
            var brush = new _this.webAssemblyContext2D.SCRTSolidBrush((0, parseColor_1.parseColorToUIntArgb)("rgba(0,255,0,0.7)"), false);
            var nativeRect = (0, createNativeRect_1.createNativeRect)(_this.webAssemblyContext2D, 0, 0, viewRect.width, viewRect.height);
            vecRects.push_back(nativeRect);
            renderContext.drawRects(vecRects, brush, viewRect.left, viewRect.top);
            brush.delete();
        };
        drawTitleViewRects();
    };
    /**
     * @inheritDoc
     */
    AxisBase2D.prototype.getDefaultNonZeroRange = function () {
        return new NumberRange_1.NumberRange(0, 10);
    };
    /**
     * @Summary Part of AutoRanging - Gets the maximum range on this axis
     * @description The getMaximumRange function computes the {@link visibleRange} min and max that this axis must
     * have to display all the data in the chart.
     */
    AxisBase2D.prototype.getMaximumRange = function () {
        if (this.zoomExtentsRange) {
            return this.zoomExtentsRange;
        }
        var maximumRange;
        if (this.parentSurface && this.parentSurface.renderableSeries.size() > 0) {
            maximumRange = this.isXAxis ? this.getMaxXRange() : this.getWindowedYRange(undefined);
        }
        var currentVisibleRange = this.visibleRange || this.getDefaultNonZeroRange();
        return maximumRange || currentVisibleRange;
    };
    /**
     * @summary Part of AutoRanging - gets the windowed maximum range for Y-Axes
     * @description Returns the max range only for that axis (by the data-series on it),
     * based on associated XAxis visible range of series on the same axis
     * @param xRanges (optional) if provided, we use previously calculated XAxis ranges
     * keyed by AxisId rather than calculate them again
     */
    AxisBase2D.prototype.getWindowedYRange = function (xRanges) {
        var _this = this;
        if (this.zoomExtentsRange) {
            return this.zoomExtentsRange;
        }
        var maxRange;
        if (this.parentSurface) {
            var visibleSeries = this.parentSurface.renderableSeries
                .asArray()
                .filter(function (s) { return s.yAxisId === _this.id && s.isVisible && s.hasDataSeriesValues(); });
            visibleSeries.forEach(function (rSeries) {
                // Get pre-calculated XRange if exists, otherwise, fetch from the axis for this series
                var xVisibleRange = (xRanges === null || xRanges === void 0 ? void 0 : xRanges.containsKey(rSeries.xAxisId))
                    ? xRanges.item(rSeries.xAxisId)
                    : _this.getXVisibleRange(rSeries.xAxisId);
                var isXCategoryAxis = _this.getIsXCategoryAxis(rSeries.xAxisId);
                if (xVisibleRange) {
                    var range = rSeries.getYRange(xVisibleRange, isXCategoryAxis);
                    if (range) {
                        maxRange = maxRange ? maxRange.union(range) : range;
                    }
                }
            });
        }
        if (maxRange === null || maxRange === void 0 ? void 0 : maxRange.isZero()) {
            maxRange = this.coerceZeroVisibleRange(maxRange);
        }
        if (this.growBy && maxRange) {
            maxRange = maxRange.growBy(this.growBy);
        }
        maxRange = this.applyVisibleRangeLimit(maxRange);
        maxRange = this.applyVisibleRangeSizeLimit(maxRange);
        return maxRange || new NumberRange_1.NumberRange();
    };
    /**
     * Programmatically scrolls the axis by a number of pixels
     * @param pixelsToScroll The number of pixels to scroll
     * @param clipMode The clipping mode. See {@link EClipMode} for a list of values
     */
    AxisBase2D.prototype.scroll = function (pixelsToScroll, clipMode) {
        var startVisibleRange = this.visibleRange;
        if (startVisibleRange === undefined) {
            return false;
        }
        var translatedRange = this.getCurrentCoordinateCalculator().translateBy(pixelsToScroll, startVisibleRange);
        // TODO: refactor to use this.applyVisibleRangeLimit() method
        if (this.visibleRangeLimit) {
            var limitDelta = 0;
            if (translatedRange.min < this.visibleRangeLimit.min) {
                limitDelta = this.visibleRangeLimit.min - translatedRange.min;
            }
            else if (this.visibleRangeLimit.max < translatedRange.max) {
                limitDelta = this.visibleRangeLimit.max - translatedRange.max;
            }
            if (limitDelta) {
                translatedRange = new NumberRange_1.NumberRange(translatedRange.min + limitDelta, translatedRange.max + limitDelta);
            }
        }
        this.visibleRange = this.applyVisibleRangeSizeLimit(translatedRange);
        return true;
    };
    /**
     * Apply the axis visibleRangeLimit and visibleRangeSizeLimit to the given range and set the result as the axis visibleRange.
     */
    AxisBase2D.prototype.setVisibleRangeWithLimits = function (range) {
        var newRange = this.applyVisibleRangeLimit(range);
        this.visibleRange = this.applyVisibleRangeSizeLimit(newRange);
    };
    /**
     * Programmatically zooms the axis by a min and max fraction
     * @param minFraction The Min fraction, e.g. 0.1 will zoom the lower part of the range 10%
     * @param maxFraction The Max fraction, e.g. 0.1 will zoom the upper part of the range 10%
     */
    AxisBase2D.prototype.zoomBy = function (minFraction, maxFraction) {
        var coordCalc = this.getCurrentCoordinateCalculator();
        var translatedRange = coordCalc.zoomTranslateBy(minFraction, maxFraction, this.visibleRange);
        if (translatedRange.max < translatedRange.min) {
            return;
        }
        var newVisibleRange = this.applyVisibleRangeLimit(translatedRange);
        this.visibleRange = this.applyVisibleRangeSizeLimit(newVisibleRange);
    };
    /**
     * @summary Programmatically zooms the axis with a from and to coordinate
     * @description Used by the {@link RubberBandXyZoomModifier}, which allows the user to draw a rectangle on the chart
     * to zoom in. The from / too coordinate are the x or y components of the rectangle corners used to zoom in
     * @param fromCoord a pixel coordinate to zoom from
     * @param toCoord a pixel coordinate to zoom to
     * @param duration The duration of animation in milliseconds. Pass 0 for no animation.
     * @param easingFunction An optional easing function passed to specify animation easing. See {@link TEasingFn} for a list of values
     */
    AxisBase2D.prototype.zoom = function (fromCoord, toCoord, duration, easingFunction) {
        if (duration === void 0) { duration = 0; }
        if (easingFunction === void 0) { easingFunction = EasingFunctions_1.easing.outExpo; }
        var coordCalc = this.getCurrentCoordinateCalculator();
        var fromValue = coordCalc.getDataValue(fromCoord);
        var toValue = coordCalc.getDataValue(toCoord);
        var min = fromValue < toValue ? fromValue : toValue;
        var max = fromValue < toValue ? toValue : fromValue;
        var newVisibleRange1 = this.applyVisibleRangeLimit(new NumberRange_1.NumberRange(min, max));
        var newVisibleRange = this.applyVisibleRangeSizeLimit(newVisibleRange1);
        this.animateVisibleRange(newVisibleRange, duration, easingFunction);
    };
    AxisBase2D.prototype.scale = function (initialRange, delta, isMoreThanHalf) {
        var deltaRange = initialRange.max - initialRange.min;
        var newMin, newMax;
        // Respect flippedCoordinates
        var isMoreThanHalf2 = this.flippedCoordinates ? !isMoreThanHalf : isMoreThanHalf;
        var delta2 = this.flippedCoordinates ? -delta : delta;
        if (isMoreThanHalf2) {
            newMin = initialRange.min;
            newMax = delta2 > 0 ? newMin + deltaRange / (1 + delta2) : newMin + deltaRange * (1 + Math.abs(delta2));
        }
        else {
            newMax = initialRange.max;
            newMin = delta2 > 0 ? newMax - deltaRange * (1 + delta2) : newMax - deltaRange / (1 + Math.abs(delta2));
        }
        var newVisibleRange = this.applyVisibleRangeLimit(new NumberRange_1.NumberRange(newMin, newMax));
        this.visibleRange = this.applyVisibleRangeSizeLimit(newVisibleRange);
    };
    /**
     * @inheritDoc
     */
    AxisBase2D.prototype.animateVisibleRange = function (visibleRange, durationMs, easingFunction, onCompleted) {
        var _this = this;
        var _a;
        if (easingFunction === void 0) { easingFunction = EasingFunctions_1.easing.outCubic; }
        if (onCompleted === void 0) { onCompleted = function () { }; }
        if (durationMs <= 0) {
            // Don't allow setting visibleRange to undefined if there is no data
            this.visibleRange = visibleRange || this.visibleRange;
            onCompleted();
            return undefined;
        }
        (_a = this.visibleRangeAnimationToken) === null || _a === void 0 ? void 0 : _a.cancel();
        this.visibleRangeAnimationToken = NumberRangeAnimator_1.NumberRangeAnimator.animate(this.visibleRange, visibleRange, durationMs, function (range) {
            _this.visibleRange = range;
        }, function () {
            _this.visibleRangeAnimationToken = undefined;
            onCompleted();
        }, easingFunction);
        this.parentSurface.addAnimation(this.visibleRangeAnimationToken);
        return this.visibleRangeAnimationToken;
    };
    /**
     * @inheritDoc
     */
    AxisBase2D.prototype.delete = function () {
        this.penCacheForMajorGridLines = (0, Deleter_1.deleteSafe)(this.penCacheForMajorGridLines);
        this.penCacheForMinorGridLines = (0, Deleter_1.deleteSafe)(this.penCacheForMinorGridLines);
        this.penCacheForMajorTickLines = (0, Deleter_1.deleteSafe)(this.penCacheForMajorTickLines);
        this.penCacheForMinorTickLines = (0, Deleter_1.deleteSafe)(this.penCacheForMinorTickLines);
        this.solidBrushCacheBorder = (0, Deleter_1.deleteSafe)(this.solidBrushCacheBorder);
        this.solidBrushCacheAxisBands = (0, Deleter_1.deleteSafe)(this.solidBrushCacheAxisBands);
        this.solidBrushCacheAxisBackground = (0, Deleter_1.deleteSafe)(this.solidBrushCacheAxisBackground);
        this.axisRendererProperty = (0, Deleter_1.deleteSafe)(this.axisRenderer);
        this.axisTitleRenderer = (0, Deleter_1.deleteSafe)(this.axisTitleRenderer);
        this.webAssemblyContext2D = undefined;
        this.parentSurface = undefined;
        _super.prototype.delete.call(this);
    };
    AxisBase2D.prototype.toJSON = function () {
        var options = {
            autoRange: this.autoRange,
            autoTicks: this.autoTicks,
            axisAlignment: this.axisAlignment,
            axisBandsFill: this.axisBandsFill,
            axisBorder: this.axisBorder,
            axisTitle: this.axisTitle,
            axisTitleStyle: this.axisTitleStyle,
            drawLabels: this.drawLabels,
            drawMajorBands: this.drawMajorBands,
            drawMajorGridLines: this.drawMajorGridLines,
            drawMajorTickLines: this.drawMajorTickLines,
            drawMinorGridLines: this.drawMinorGridLines,
            drawMinorTickLines: this.drawMinorTickLines,
            flippedCoordinates: this.flippedCoordinates,
            growBy: this.growBy,
            id: this.id,
            isInnerAxis: this.isInnerAxis,
            isVisible: this.isVisible,
            labelStyle: this.labelStyle,
            majorGridLineStyle: this.majorGridLineStyle,
            majorTickLineStyle: this.majorTickLineStyle,
            maxAutoTicks: this.maxAutoTicks,
            minorGridLineStyle: this.minorGridLineStyle,
            minorTickLineStyle: this.minorTickLineStyle,
            visibleRange: this.hasDefaultVisibleRange() ? undefined : this.visibleRange,
            visibleRangeLimit: this.visibleRangeLimit,
            zoomExtentsRange: this.zoomExtentsRange,
            minorsPerMajor: this.minorsPerMajor,
            majorDelta: this.majorDelta,
            minorDelta: this.minorDelta,
            // @ts-ignore
            labelProvider: this.labelProvider.toJSON(),
            keepLabelsWithinAxis: this.axisRenderer.keepLabelsWithinAxis,
            clipToXRange: this.clipToXRange,
            isStaticAxis: this.isStaticAxis
        };
        return { type: this.type, options: options };
    };
    /**
     * Returns the max size for major/minor ticks. Used in layout and passed to AxisRenderer
     * @protected
     */
    AxisBase2D.prototype.getTicksMaxSize = function () {
        var _a, _b, _c, _d;
        // @ts-ignore
        var majorTickSize = (_b = ((_a = this.majorTickLineStyle) === null || _a === void 0 ? void 0 : _a.tickSize) * DpiHelper_1.DpiHelper.PIXEL_RATIO) !== null && _b !== void 0 ? _b : 0;
        // @ts-ignore
        var minorTickSize = (_d = ((_c = this.minorTickLineStyle) === null || _c === void 0 ? void 0 : _c.tickSize) * DpiHelper_1.DpiHelper.PIXEL_RATIO) !== null && _d !== void 0 ? _d : 0;
        return Math.max(majorTickSize, minorTickSize);
    };
    /**
     * When true, the axis is valid for drawing
     */
    AxisBase2D.prototype.getIsValidForDrawing = function () {
        return this.isVisible;
    };
    /**
     * Called internally - draws the Axis Bands and Gridlines
     * @param renderContext The {@link WebGL2RenderingContext} used for drawing
     * @param tickObject The {@link TTickObject} contains the major, minor tick numeric values, coordinates and labels for drawing
     * @param penForMinorGridLines The {@link SCRTPen} for drawing minor gridlines in our WebGL graphics engine
     * @param penForMajorGridLines The {@link SCRTPen} for drawing major gridlines in our WebGL graphics engine
     */
    AxisBase2D.prototype.drawAxisBandsAndGridLines = function (renderContext, tickObject, penForMinorGridLines, penForMajorGridLines) {
        var _this = this;
        // Draw axis bands
        if (this.drawMajorBands) {
            var solidBrush_1 = this.solidBrushCacheAxisBands.newBrush(this.axisBandsFill, true);
            var axisBandsLayer = (0, WebGlRenderContext2D_1.calculateAbsoluteRenderLayer)(this.parentSurface.layersOffset, this.parentSurface.stepBetweenLayers, DefaultRenderLayer_1.EDefaultRenderLayer.AxisBandsLayer);
            renderContext.enqueueLayeredDraw(function () {
                var _a, _b, _c;
                var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawAxisBandsStart, {
                    contextId: _this.id,
                    parentContextId: (_a = _this.parentSurface) === null || _a === void 0 ? void 0 : _a.id,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
                _this.drawAxisBands(renderContext, tickObject.majorTicks, tickObject.majorTickCoords, solidBrush_1);
                perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawAxisBandsEnd, {
                    contextId: _this.id,
                    parentContextId: (_b = _this.parentSurface) === null || _b === void 0 ? void 0 : _b.id,
                    relatedId: (_c = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _c === void 0 ? void 0 : _c.relatedId,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
            }, axisBandsLayer);
        }
        // Draw minor grid lines
        if (this.drawMinorGridLines) {
            var minorGridLinesLayer = (0, WebGlRenderContext2D_1.calculateAbsoluteRenderLayer)(this.parentSurface.layersOffset, this.parentSurface.stepBetweenLayers, DefaultRenderLayer_1.EDefaultRenderLayer.MinorGridLinesLayer);
            renderContext.enqueueLayeredDraw(function () {
                var _a, _b, _c;
                var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawMinorGridLinesStart, {
                    contextId: _this.id,
                    parentContextId: (_a = _this.parentSurface) === null || _a === void 0 ? void 0 : _a.id,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
                _this.drawGridLines(renderContext, tickObject.minorTickCoords, penForMinorGridLines);
                perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawMinorGridLinesEnd, {
                    contextId: _this.id,
                    parentContextId: (_b = _this.parentSurface) === null || _b === void 0 ? void 0 : _b.id,
                    relatedId: (_c = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _c === void 0 ? void 0 : _c.relatedId,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
            }, minorGridLinesLayer);
        }
        // Draw major grid lines
        if (this.drawMajorGridLines) {
            var majorGridLinesLayer = (0, WebGlRenderContext2D_1.calculateAbsoluteRenderLayer)(this.parentSurface.layersOffset, this.parentSurface.stepBetweenLayers, DefaultRenderLayer_1.EDefaultRenderLayer.MajorGridLinesLayer);
            renderContext.enqueueLayeredDraw(function () {
                var _a, _b, _c;
                var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawMajorGridLinesStart, {
                    contextId: _this.id,
                    parentContextId: (_a = _this.parentSurface) === null || _a === void 0 ? void 0 : _a.id,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
                _this.drawGridLines(renderContext, tickObject.majorTickCoords, penForMajorGridLines);
                perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawMajorGridLinesEnd, {
                    contextId: _this.id,
                    parentContextId: (_b = _this.parentSurface) === null || _b === void 0 ? void 0 : _b.id,
                    relatedId: (_c = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _c === void 0 ? void 0 : _c.relatedId,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
            }, majorGridLinesLayer);
        }
    };
    /**
     * Called internally - draws the Axis Bands
     * @param renderContext The {@link WebGL2RenderingContext} used for drawing
     * @param ticks An array of tick numeric values
     * @param tickCoords An array of tick coordinates
     * @param brush The {@link SCRTSolidBrush} used to fill the axis band area in our WebGL graphics engine
     */
    AxisBase2D.prototype.drawAxisBands = function (renderContext, ticks, tickCoords, brush) {
        var _this = this;
        if (!ticks || ticks.length === 0)
            return;
        var seriesViewRect = this.parentSurface.seriesViewRect;
        var direction = this.isHorizontalAxis ? XyDirection_1.EXyDirection.XDirection : XyDirection_1.EXyDirection.YDirection;
        var min = this.offset;
        var max = this.axisLength + this.offset;
        // Case where the axis is flipped, swap the min/max coords so we draw bands correctly
        var isFlipped = this.isAxisFlipped !== this.flippedCoordinates;
        if (isFlipped) {
            var temp = max;
            max = min;
            min = temp;
        }
        // Even/Odd calculation helps preserve order of bands as you scroll
        var firstTickIndex = this.getMajorTickIndex(ticks[0]);
        var isEven = firstTickIndex % 2 === 0;
        var vecRects = (0, NativeObject_1.getVectorRectVertex)(this.webAssemblyContext2D);
        var drawBand = function (coord0, coord1, isThisBandEven) {
            if (!isThisBandEven) {
                return;
            }
            var nativeRect = (0, createNativeRect_1.createNativeRect)(_this.webAssemblyContext2D, direction === XyDirection_1.EXyDirection.YDirection ? 0 : coord0, direction === XyDirection_1.EXyDirection.YDirection ? coord0 : 0, direction === XyDirection_1.EXyDirection.YDirection ? seriesViewRect.width : coord1, direction === XyDirection_1.EXyDirection.YDirection ? coord1 : seriesViewRect.height);
            vecRects.push_back(nativeRect);
        };
        ticks.forEach(function (mt, index) {
            var coord0 = index === 0 ? min : tickCoords[index - 1];
            var coord1 = tickCoords[index];
            drawBand(coord0, coord1, isEven);
            isEven = !isEven;
        });
        // Draw the last band to the edge of the screen
        drawBand(max, tickCoords[ticks.length - 1], isEven);
        renderContext.drawRects(vecRects, brush, seriesViewRect.left, seriesViewRect.top);
    };
    /**
     * Called internally - draws the Axis Grid Lines
     * @param renderContext The {@link WebGL2RenderingContext} used for drawing
     * @param tickCoords An array of tick coordinates
     * @param linesPen The {@link SCRTPen} used to draw the axis gridlines in our WebGL graphics engine
     */
    AxisBase2D.prototype.drawGridLines = function (renderContext, tickCoords, linesPen) {
        var _this = this;
        if (!tickCoords || tickCoords.length === 0)
            return;
        var seriesViewRect = this.parentSurface.seriesViewRect;
        var vertices = (0, NativeObject_1.getVectorColorVertex)(this.webAssemblyContext2D);
        tickCoords.forEach(function (tc) {
            var x1 = _this.isHorizontalAxis ? tc : 0;
            var x2 = _this.isHorizontalAxis ? tc : seriesViewRect.width;
            var y1 = _this.isHorizontalAxis ? 0 : tc;
            var y2 = _this.isHorizontalAxis ? seriesViewRect.height : tc;
            var vertex = (0, NativeObject_1.getVertex)(_this.webAssemblyContext2D, x1, y1);
            vertices.push_back(vertex);
            var vertex2 = (0, NativeObject_1.getVertex)(_this.webAssemblyContext2D, x2, y2);
            vertices.push_back(vertex2);
        });
        renderContext.drawLinesNative(vertices, linesPen, WebGlRenderContext2D_1.ELineDrawMode.DiscontinuousLine, seriesViewRect.left, seriesViewRect.top);
    };
    AxisBase2D.prototype.getXVisibleRange = function (xAxisId) {
        return this.parentSurface.getXAxisById(xAxisId).visibleRange;
    };
    AxisBase2D.prototype.getIsXCategoryAxis = function (xAxisId) {
        return this.parentSurface.getXAxisById(xAxisId).isCategoryAxis;
    };
    /**
     * Returns an array of label strings for an array of major tick numeric values
     * @param majorTicks The major tick numeric values
     */
    AxisBase2D.prototype.getLabels = function (majorTicks) {
        return this.labelProvider.getLabels(majorTicks);
    };
    /**
     * Gets the total range on the XAxis required to display all the series zoomed to fit on this axis
     */
    AxisBase2D.prototype.getXDataRange = function () {
        var _this = this;
        var maxRange;
        if (this.parentSurface) {
            var visibleSeries = this.parentSurface.renderableSeries
                .asArray()
                .filter(function (s) { return s.xAxisId === _this.id && s.isVisible && s.hasDataSeriesValues(); });
            visibleSeries.forEach(function (rSeries) {
                var xRange = rSeries.getXRange();
                if (xRange) {
                    maxRange = !maxRange ? xRange : maxRange.union(xRange);
                }
            });
        }
        return maxRange;
    };
    /**
     * @inheritDoc
     */
    AxisBase2D.prototype.notifyPropertyChanged = function (propertyName) {
        if (propertyName === constants_1.PROPERTY.IS_XAXIS) {
            if (this.axisAlignmentProperty === undefined) {
                this.axisAlignmentProperty = this.isXAxisProperty ? AxisAlignment_1.EAxisAlignment.Bottom : AxisAlignment_1.EAxisAlignment.Right;
            }
        }
        if (propertyName === constants_1.PROPERTY.AXIS_RENDERER) {
            this.axisRendererProperty.attachedToAxis(this);
        }
        _super.prototype.notifyPropertyChanged.call(this, propertyName);
    };
    AxisBase2D.prototype.getMaxXRange = function () {
        var maximumRange = this.getXDataRange();
        if (!maximumRange)
            return undefined;
        // TODO: Coerce a zero range
        if (this.growBy) {
            maximumRange = maximumRange.growBy(this.growBy);
        }
        maximumRange = this.applyVisibleRangeLimit(maximumRange !== null && maximumRange !== void 0 ? maximumRange : this.visibleRange);
        maximumRange = this.applyVisibleRangeSizeLimit(maximumRange);
        return maximumRange;
    };
    AxisBase2D.prototype.getAxisSize = function () {
        return this.axisLength;
    };
    AxisBase2D.prototype.getMajorTickIndex = function (tick) {
        var step = this.majorDeltaProperty;
        var index = tick / step;
        // TODO: Add IsLogarithmicAxis logic from AxisBase.cs
        // TODO: Add Category axis logic from AxisBase.cs
        return Math.round(index);
    };
    AxisBase2D.prototype.getTicks = function (regenerate) {
        var _a, _b;
        if (regenerate || !this.tickCache) {
            var maxAutoTicks = this.getMaxAutoTicks();
            if (this.autoTicks) {
                var delta = this.deltaCalculator.getDeltaFromRange(this.visibleRange.min, this.visibleRange.max, this.minorsPerMajor, maxAutoTicks);
                this.minorDeltaProperty = delta.min;
                this.majorDeltaProperty = delta.max;
            }
            // See if tickCoordinatesProvider has cached ticks (if isStaticAxis)
            var _c = this.tickCoordinatesProvider.getTickCoordinates(undefined, undefined), majorTickCoords = _c.majorTickCoords, minorTickCoords = _c.minorTickCoords, majorTickOverrides = _c.majorTickOverrides, minorTickOverRides = _c.minorTickOverRides;
            var majorTicks = this.drawLabels || this.drawMajorGridLines || this.drawMajorTickLines
                ? majorTickOverrides !== null && majorTickOverrides !== void 0 ? majorTickOverrides : this.tickProvider.getMajorTicks((_a = this.minorDeltaProperty) !== null && _a !== void 0 ? _a : this.majorDeltaProperty / this.minorsPerMajor, this.majorDeltaProperty, this.visibleRange)
                : [];
            var minorTicks = this.drawMinorGridLines || this.drawMinorTickLines
                ? minorTickOverRides !== null && minorTickOverRides !== void 0 ? minorTickOverRides : this.tickProvider.getMinorTicks((_b = this.minorDeltaProperty) !== null && _b !== void 0 ? _b : this.majorDeltaProperty / this.minorsPerMajor, this.majorDeltaProperty, this.visibleRange)
                : [];
            var _d = this.visibleRange, min_1 = _d.min, max_1 = _d.max;
            majorTicks = majorTicks.filter(function (t) { return t >= min_1 && t <= max_1; });
            minorTicks = minorTicks.filter(function (t) { return t >= min_1 && t <= max_1; });
            var majorTickLabels = [];
            if (majorTicks.length > 1000 && this.drawLabels) {
                console.warn("Axis settings result in more than 1000 labels.  Label drawing is disabled.  If using autoTicks: false, check that you have set sensible deltas.");
            }
            else {
                majorTickLabels = this.drawLabels ? this.getLabels(majorTicks) : [];
            }
            this.tickCache = {
                majorTicks: majorTicks,
                majorTickLabels: majorTickLabels,
                majorTickCoords: majorTickCoords,
                minorTicks: minorTicks,
                minorTickCoords: minorTickCoords // probably undefined unless isStaticAxis
            };
        }
        return this.tickCache;
    };
    AxisBase2D.prototype.getTicksWithCoords = function () {
        if (!this.tickCache) {
            this.getTicks(true);
        }
        if (this.tickCache.majorTickCoords === undefined) {
            var _a = this.tickCoordinatesProvider.getTickCoordinates(this.tickCache.majorTicks, this.tickCache.minorTicks), majorTickCoords = _a.majorTickCoords, minorTickCoords = _a.minorTickCoords;
            // tick values are never overridden at this point.  If they could be, it would have been done in the call from measure.
            this.tickCache.majorTickCoords = majorTickCoords;
            this.tickCache.minorTickCoords = minorTickCoords;
        }
        return this.tickCache;
    };
    AxisBase2D.prototype.applyVisibleRangeLimit = function (visibleRange) {
        if (!visibleRange)
            return undefined;
        if (!this.visibleRangeLimit)
            return visibleRange;
        var newRange = visibleRange.clip(this.visibleRangeLimit);
        if (newRange.min >= newRange.max) {
            console.warn("Can not apply visibleRangeLimit for the ".concat(this.isXAxis ? "xAxis" : "yAxis", " with ID ").concat(this.id));
            return visibleRange;
        }
        else {
            return newRange;
        }
    };
    AxisBase2D.prototype.applyVisibleRangeSizeLimit = function (visibleRange) {
        if (!visibleRange)
            return undefined;
        var minDiff = Math.abs(visibleRange.min) / Math.pow(10, 14);
        // Prevent axis becoming invalid due to loss of precision
        var currentSize = visibleRange.diff;
        if (currentSize < minDiff) {
            var middleValue = visibleRange.min + currentSize / 2;
            return new NumberRange_1.NumberRange(middleValue - minDiff / 2, middleValue + minDiff / 2);
        }
        if (!this.visibleRangeSizeLimit)
            return visibleRange;
        if (currentSize < 0) {
            console.warn("Can not apply visibleRangeSizeLimit for the ".concat(this.isXAxis ? "xAxis" : "yAxis", " with ID ").concat(this.id));
            return visibleRange;
        }
        else {
            var newVisibleRange = visibleRange;
            var _a = this.visibleRangeSizeLimit, min = _a.min, max = _a.max;
            var middleValue = visibleRange.min + currentSize / 2;
            if (currentSize < min) {
                newVisibleRange = new NumberRange_1.NumberRange(middleValue - min / 2, middleValue + min / 2);
            }
            else if (currentSize > max) {
                newVisibleRange = new NumberRange_1.NumberRange(middleValue - max / 2, middleValue + max / 2);
            }
            return newVisibleRange;
        }
    };
    return AxisBase2D;
}(AxisCore_1.AxisCore));
exports.AxisBase2D = AxisBase2D;
/** @ignore */
var getPenForLines = function (penCache, stroke, strokeThickness, strokeDashArray) {
    return (0, Pen2DCache_1.createPenInCache)(penCache, stroke, strokeThickness, 1, strokeDashArray, false);
};
