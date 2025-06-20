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
exports.UniformContoursRenderableSeries = exports.EContourColorMapMode = exports.COLOR_MAP_PREFIX = void 0;
var SeriesType_1 = require("../../../types/SeriesType");
var isRealNumber_1 = require("../../../utils/isRealNumber");
var AxisCore_1 = require("../Axis/AxisCore");
var BaseRenderableSeries_1 = require("./BaseRenderableSeries");
var constants_1 = require("./constants");
var ContoursDataLabelProvider_1 = require("./DataLabels/ContoursDataLabelProvider");
var UniformContoursDrawingProvider_1 = require("./DrawingProviders/UniformContoursDrawingProvider");
var HeatmapColorMap_1 = require("./HeatmapColorMap");
/** @ignore */
exports.COLOR_MAP_PREFIX = "colorMap.";
var EContourColorMapMode;
(function (EContourColorMapMode) {
    /**
     *  Applies the Gradient Colors from {@link UniformContoursRenderableSeries} ColorMap individually,
     *  ignoring offsets, e.g. with Gradient Stops Red, Green, Blue then
     *  contour lines will appear Red Green or Blue
     */
    EContourColorMapMode[EContourColorMapMode["AlternateColors"] = 0] = "AlternateColors";
    /**
     * Applies the Gradient Colors from {@link UniformContoursRenderableSeries} ColorMap according to the data on the chart
     */
    EContourColorMapMode[EContourColorMapMode["GradientColors"] = 1] = "GradientColors";
})(EContourColorMapMode = exports.EContourColorMapMode || (exports.EContourColorMapMode = {}));
var UniformContoursRenderableSeries = /** @class */ (function (_super) {
    __extends(UniformContoursRenderableSeries, _super);
    // private drawingModeProperty: EContourDrawingMode;
    /**
     * Creates an instance of the {@link UniformHeatmapRenderableSeries}
     * @param webAssemblyContext The {@link TSciChart | SciChart WebAssembly Context} containing
     * native methods and access to our WebGL2 WebAssembly Drawing Engine
     * @param options optional parameters of type {@link IHeatmapRenderableSeriesOptions} applied when constructing the series type
     */
    function UniformContoursRenderableSeries(webAssemblyContext, options) {
        var _this = this;
        var _a, _b, _c, _d;
        _this = _super.call(this, webAssemblyContext, options) || this;
        _this.type = SeriesType_1.ESeriesType.UniformContoursSeries;
        _this.colorMapPropertyChanged = _this.colorMapPropertyChanged.bind(_this);
        if (options === null || options === void 0 ? void 0 : options.colorMap) {
            if (!("toJSON" in options.colorMap)) {
                options.colorMap = new HeatmapColorMap_1.HeatmapColorMap(options.colorMap);
            }
        }
        _this.colorMap = options === null || options === void 0 ? void 0 : options.colorMap;
        _this.dataSeries = options === null || options === void 0 ? void 0 : options.dataSeries;
        _this.xAxisId = (_a = options === null || options === void 0 ? void 0 : options.xAxisId) !== null && _a !== void 0 ? _a : AxisCore_1.AxisCore.DEFAULT_AXIS_ID;
        _this.yAxisId = (_b = options === null || options === void 0 ? void 0 : options.yAxisId) !== null && _b !== void 0 ? _b : AxisCore_1.AxisCore.DEFAULT_AXIS_ID;
        _this.zMin = (options === null || options === void 0 ? void 0 : options.zMin) || NaN;
        _this.zMax = (options === null || options === void 0 ? void 0 : options.zMax) || NaN;
        _this.zStep = (options === null || options === void 0 ? void 0 : options.zStep) || NaN;
        _this.majorLineStyle = (options === null || options === void 0 ? void 0 : options.majorLineStyle) || UniformContoursRenderableSeries.DEFAULT_MAJOR_LINE_STYLE;
        _this.minorLineStyle = (options === null || options === void 0 ? void 0 : options.minorLineStyle) || UniformContoursRenderableSeries.DEFAULT_MINOR_LINE_STYLE;
        _this.minorsPerMajor = (options === null || options === void 0 ? void 0 : options.minorsPerMajor) || 0;
        _this.majorLineStyleProperty = options === null || options === void 0 ? void 0 : options.majorLineStyle;
        _this.minorLineStyleProperty = options === null || options === void 0 ? void 0 : options.minorLineStyle;
        // Must be called here for the series type to be available
        if ((_c = _this.paletteProvider) === null || _c === void 0 ? void 0 : _c.onAttached) {
            (_d = _this.paletteProvider) === null || _d === void 0 ? void 0 : _d.onAttached(_this);
        }
        if (!_this.dataLabelProviderProperty) {
            _this.dataLabelProviderProperty = new ContoursDataLabelProvider_1.ContoursDataLabelProvider(options === null || options === void 0 ? void 0 : options.dataLabels);
            _this.dataLabelProviderProperty.onAttach(_this.webAssemblyContext, _this);
        }
        _this.drawingProviders = [];
        _this.drawingProviders.push(new UniformContoursDrawingProvider_1.UniformContoursDrawingProvider(webAssemblyContext, _this));
        return _this;
    }
    Object.defineProperty(UniformContoursRenderableSeries.prototype, "zMin", {
        get: function () {
            return this.zMinProperty;
        },
        set: function (zMin) {
            this.zMinProperty = zMin;
            this.notifyPropertyChanged(constants_1.PROPERTY.Z_MIN);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UniformContoursRenderableSeries.prototype, "zMax", {
        get: function () {
            return this.zMaxProperty;
        },
        set: function (zMax) {
            this.zMaxProperty = zMax;
            this.notifyPropertyChanged(constants_1.PROPERTY.Z_MAX);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UniformContoursRenderableSeries.prototype, "zStep", {
        get: function () {
            return this.zStepProperty;
        },
        set: function (zStep) {
            this.zStepProperty = zStep;
            this.notifyPropertyChanged(constants_1.PROPERTY.Z_STEP);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UniformContoursRenderableSeries.prototype, "colorMap", {
        /**
         * Gets or sets the {@link HeatmapColorMap}, which maps heatmap z-values to colors
         */
        get: function () {
            return this.colorMapProperty;
        },
        /**
         * Gets or sets the {@link HeatmapColorMap}, which maps heatmap z-values to colors
         */
        set: function (colorMap) {
            var _a, _b;
            (_a = this.colorMapProperty) === null || _a === void 0 ? void 0 : _a.propertyChanged.unsubscribe(this.colorMapPropertyChanged);
            this.colorMapProperty = colorMap;
            (_b = this.colorMapProperty) === null || _b === void 0 ? void 0 : _b.propertyChanged.subscribe(this.colorMapPropertyChanged);
            this.notifyPropertyChanged(constants_1.PROPERTY.COLOR_MAP);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UniformContoursRenderableSeries.prototype, "colorMapMode", {
        get: function () {
            return this.colorMapModeProperty;
        },
        set: function (colorMapMode) {
            this.colorMapModeProperty = colorMapMode;
            this.notifyPropertyChanged(constants_1.PROPERTY.CONTOUR_COLOR_MAP_MODE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UniformContoursRenderableSeries.prototype, "majorLineStyle", {
        get: function () {
            return this.majorLineStyleProperty;
        },
        set: function (majorLineStyle) {
            this.majorLineStyleProperty = majorLineStyle;
            this.notifyPropertyChanged(constants_1.PROPERTY.CONTOUR_MAJOR_LINE_STYLE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UniformContoursRenderableSeries.prototype, "minorLineStyle", {
        get: function () {
            return this.minorLineStyleProperty;
        },
        set: function (minorLineStyle) {
            this.minorLineStyleProperty = minorLineStyle;
            this.notifyPropertyChanged(constants_1.PROPERTY.CONTOUR_MINOR_LINE_STYLE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UniformContoursRenderableSeries.prototype, "minorsPerMajor", {
        get: function () {
            return this.minorsPerMajorProperty;
        },
        set: function (minorsPerMajor) {
            this.minorsPerMajorProperty = minorsPerMajor;
            this.notifyPropertyChanged(constants_1.PROPERTY.CONTOUR_MINORS_PER_MAJOR);
        },
        enumerable: false,
        configurable: true
    });
    UniformContoursRenderableSeries.prototype.getContourDrawingParams = function () {
        var _a, _b;
        var heatmapSeries = this.dataSeries;
        var dataZRange = heatmapSeries.zRange;
        var zMin = this.zMin && (0, isRealNumber_1.isRealNumber)(this.zMin) ? this.zMin : dataZRange.min;
        var zMax = this.zMax && (0, isRealNumber_1.isRealNumber)(this.zMax) ? this.zMax : dataZRange.max;
        zMin = Math.max(zMin, dataZRange.min);
        zMax = Math.min(zMax, dataZRange.max);
        var majorStepZ = this.zStep && (0, isRealNumber_1.isRealNumber)(this.zStep)
            ? this.zStep
            : Math.abs(zMax - zMin) / UniformContoursRenderableSeries.DEFAULT_CONTOURS_COUNT;
        var minorStepZ = this.minorsPerMajor && this.minorsPerMajor > 0 ? majorStepZ / (this.minorsPerMajor + 1) : majorStepZ;
        var minorLineStyle = (_a = this.minorLineStyle) !== null && _a !== void 0 ? _a : {
            strokeThickness: this.strokeThickness,
            color: this.stroke
        };
        var majorLineStyle = (_b = this.majorLineStyle) !== null && _b !== void 0 ? _b : {
            strokeThickness: this.strokeThickness,
            color: this.stroke
        };
        var result = {
            xMax: heatmapSeries.xMax,
            yMin: heatmapSeries.yMin,
            yMax: heatmapSeries.yMax,
            xMin: heatmapSeries.xMin,
            zMin: zMin,
            zMax: zMax,
            majorStepZ: majorStepZ,
            minorStepZ: minorStepZ,
            minorLineStyle: minorLineStyle,
            majorLineStyle: majorLineStyle
        };
        return result;
    };
    /** @inheritDoc */
    UniformContoursRenderableSeries.prototype.toPointSeries = function (resamplingParams) {
        // not used for Contours
        return undefined;
    };
    /** @inheritDoc */
    UniformContoursRenderableSeries.prototype.toJSON = function (excludeData) {
        var _a;
        if (excludeData === void 0) { excludeData = false; }
        var json = _super.prototype.toJSON.call(this, excludeData);
        var options = {
            colorMap: (_a = this.colorMap) === null || _a === void 0 ? void 0 : _a.toJSON(),
            majorLineStyle: this.majorLineStyle,
            minorLineStyle: this.minorLineStyle,
            zMax: this.zMax,
            zMin: this.zMin,
            zStep: this.zStep,
            minorsPerMajor: this.minorsPerMajor
        };
        Object.assign(json.options, options);
        return json;
    };
    /**
     * Called when a property changes on {@link HeatmapColorMap}, and notifies the parent {@link SciChartSurface}
     * that a redraw is required.
     * @param args
     */
    UniformContoursRenderableSeries.prototype.colorMapPropertyChanged = function (args) {
        this.notifyPropertyChanged(exports.COLOR_MAP_PREFIX + args.propertyName);
    };
    UniformContoursRenderableSeries.prototype.newHitTestProvider = function () {
        return undefined;
    };
    UniformContoursRenderableSeries.DEFAULT_CONTOURS_COUNT = 15;
    UniformContoursRenderableSeries.DEFAULT_MAJOR_LINE_STYLE = {
        strokeThickness: 2,
        color: "white"
    };
    UniformContoursRenderableSeries.DEFAULT_MINOR_LINE_STYLE = {
        strokeThickness: 1,
        color: "white"
    };
    return UniformContoursRenderableSeries;
}(BaseRenderableSeries_1.BaseRenderableSeries));
exports.UniformContoursRenderableSeries = UniformContoursRenderableSeries;
