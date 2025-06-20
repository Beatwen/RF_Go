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
exports.layoutLabelsHelper = exports.AxisRenderer = void 0;
var app_1 = require("../../../constants/app");
var DeletableEntity_1 = require("../../../Core/DeletableEntity");
var Deleter_1 = require("../../../Core/Deleter");
var Rect_1 = require("../../../Core/Rect");
var Thickness_1 = require("../../../Core/Thickness");
var AxisAlignment_1 = require("../../../types/AxisAlignment");
var LabelAlignment_1 = require("../../../types/LabelAlignment");
var logger_1 = require("../../../utils/logger");
var parseColor_1 = require("../../../utils/parseColor");
var WebGlRenderContext2D_1 = require("../../Drawing/WebGlRenderContext2D");
var createNativeRect_1 = require("../Helpers/createNativeRect");
var NativeObject_1 = require("../Helpers/NativeObject");
var SciChartSurfaceBase_1 = require("../SciChartSurfaceBase");
var DpiHelper_1 = require("../TextureManager/DpiHelper");
var TextureManager_1 = require("../TextureManager/TextureManager");
/**
 * Draws an axis using our WebGL Rendering engine
 */
var AxisRenderer = /** @class */ (function (_super) {
    __extends(AxisRenderer, _super);
    /**
     * Creates an instance of a {@link AxisRenderer}
     * @param webAssemblyContext The {@link TSciChart | SciChart 2D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     */
    function AxisRenderer(webAssemblyContext) {
        var _this = _super.call(this) || this;
        /**
         * The viewRect of the axis for ticks and labels.  Does not include the axis Title.
         */
        _this.viewRect = Rect_1.Rect.createZero();
        _this.drawDebug = false;
        _this.desiredLabelsSize = 0;
        _this.desiredTicksSize = 0;
        _this.desiredHeightProperty = 0;
        _this.desiredWidthProperty = 0;
        _this.axisThicknessProperty = 0;
        _this.keepLabelsWithinAxisProperty = true;
        _this.hideOverlappingLabelsProperty = true;
        _this.webAssemblyContext = webAssemblyContext;
        _this.textureManager = new TextureManager_1.TextureManager(webAssemblyContext);
        if (!app_1.IS_TEST_ENV) {
            _this.measureTextCanvas = document.createElement("canvas");
            _this.measureTextCanvas.width = 1;
            _this.measureTextCanvas.height = 1;
        }
        return _this;
    }
    /** @inheritDoc */
    AxisRenderer.prototype.delete = function () {
        this.webAssemblyContext = undefined;
        this.measureTextCanvas = undefined;
        this.parentAxis = undefined;
        this.textureManager = (0, Deleter_1.deleteSafe)(this.textureManager);
    };
    /**
     * Called when the {@link AxisRenderer} is attached to an {@link AxisBase2D | Axis}
     * @param axis The Axis we are attached to.
     */
    AxisRenderer.prototype.attachedToAxis = function (axis) {
        this.parentAxis = axis;
    };
    /**
     * Called internally - measures the axis label area as part of the layout phase
     */
    AxisRenderer.prototype.measure = function (isHorizontalAxis, labelStyle, majorTickLabels, ticksSize, labelProvider, drawLabels, drawTicks) {
        if (SciChartSurfaceBase_1.DebugForDpi) {
            console.log("AxisRenderer.measure. fontSize: ".concat(labelStyle.fontSize));
        }
        this.desiredLabelsSize = drawLabels
            ? this.calcDesiredLabelsSize(isHorizontalAxis, labelProvider, labelStyle, majorTickLabels)
            : 0;
        this.desiredTicksSize = drawTicks ? ticksSize : 0;
        var desiredLabelsSize = Math.max(this.desiredLabelsSize, this.axisThicknessProperty * DpiHelper_1.DpiHelper.PIXEL_RATIO);
        var desiredSize = desiredLabelsSize + this.desiredTicksSize;
        if (isHorizontalAxis) {
            this.desiredHeightProperty = desiredSize;
        }
        else {
            this.desiredWidthProperty = desiredSize;
        }
    };
    /**
     * Called internally - calculates desired labels size
     */
    AxisRenderer.prototype.calcDesiredLabelsSize = function (isHorizontalAxis, labelProvider, labelStyle, majorTickLabels) {
        if (app_1.IS_TEST_ENV)
            return 0;
        var desiredLabelsSize;
        var ctx = this.measureTextCanvas.getContext("2d");
        if (isHorizontalAxis) {
            desiredLabelsSize = labelProvider.getMaxLabelHeightForHorizontalAxis(majorTickLabels, ctx, labelStyle);
        }
        else {
            desiredLabelsSize = labelProvider.getMaxLabelWidthForVerticalAxis(majorTickLabels, ctx, labelStyle);
        }
        // uncomment this line to get desiredLabelsSize to use in unit tests
        // console.log("calcDesiredLabelsSize", this.parentAxis.isXAxis ? "xAxis" : "yAxis", desiredLabelsSize);
        return desiredLabelsSize;
    };
    Object.defineProperty(AxisRenderer.prototype, "desiredHeight", {
        /**
         * Called internally - Gets or sets desired height during the layout process
         */
        get: function () {
            return this.desiredHeightProperty;
        },
        set: function (height) {
            this.desiredHeightProperty = height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "desiredWidth", {
        /**
         * Called internally - Gets or sets desired width during the layout process
         */
        get: function () {
            return this.desiredWidthProperty;
        },
        set: function (width) {
            this.desiredWidthProperty = width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "keepLabelsWithinAxis", {
        /**
         * Gets or sets keepLabelsWithinAxis property.
         * When true (default), first and last labels will be shifted to stay within axis bounds.
         * If set to false, these labels will stay aligned to their ticks
         */
        get: function () {
            return this.keepLabelsWithinAxisProperty;
        },
        set: function (value) {
            this.keepLabelsWithinAxisProperty = value;
            this.invalidateParent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "hideOverlappingLabels", {
        /**
         * Gets or sets hideOverlappingLabels property.
         * Default (true) is to not show labels that would overlap. When using rotation you may want to set this false,
         * as the bounding box of rotated text may overlap even if the text itself does not.
         */
        get: function () {
            return this.hideOverlappingLabelsProperty;
        },
        set: function (value) {
            this.hideOverlappingLabelsProperty = value;
            this.invalidateParent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "axisThickness", {
        /**
         * Gets or sets axis label area thickness, by default the size is calculated to have enough space for labels.
         * However, this property allows to set minimal width/height for vertical/horizontal axes.
         * Useful to align seriesViewRects for different charts
         */
        get: function () {
            return this.axisThicknessProperty;
        },
        set: function (value) {
            this.axisThicknessProperty = value;
            this.invalidateParent();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Called internally as a part of the layout process
     */
    AxisRenderer.prototype.layout = function (rect) {
        this.viewRect = rect;
        // Not much we can do here as we don't have access to tick coordinates yet
    };
    /**
     * Called internally - draws labels
     */
    AxisRenderer.prototype.drawLabels = function (renderContext, axisAlignment, isInnerAxis, tickLabels, tickCoords, axisOffset, labelStyle, isVerticalChart, isFlippedCoordinates, labelProvider) {
        if (SciChartSurfaceBase_1.DebugForDpi) {
            console.log("AxisRenderer.drawLabels. fontSize: ".concat(labelStyle.fontSize));
        }
        var _a = this, viewRect = _a.viewRect, textureManager = _a.textureManager;
        var nativeContext = renderContext.getNativeContext();
        var isAxisFlipped = isVerticalChart ? (0, AxisAlignment_1.getIsHorizontal)(axisAlignment) : (0, AxisAlignment_1.getIsVertical)(axisAlignment);
        var width = Math.floor(viewRect.width);
        var height = Math.floor(viewRect.height);
        var tickSize = this.desiredTicksSize;
        var ctx;
        var padding = labelStyle.padding, alignment = labelStyle.alignment;
        if (isAxisFlipped) {
            tickCoords = tickCoords.reverse();
            tickLabels = tickLabels.reverse();
        }
        // for debug
        var labelRects = [];
        var textColor = (0, parseColor_1.parseColorToUIntArgb)(labelStyle.color);
        var nativeFont = labelProvider.useNativeText
            ? renderContext.getFont(labelStyle, labelProvider.rotation !== 0)
            : null;
        var textBounds = labelProvider.useNativeText ? (0, NativeObject_1.getTextBounds)(this.webAssemblyContext) : null;
        if (!nativeFont) {
            // The clearRect in here is slow.
            ctx = textureManager.getTextureContext(width, height);
        }
        var adjRotation = labelProvider.rotation;
        if (adjRotation > 90)
            adjRotation -= 180;
        else if (adjRotation < -90)
            adjRotation += 180;
        var rotationRad = -(adjRotation * Math.PI) / 180;
        tickCoords = tickCoords.map(function (t) { return t - axisOffset; });
        var multiLineAlignment = convertMultiLineAlignment(alignment, this.webAssemblyContext);
        var nativeLineSpacing = labelProvider.lineSpacing;
        var lineHeight = 0;
        if (nativeFont) {
            nativeFont.CalculateStringBounds("Ag", textBounds, 0);
            lineHeight = textBounds.GetLineBounds(0).m_fHeight;
        }
        if ((0, AxisAlignment_1.getIsHorizontal)(axisAlignment)) {
            var labelHeights = [];
            var labelWidths = [];
            if (!labelProvider.useCache && labelProvider.useNativeText) {
                for (var _i = 0, tickLabels_1 = tickLabels; _i < tickLabels_1.length; _i++) {
                    var label = tickLabels_1[_i];
                    nativeFont.CalculateStringBounds(label !== null && label !== void 0 ? label : "", textBounds, 2);
                    labelHeights.push(textBounds.m_fHeight + labelStyle.padding.top + labelStyle.padding.bottom);
                    labelWidths.push(textBounds.m_fWidth + labelStyle.padding.left + labelStyle.padding.right);
                }
            }
            else {
                labelHeights = tickLabels.map(function (label) { return labelProvider.getLabelHeight(ctx, label, labelStyle); });
                labelWidths = tickLabels.map(function (label) { return labelProvider.getLabelWidth(ctx, label, labelStyle); });
            }
            var _b = this.layoutLabels(width, tickCoords, labelWidths, isFlippedCoordinates, padding === null || padding === void 0 ? void 0 : padding.top, padding === null || padding === void 0 ? void 0 : padding.bottom), labelCoords = _b.labelCoords, labelIndexes = _b.labelIndexes;
            for (var index = 0; index < labelIndexes.length; index++) {
                var xCoord = labelCoords[index];
                var labelText = tickLabels[labelIndexes[index]];
                var labelHeight = labelHeights[labelIndexes[index]];
                var yCoord = 0;
                // Always align to the axis for horizontal
                if ((axisAlignment === AxisAlignment_1.EAxisAlignment.Bottom && !isInnerAxis) ||
                    (axisAlignment === AxisAlignment_1.EAxisAlignment.Top && isInnerAxis)) {
                    yCoord += tickSize;
                }
                else {
                    yCoord += height - labelHeight - tickSize;
                }
                if (this.drawDebug) {
                    labelRects.push(Rect_1.Rect.create(xCoord, yCoord, labelWidths[labelIndexes[index]], labelHeight));
                }
                try {
                    if (nativeFont) {
                        var tx = xCoord + viewRect.left + padding.left;
                        var ty = yCoord + viewRect.top + lineHeight + padding.top;
                        var rx = tx;
                        var ry = ty - lineHeight;
                        if (rotationRad !== 0) {
                            var _c = labelProvider.getNativeLabelInfo(labelText), textWidth = _c.textWidth, textHeight = _c.textHeight;
                            tx =
                                tickCoords[labelIndexes[index]] +
                                    viewRect.left -
                                    (textHeight * Math.sin(rotationRad)) / 2;
                            rx = tx;
                            if (rotationRad > 0) {
                                // rotating up
                                tx -= textWidth;
                            }
                        }
                        nativeFont.DrawStringAdvanced(labelText !== null && labelText !== void 0 ? labelText : "", textColor, Math.round(tx), Math.round(ty), (0, NativeObject_1.getVector4)(this.webAssemblyContext, rx, ry, rotationRad, 0), multiLineAlignment, nativeLineSpacing);
                    }
                    else {
                        var _d = labelProvider.getCachedLabelTexture(labelText, textureManager, labelStyle), bitmapTexture = _d.bitmapTexture, textureHeight = _d.textureHeight, textureWidth = _d.textureWidth;
                        if (bitmapTexture) {
                            nativeContext.DrawTexture(bitmapTexture, Math.round(xCoord + viewRect.left), Math.round(yCoord + viewRect.top), textureWidth, textureHeight);
                            if (!labelProvider.useCache) {
                                bitmapTexture.delete();
                            }
                        }
                    }
                }
                catch (err) {
                    logger_1.Logger.debug(err);
                    // webgl context probably lost.  Clear the label cache
                    labelProvider.delete();
                }
            }
        }
        else {
            var labelHeights = [];
            var labelWidths = [];
            if (!labelProvider.useCache && labelProvider.useNativeText) {
                for (var _e = 0, tickLabels_2 = tickLabels; _e < tickLabels_2.length; _e++) {
                    var label = tickLabels_2[_e];
                    nativeFont.CalculateStringBounds(label !== null && label !== void 0 ? label : "", textBounds, 2);
                    labelHeights.push(textBounds.m_fHeight + labelStyle.padding.top + labelStyle.padding.bottom);
                    labelWidths.push(textBounds.m_fWidth + labelStyle.padding.left + labelStyle.padding.right);
                }
            }
            else {
                labelHeights = tickLabels.map(function (label) { return labelProvider.getLabelHeight(ctx, label, labelStyle); });
                labelWidths = tickLabels.map(function (label) { return labelProvider.getLabelWidth(ctx, label, labelStyle); });
            }
            var _f = this.layoutLabels(height, tickCoords, labelHeights, isFlippedCoordinates, padding === null || padding === void 0 ? void 0 : padding.left, padding === null || padding === void 0 ? void 0 : padding.right), labelCoords = _f.labelCoords, labelIndexes = _f.labelIndexes;
            for (var index = 0; index < labelIndexes.length; index++) {
                var xCoord = 0;
                var labelText = tickLabels[labelIndexes[index]];
                var labelWidth = labelWidths[labelIndexes[index]];
                xCoord = this.adjustForLabelAlignment(xCoord, labelWidth, alignment, axisAlignment, isInnerAxis, width, tickSize);
                var yCoord = labelCoords[index];
                if (this.drawDebug) {
                    labelRects.push(Rect_1.Rect.create(xCoord, yCoord, labelWidth, labelHeights[labelIndexes[index]]));
                }
                try {
                    if (nativeFont) {
                        var tx = xCoord + viewRect.left + padding.left;
                        var ty = yCoord + viewRect.top + lineHeight + padding.top;
                        nativeFont.DrawStringAdvanced(labelText !== null && labelText !== void 0 ? labelText : "", textColor, Math.round(tx), Math.round(ty), (0, NativeObject_1.getVector4)(this.webAssemblyContext, tx, ty, rotationRad, 0), multiLineAlignment, nativeLineSpacing);
                    }
                    else {
                        var _g = labelProvider.getCachedLabelTexture(labelText, textureManager, labelStyle), bitmapTexture = _g.bitmapTexture, textureHeight = _g.textureHeight, textureWidth = _g.textureWidth;
                        if (bitmapTexture) {
                            nativeContext.DrawTexture(bitmapTexture, Math.round(xCoord + viewRect.left), Math.round(yCoord + viewRect.top), textureWidth, textureHeight);
                            if (!labelProvider.useCache) {
                                bitmapTexture.delete();
                            }
                        }
                    }
                }
                catch (err) {
                    logger_1.Logger.debug(err);
                    // webgl context probably lost.  Clear the label cache
                    labelProvider.delete();
                }
            }
        }
        if (this.drawDebug) {
            this.drawLabelViewRects(renderContext, viewRect, labelRects);
        }
    };
    /**
     * Called internally - adjusts labels for label alignment
     */
    AxisRenderer.prototype.adjustForLabelAlignment = function (xCoord, labelWidth, labelAlignment, axisAlignment, isInnerAxis, axisWidth, tickSize) {
        var adj = axisWidth - tickSize - labelWidth;
        if ((axisAlignment === AxisAlignment_1.EAxisAlignment.Left && !isInnerAxis) ||
            (axisAlignment === AxisAlignment_1.EAxisAlignment.Right && isInnerAxis)) {
            if (labelAlignment === LabelAlignment_1.ELabelAlignment.Right || labelAlignment === LabelAlignment_1.ELabelAlignment.Auto) {
                xCoord += adj;
            }
            else if (labelAlignment === LabelAlignment_1.ELabelAlignment.Center) {
                xCoord += adj / 2;
            }
        }
        else {
            if (labelAlignment === LabelAlignment_1.ELabelAlignment.Left || labelAlignment === LabelAlignment_1.ELabelAlignment.Auto) {
                xCoord += tickSize;
            }
            else if (labelAlignment === LabelAlignment_1.ELabelAlignment.Center) {
                xCoord += tickSize + adj / 2;
            }
            else {
                xCoord += axisWidth - labelWidth;
            }
        }
        return xCoord;
    };
    /**
     * Called internally
     */
    AxisRenderer.prototype.layoutLabels = function (size, tickCoords, labelSizes, isFlippedCoordinates, padBefore, padAfter) {
        return (0, exports.layoutLabelsHelper)(this.keepLabelsWithinAxis, this.hideOverlappingLabels, size, tickCoords, labelSizes, isFlippedCoordinates);
    };
    /**
     * Called internally
     */
    AxisRenderer.prototype.drawTicks = function (renderContext, axisAlignment, isInnerAxis, tickCoords, axisOffset, pen, tickStyle) {
        var _this = this;
        if (!tickCoords || tickCoords.length === 0)
            return;
        var viewRect = this.viewRect;
        var tickSize = tickStyle.tickSize;
        var vertices = (0, NativeObject_1.getVectorColorVertex)(this.webAssemblyContext);
        vertices.clear();
        var isHorizontal = (0, AxisAlignment_1.getIsHorizontal)(axisAlignment);
        if (isHorizontal === undefined) {
            return;
        }
        tickCoords.forEach(function (tc) {
            var x1, x2, y1, y2;
            if (isInnerAxis) {
                if (isHorizontal) {
                    x1 = tc;
                    x2 = tc;
                    y1 = axisAlignment === AxisAlignment_1.EAxisAlignment.Top ? 0 : viewRect.height;
                    y2 = axisAlignment === AxisAlignment_1.EAxisAlignment.Top ? tickSize : viewRect.height - tickSize;
                }
                else {
                    x1 = axisAlignment === AxisAlignment_1.EAxisAlignment.Left ? 0 : viewRect.width;
                    x2 = axisAlignment === AxisAlignment_1.EAxisAlignment.Left ? tickSize : viewRect.width - tickSize;
                    y1 = tc;
                    y2 = tc;
                }
            }
            else {
                if (isHorizontal) {
                    x1 = tc;
                    x2 = tc;
                    y1 = axisAlignment === AxisAlignment_1.EAxisAlignment.Bottom ? 0 : viewRect.height;
                    y2 = axisAlignment === AxisAlignment_1.EAxisAlignment.Bottom ? tickSize : viewRect.height - tickSize;
                }
                else {
                    x1 = axisAlignment === AxisAlignment_1.EAxisAlignment.Right ? 0 : viewRect.width;
                    x2 = axisAlignment === AxisAlignment_1.EAxisAlignment.Right ? tickSize : viewRect.width - tickSize;
                    y1 = tc;
                    y2 = tc;
                }
            }
            var vertex = (0, NativeObject_1.getVertex)(_this.webAssemblyContext, x1, y1);
            vertices.push_back(vertex);
            var vertex2 = (0, NativeObject_1.getVertex)(_this.webAssemblyContext, x2, y2);
            vertices.push_back(vertex2);
        });
        var leftOffset = viewRect.left - (isHorizontal ? axisOffset : 0);
        var topOffset = viewRect.top - (isHorizontal ? 0 : axisOffset);
        renderContext.drawLinesNative(vertices, pen, WebGlRenderContext2D_1.ELineDrawMode.DiscontinuousLine, leftOffset, topOffset);
    };
    /**
     * Called internally - draws axis labels when needed, for example for line annotations
     */
    AxisRenderer.prototype.drawModifiersAxisLabel = function (renderContext, displayValue, coord, axisAlignment, textStyle, fill) {
        if (!displayValue)
            return undefined;
        var nativeContext = renderContext.getNativeContext();
        var _a = this.textureManager.createSimpleTextTexture(displayValue, __assign(__assign({}, textStyle), { padding: new Thickness_1.Thickness(2, 2, 2, 2) }), fill), bitmapTexture = _a.bitmapTexture, textureHeight = _a.textureHeight, textureWidth = _a.textureWidth;
        var canvas = {
            height: this.parentAxis.parentSurface.domCanvas2D.height,
            width: this.parentAxis.parentSurface.domCanvas2D.width
        };
        var getPosition = function (viewRectSize, coord, canvasSize, textureSize$) {
            if (viewRectSize + coord < textureSize$ / 2) {
                return 0;
            }
            else if (viewRectSize + coord > canvasSize - textureSize$ / 2) {
                return canvasSize - textureSize$;
            }
            else {
                return viewRectSize + coord - textureSize$ / 2;
            }
        };
        var offset = this.parentAxis.offset;
        var xPosition, yPosition;
        if (axisAlignment === AxisAlignment_1.EAxisAlignment.Bottom) {
            xPosition = getPosition(this.viewRect.x - offset, coord, canvas.width, textureWidth);
            yPosition = this.viewRect.y;
            if (canvas.height - yPosition < textureHeight) {
                yPosition = canvas.height - textureHeight;
            }
        }
        else if (axisAlignment === AxisAlignment_1.EAxisAlignment.Top) {
            xPosition = getPosition(this.viewRect.x - offset, coord, canvas.width, textureWidth);
            yPosition = this.viewRect.y + this.viewRect.height - textureHeight;
            if (this.parentAxis.axisLayoutState.axisSize - this.viewRect.y < textureHeight) {
                yPosition = 0;
            }
        }
        else if (axisAlignment === AxisAlignment_1.EAxisAlignment.Left) {
            xPosition = this.viewRect.x + this.viewRect.width - textureWidth;
            yPosition = getPosition(this.viewRect.y - offset, coord, canvas.height, textureHeight);
            if (this.parentAxis.axisLayoutState.axisSize + this.viewRect.x < textureWidth) {
                xPosition = 0;
            }
        }
        else if (axisAlignment === AxisAlignment_1.EAxisAlignment.Right) {
            xPosition = this.viewRect.x;
            yPosition = getPosition(this.viewRect.y - offset, coord, canvas.height, textureHeight);
            if (canvas.width - xPosition < textureWidth) {
                xPosition = canvas.width - textureWidth;
            }
        }
        nativeContext.DrawTexture(bitmapTexture, Math.round(xPosition), Math.round(yPosition), textureWidth, textureHeight);
        bitmapTexture.delete();
        return new Rect_1.Rect(xPosition, yPosition, textureWidth, textureHeight);
    };
    /**
     * Called internally - used for {@link AxisMarkerAnnotation}
     */
    AxisRenderer.prototype.createAxisMarker = function (axisAlignment, text, textStyle, backgroundColor, opacity) {
        var fontStyle = textStyle.fontStyle, fontWeight = textStyle.fontWeight, fontSize = textStyle.fontSize, fontFamily = textStyle.fontFamily, color = textStyle.color;
        return this.textureManager.createAxisMarkerTexture(axisAlignment, text, fontStyle, fontWeight, fontSize, fontFamily, color, 2 * DpiHelper_1.DpiHelper.PIXEL_RATIO, backgroundColor, opacity);
    };
    /**
     * Called internally - used for custom {@link AxisMarkerAnnotation}
     */
    AxisRenderer.prototype.createAxisMarkerFromImage = function (image, imageWidth, imageHeight) {
        return this.textureManager.createTextureFromImage(image, imageWidth, imageHeight);
    };
    /**
     * Called internally
     */
    AxisRenderer.prototype.createAnnotationLabelTexture = function (text, textStyle, backgroundColor, displayVertically, displayMirrored, opacity) {
        return this.textureManager.createSimpleTextTexture(text, textStyle, backgroundColor, displayVertically, displayMirrored, opacity);
    };
    AxisRenderer.prototype.invalidateParent = function () {
        if (this.parentAxis && this.parentAxis.invalidateParentCallback) {
            this.parentAxis.invalidateParentCallback();
        }
    };
    AxisRenderer.prototype.drawLabelViewRects = function (renderContext, axisRect, rects) {
        var vecRects = (0, NativeObject_1.getVectorRectVertex)(this.webAssemblyContext);
        var brush = new this.webAssemblyContext.SCRTSolidBrush((0, parseColor_1.parseColorToUIntArgb)("rgba(30,30,255,0.3)"), false);
        for (var _i = 0, rects_1 = rects; _i < rects_1.length; _i++) {
            var rect = rects_1[_i];
            var nativeRect = (0, createNativeRect_1.createNativeRect)(this.webAssemblyContext, rect.left, rect.top, rect.right, rect.bottom);
            vecRects.push_back(nativeRect);
        }
        renderContext.drawRects(vecRects, brush, axisRect.left, axisRect.top);
        brush.delete();
    };
    return AxisRenderer;
}(DeletableEntity_1.DeletableEntity));
exports.AxisRenderer = AxisRenderer;
/** @ignore */
var layoutLabelsHelper = function (keepLabelsWithinAxis, hideOverlappingLabels, size, tickCoords, labelSizes, isFlippedCoordinates) {
    var labelSpacing = 0;
    var labelCoords = [];
    var labelIndexes = [];
    var length = labelSizes.length;
    var getTickCoord = function (i) { return (isFlippedCoordinates ? tickCoords[length - 1 - i] : tickCoords[i]); };
    var getlabelSize = function (i) { return (isFlippedCoordinates ? labelSizes[length - 1 - i] : labelSizes[i]); };
    var pushLabelIndex = function (i) {
        return isFlippedCoordinates ? labelIndexes.push(length - 1 - i) : labelIndexes.push(i);
    };
    var lastLabelEnd = 0;
    for (var tickIndex = 0; tickIndex < length; tickIndex++) {
        var isFirstTick = tickIndex === 0;
        var isLastTick = tickIndex === length - 1;
        var labelSize = getlabelSize(tickIndex);
        var centerDelta = Math.ceil(labelSize / 2);
        var coord = getTickCoord(tickIndex);
        var labelEnd = 0;
        if (keepLabelsWithinAxis && isFirstTick) {
            if (coord > centerDelta) {
                labelEnd = coord + centerDelta;
                coord = coord - centerDelta;
            }
            else {
                coord = 0;
                labelEnd = coord + labelSize;
            }
            var nextCoord = getTickCoord(1);
            var nextCenterDelta = getlabelSize(1) / 2;
            if (hideOverlappingLabels) {
                // Skip first if it would overlap with next
                if (labelEnd >= nextCoord - nextCenterDelta - labelSpacing) {
                    continue;
                }
            }
        }
        else if (keepLabelsWithinAxis && isLastTick) {
            coord = coord + centerDelta < size ? coord - centerDelta : size - labelSize;
        }
        else {
            labelEnd = coord + centerDelta;
            coord -= centerDelta;
        }
        if (hideOverlappingLabels) {
            // If this label will overlap the previous, skip it.
            if (tickIndex > 0 && coord < lastLabelEnd + labelSpacing) {
                continue;
            }
        }
        lastLabelEnd = labelEnd;
        labelCoords.push(coord);
        pushLabelIndex(tickIndex);
    }
    return { labelCoords: labelCoords, labelIndexes: labelIndexes };
};
exports.layoutLabelsHelper = layoutLabelsHelper;
var convertMultiLineAlignment = function (multiLineAlignment, webAssemblyContext) {
    var alignMode = webAssemblyContext.eTSRTextAlignMode.Left;
    switch (multiLineAlignment) {
        case LabelAlignment_1.ELabelAlignment.Left:
            alignMode = webAssemblyContext.eTSRTextAlignMode.Left;
            break;
        case LabelAlignment_1.ELabelAlignment.Right:
            alignMode = webAssemblyContext.eTSRTextAlignMode.Right;
            break;
        case LabelAlignment_1.ELabelAlignment.Center:
            alignMode = webAssemblyContext.eTSRTextAlignMode.Center;
            break;
        default:
            alignMode = webAssemblyContext.eTSRTextAlignMode.Left;
            break;
    }
    return alignMode;
};
