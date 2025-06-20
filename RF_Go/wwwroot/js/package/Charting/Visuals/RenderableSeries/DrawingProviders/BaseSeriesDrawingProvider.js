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
exports.BaseSeriesDrawingProvider = void 0;
var DeletableEntity_1 = require("../../../../Core/DeletableEntity");
var Deleter_1 = require("../../../../Core/Deleter");
var Guard_1 = require("../../../../Core/Guard");
var colorUtil_1 = require("../../../../utils/colorUtil");
var number_1 = require("../../../../utils/number");
var parseColor_1 = require("../../../../utils/parseColor");
var PaletteCache_1 = require("../../../Drawing/PaletteCache");
var IPaletteProvider_1 = require("../../../Model/IPaletteProvider");
var createSolidBrush_1 = require("../../Helpers/createSolidBrush");
var constants_1 = require("../constants");
/**
 * Used internally - a drawing provider performs drawing for a specific chart-type or series using
 * our WebAssembly WebGL rendering engine
 */
var BaseSeriesDrawingProvider = /** @class */ (function (_super) {
    __extends(BaseSeriesDrawingProvider, _super);
    /**
     * Creates an instance of the {@link BaseSeriesDrawingProvider}
     * @param webAssemblyContext The {@link TSciChart | SciChart 2D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     * @param parentSeries the parent {@link IRenderableSeries | Renderable Series} which this drawing provider is attached to
     */
    function BaseSeriesDrawingProvider(webAssemblyContext, parentSeries, ySelector, xSelector) {
        var _this = this;
        var _a;
        _this = _super.call(this) || this;
        Guard_1.Guard.notNull(webAssemblyContext, "webAssemblyContext");
        Guard_1.Guard.notNull(parentSeries, "parentSeries");
        _this.webAssemblyContext = webAssemblyContext;
        _this.parentSeries = parentSeries;
        _this.ySelector = ySelector !== null && ySelector !== void 0 ? ySelector : (function (ps) { return ps.yValues; });
        _this.xSelector = xSelector !== null && xSelector !== void 0 ? xSelector : (function (ps) { return ps.xValues; });
        _this.palettingState = {
            palettedColors: undefined,
            palettedColorsHashCode: 0,
            gradientPaletting: false,
            paletteTextureCache: new PaletteCache_1.PaletteCache(webAssemblyContext),
            requiresUpdate: true
        };
        _this.seriesHasDataChanges = _this.seriesHasDataChanges.bind(_this);
        _this.parentDataSeries = _this.parentSeries.dataSeries;
        (_a = _this.parentDataSeries) === null || _a === void 0 ? void 0 : _a.dataChanged.subscribe(_this.seriesHasDataChanges);
        return _this;
    }
    /**
     * Returns the startIndex and count to be passed to the native drawing provider.
     * If renderPassData exists and contains an indexRange, this will be used, otherwise the full size of the xValues will be used
     * @param renderPassData
     * @param xValues
     * @returns
     */
    BaseSeriesDrawingProvider.prototype.getStartAndCount = function (renderPassData, xValues) {
        var _a, _b, _c;
        var pointSeries = renderPassData === null || renderPassData === void 0 ? void 0 : renderPassData.pointSeries;
        var xAxis = (_a = this.parentSeries) === null || _a === void 0 ? void 0 : _a.xAxis;
        var shouldClip = (_b = xAxis === null || xAxis === void 0 ? void 0 : xAxis.clipToXRange) !== null && _b !== void 0 ? _b : true; // fo the sake of tests
        var xCount = xValues.size();
        var count = Math.min(pointSeries ? pointSeries.xValues.size() : xCount, xCount);
        var startIndex = 0;
        if (shouldClip && !(pointSeries === null || pointSeries === void 0 ? void 0 : pointSeries.resampled) && ((_c = renderPassData === null || renderPassData === void 0 ? void 0 : renderPassData.indexRange) === null || _c === void 0 ? void 0 : _c.diff) >= 0) {
            if (renderPassData.indexRange.diff + 1 < count) {
                startIndex = renderPassData.indexRange.min;
            }
            count = Math.min(renderPassData.indexRange.diff + 1, count);
        }
        return { startIndex: startIndex, count: count };
    };
    /**
     * Helper function to apply color-paletting to a {@link UIntVector} - where each element in the vector
     * is an ARGB color that defines stroke of the series
     * @param strokePen the current pen, as type {@link SCRTPen}
     * @param renderPassData optional renderPassData.  If not supplied, the current renderPassData for the parent series will be used
     * @returns the new {@link UIntVector} with ARGB colors
     */
    BaseSeriesDrawingProvider.prototype.applyStrokePaletting = function (strokePen, renderPassData) {
        var _a, _b, _c, _d;
        var advancedPP = this.parentSeries.paletteProvider;
        if (this.parentSeries.hasStrokePaletteProvider() || advancedPP.applyPaletting !== undefined) {
            var strokeColorArgb = (0, colorUtil_1.uintArgbColorMultiplyOpacity)((0, parseColor_1.parseColorToUIntArgb)(this.parentSeries.stroke), this.parentSeries.opacity);
            if (isNaN(strokeColorArgb)) {
                throw Error("applyStrokePaletting(): renderSeries.stroke " +
                    this.parentSeries.stroke +
                    " cannot be converted to a valid color");
            }
            var strokePaletteProvider = this.parentSeries.paletteProvider;
            var dataSeries = this.parentSeries.dataSeries;
            renderPassData = renderPassData !== null && renderPassData !== void 0 ? renderPassData : this.parentSeries.getCurrentRenderPassData();
            var pointSeries = renderPassData === null || renderPassData === void 0 ? void 0 : renderPassData.pointSeries;
            var xValues = (_a = (pointSeries ? this.xSelector(pointSeries) : undefined)) !== null && _a !== void 0 ? _a : dataSeries.getNativeXValues();
            var yValues = (_b = (pointSeries ? this.ySelector(pointSeries) : undefined)) !== null && _b !== void 0 ? _b : dataSeries.getNativeYValues();
            var _e = this.getStartAndCount(renderPassData, xValues), startIndex = _e.startIndex, count = _e.count;
            if (!this.palettingState.palettedColors) {
                this.palettingState.palettedColors = new this.webAssemblyContext.UIntVector();
            }
            // For paletted series, we must pass 0xFFFFFFFF (white) to pen line
            this.palettingState.originalPenColor = strokePen.m_uiColor;
            strokePen.m_uiColor = 0xffffffff;
            strokePen.m_bGradient = strokePaletteProvider.strokePaletteMode === IPaletteProvider_1.EStrokePaletteMode.GRADIENT;
            if (advancedPP.applyPaletting) {
                advancedPP.applyPaletting(this.palettingState, xValues, yValues, (_c = pointSeries === null || pointSeries === void 0 ? void 0 : pointSeries.indexes) !== null && _c !== void 0 ? _c : dataSeries.getNativeIndexes(), startIndex, count);
                return;
            }
            this.shouldUpdatePalette(renderPassData, strokePaletteProvider, startIndex, count, false);
            if (!this.palettingState.requiresUpdate) {
                return;
            }
            this.palettingState.palettedColors.clear();
            this.palettingState.palettedColors.reserve(count);
            var hasPSIndexes = pointSeries && pointSeries.indexes.size() > 0;
            for (var index = startIndex; index < startIndex + count; index++) {
                var originalDataIndex = hasPSIndexes ? pointSeries.indexes.get(index) : index;
                if (originalDataIndex < 0)
                    originalDataIndex = 0;
                else if (originalDataIndex >= dataSeries.count())
                    originalDataIndex = dataSeries.count() - 1;
                var xValue = xValues.get(index);
                var yValue = yValues.get(index);
                var overrideColor = strokePaletteProvider.overrideStrokeArgb(xValue, yValue, originalDataIndex, this.parentSeries.opacity, dataSeries.getMetadataAt(originalDataIndex));
                this.parentSeries.pushPalettedColors(overrideColor ? overrideColor : strokeColorArgb, this.palettingState);
            }
            this.palettingState.requiresUpdate = false;
        }
        else {
            if (this.palettingState.originalPenColor) {
                strokePen.m_uiColor = this.palettingState.originalPenColor;
                this.palettingState.originalPenColor = undefined;
            }
            (_d = this.palettingState.palettedColors) === null || _d === void 0 ? void 0 : _d.clear();
        }
        // Due to pass-by-pointer limitations of WASM binding, we pass an empty vector rather than null
        if (!this.palettingState.palettedColors) {
            this.palettingState.palettedColors = new this.webAssemblyContext.UIntVector();
        }
    };
    BaseSeriesDrawingProvider.prototype.applyStrokeFillPaletting = function (stroke, strokePen, fill, fillBrush, opacity, usePalette, resetPenBrushColors, renderPassData) {
        var _a, _b, _c, _d, _e, _f;
        if (usePalette === void 0) { usePalette = false; }
        if (resetPenBrushColors === void 0) { resetPenBrushColors = true; }
        var hasStrokePaletteProvider = this.parentSeries.hasStrokePaletteProvider();
        var hasFillPaletteProvider = this.parentSeries.hasFillPaletteProvider();
        var hasPointMarkerPaletteProvider = this.parentSeries.hasPointMarkerPaletteProvider();
        var strokePaletteProvider = this.parentSeries.paletteProvider;
        var advancedPP = this.parentSeries.paletteProvider;
        var hasAdvancedPP = (advancedPP === null || advancedPP === void 0 ? void 0 : advancedPP.applyPaletting) !== undefined;
        if (hasStrokePaletteProvider || hasFillPaletteProvider || hasPointMarkerPaletteProvider || hasAdvancedPP) {
            var strokeColor = void 0;
            var fillColor = void 0;
            // Palette (this.palettingState.paletteTextureCache) is used only for band and mountain series
            if (usePalette) {
                strokeColor = fillColor = this.webAssemblyContext.SCRTPalette.GetNoOverrideColorCode();
            }
            else {
                var hasOpacity = opacity !== undefined;
                strokeColor =
                    stroke && hasOpacity ? (0, colorUtil_1.uintArgbColorMultiplyOpacity)((0, parseColor_1.parseColorToUIntArgb)(stroke), 1) : 0xffffffff;
                fillColor =
                    fill && hasOpacity ? (0, colorUtil_1.uintArgbColorMultiplyOpacity)((0, parseColor_1.parseColorToUIntArgb)(fill), 1) : 0xffffffff;
            }
            if (isNaN(strokeColor)) {
                throw Error("updatePalette(): parentSeries.stroke " + stroke + " cannot be converted to a valid color");
            }
            if (isNaN(fillColor)) {
                throw Error("updatePalette(): fillColor " + fillColor + " cannot be converted to a valid color");
            }
            var dataSeries = this.parentSeries.dataSeries;
            renderPassData = renderPassData !== null && renderPassData !== void 0 ? renderPassData : this.parentSeries.getCurrentRenderPassData();
            var pointSeries = renderPassData === null || renderPassData === void 0 ? void 0 : renderPassData.pointSeries;
            var xValues = (_a = (pointSeries ? this.xSelector(pointSeries) : undefined)) !== null && _a !== void 0 ? _a : dataSeries.getNativeXValues();
            var yValues = (_b = (pointSeries ? this.ySelector(pointSeries) : undefined)) !== null && _b !== void 0 ? _b : dataSeries.getNativeYValues();
            var _g = this.getStartAndCount(renderPassData, xValues), startIndex = _g.startIndex, count = _g.count;
            if (!this.palettingState.palettedColors) {
                this.palettingState.palettedColors = new this.webAssemblyContext.UIntVector();
            }
            if (advancedPP.applyPaletting) {
                advancedPP.applyPaletting(this.palettingState, xValues, yValues, (_c = pointSeries === null || pointSeries === void 0 ? void 0 : pointSeries.indexes) !== null && _c !== void 0 ? _c : dataSeries.getNativeIndexes(), startIndex, count);
                return;
            }
            this.shouldUpdatePalette(renderPassData, strokePaletteProvider, startIndex, count, true);
            if (!this.palettingState.requiresUpdate) {
                return;
            }
            this.palettingState.paletteTextureCache.reset();
            this.palettingState.palettedColors.clear();
            this.palettingState.palettedColors.reserve(count * 2);
            if (resetPenBrushColors) {
                if (strokePen && hasStrokePaletteProvider) {
                    // For paletted series, we must pass 0xFFFFFFFF (white) to pen line
                    this.palettingState.originalPenColor = strokePen.m_uiColor;
                    strokePen.m_uiColor = 0xffffffff;
                    this.palettingState.originalPenGradient = strokePen.m_bGradient;
                    strokePen.m_bGradient = strokePaletteProvider.strokePaletteMode === IPaletteProvider_1.EStrokePaletteMode.GRADIENT;
                }
                if (fillBrush) {
                    this.palettingState.originalBrushColor = fillBrush.GetColor();
                    fillBrush.SetColor(0xffffffff);
                }
            }
            // Override stroke and fill colors
            var hashCode = 0;
            var hasPSIndexes = pointSeries && pointSeries.indexes.size() > 0;
            for (var index = startIndex; index < startIndex + count; index++) {
                var originalDataIndex = hasPSIndexes ? pointSeries.indexes.get(index) : index;
                if (originalDataIndex < 0)
                    originalDataIndex = 0;
                else if (originalDataIndex >= dataSeries.count())
                    originalDataIndex = dataSeries.count() - 1;
                var xValue = xValues.get(index);
                var yValue = yValues.get(index);
                var overriddenColors = this.overridePaletteProviderColors(this.parentSeries, xValue, yValue, originalDataIndex, opacity, dataSeries.getMetadataAt(originalDataIndex));
                var overrideStrokeColor = (_d = overriddenColors.stroke) !== null && _d !== void 0 ? _d : strokeColor;
                var overrideFillColor = (_e = overriddenColors.fill) !== null && _e !== void 0 ? _e : fillColor;
                this.palettingState.palettedColors.push_back(overrideStrokeColor);
                this.palettingState.palettedColors.push_back(overrideFillColor);
                if (usePalette) {
                    hashCode = (0, number_1.numericHashCode)(hashCode, overrideStrokeColor);
                    hashCode = (0, number_1.numericHashCode)(hashCode, overrideFillColor);
                }
            }
            // Palette is used only for band and mountain series
            if (usePalette) {
                if (this.palettingState.palettedColorsHashCode !== hashCode) {
                    this.palettingState.paletteTextureCache.reset();
                }
                this.palettingState.paletteTextureCache.create(this.palettingState.palettedColors);
                this.palettingState.palettedColorsHashCode = hashCode;
            }
            this.palettingState.requiresUpdate = false;
        }
        else {
            this.palettingState.paletteTextureCache.reset();
            (_f = this.palettingState.palettedColors) === null || _f === void 0 ? void 0 : _f.clear();
            if (strokePen) {
                if (this.palettingState.originalPenColor) {
                    strokePen.m_uiColor = this.palettingState.originalPenColor;
                    this.palettingState.originalPenColor = undefined;
                }
                if (this.palettingState.originalPenGradient) {
                    strokePen.m_bGradient = this.palettingState.originalPenGradient;
                    this.palettingState.originalPenGradient = undefined;
                }
            }
            if (fillBrush && this.palettingState.originalBrushColor) {
                fillBrush.SetColor(this.palettingState.originalBrushColor);
                this.palettingState.originalBrushColor = undefined;
            }
        }
        // Due to pass-by-pointer limitations of WASM binding, we pass an empty vector rather than null
        if (!this.palettingState.palettedColors) {
            this.palettingState.palettedColors = new this.webAssemblyContext.UIntVector();
        }
        // Set gradient for the fill color
        this.palettingState.gradientPaletting = this.isGradientFillPaletting(this.parentSeries);
    };
    /**
     * Creates a native {@link SCRTBrush} Solid Color Brush from html color code string passed in
     * @param htmlColorCode The HTML Color code
     * @param opacity The opacity factor
     */
    BaseSeriesDrawingProvider.prototype.createSolidBrush = function (htmlColorCode, opacity) {
        return (0, createSolidBrush_1.createSolidBrush)(this.webAssemblyContext, htmlColorCode, opacity);
    };
    /**
     * @inheritDoc
     */
    BaseSeriesDrawingProvider.prototype.delete = function () {
        if (this.palettingState.palettedColors) {
            this.palettingState.palettedColors = (0, Deleter_1.deleteSafe)(this.palettingState.palettedColors);
        }
        this.palettingState.paletteTextureCache = (0, Deleter_1.deleteSafe)(this.palettingState.paletteTextureCache);
    };
    /**
     * @inheritDoc
     */
    BaseSeriesDrawingProvider.prototype.onSeriesPropertyChange = function (propertyName) {
        var _a, _b;
        if (propertyName === constants_1.PROPERTY.DATA_SERIES) {
            (_a = this.parentDataSeries) === null || _a === void 0 ? void 0 : _a.dataChanged.unsubscribe(this.seriesHasDataChanges);
            this.parentDataSeries = this.parentSeries.dataSeries;
            (_b = this.parentDataSeries) === null || _b === void 0 ? void 0 : _b.dataChanged.subscribe(this.seriesHasDataChanges);
            this.palettingState.requiresUpdate = true;
        }
    };
    /**
     * @inheritDoc
     */
    BaseSeriesDrawingProvider.prototype.onDpiChanged = function (args) {
        // Override in derived class to be notified of Dpi changes
    };
    /**
     * @inheritDoc
     */
    BaseSeriesDrawingProvider.prototype.onAttachSeries = function () {
        // Override in derived class to be notified of series being attached to sciChartSurface
    };
    /**
     * @inheritDoc
     */
    BaseSeriesDrawingProvider.prototype.onDetachSeries = function () {
        // Override in derived class to be notified of series being detached from sciChartSurface
    };
    BaseSeriesDrawingProvider.prototype.seriesHasDataChanges = function () {
        this.palettingState.requiresUpdate = true;
        // TODO override in derived class.
    };
    BaseSeriesDrawingProvider.prototype.shouldUpdatePalette = function (renderPassData, paletteProvider, startIndex, count, isDoubled) {
        var _a, _b, _c, _d, _e, _f;
        if (((_a = renderPassData === null || renderPassData === void 0 ? void 0 : renderPassData.pointSeries) === null || _a === void 0 ? void 0 : _a.resampled) &&
            (renderPassData === null || renderPassData === void 0 ? void 0 : renderPassData.resamplingHash) !== this.palettingState.lastResamplingHash) {
            this.palettingState.lastResamplingHash = renderPassData === null || renderPassData === void 0 ? void 0 : renderPassData.resamplingHash;
            this.palettingState.requiresUpdate = true;
        }
        if (!((_b = paletteProvider.isRangeIndependant) !== null && _b !== void 0 ? _b : false)) {
            // Range dependant (the default) so recalculate if start and count have changed
            if (((_c = this.palettingState.lastStartIndex) !== null && _c !== void 0 ? _c : 0) !== startIndex ||
                ((_d = this.palettingState.lastCount) !== null && _d !== void 0 ? _d : 0) !== count) {
                this.palettingState.lastStartIndex = startIndex;
                this.palettingState.lastCount = count;
                this.palettingState.requiresUpdate = true;
                this.palettingState.paletteStartIndex = 0;
            }
        }
        else {
            if (((_e = this.palettingState.lastStartIndex) !== null && _e !== void 0 ? _e : Number.MAX_SAFE_INTEGER) > startIndex ||
                ((_f = this.palettingState.lastCount) !== null && _f !== void 0 ? _f : 0) < count ||
                startIndex + count > this.palettingState.lastStartIndex + this.palettingState.lastCount) {
                // Range has grown so recalcualte and start from 0
                this.palettingState.lastStartIndex = startIndex;
                this.palettingState.lastCount = count;
                this.palettingState.requiresUpdate = true;
                this.palettingState.paletteStartIndex = 0;
            }
            else {
                // Range is same or smaller so adjust palette startIndex
                this.palettingState.paletteStartIndex =
                    startIndex * (isDoubled ? 2 : 1) - this.palettingState.lastStartIndex;
            }
        }
        // Default to always update for back compatability
        if (!paletteProvider.shouldUpdatePalette || paletteProvider.shouldUpdatePalette()) {
            this.palettingState.requiresUpdate = true;
        }
    };
    BaseSeriesDrawingProvider.prototype.overridePaletteProviderColors = function (rs, xValue, yValue, index, opacity, metadata) {
        var stroke;
        var fill;
        if (rs.hasStrokePaletteProvider()) {
            var strokePaletteProvider = rs.paletteProvider;
            stroke = strokePaletteProvider.overrideStrokeArgb(xValue, yValue, index, opacity, metadata);
        }
        if (rs.hasFillPaletteProvider()) {
            var fillPaletteProvider = rs.paletteProvider;
            fill = fillPaletteProvider.overrideFillArgb(xValue, yValue, index, opacity, metadata);
        }
        return { stroke: stroke, fill: fill };
    };
    BaseSeriesDrawingProvider.prototype.isGradientFillPaletting = function (rs) {
        if (rs.hasFillPaletteProvider()) {
            var fillPaletteProvider = rs.paletteProvider;
            return fillPaletteProvider.fillPaletteMode === IPaletteProvider_1.EFillPaletteMode.GRADIENT;
        }
        return false;
    };
    return BaseSeriesDrawingProvider;
}(DeletableEntity_1.DeletableEntity));
exports.BaseSeriesDrawingProvider = BaseSeriesDrawingProvider;
