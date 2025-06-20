"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHeatmapDataSeries = void 0;
var classFactory_1 = require("../../Builder/classFactory");
var Deleter_1 = require("../../Core/Deleter");
var EventHandler_1 = require("../../Core/EventHandler");
var Guard_1 = require("../../Core/Guard");
var NumberRange_1 = require("../../Core/NumberRange");
var BaseType_1 = require("../../types/BaseType");
var appendDoubleVectorFromJsArray_1 = require("../../utils/ccall/appendDoubleVectorFromJsArray");
var guid_1 = require("../../utils/guid");
var isRealNumber_1 = require("../../utils/isRealNumber");
var IDataSeries_1 = require("./IDataSeries");
var IPointMetadata_1 = require("./IPointMetadata");
/**
 * The base class for Heatmap-style DataSeries in SciChart's
 * {@link https://www.scichart.com/javascript-chart-features | JavaScript Charts}
 * @remarks
 * A DataSeries stores the data to render. This is independent from the {@link IRenderableSeries | RenderableSeries}
 * which defines how that data should be rendered.
 *
 * See derived types of {@link BaseHeatmapDataSeries} to find out what Heatmap data-series are available.
 * See {@link UniformHeatmapRenderableSeries} to see the class for rendering a 2D JavaScript Heatmap Chart.
 */
