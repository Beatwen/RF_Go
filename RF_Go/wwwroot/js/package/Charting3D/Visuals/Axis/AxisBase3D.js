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
exports.AxisBase3D = exports.EWhichAxis = void 0;
var AxisCore_1 = require("../../../Charting/Visuals/Axis/AxisCore");
var SciChartSurfaceBase_1 = require("../../../Charting/Visuals/SciChartSurfaceBase");
var DpiHelper_1 = require("../../../Charting/Visuals/TextureManager/DpiHelper");
var NumberRange_1 = require("../../../Core/NumberRange");
var parseColor_1 = require("../../../utils/parseColor");
var AxisBase3DLabelStyle_1 = require("./AxisBase3DLabelStyle");
var constants_1 = require("./constants");
/**
 * Which axis - used for calculations
 */
var EWhichAxis;
(function (EWhichAxis) {
    EWhichAxis[EWhichAxis["xAxis"] = 0] = "xAxis";
    EWhichAxis[EWhichAxis["yAxis"] = 1] = "yAxis";
    EWhichAxis[EWhichAxis["zAxis"] = 2] = "zAxis";
})(EWhichAxis = exports.EWhichAxis || (exports.EWhichAxis = {}));
/**
 * The base class for 3D Chart Axis within SciChart - High Performance
 * {@link https://www.scichart.com/javascript-chart-features | JavaScript 3D Charts}.
 * @description
 * AxisBase3D is a base class for both 3D Axis types in SciChart. Concrete types include:
 *
 *  - {@link NumericAxis3D}: a Numeric 3D value-axis
 *
 * Set axis on the {@link SciChart3DSurface.xAxis}, {@link SciChart3DSurface.yAxis} or {@link SciChart3DSurface.zAxis} in 3D Charts.
 */
