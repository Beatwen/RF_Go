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
exports.toScrtTextStyle = exports.updateScrtLineStyle = exports.updateScrtAxisDescriptor = exports.AxisCubeEntity = void 0;
var SceneEntityType_1 = require("../../../types/SceneEntityType");
var tsrExtensions_1 = require("../../../utils/tsrExtensions");
var BaseSceneEntity3D_1 = require("../Primitives/BaseSceneEntity3D");
var IAxisDescriptor_1 = require("./IAxisDescriptor");
/**
 * The {@link AxisCubeEntity} is a 3D Scene Entity (inherits {@link BaseSceneEntity3D}) which renders the 3D X,Y,Z axis cube,
 * axis walls and labels in a {@link SciChart3DSurface}
 */
var AxisCubeEntity = /** @class */ (function (_super) {
    __extends(AxisCubeEntity, _super);
    /**
     * Creates an instance of an {@link AxisCubeEntity}
     * @param webAssemblyContext The {@link TSciChart3D | SciChart 3D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     * @param sciChart3DSurface The {@link SciChart3DSurface} associated with the axis cube
     */
    function AxisCubeEntity(webAssemblyContext, sciChart3DSurface) {
        var _this = _super.call(this, webAssemblyContext) || this;
        /**
         * @inheritDoc
         */
        _this.type = SceneEntityType_1.ESceneEntityType.AxisCubeEntity;
        _this.sciChart3DSurface = sciChart3DSurface;
        _this.setNativeEntity(webAssemblyContext.SCRTAxisCubeEntity.implement(_this));
        return _this;
    }
    /**
     * @inheritDoc
     */
    AxisCubeEntity.prototype.Update = function (deltaTime) {
        var _this = this;
        var _a, _b;
        // console.log("update");
        // this gets called from wasm!!
        if (!this.currentRenderPassData) {
            return;
        }
        var scrtAxisCubeEntity = this.nativeEntity;
        var scrtAxisCubeDescriptor = scrtAxisCubeEntity.GetDescriptorPtr();
        scrtAxisCubeDescriptor.m_bZxPlaneVisible = this.sciChart3DSurface.isZXPlaneVisible;
        scrtAxisCubeDescriptor.m_bXyPlaneVisible = this.sciChart3DSurface.isXYPlaneVisible;
        scrtAxisCubeDescriptor.m_bZyPlaneVisible = this.sciChart3DSurface.isZYPlaneVisible;
        var _c = this.currentRenderPassData.sceneDescriptor.axisCubeDescriptor, xAxisDescriptor = _c.xAxisDescriptor, yAxisDescriptor = _c.yAxisDescriptor, zAxisDescriptor = _c.zAxisDescriptor;
        // Check for changes and force recreation of meshes in C++ side
        if (!(0, IAxisDescriptor_1.getDescriptorsEqual)(xAxisDescriptor, this.lastXDescriptor) ||
            !(0, IAxisDescriptor_1.getDescriptorsEqual)(yAxisDescriptor, this.lastYDescriptor) ||
            !(0, IAxisDescriptor_1.getDescriptorsEqual)(zAxisDescriptor, this.lastZDescriptor)) {
            // Destroy meshes to recreate later in SCRTAxisCubeEntity::Update()
            // console.warn("Property changed, destroying meshes");
            scrtAxisCubeEntity.DestroyMeshes();
        }
        this.lastXDescriptor = xAxisDescriptor;
        this.lastYDescriptor = yAxisDescriptor;
        this.lastZDescriptor = zAxisDescriptor;
        // TODO: MEMORY LEAK if we don't delete the SCRTAxisDescriptor
        var xScrtAxisDesc = scrtAxisCubeDescriptor.GetXAxisDescPtr();
        var yScrtAxisDesc = scrtAxisCubeDescriptor.GetYAxisDescPtr();
        var zScrtAxisDesc = scrtAxisCubeDescriptor.GetZAxisDescPtr();
        var descriptorsMapping = [
            [xScrtAxisDesc, xAxisDescriptor],
            [yScrtAxisDesc, yAxisDescriptor],
            [zScrtAxisDesc, zAxisDescriptor]
        ];
        descriptorsMapping.forEach(function (el) { return (0, exports.updateScrtAxisDescriptor)(_this.webAssemblyContext, el[0], el[1]); });
        // The code below is commented due to performance reasons
        // yAxisDescriptor.majorCoordinates.forEach(c => console.log(" .. coord " + c));
        // yAxisDescriptor.tickLabels.forEach(l => console.log(" .. label " + l));
        // scrtAxisCubeEntity.DebugDescriptor();
        _super.prototype.Update.call(this, deltaTime);
        // Redraw after setting up the axis cube
        if (!((_a = this.sciChart3DSurface) === null || _a === void 0 ? void 0 : _a.isAxisCubeRendered)) {
            (_b = this.sciChart3DSurface) === null || _b === void 0 ? void 0 : _b.setIsAxisCubeRendered();
            setTimeout(function () { var _a; return (_a = _this.sciChart3DSurface) === null || _a === void 0 ? void 0 : _a.invalidateElement(); }, 0);
        }
    };
    return AxisCubeEntity;
}(BaseSceneEntity3D_1.BaseSceneEntity3D));
exports.AxisCubeEntity = AxisCubeEntity;
/** @ignore */
var updateScrtAxisDescriptor = function (wasmContext, scrtAxisDesc, axisDesc) {
    var _a;
    scrtAxisDesc.m_strTitle = (_a = axisDesc.axisTitle) !== null && _a !== void 0 ? _a : "";
    scrtAxisDesc.m_fRangeSize = axisDesc.axisSize;
    scrtAxisDesc.m_fTitleOffset = axisDesc.titleOffset;
    scrtAxisDesc.m_fTextOffset = axisDesc.tickLabelsOffset;
    scrtAxisDesc.m_bBandsEnabled = axisDesc.drawBands;
    scrtAxisDesc.m_bLabelsEnabled = axisDesc.drawLabels;
    scrtAxisDesc.m_bMajorLinesEnabled = axisDesc.drawMajorGridlines;
    scrtAxisDesc.m_bMajorTicksEnabled = axisDesc.drawMajorTicks;
    scrtAxisDesc.m_bMinorLinesEnabled = axisDesc.drawMinorGridlines;
    scrtAxisDesc.m_bMinorTicksEnabled = axisDesc.drawMinorTicks;
    scrtAxisDesc.m_fBorderThickness = axisDesc.borderThickness;
    (0, tsrExtensions_1.updateTsrVector4)(axisDesc.borderColor, scrtAxisDesc.GetBorderColorPtr());
    (0, tsrExtensions_1.updateTsrVector4)(axisDesc.backgroundColor, scrtAxisDesc.GetBackgroundColorPtr());
    (0, tsrExtensions_1.updateTsrVector4)(axisDesc.bandColor, scrtAxisDesc.GetBandColorPtr());
    (0, exports.updateScrtLineStyle)(axisDesc.majorLineStyle, scrtAxisDesc.GetMajorLineStylePtr());
    (0, exports.updateScrtLineStyle)(axisDesc.minorLineStyle, scrtAxisDesc.GetMinorLineStylePtr());
    (0, exports.toScrtTextStyle)(axisDesc.labelStyle, scrtAxisDesc.GetTextStylePtr());
    (0, exports.toScrtTextStyle)(axisDesc.titleStyle, scrtAxisDesc.GetTitleTextStylePtr());
    (0, exports.updateScrtLineStyle)(axisDesc.majorTickStyle, scrtAxisDesc.GetMajorTickStylePtr());
    (0, exports.updateScrtLineStyle)(axisDesc.minorTickStyle, scrtAxisDesc.GetMinorTickStylePtr());
    // toScrtTextStyle(axisDesc.titleStyle, scrtAxisDesc.GetTitleStylePtr());
    // console.log("majorCoordinates", axisDesc.majorCoordinates);
    // console.log("minorCoordinates", axisDesc.minorCoordinates);
    // console.log("tickLabels", axisDesc.tickLabels);
    var majors = new wasmContext.FloatVector();
    axisDesc.majorCoordinates.forEach(function (el) { return majors.push_back(el); });
    scrtAxisDesc.SetMajors(majors);
    majors.delete();
    var minors = new wasmContext.FloatVector();
    axisDesc.minorCoordinates.forEach(function (el) { return minors.push_back(el); });
    scrtAxisDesc.SetMinors(minors);
    minors.delete();
    var majorLabels = new wasmContext.WStringVector();
    axisDesc.tickLabels.forEach(function (el) { return majorLabels.push_back(el); });
    scrtAxisDesc.SetMajorLabels(majorLabels);
    majorLabels.delete();
};
exports.updateScrtAxisDescriptor = updateScrtAxisDescriptor;
/** @ignore */
var updateScrtLineStyle = function (lineStyle, scrtLineStyle) {
    scrtLineStyle.m_fStrokeThickness = lineStyle.strokeThickness;
    scrtLineStyle.m_fStart = lineStyle.start;
    scrtLineStyle.m_fEnd = lineStyle.end;
    (0, tsrExtensions_1.updateTsrVector4)(lineStyle.stroke, scrtLineStyle.GetStrokeColorPtr());
};
exports.updateScrtLineStyle = updateScrtLineStyle;
/** @ignore */
var toScrtTextStyle = function (labelStyle, scrtTextStyle) {
    scrtTextStyle.m_fSize = labelStyle.fontSize;
    scrtTextStyle.m_strFont = labelStyle.fontFamily;
    scrtTextStyle.m_uiARGBColor = labelStyle.foreground;
    scrtTextStyle.m_fDpiScaling = labelStyle.dpiScaling;
    if (labelStyle.alignment) {
        scrtTextStyle.SetAlignment(labelStyle.alignment);
    }
    return scrtTextStyle;
};
exports.toScrtTextStyle = toScrtTextStyle;