var BaseHeatmapDataSeries = /** @class */ (function () {
    /**
     * Creates an instance of {@link BaseHeatmapDataSeries}
     * @param webAssemblyContext the {@link TSciChart | SciChart WebAssembly Context} containing native methods
     * and access to our underlying WebGL2 rendering engine
     * @param options the {@link IBaseHeatmapSeriesOptions} which can be passed to configure the DataSeries at construct time
     */
    function BaseHeatmapDataSeries(webAssemblyContext, options) {
        var _a, _b, _c, _d;
        /** @inheritDoc */
        this.dataChanged = new EventHandler_1.EventHandler();
        /** @inheritDoc */
        this.minXSpacing = 0;
        /**
         * Gets the width of the 2-dimensional array of {@link getZValues | Z-Values} where array is ranked [width][height]
         */
        this.arrayWidth = 0;
        /**
         * Gets the height of the 2-dimensional array of {@link getZValues | Z-Values} where array is ranked [width][height]
         */
        this.arrayHeight = 0;
        /**
         * When true, the {@link BaseHeatmapDataSeries} has data changes and requires redrawing
         */
        this.hasDataChangesProperty = false;
        this.hasNaNsProperty = false;
        this.lastZMin = -1;
        this.lastZMax = -1;
        this.lastFillValuesOutOfRange = undefined;
        this.metadataGeneratorProperty = undefined;
        this.changeCountProperty = 0;
        this.webAssemblyContext = webAssemblyContext;
        this.id = (_a = options === null || options === void 0 ? void 0 : options.id) !== null && _a !== void 0 ? _a : (0, guid_1.generateGuid)();
        this.dataSeriesNameProperty = (_b = options === null || options === void 0 ? void 0 : options.dataSeriesName) !== null && _b !== void 0 ? _b : this.dataSeriesNameProperty;
        this.hasNaNsProperty = (_c = options === null || options === void 0 ? void 0 : options.containsNaN) !== null && _c !== void 0 ? _c : this.hasNaNsProperty;
        this.normalizedVector = new this.webAssemblyContext.SCRTFloatVector();
        if (options === null || options === void 0 ? void 0 : options.metadata) {
            if ("type" in options.metadata) {
                this.metadataGeneratorProperty = (0, classFactory_1.createType)(BaseType_1.EBaseType.MetadataGenerator, options.metadata.type, webAssemblyContext, options.metadata.data);
                options.metadata = (_d = this.metadataGeneratorProperty) === null || _d === void 0 ? void 0 : _d.getMetadata();
            }
            else if (!Array.isArray(options === null || options === void 0 ? void 0 : options.metadata)) {
                this.metadataGeneratorProperty = new IPointMetadata_1.TemplateMetadataGenerator(options === null || options === void 0 ? void 0 : options.metadata);
                options.metadata = undefined;
            }
        }
        // Copy zValues
        this.setZValues(options === null || options === void 0 ? void 0 : options.zValues, options === null || options === void 0 ? void 0 : options.metadata);
    }
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "isSorted", {
        /** @inheritDoc */
        get: function () {
            return true;
        },
        /** @inheritDoc */
        set: function (value) {
            throw new Error("setting isSorted on a heatmap series is not supported");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "isEvenlySpaced", {
        /** @inheritDoc */
        get: function () {
            return true;
        },
        /** @inheritDoc */
        set: function (value) {
            throw new Error("setting isEvenlySpaced on a heatmap series is not supported");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "containsNaN", {
        /** @inheritDoc */
        get: function () {
            return false;
        },
        /** @inheritDoc */
        set: function (value) {
            throw new Error("setting containsNaN is not supported on BaseHeatmapDataSeries");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "dataDistributionCalculator", {
        /** @inheritDoc */
        get: function () {
            throw new Error("dataDistributionCalculator is not supported on BaseHeatmapDataSeries");
        },
        enumerable: false,
        configurable: true
    });
    /** @inheritDoc */
    BaseHeatmapDataSeries.prototype.getNativeValue = function (values, index) {
        throw new Error("getNativeValue not supported for HeatmapDataSeries");
    };
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "hasDataChanges", {
        /**
         * Returns true if the Heatmap DataSeries has data changes.
         * This flag is set to true when notifyDataChanged is called, and reset to false after
         */
        get: function () {
            return this.hasDataChangesProperty;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets a readonly collection of Z-values which can be read in the format zValues[y][x]
     * Note that changes or manipulation of the 2D array will not update the Heatmap. Set it back via setZValues()
     * to see changes to the chart
     */
    BaseHeatmapDataSeries.prototype.getZValues = function () {
        return this.zValuesProperty;
    };
    /**
     * Sets a 2D array of zValues. Input is in the format zValues[y][x] where Y is 0 to height and X is 0 to Width
     * @param zValues
     * @param metadata The array of arrays of point metadata
     */
    BaseHeatmapDataSeries.prototype.setZValues = function (zValues, metadata) {
        if (!zValues || !zValues[0]) {
            this.zValuesProperty = undefined;
            this.arrayHeight = 0;
            this.arrayWidth = 0;
            this.size = 0;
            return;
        }
        var firstRowLength = zValues[0].length;
        zValues.forEach(function (zRow) {
            if (!zRow) {
                throw new Error("Each row in zValues must be defined. See how to declare a 2D array in Javascript here https://stackoverflow.com/a/966234/303612");
            }
            if (zRow.length !== firstRowLength) {
                throw new Error("Each row in zValues must be the same length, so that the overall 2D array is square");
            }
        });
        if (metadata) {
            guardSameLengthZValuesAndMetadata(zValues, metadata);
        }
        var w = zValues[0].length;
        var h = zValues.length;
        // const metadata2 = fillMetadata(w, h, metadata);
        this.arrayWidth = w;
        this.arrayHeight = h;
        this.size = w * h;
        this.zValuesProperty = zValues;
        this.setMetadata(metadata);
        this.notifyDataChanged(IDataSeries_1.EDataChangeType.Append);
    };
    /**
     * Gets the ZValue at the specific Y,X index where Y must be within 0-arrayHeight and X must be within 0-arrayWidth
     * @param yIndex the y-index from 0 to arrayHeight
     * @param xIndex the x-index from 0 to arrayWidth
     */
    BaseHeatmapDataSeries.prototype.getZValue = function (yIndex, xIndex) {
        return this.zValuesProperty[yIndex][xIndex];
    };
    /**
     * Sets the ZValue at the specific Y,X index where Y must be within 0-arrayHeight and X must be within 0-arrayWidth
     * @param yIndex the y-index from 0 to arrayHeight
     * @param xIndex the x-index from 0 to arrayWidth
     * @param zValue the new Z-value
     * @param metadata The point metadata
     */
    BaseHeatmapDataSeries.prototype.setZValue = function (yIndex, xIndex, zValue, metadata) {
        this.zValuesProperty[yIndex][xIndex] = zValue;
        this.setMetadataAt(yIndex, xIndex, metadata);
        this.notifyDataChanged(IDataSeries_1.EDataChangeType.Update, xIndex, yIndex);
    };
    /** @inheritDoc */
    BaseHeatmapDataSeries.prototype.clear = function () {
        if (!this.getIsDeleted()) {
            this.setZValues(undefined);
            this.setMetadata(undefined);
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Clear, null, null);
        }
    };
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "xMin", {
        /**
         * Gets the minimum X-value for this heatmap, which controls where it is displayed on a cartesian chart
         */
        get: function () {
            return this.xRange.min;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "xMax", {
        /**
         * Gets the maximum X-value for this heatmap, which controls where it is displayed on a cartesian chart
         */
        get: function () {
            return this.xRange.max;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "yMin", {
        /**
         * Gets the minimum Y-value for this heatmap, which controls where it is displayed on a cartesian chart
         */
        get: function () {
            return this.yRange.min;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "yMax", {
        /**
         * Gets the maximum Y-value for this heatmap, which controls where it is displayed on a cartesian chart
         */
        get: function () {
            return this.yRange.max;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "zMin", {
        /**
         * Computes the minimum Z-value for this heatmap
         * @remarks
         * Be aware for performance reasons, every call to zMin will result in a recalculation
         */
        get: function () {
            return this.zRange.min;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "zMax", {
        /**
         * Computes the maximum Z-value for this heatmap
         * @remarks
         * Be aware for performance reasons, every call to zMax will result in a recalculation
         */
        get: function () {
            return this.zRange.max;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "xRange", {
        /**
         * Gets the XRange for this heatmap, which controls where it is displayed on a cartesian chart
         */
        get: function () {
            return this.getXRange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "yRange", {
        /**
         * Gets the YRange for this heatmap, which controls where it is displayed on a cartesian chart
         */
        get: function () {
            return this.getYRange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "zRange", {
        /**
         * Computes the ZRange for this heatmap, which controls where it is displayed on a cartesian chart
         * @remarks
         * Be aware for performance reasons, every call to zRange will result in a recalculation
         */
        get: function () {
            return this.getZRange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "dataSeriesName", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this.dataSeriesNameProperty;
        },
        /**
         * @inheritDoc
         */
        set: function (dataSeriesName) {
            this.dataSeriesNameProperty = dataSeriesName;
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Property, null, null, "dataSeriesName");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "hasValues", {
        /**
         * Gets whether this Heatmap has values to display
         */
        get: function () {
            return this.arrayWidth > 0 && this.arrayHeight > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "hasNaNs", {
        /**
         * Gets/sets whether this Heatmap has NaN value, to display them as transparent tiles
         */
        get: function () {
            return this.hasNaNsProperty;
        },
        /**
         * Gets/sets whether this Heatmap has NaN value, to display them as transparent tiles
         */
        set: function (value) {
            this.hasNaNsProperty = value;
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Property, null, null, "hasNaNs");
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the number of heatmap cells
     */
    BaseHeatmapDataSeries.prototype.count = function () {
        return this.arrayWidth * this.arrayHeight;
    };
    /**
     * Sets a function that will be used to generate metadata for values when they are appended/inserted, if no explicit metadata is supplied.
     * @param generator
     */
    BaseHeatmapDataSeries.prototype.setMetadataGenerator = function (generator) {
        var shouldGenerate = typeof this.metadataGeneratorProperty === "undefined";
        this.metadataGeneratorProperty = generator;
        if (shouldGenerate) {
            this.setMetadata(null);
        }
    };
    /**
     * @inheritDoc
     */
    BaseHeatmapDataSeries.prototype.delete = function () {
        this.isDeleted = true;
        this.normalizedVector = (0, Deleter_1.deleteSafe)(this.normalizedVector);
    };
    /**
     * @inheritDoc
     */
    BaseHeatmapDataSeries.prototype.getIsDeleted = function () {
        return this.isDeleted;
    };
    /**
     * @inheritDoc
     */
    BaseHeatmapDataSeries.prototype.getNativeIndexes = function () {
        throw new Error("getNativeIndexes is invalid for heatmap type series. Try getting or setting zValues instead");
    };
    /**
     * @inheritDoc
     */
    BaseHeatmapDataSeries.prototype.getNativeXValues = function () {
        throw new Error("getNativeXValues is invalid for heatmap type series. Try getting or setting zValues instead");
    };
    /**
     * @inheritDoc
     */
    BaseHeatmapDataSeries.prototype.getNativeYValues = function () {
        throw new Error("getNativeYValues is invalid for heatmap type series. Try getting or setting zValues instead");
    };
    /**
     * @inheritDoc
     */
    BaseHeatmapDataSeries.prototype.getWindowedYRange = function (xRange, getPositiveRange, isCategoryAxis) {
        return this.yRange;
    };
    /**
     * Notify subscribers to dataChanged that data has changed. Also sets internal flags.
     * This will trigger a redraw on a parent SciChartSurface
     */
    BaseHeatmapDataSeries.prototype.notifyDataChanged = function (changeType, xIndex, yIndex, name) {
        this.changeCountProperty++;
        this.hasDataChangesProperty = true;
        this.dataChanged.raiseEvent({ changeType: changeType, index: xIndex, yIndex: yIndex, name: name });
    };
    /**
     * Returns a FloatVector with normalized values based on the color map passed in
     * @param colorMap the {@link IColorMapParams} provides properties used to map heatmap Z-values into colors
     * for rendering in SciChart's {@link https://www.scichart.com/javascript-chart-features | Realtime JavaScript Charts}
     */
    BaseHeatmapDataSeries.prototype.getNormalizedVector = function (colorMap, fillValuesOutOfRange) {
        Guard_1.Guard.notNull(colorMap, "colorMap");
        Guard_1.Guard.argumentIsRealNumber(colorMap.minimum, "colorMap.minimum");
        Guard_1.Guard.argumentIsRealNumber(colorMap.maximum, "colorMap.maximum");
        var size = this.arrayWidth * this.arrayHeight;
        if (this.hasDataChangesProperty ||
            size !== this.normalizedVector.size() ||
            colorMap.minimum !== this.lastZMin ||
            colorMap.maximum !== this.lastZMax ||
            fillValuesOutOfRange !== this.lastFillValuesOutOfRange) {
            this.recreateNormalizedVector(colorMap.minimum, colorMap.maximum, fillValuesOutOfRange);
            this.lastZMin = colorMap.minimum;
            this.lastZMax = colorMap.maximum;
            this.lastFillValuesOutOfRange = fillValuesOutOfRange;
            this.hasDataChangesProperty = false;
        }
        return this.normalizedVector;
    };
    /**
     * Recreates the normalized vector (internally used for drawing heatmap) according to zMin and zMax values
     * @param zMin
     * @param zMax
     */
    BaseHeatmapDataSeries.prototype.recreateNormalizedVector = function (zMin, zMax, fillValuesOutOfRange) {
        var size = this.arrayWidth * this.arrayHeight;
        this.normalizedVector.clear();
        this.normalizedVector.resizeFast(size);
        // We need to offset newMinValue which is being used for NaN values
        // for the double distance of the texture, which is 256
        var newZMin = this.hasNaNs ? zMin - (zMax - zMin) / 128 : zMin;
        if (!(0, isRealNumber_1.isRealNumber)(newZMin)) {
            throw Error("Can not create newZMin for try to use different zMin and zMax values");
        }
        var index = 0;
        var normalizationFactor = 1.0 / (zMax - newZMin);
        var rowArray = new Float32Array(this.arrayWidth);
        for (var y = 0; y < this.arrayHeight; y++) {
            for (var x = 0; x < this.arrayWidth; x++) {
                // normalized value from 0..1 = (zValue - zMin) / ((zMax - zMin))
                var zValueRaw = this.zValuesProperty[y][x];
                var zValue = zValueRaw - newZMin;
                // if value !== value is a simple but fast isNaN check
                // equivalent to isNaN(zValueRaw)
                if (zValueRaw !== zValueRaw) {
                    zValue = 0;
                }
                else if (zValue < zMin - newZMin) {
                    zValue = fillValuesOutOfRange ? zMin - newZMin : 0;
                }
                else if (zValue > zMax - newZMin) {
                    zValue = fillValuesOutOfRange ? zMax - newZMin : 0;
                }
                var normalizedZValue = zValue * normalizationFactor;
                rowArray[x] = normalizedZValue;
            }
            (0, appendDoubleVectorFromJsArray_1.memCopyFloat32)(this.webAssemblyContext, rowArray, this.normalizedVector, index);
            index += this.arrayWidth;
        }
    };
    /**
     * Gets the metadata by Y and X indexes
     * @param yIndex The Y index
     * @param xIndex The X index
     */
    BaseHeatmapDataSeries.prototype.getMetadataAt = function (yIndex, xIndex) {
        this.validateIndexes(yIndex, xIndex);
        if (!this.metadataProperty) {
            return undefined;
        }
        return this.metadataProperty[yIndex][xIndex];
    };
    /**
     * Gets the metadata matrix height
     */
    BaseHeatmapDataSeries.prototype.getMetadataHeight = function () {
        if (!this.metadataProperty) {
            return this.arrayHeight;
        }
        return this.metadataProperty.length;
    };
    /**
     * Gets the metadata matrix width
     */
    BaseHeatmapDataSeries.prototype.getMetadataWidth = function () {
        if (!this.metadataProperty) {
            return this.arrayWidth;
        }
        return this.metadataProperty[0].length;
    };
    BaseHeatmapDataSeries.prototype.toJSON = function (excludeData) {
        if (excludeData === void 0) { excludeData = false; }
        var options = this.getOptions(excludeData);
        return { type: this.type, options: options };
    };
    /** @inheritDoc */
    BaseHeatmapDataSeries.prototype.getIndicesRange = function (visibleRange, isCategoryData, downSearchMode, upSearchMode) {
        return undefined;
    };
    Object.defineProperty(BaseHeatmapDataSeries.prototype, "changeCount", {
        /** @inheritDoc */
        get: function () {
            return this.changeCountProperty;
        },
        enumerable: false,
        configurable: true
    });
    BaseHeatmapDataSeries.prototype.getOptions = function (excludeData) {
        if (excludeData === void 0) { excludeData = false; }
        var options = {
            id: this.id,
            containsNaN: this.hasNaNs,
            dataSeriesName: this.dataSeriesName,
            zValues: excludeData ? undefined : this.zValuesProperty,
            metadata: this.metadataGeneratorProperty
                ? this.metadataGeneratorProperty.toJSON()
                : excludeData
                    ? undefined
                    : this.metadataProperty
        };
        return options;
    };
    /**
     * Computes the range in the Z-direction for this DataSeries
     * @remarks
     * Be aware for performance reasons, every call to getZRange will result in a recalculation
     * @protected
     */
    BaseHeatmapDataSeries.prototype.getZRange = function () {
        var zValues = this.getZValues();
        if (zValues) {
            var zMin = Number.MAX_VALUE;
            var zMax = -Number.MAX_VALUE;
            for (var y = 0; y < this.arrayHeight; ++y) {
                for (var x = 0; x < this.arrayWidth; x++) {
                    var zValue = zValues[y][x];
                    if (zValue < zMin)
                        zMin = zValue;
                    if (zValue > zMax)
                        zMax = zValue;
                }
            }
            return new NumberRange_1.NumberRange(zMin, zMax);
        }
        return undefined;
    };
    BaseHeatmapDataSeries.prototype.validateIndexes = function (yIndex, xIndex) {
        if (Math.round(yIndex) !== yIndex) {
            throw Error("yIndex must be an integer");
        }
        if (Math.round(xIndex) !== xIndex) {
            throw Error("xIndex must be an integer");
        }
        if (yIndex < 0 || yIndex >= this.arrayHeight) {
            throw new Error("yIndex is out of range");
        }
        if (xIndex < 0 || xIndex >= this.arrayWidth) {
            throw new Error("xIndex is out of range");
        }
    };
    BaseHeatmapDataSeries.prototype.setMetadata = function (metadata) {
        if (!metadata && this.metadataGeneratorProperty) {
            metadata = [];
            for (var h = 0; h < this.arrayHeight; h++) {
                metadata[h] = [];
                for (var w = 0; w < this.arrayWidth; w++) {
                    metadata[h][w] = this.metadataGeneratorProperty.getSingleMetadata();
                }
            }
        }
        this.metadataProperty = metadata;
    };
    BaseHeatmapDataSeries.prototype.setMetadataAt = function (yIndex, xIndex, metadata) {
        if (!metadata) {
            return;
        }
        this.validateIndexes(yIndex, xIndex);
        this.fillMetadataIfUndefined();
        this.metadataProperty[yIndex][xIndex] = metadata;
    };
    BaseHeatmapDataSeries.prototype.fillMetadataIfUndefined = function () {
        if (this.metadataProperty === undefined) {
            var metadata = Array(this.arrayHeight).fill(undefined);
            for (var i = 0; i < this.arrayHeight; i++) {
                metadata[i] = Array(this.arrayWidth).fill(undefined);
            }
        }
    };
    return BaseHeatmapDataSeries;
}());
exports.BaseHeatmapDataSeries = BaseHeatmapDataSeries;
// @ignore
var guardSameLengthZValuesAndMetadata = function (zValues, metadata) {
    Guard_1.Guard.arraysSameLengthArr([
        { arg: zValues, name: "zValues" },
        { arg: metadata, name: "metadata" }
    ]);
    for (var i = 0; i < zValues.length; i++) {
        Guard_1.Guard.arraysSameLengthArr([
            { arg: zValues[i], name: "zValues[".concat(i, "]") },
            { arg: metadata[i], name: "metadata[".concat(i, "]") }
        ]);
    }
};
// @ignore
var fillMetadata = function (width, height, metadata) {
    if (metadata) {
        return metadata;
    }
    var metadata2 = Array(height).fill(undefined);
    for (var i = 0; i < height; i++) {
        metadata2[i] = Array(width).fill(undefined);
    }
    return metadata2;
};