var AxisBase3D = /** @class */ (function (_super) {
    __extends(AxisBase3D, _super);
    /**
     * Creates an instance of the {@link AxisBase3D}
     * @param webAssemblyContext The {@link TSciChart3D | SciChart 3D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     * @param options optional parameters of type {@link IAxisBase3dOptions} to pass to the constructor
     * @protected
     */
    function AxisBase3D(webAssemblyContext, options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        _this = _super.call(this, options) || this;
        _this.labelDepthTestEnabledProperty = false;
        _this.planeBorderColorProperty = SciChartSurfaceBase_1.SciChartSurfaceBase.DEFAULT_THEME.planeBorderColor;
        _this.axisPlaneBackgroundFillProperty = SciChartSurfaceBase_1.SciChartSurfaceBase.DEFAULT_THEME.axisPlaneBackgroundFill;
        _this.isYAxisProperty = false;
        _this.isZAxisProperty = false;
        _this.labelStyle = new AxisBase3DLabelStyle_1.AxisBase3DLabelStyle(_this);
        if (options === null || options === void 0 ? void 0 : options.labelStyle) {
            _this.labelStyle.foreground = (_a = options.labelStyle.color) !== null && _a !== void 0 ? _a : _this.labelStyle.foreground;
            _this.labelStyle.fontSize = (_b = options.labelStyle.fontSize) !== null && _b !== void 0 ? _b : _this.labelStyle.fontSize;
            _this.labelStyle.fontFamily = (_c = options.labelStyle.fontFamily) !== null && _c !== void 0 ? _c : _this.labelStyle.fontFamily;
        }
        _this.titleStyle = new AxisBase3DLabelStyle_1.AxisBase3DLabelStyle(_this);
        if (options === null || options === void 0 ? void 0 : options.axisTitleStyle) {
            _this.titleStyle.foreground = (_d = options.axisTitleStyle.color) !== null && _d !== void 0 ? _d : _this.titleStyle.foreground;
            _this.titleStyle.fontSize = (_e = options.axisTitleStyle.fontSize) !== null && _e !== void 0 ? _e : _this.titleStyle.fontSize;
            _this.titleStyle.fontFamily = (_f = options.axisTitleStyle.fontFamily) !== null && _f !== void 0 ? _f : _this.titleStyle.fontFamily;
        }
        _this.webAssemblyContext3D = webAssemblyContext;
        _this.isXAxisProperty = false;
        _this.tickLabelsOffsetProperty = (_g = options === null || options === void 0 ? void 0 : options.tickLabelsOffset) !== null && _g !== void 0 ? _g : 10;
        _this.titleOffsetProperty = (_h = options === null || options === void 0 ? void 0 : options.titleOffset) !== null && _h !== void 0 ? _h : 50;
        _this.planeBorderColorProperty = (_j = options === null || options === void 0 ? void 0 : options.planeBorderColor) !== null && _j !== void 0 ? _j : _this.planeBorderColorProperty;
        _this.planeBorderThicknessProperty = (_k = options === null || options === void 0 ? void 0 : options.planeBorderThickness) !== null && _k !== void 0 ? _k : 2;
        _this.axisPlaneBackgroundFillProperty = (_l = options === null || options === void 0 ? void 0 : options.planeBackgroundFill) !== null && _l !== void 0 ? _l : _this.axisPlaneBackgroundFillProperty;
        return _this;
    }
    /**
     * @inheritDoc
     */
    AxisBase3D.prototype.applyTheme = function (themeProvider) {
        var _a, _b, _c, _d, _e, _f, _g;
        var previousThemeProvider = this.parentSurface.previousThemeProvider;
        if (((_a = this.labelStyle) === null || _a === void 0 ? void 0 : _a.foreground) === previousThemeProvider.labelForegroundBrush) {
            this.labelStyle.foreground = themeProvider.labelForegroundBrush;
        }
        if (((_b = this.titleStyle) === null || _b === void 0 ? void 0 : _b.foreground) === previousThemeProvider.labelForegroundBrush) {
            this.titleStyle.foreground = themeProvider.labelForegroundBrush;
        }
        if (this.axisBandsFill === previousThemeProvider.axisBandsFill) {
            this.axisBandsFill = themeProvider.axisBandsFill;
        }
        if (((_c = this.majorGridLineStyle) === null || _c === void 0 ? void 0 : _c.color) === previousThemeProvider.majorGridLineBrush) {
            this.majorGridLineStyle = { color: themeProvider.majorGridLineBrush };
        }
        if (((_d = this.majorTickLineStyle) === null || _d === void 0 ? void 0 : _d.color) === previousThemeProvider.majorGridLineBrush) {
            this.majorTickLineStyle = { color: themeProvider.majorGridLineBrush };
        }
        if (((_e = this.minorGridLineStyle) === null || _e === void 0 ? void 0 : _e.color) === previousThemeProvider.minorGridLineBrush) {
            this.minorGridLineStyle = { color: themeProvider.minorGridLineBrush };
        }
        if (((_f = this.minorTickLineStyle) === null || _f === void 0 ? void 0 : _f.color) === previousThemeProvider.minorGridLineBrush) {
            this.minorTickLineStyle = { color: themeProvider.minorGridLineBrush };
        }
        if (((_g = this.axisTitleStyle) === null || _g === void 0 ? void 0 : _g.color) === previousThemeProvider.axisTitleColor) {
            this.axisTitleStyle = { color: themeProvider.axisTitleColor };
        }
        if (this.planeBorderColor === previousThemeProvider.planeBorderColor) {
            this.planeBorderColor = themeProvider.planeBorderColor;
        }
        if (this.axisPlaneBackgroundFill === previousThemeProvider.axisPlaneBackgroundFill) {
            this.axisPlaneBackgroundFill = themeProvider.axisPlaneBackgroundFill;
        }
    };
    Object.defineProperty(AxisBase3D.prototype, "isYAxis", {
        /**
         * Used internally - gets whether this axis is a Y Axis
         */
        get: function () {
            return this.isYAxisProperty;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Used internally - sets whether this axis is a Y Axis
     */
    AxisBase3D.prototype.setIsYAxis = function (isYAxis) {
        this.isYAxisProperty = isYAxis;
        this.notifyPropertyChanged(constants_1.PROPERTY.IS_Y_AXIS);
    };
    Object.defineProperty(AxisBase3D.prototype, "isZAxis", {
        /**
         * Used internally - gets whether this axis is a Z Axis
         */
        get: function () {
            return this.isZAxisProperty;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Used internally - sets whether this axis is a Z Axis
     */
    AxisBase3D.prototype.setIsZAxis = function (isZAxis) {
        this.isZAxisProperty = isZAxis;
        this.notifyPropertyChanged(constants_1.PROPERTY.IS_Z_AXIS);
    };
    Object.defineProperty(AxisBase3D.prototype, "labelDepthTestEnabled", {
        /**
         * Gets or sets if Label Depth test is enabled
         * @description When true, Labels are rendered with depth and can be behind chart objects.
         * Else, labels are always on top and closest to the viewer
         */
        get: function () {
            return this.labelDepthTestEnabledProperty;
        },
        /**
         * Gets or sets if Label Depth test is enabled
         * @description When true, Labels are rendered with depth and can be behind chart objects.
         * Else, labels are always on top and closest to the viewer
         */
        set: function (labelDepthTestEnabled) {
            this.labelDepthTestEnabledProperty = labelDepthTestEnabled;
            this.notifyPropertyChanged(constants_1.PROPERTY.LABEL_DEPTH_TEST);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase3D.prototype, "planeBorderThickness", {
        /**
         * Gets or sets a thickness of the axis plane border.
         */
        get: function () {
            return this.planeBorderThicknessProperty;
        },
        /**
         * Gets or sets a thickness of the axis plane border.
         */
        set: function (planeBorderThickness) {
            this.planeBorderThicknessProperty = planeBorderThickness;
            this.notifyPropertyChanged(constants_1.PROPERTY.PLANE_BORDER_THICKNESS);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase3D.prototype, "planeBorderColor", {
        /**
         * Gets or sets the color of the axis plane border as an HTML Color code
         */
        get: function () {
            return this.planeBorderColorProperty;
        },
        /**
         * Gets or sets the color of the axis plane border as an HTML Color code
         */
        set: function (planeBorderColor) {
            this.planeBorderColorProperty = planeBorderColor;
            this.notifyPropertyChanged(constants_1.PROPERTY.PLANE_BORDER_COLOR);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase3D.prototype, "tickLabelAlignment", {
        /**
         * Gets or sets the Axis Label Alignment. See {@link ETextAlignment3D} for a list of values
         */
        get: function () {
            return this.tickLabelAlignmentProperty;
        },
        /**
         * Gets or sets the Axis Label Alignment. See {@link ETextAlignment3D} for a list of values
         */
        set: function (tickLabelAlignment) {
            this.tickLabelAlignmentProperty = tickLabelAlignment;
            this.notifyPropertyChanged(constants_1.PROPERTY.TICK_LABEL_ALIGNMENT);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase3D.prototype, "positiveSideClipping", {
        /**
         * Gets or sets a value determining how {@link BaseRenderableSeries3D | 3D RenderableSeries} are clipped by axis on the positive side
         * @remarks See {@link EAxisSideClipping} for a list of values
         */
        get: function () {
            return this.positiveSideClippingProperty;
        },
        /**
         * Gets or sets a value determining how {@link BaseRenderableSeries3D | 3D RenderableSeries} are clipped by axis on the positive side
         * @remarks See {@link EAxisSideClipping} for a list of values
         */
        set: function (positiveSideClipping) {
            this.positiveSideClippingProperty = positiveSideClipping;
            this.notifyPropertyChanged(constants_1.PROPERTY.POSITIVE_SIDE_CLIPPING);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase3D.prototype, "negativeSideClipping", {
        /**
         * Gets or sets a value determining how {@link BaseRenderableSeries3D | 3D RenderableSeries} are clipped by axis on the negative side
         * @remarks See {@link EAxisSideClipping} for a list of values
         */
        get: function () {
            return this.negativeSideClippingProperty;
        },
        /**
         * Gets or sets a value determining how {@link BaseRenderableSeries3D | 3D RenderableSeries} are clipped by axis on the negative side
         * @remarks See {@link EAxisSideClipping} for a list of values
         */
        set: function (negativeSideClipping) {
            this.negativeSideClippingProperty = negativeSideClipping;
            this.notifyPropertyChanged(constants_1.PROPERTY.NEGATIVE_SIDE_CLIPPING);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase3D.prototype, "axisPlaneBackgroundFill", {
        /**
         * Gets or sets the fill of the Axis Plane background as an HTML Color code. Defaults to transparent
         */
        get: function () {
            return this.axisPlaneBackgroundFillProperty;
        },
        /**
         * Gets or sets the fill of the Axis Plane background as an HTML Color code. Defaults to transparent
         */
        set: function (axisPlaneBackgroundFill) {
            this.axisPlaneBackgroundFillProperty = axisPlaneBackgroundFill;
            this.notifyPropertyChanged(constants_1.PROPERTY.AXIS_PLANE_BACKGROUND_FILL);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase3D.prototype, "titleOffset", {
        /**
         *  Gets or sets title text offset from the axis plane
         */
        get: function () {
            return this.titleOffsetProperty;
        },
        /**
         *  Gets or sets title text offset from the axis plane
         */
        set: function (value) {
            this.titleOffsetProperty = value;
            this.notifyPropertyChanged(constants_1.PROPERTY.TITLE_OFFSET);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase3D.prototype, "backgroundColor", {
        /**
         * Gets or sets the color of the background of the axis plane as an HTML Color code
         */
        get: function () {
            return this.axisPlaneBackgroundFill;
        },
        /**
         * Gets or sets the color of the background of the axis plane as an HTML Color code
         */
        set: function (value) {
            this.axisPlaneBackgroundFill = value;
            this.notifyPropertyChanged(constants_1.PROPERTY.BACKGROUND_COLOR);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisBase3D.prototype, "tickLabelsOffset", {
        /**
         * Gets or sets tick labels offset from the axis plane
         */
        get: function () {
            return this.tickLabelsOffsetProperty;
        },
        /**
         * Gets or sets tick labels offset from the axis plane
         */
        set: function (value) {
            this.tickLabelsOffsetProperty = value;
            this.notifyPropertyChanged(constants_1.PROPERTY.TICK_LABELS_OFFSET);
        },
        enumerable: false,
        configurable: true
    });
    AxisBase3D.prototype.onAttach = function (parentSurface, isXaxis, isYAxis, isZAxis) {
        this.parentSurface = parentSurface;
        this.setIsXAxis(isXaxis);
        this.setIsYAxis(isYAxis);
        this.setIsZAxis(isZAxis);
    };
    /**
     * Called internally - returns an {@link IAxisDescriptor} which contains parameters, property and data
     * to pass to the WebAssembly 3D Engine for drawing this axis
     */
    AxisBase3D.prototype.toAxisDescriptor = function () {
        var defaultColor = "transparent";
        var defaultBandsColor = "#202123";
        var _a = this.getTickCoordsAndLabels(), majorTickCoords = _a.majorTickCoords, minorTickCoords = _a.minorTickCoords, majorTickLabels = _a.majorTickLabels;
        // @ts-ignore
        // @ts-ignore
        var descriptor = {
            axisTitle: this.isVisible
                ? Array.isArray(this.axisTitle)
                    ? this.axisTitle.join(" ")
                    : this.axisTitle
                : "",
            axisSize: this.getAxisSize(),
            backgroundColor: (0, parseColor_1.parseColorToTArgb)(this.axisPlaneBackgroundFill || defaultColor),
            bandColor: (0, parseColor_1.parseColorToTArgb)(this.axisBandsFill || defaultBandsColor),
            borderColor: (0, parseColor_1.parseColorToTArgb)(this.planeBorderColor || defaultColor),
            borderThickness: this.planeBorderThickness,
            drawBands: this.isVisible && this.drawMajorBands,
            drawLabels: this.isVisible && this.drawLabels,
            drawMajorGridlines: this.isVisible && this.drawMajorGridLines,
            drawMajorTicks: this.isVisible && this.drawMajorTickLines,
            drawMinorGridlines: this.isVisible && this.drawMinorGridLines,
            drawMinorTicks: this.isVisible && this.drawMinorTickLines,
            isVisible: this.isVisible,
            labelDepthTestEnabled: this.labelDepthTestEnabled,
            labelStyle: {
                alignment: this.labelStyle.alignment,
                dpiScaling: this.labelStyle.dpiScaling / 96,
                fontFamily: this.labelStyle.fontFamily,
                fontSize: this.labelStyle.fontSize * DpiHelper_1.DpiHelper.PIXEL_RATIO,
                foreground: (0, parseColor_1.parseColorToUIntAbgr)(this.labelStyle.foreground)
            },
            majorCoordinates: majorTickCoords,
            majorLineStyle: toLineStyle(this.majorGridLineStyle),
            minorLineStyle: toLineStyle(this.minorGridLineStyle),
            majorTickStyle: toTickStyle(this.majorTickLineStyle),
            minorTickStyle: toTickStyle(this.minorTickLineStyle),
            minorCoordinates: minorTickCoords,
            smoothLabelOverlapAvoidance: false,
            tickLabels: majorTickLabels,
            tickLabelsOffset: this.tickLabelsOffset * DpiHelper_1.DpiHelper.PIXEL_RATIO,
            titleOffset: this.titleOffset * DpiHelper_1.DpiHelper.PIXEL_RATIO,
            titleStyle: {
                alignment: this.titleStyle.alignment,
                dpiScaling: this.titleStyle.dpiScaling / 96,
                fontFamily: this.titleStyle.fontFamily,
                fontSize: this.titleStyle.fontSize * DpiHelper_1.DpiHelper.PIXEL_RATIO,
                foreground: (0, parseColor_1.parseColorToUIntAbgr)(this.titleStyle.foreground)
            }
        };
        return descriptor;
    };
    AxisBase3D.prototype.validateAxis = function () {
        // TODO
    };
    /**
     * @Summary Part of AutoRanging - Gets the maximum range on this axis
     * @description The getMaximumRange function computes the {@link visibleRange} min and max that this axis must
     * have to display all the data in the chart.
     */
    AxisBase3D.prototype.getMaximumRange = function () {
        var _a, _b, _c, _d, _e;
        var maximumRange = new NumberRange_1.NumberRange(NaN, NaN);
        if (((_b = (_a = this.parentSurface) === null || _a === void 0 ? void 0 : _a.renderableSeries) === null || _b === void 0 ? void 0 : _b.size()) > 0) {
            var whichAxis = void 0;
            if (this.isXAxis) {
                whichAxis = EWhichAxis.xAxis;
            }
            else if (this.isYAxis) {
                whichAxis = EWhichAxis.yAxis;
            }
            else if (this.isZAxis) {
                whichAxis = EWhichAxis.zAxis;
            }
            else {
                throw Error("AxisBase3D: isXAxis, isYAxis, isZAxis flag are not set");
            }
            maximumRange = (_c = this.getMaximumRangeAs(this.parentSurface.renderableSeries, whichAxis)) !== null && _c !== void 0 ? _c : maximumRange;
            if (maximumRange.isZero()) {
                maximumRange = this.coerceZeroVisibleRange(maximumRange);
            }
            // Apply growby
            if ((_d = this.growBy) === null || _d === void 0 ? void 0 : _d.isDefined()) {
                maximumRange = maximumRange.growBy(this.growBy);
            }
        }
        var currentVisibleRange = ((_e = this.visibleRange) === null || _e === void 0 ? void 0 : _e.isDefined()) ? this.visibleRange : this.getDefaultNonZeroRange();
        return (maximumRange === null || maximumRange === void 0 ? void 0 : maximumRange.isDefined()) ? maximumRange : currentVisibleRange;
    };
    /**
     * @Summary Part of AutoRanging - Gets the maximum range on this axis.
     * @description The getMaximumRange function computes the {@link visibleRange} min and max that this axis must
     * have to display all the data in the chart.
     * @remarks This overload impersonates a specific axis according to the {@link EWhichAxis} parameter
     * @param whichAxis Which axis we should calculate as. See {@link EWhichAxis} for a list of values
     * @param renderableSeries The series to use for calculations
     */
    AxisBase3D.prototype.getMaximumRangeAs = function (renderableSeries, whichAxis) {
        var maximumRange;
        renderableSeries.asArray().forEach(function (r) {
            if (r.isVisible && r.dataSeries) {
                var range = whichAxis === EWhichAxis.xAxis
                    ? r.dataSeries.xRange
                    : whichAxis === EWhichAxis.yAxis
                        ? r.dataSeries.yRange
                        : r.dataSeries.zRange;
                if (range === null || range === void 0 ? void 0 : range.isDefined()) {
                    maximumRange = !maximumRange ? range : range.union(maximumRange);
                }
            }
        });
        return maximumRange;
    };
    /**
     * gets the axis size from the WorldDimensions, depending on whether it is an X,Y or ZAxis
     */
    AxisBase3D.prototype.getAxisSize = function () {
        if (!this.parentSurface) {
            return 0;
        }
        var worldDimensions = this.parentSurface.worldDimensions;
        if (!worldDimensions) {
            throw new Error("Must set property sciChart3DSurface.worldDimensions to a valid Vector3 with X,Y,Z world size");
        }
        var axisSize = this.isXAxis ? worldDimensions.x : this.isYAxis ? worldDimensions.y : worldDimensions.z;
        return axisSize;
    };
    /**
     * Given an array of numeric values for axis labels, returns a list of strings. Uses {@link labelProvider} property to format labels
     * @param majorTicks The major tick values as numbers to be converted to labels
     * @protected
     */
    AxisBase3D.prototype.getLabels = function (majorTicks) {
        var _this = this;
        return majorTicks.map(function (tick) { return _this.labelProvider.formatLabel(tick); });
    };
    AxisBase3D.prototype.getTicks = function () {
        var maxAutoTicks = this.getMaxAutoTicks();
        if (this.autoTicks) {
            var delta = this.deltaCalculator.getDeltaFromRange(this.visibleRange.min, this.visibleRange.max, this.minorsPerMajor, maxAutoTicks);
            this.minorDeltaProperty = delta.min;
            this.majorDeltaProperty = delta.max;
        }
        var majorTicks = this.tickProvider.getMajorTicks(this.minorDeltaProperty, this.majorDeltaProperty, this.visibleRange);
        var minorTicks = this.tickProvider.getMinorTicks(this.minorDeltaProperty, this.majorDeltaProperty, this.visibleRange);
        return {
            majorTicks: majorTicks,
            minorTicks: minorTicks
        };
    };
    AxisBase3D.prototype.getTickCoordsAndLabels = function () {
        var coordCalc = this.getCurrentCoordinateCalculator();
        var getTickCoords = function (ticks) { return ticks.map(function (el) { return coordCalc.getCoordinate(el); }); };
        var _a = this.getTicks(), majorTicks = _a.majorTicks, minorTicks = _a.minorTicks;
        var majorTickLabels = this.getLabels(majorTicks);
        var majorTickCoords = getTickCoords(majorTicks);
        var minorTickCoords = getTickCoords(minorTicks);
        return {
            majorTicks: majorTicks,
            majorTickLabels: majorTickLabels,
            majorTickCoords: majorTickCoords,
            minorTicks: minorTicks,
            minorTickCoords: minorTickCoords
        };
    };
    return AxisBase3D;
}(AxisCore_1.AxisCore));
exports.AxisBase3D = AxisBase3D;
/** @ignore */
var toLineStyle = function (styleProperty) {
    return {
        stroke: (0, parseColor_1.parseColorToTArgb)(styleProperty.color),
        strokeThickness: styleProperty.strokeThickness * DpiHelper_1.DpiHelper.PIXEL_RATIO,
        start: 1,
        end: 1
    };
};
/** @ignore */
var toTickStyle = function (tickLineStyle) {
    return {
        stroke: (0, parseColor_1.parseColorToTArgb)(tickLineStyle.color),
        strokeThickness: tickLineStyle.strokeThickness * DpiHelper_1.DpiHelper.PIXEL_RATIO,
        start: 0,
        end: tickLineStyle.tickSize * DpiHelper_1.DpiHelper.PIXEL_RATIO
    };
};
