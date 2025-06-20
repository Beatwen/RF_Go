export declare type TSciChart3D = {
    canvas: HTMLCanvasElement;
    canvas2D: HTMLCanvasElement;
    SCRTFillTextureFloat32: (texture: TSRTexture, width: number, height: number, pixels: SCRTFloatVector) => TSRVector4;
    SCRTDoLeakCheck: () => void;
    SCRT3DSetClearColor: (reg: number, green: number, blue: number, alpha: number) => void;
    SCRTCreateBitmapTexture: (width: number, height: number, textureFormat: eTSRTextureFormat) => TSRTexture;
    SCRTFillTextureAbgr: (texture: TSRTexture, width: number, height: number, pixels: IntVector) => void;
    TSRRequestExit: () => void;
    TSRRequestDraw: () => void;
    TSRRequestCanvasDraw: (canvasID: string) => void;
    TSRSetDrawRequestsEnabled: (enabled: boolean) => void;
    SCRT3DGetScreenWidth: () => number;
    SCRT3DGetScreenHeight: () => number;
    SCRTSetActiveWorld: (scrtSceneWorld: SCRTSceneWorld) => void;
    SCRTSetMainWindowSize: (width: number, height: number) => void;
    SCRTGetTemplateMesh: (meshId: eSCRTMesh) => TSRIndexedMesh;
    SCRTGetTemplateTexture: (textureId: eSCRTTexture) => TSRTexture;
    SCRTGetSelectionInfo: (xCoord: number, yCoord: number) => SCRTSelectionInfo;
    SCRTSetIsSelectionBufferEnabled: (isEnabled: boolean) => void;
    SCRTGetIsSelectionBufferEnabled: () => boolean;
    SCRT3DSetWaterMarkProperties: (properties: SCRTWaterMarkProperties) => void;
    SCRTSetGlobalSampleChartInterface: (param0: SCRTSampleChartInterface) => void;
    SCRTGetGlobalSampleChartInterface: () => SCRTSampleChartInterface;
    SCRTSetGlobalCopyToDestinationInterface: (param0: SCRTCopyToDestinationInterface) => void;
    SCRTSetClearAlphaParams: (enabled: boolean, alpha: number) => void;
    SCRTRegisterFile: (fileName: string, url: string, callback: SCRTFileLoadCallbackInterface) => void;
    TSRVector4: (new () => TSRVector4) & (new (x: number, y: number, z: number, w: number) => TSRVector4);
    IntVector: new () => IntVector;
    UIntVector: new () => UIntVector;
    SCRTFloatVector: new () => SCRTFloatVector;
    FloatVector: new () => FloatVector;
    SCRTDoubleVector: new () => SCRTDoubleVector;
    DoubleVector: new () => DoubleVector;
    eTSRTextureFormat: {
        TSR_TEXTUREFORMAT_A8B8G8R8: eTSRTextureFormat;
        TSR_TEXTUREFORMAT_R32F: eTSRTextureFormat;
    };
    StringVector: new () => StringVector;
    LinearCoordinateCalculatorDouble: new (ViewportDimension: number, VisibleMin: number, VisibleMax: number, ViewportOffset: number, CoordOffset: number) => LinearCoordinateCalculatorDouble;
    FlippedLinearCoordinateCalculatorDouble: new (ViewportDimension: number, VisibleMin: number, VisibleMax: number, ViewportOffset: number, CoordOffset: number) => FlippedLinearCoordinateCalculatorDouble;
    LinearCoordinateCalculatorSingle: new (ViewportDimension: number, VisibleMin: number, VisibleMax: number, ViewportOffset: number, CoordOffset: number) => LinearCoordinateCalculatorSingle;
    FlippedLinearCoordinateCalculatorSingle: new (ViewportDimension: number, VisibleMin: number, VisibleMax: number, ViewportOffset: number, CoordOffset: number) => FlippedLinearCoordinateCalculatorSingle;
    CategoryCoordinateCalculatorDouble: new (ViewportDimension: number, VisibleMin: number, VisibleMax: number, ViewportOffset: number, CoordOffset: number, IndexMin: number, IndexMax: number) => CategoryCoordinateCalculatorDouble;
    FlippedCategoryCoordinateCalculatorDouble: new (ViewportDimension: number, VisibleMin: number, VisibleMax: number, ViewportOffset: number, CoordOffset: number, IndexMin: number, IndexMax: number) => FlippedCategoryCoordinateCalculatorDouble;
    LogarithmicCoordinateCalculator: new (ViewportDimension: number, VisibleMin: number, VisibleMax: number, ViewportOffset: number, CoordOffset: number, LogBase: number) => LogarithmicCoordinateCalculator;
    FlippedLogarithmicCoordinateCalculator: new (ViewportDimension: number, VisibleMin: number, VisibleMax: number, ViewportOffset: number, CoordOffset: number, LogBase: number) => FlippedLogarithmicCoordinateCalculator;
    DoubleRange: (new () => DoubleRange) & (new (min: number, max: number) => DoubleRange);
    NumberUtil: {
        Log: (value: number, logBase: number) => number;
        IsPowerOf: (value: number, power: number, logBase: number) => boolean;
        RoundUpPower: (value: number, power: number, logBase: number) => number;
        RoundDownPower: (value: number, power: number, logBase: number) => number;
        RoundUp: (value: number, nearest: number) => number;
        RoundDown: (value: number, nearest: number) => number;
        IsDivisibleBy: (value: number, divisor: number) => boolean;
        Constrain: (value: number, lowerBound: number, upperBound: number) => number;
        RoundToDigits: (value: number, decimals: number) => number;
        MinMax: (inputValues: SCRTDoubleVector) => DoubleRange;
        LinearInterpolateI: (from: number, to: number, ratio: number) => number;
    };
    SCRTLicenseType: {
        LICENSE_TYPE_NO_LICENSE: SCRTLicenseType;
        LICENSE_TYPE_TRIAL: SCRTLicenseType;
        LICENSE_TYPE_COMMUNITY: SCRTLicenseType;
        LICENSE_TYPE_FULL: SCRTLicenseType;
        LICENSE_TYPE_FULL_EXPIRED: SCRTLicenseType;
        LICENSE_TYPE_TRIAL_EXPIRED: SCRTLicenseType;
        LICENSE_TYPE_SUBSCRIPTION_EXPIRED: SCRTLicenseType;
        LICENSE_TYPE_INVALID_DEVELOPER_LICENSE: SCRTLicenseType;
        LICENSE_TYPE_REQUIRES_VALIDATION: SCRTLicenseType;
        LICENSE_TYPE_INVALID_LICENSE: SCRTLicenseType;
    };
    SCRTCredentials: {
        SetRuntimeLicenseKeyW: (licenseKey: string) => boolean;
        GetLicenseType: () => SCRTLicenseType;
        ResetRuntimeLicense: () => void;
        HasFeature: (feature: string) => SCRTLicenseType;
        GetLicenseDaysRemaining: () => number;
        GetExpiryDate: () => string;
        Dump: () => string;
        GetEncrypted: (stringToEncrypt: string) => string;
        Hash256Encode64: (stringToHash: string) => string;
        GetOrderId: () => string;
        GetAllowDebugging: () => boolean;
        GetLicenseErrors: () => string;
        GetLicenseChallenge: () => string;
        ApplyLicenseResponse: (response: string) => number;
        RequiresValidation: () => boolean;
        GetBuildStamp: () => string;
        GetProductCode: () => string;
        GetEncryptedOrderId: () => string;
        GetDeveloperCount: () => number;
    };
    WStringVector: new () => WStringVector;
    NiceDoubleScale: {
        CalculateTickSpacing: (min: number, max: number, minorsPerMajor: number, maxTicks: number) => DoubleRange;
    };
    NiceLogScale: {
        CalculateTickSpacing: (min: number, max: number, logBase: number, minorsPerMajor: number, maxTicks: number) => DoubleRange;
        CalculateLowPrecisionTickSpacing: (min: number, max: number, logBase: number, minorsPerMajor: number, maxTicks: number) => DoubleRange;
    };
    Math3D: {
        CenterOfVectors: (a: TSRVector3, b: TSRVector3) => TSRVector3;
        PitchAndYawToDirection: (pitch: number, yaw: number) => TSRVector3;
        DirectionToPitchAndYaw: (direction: TSRVector3) => PitchYaw;
        RotateAroundPoint: (originPoint: TSRVector3, pointToRotate: TSRVector3, rotationAngleDegrees: number, rotationAxis: TSRVector3) => TSRVector3;
        DegToRad: (degrees: number) => number;
        RadToDeg: (radians: number) => number;
        IsZero: (value: number) => boolean;
    };
    TSRVector3: (new () => TSRVector3) & (new (x: number, y: number, z: number) => TSRVector3);
    SCRTTickStyle: new () => SCRTTickStyle;
    eSCRTTextAlignement: {
        SCRT_TEXT_ALIGNEMENT_SCREEN: eSCRTTextAlignement;
        SCRT_TEXT_ALIGNEMENT_SCREEN_AUTOROTATED: eSCRTTextAlignement;
        SCRT_TEXT_ALIGNEMENT_WORLD: eSCRTTextAlignement;
        SCRT_TEXT_ALIGNEMENT_WORLD_BILLBOARD: eSCRTTextAlignement;
    };
    SCRTTextStyle: new () => SCRTTextStyle;
    SCRTAxisDescriptor: new () => SCRTAxisDescriptor;
    SCRTSceneWorld: new () => SCRTSceneWorld;
    SCRTSceneEntity: {
        implement: (wrapper: SCRTSceneEntityWrapper) => SCRTSceneEntity;
    };
    TSRCamera: new () => TSRCamera;
    TSRVector2: (new () => TSRVector2) & (new (x: number, y: number) => TSRVector2);
    SCRTFontKey: new (name: string, size: number, transformed: boolean, advanced: boolean) => SCRTFontKey;
    SCRTXyzGizmoEntity: {
        implement: (wrapper: SCRTXyzGizmoEntityWrapper) => SCRTXyzGizmoEntity;
    };
    eSCRT_POINT_MARKER_TYPE: {
        SCRT_POINT_MARKER_TYPE_PIXEL: eSCRT_POINT_MARKER_TYPE;
        SCRT_POINT_MARKER_TYPE_TEXTURED_QUAD: eSCRT_POINT_MARKER_TYPE;
        SCRT_POINT_MARKER_TYPE_INSTANCED_MESH: eSCRT_POINT_MARKER_TYPE;
    };
    SCRTPoint3DSceneEntityParams: new () => SCRTPoint3DSceneEntityParams;
    SCRTPoint3DSceneEntity: (new () => SCRTPoint3DSceneEntity) & {
        implement: (wrapper: SCRTPoint3DSceneEntityWrapper) => SCRTPoint3DSceneEntity;
    };
    SCRTColumnsSceneEntityParams: new () => SCRTColumnsSceneEntityParams;
    SCRTColumnsSceneEntity: (new () => SCRTColumnsSceneEntity) & {
        implement: (wrapper: SCRTColumnsSceneEntityWrapper) => SCRTColumnsSceneEntity;
    };
    SCRTPointLines3DSceneEntityParams: new () => SCRTPointLines3DSceneEntityParams;
    SCRTPointLine3DSceneEntity: (new () => SCRTPointLine3DSceneEntity) & {
        implement: (wrapper: SCRTPointLine3DSceneEntityWrapper) => SCRTPointLine3DSceneEntity;
    };
    SCRTAxisRange: new () => SCRTAxisRange;
    eSCRTGridDrawingFeatures: {
        SCRT_GRID_DRAWING_FEATURES_SOLID: eSCRTGridDrawingFeatures;
        SCRT_GRID_DRAWING_FEATURES_WIREFRAME: eSCRTGridDrawingFeatures;
        SCRT_GRID_DRAWING_FEATURES_CONTOURS: eSCRTGridDrawingFeatures;
        SCRT_GRID_DRAWING_FEATURES_SKIRT: eSCRTGridDrawingFeatures;
    };
    eSCRTGridMeshResolution: {
        SCRT_GRID_MESH_RES_X1: eSCRTGridMeshResolution;
        SCRT_GRID_MESH_RES_X2: eSCRTGridMeshResolution;
        SCRT_GRID_MESH_RES_X4: eSCRTGridMeshResolution;
    };
    SCRTGridDrawingProperties: new () => SCRTGridDrawingProperties;
    SCRTGridMeshEntity: (new () => SCRTGridMeshEntity) & {
        implement: (wrapper: SCRTGridMeshEntityWrapper) => SCRTGridMeshEntity;
    };
    eAxisPlaneDrawLabelsMode: {
        AxisPlaneDrawLabelsBoth: eAxisPlaneDrawLabelsMode;
        AxisPlaneDrawLabelsHidden: eAxisPlaneDrawLabelsMode;
        AxisPlaneDrawLabelsLocalX: eAxisPlaneDrawLabelsMode;
        AxisPlaneDrawLabelsLocalY: eAxisPlaneDrawLabelsMode;
    };
    eAxisPlaneVisibilityMode: {
        AxisPlaneVisibilityOneSide: eAxisPlaneVisibilityMode;
        AxisPlaneVisibilityBackfaceCulled: eAxisPlaneVisibilityMode;
        AxisPlaneVisibilityManual: eAxisPlaneVisibilityMode;
    };
    SCRTAxisCubeDescriptor: new () => SCRTAxisCubeDescriptor;
    SCRTAxisCubeEntity: (new () => SCRTAxisCubeEntity) & {
        implement: (wrapper: SCRTAxisCubeEntityWrapper) => SCRTAxisCubeEntity;
    };
    SCRTMesh: new () => SCRTMesh;
    SCRTLinesMesh: new (lineThickness: number, isStrips: boolean, isAntialias: boolean) => SCRTLinesMesh;
    eSCRTMesh: {
        SCRT_MESH_CUBE: eSCRTMesh;
        SCRT_MESH_SPHERE: eSCRTMesh;
        SCRT_MESH_PYRAMID: eSCRTMesh;
        SCRT_MESH_CYLINDER: eSCRTMesh;
    };
    eSCRTTexture: {
        SCRT_TEXTURE_SOLIDWHITE: eSCRTTexture;
        SCRT_TEXTURE_CIRCLE: eSCRTTexture;
        SCRT_TEXTURE_SQUARE: eSCRTTexture;
        SCRT_TEXTURE_TRIANGLE: eSCRTTexture;
    };
    SCRTSelectionInfo: new () => SCRTSelectionInfo;
    SCRTWaterMarkProperties: new () => SCRTWaterMarkProperties;
    SCRTFrameRenderer3D: new () => SCRTFrameRenderer3D;
    eTSRPlatform: {
        Undefined: eTSRPlatform;
        Windows: eTSRPlatform;
        Mac: eTSRPlatform;
        Linux: eTSRPlatform;
        Android: eTSRPlatform;
        iOS: eTSRPlatform;
        Web: eTSRPlatform;
    };
    eTSRMetaDataType: {
        Unknown: eTSRMetaDataType;
        Core: eTSRMetaDataType;
        Defined: eTSRMetaDataType;
        DynamicDefined: eTSRMetaDataType;
        Enum: eTSRMetaDataType;
        BitFlags: eTSRMetaDataType;
    };
    eVariableUsage: {
        Normal: eVariableUsage;
        Pointer: eVariableUsage;
        Vector: eVariableUsage;
        VectorOfPointers: eVariableUsage;
        Blob: eVariableUsage;
        Array: eVariableUsage;
        DynamicArray: eVariableUsage;
    };
    eTSRRendererType: {
        TSR_RENDERER_TYPE_UNDEFINED: eTSRRendererType;
        TSR_RENDERER_TYPE_D3D11: eTSRRendererType;
        TSR_RENDERER_TYPE_D3D11_LEVEL10: eTSRRendererType;
        TSR_RENDERER_TYPE_D3D9: eTSRRendererType;
        TSR_RENDERER_TYPE_GL: eTSRRendererType;
        TSR_RENDERER_TYPE_GLES2: eTSRRendererType;
        TSR_RENDERER_TYPE_GLES3: eTSRRendererType;
        TSR_RENDERER_TYPE_METAL: eTSRRendererType;
        TSR_RENDERER_TYPE_VULKAN: eTSRRendererType;
        TSR_RENDERER_TYPE_D3D12: eTSRRendererType;
    };
    eTSRCameraProjectionMode: {
        CAMERA_PROJECTIONMODE_PERSPECTIVE: eTSRCameraProjectionMode;
        CAMERA_PROJECTIONMODE_ORTHOGONAL: eTSRCameraProjectionMode;
    };
    TSRShadowPartitionMode: {
        Manual: TSRShadowPartitionMode;
        Logarithmic: TSRShadowPartitionMode;
        PSSM: TSRShadowPartitionMode;
    };
    TSRShadowCascadeSelectionModes: {
        SplitDepth: TSRShadowCascadeSelectionModes;
        Projection: TSRShadowCascadeSelectionModes;
    };
    TSRShadowMode: {
        FixedSizePCF: TSRShadowMode;
        GridPCF: TSRShadowMode;
        RandomDiscPCF: TSRShadowMode;
        OptimizedPCF: TSRShadowMode;
        VSM: TSRShadowMode;
        EVSM2: TSRShadowMode;
        EVSM4: TSRShadowMode;
        MSMHamburger: TSRShadowMode;
        MSMHausdorff: TSRShadowMode;
    };
    TSRShadowMapSize: {
        SMSize512: TSRShadowMapSize;
        SMSize1024: TSRShadowMapSize;
        SMSize2048: TSRShadowMapSize;
    };
    TSRShadowDepthBufferFormat: {
        DB16Unorm: TSRShadowDepthBufferFormat;
        DB24Unorm: TSRShadowDepthBufferFormat;
        DB32Float: TSRShadowDepthBufferFormat;
    };
    TSRShadowFixedFilterSize: {
        Filter2x2: TSRShadowFixedFilterSize;
        Filter3x3: TSRShadowFixedFilterSize;
        Filter5x5: TSRShadowFixedFilterSize;
        Filter7x7: TSRShadowFixedFilterSize;
        Filter9x9: TSRShadowFixedFilterSize;
    };
    TSRShadowMSAA: {
        MSAANone: TSRShadowMSAA;
        MSAA2x: TSRShadowMSAA;
        MSAA4x: TSRShadowMSAA;
        MSAA8x: TSRShadowMSAA;
    };
    TSRShadowSMFormat: {
        SM16Bit: TSRShadowSMFormat;
        SM32Bit: TSRShadowSMFormat;
    };
    TSRShadowAnisotropy: {
        Anisotropy1x: TSRShadowAnisotropy;
        Anisotropy2x: TSRShadowAnisotropy;
        Anisotropy4x: TSRShadowAnisotropy;
        Anisotropy8x: TSRShadowAnisotropy;
        Anisotropy16x: TSRShadowAnisotropy;
    };
    eTSRTextAlignMode: {
        Left: eTSRTextAlignMode;
        Center: eTSRTextAlignMode;
        Right: eTSRTextAlignMode;
    };
    TSRTextLineBounds: new () => TSRTextLineBounds;
    TSRTextBounds: new () => TSRTextBounds;
    SCRTSampleChartInterface: {
        implement: (wrapper: SCRTSampleChartInterfaceWrapper) => SCRTSampleChartInterface;
    };
    SCRTCopyToDestinationInterface: {
        implement: (wrapper: SCRTCopyToDestinationInterfaceWrapper) => SCRTCopyToDestinationInterface;
    };
    SCRTFileLoadCallbackInterface: {
        implement: (wrapper: SCRTFileLoadCallbackInterfaceWrapper) => SCRTFileLoadCallbackInterface;
    };
    SCRTSurfaceDestination: {
        implement: (wrapper: SCRTSurfaceDestinationWrapper) => SCRTSurfaceDestination;
    };
};
export declare class TSRVector4 {
    Assign(x: number, y: number, z: number, w: number): void;
    x: number;
    y: number;
    z: number;
    w: number;
    delete(): void;
}
export declare class TSRTexture {
    GetWidth(): number;
    GetHeight(): number;
    delete(): void;
}
export declare class IntVector {
    dataPtr(offset: number): number;
    push_back(element: number): void;
    pop_back(): void;
    size(): number;
    resize(size: number, initialValue: number): void;
    reserve(size: number): void;
    clear(): void;
    fill(element: number): void;
    insertAt(index: number, element: number): void;
    removeAt(index: number): void;
    removeRange(index: number, count: number): void;
    delete(): void;
    set(index: number, element: number): void;
    get(index: number): number;
}
export declare class UIntVector {
    dataPtr(offset: number): number;
    push_back(element: number): void;
    pop_back(): void;
    size(): number;
    resize(size: number, initialValue: number): void;
    reserve(size: number): void;
    clear(): void;
    fill(element: number): void;
    insertAt(index: number, element: number): void;
    removeAt(index: number): void;
    removeRange(index: number, count: number): void;
    delete(): void;
    set(index: number, element: number): void;
    get(index: number): number;
}
export declare class SCRTFloatVector {
    push_back(_dNewValue: number): void;
    resize(_iNewSize: number, _dInitialValue: number): void;
    resizeFast(_iNewSize: number): void;
    reserve(_iCount: number): void;
    clear(): void;
    size(): number;
    capacity(): number;
    get(_iIndex: number): number;
    set(_iIndex: number, _dValue: number): void;
    insertAt(_iIndex: number, _dValue: number): void;
    removeAt(_iIndex: number): void;
    removeRange(_iIndex: number, _iCount: number): void;
    dataPtr(_iOffset: number): number;
    delete(): void;
}
export declare class FloatVector {
    dataPtr(offset: number): number;
    push_back(element: number): void;
    pop_back(): void;
    size(): number;
    resize(size: number, initialValue: number): void;
    reserve(size: number): void;
    clear(): void;
    fill(element: number): void;
    insertAt(index: number, element: number): void;
    removeAt(index: number): void;
    removeRange(index: number, count: number): void;
    delete(): void;
    set(index: number, element: number): void;
    get(index: number): number;
}
export declare class SCRTDoubleVector {
    push_back(_dNewValue: number): void;
    resize(_iNewSize: number, _dInitialValue: number): void;
    resizeFast(_iNewSize: number): void;
    reserve(_iCount: number): void;
    clear(): void;
    size(): number;
    capacity(): number;
    get(_iIndex: number): number;
    set(_iIndex: number, _dValue: number): void;
    insertAt(_iIndex: number, _dValue: number): void;
    removeAt(_iIndex: number): void;
    removeRange(_iIndex: number, _iCount: number): void;
    dataPtr(_iOffset: number): number;
    delete(): void;
}
export declare class DoubleVector {
    dataPtr(offset: number): number;
    push_back(element: number): void;
    pop_back(): void;
    size(): number;
    resize(size: number, initialValue: number): void;
    reserve(size: number): void;
    clear(): void;
    fill(element: number): void;
    insertAt(index: number, element: number): void;
    removeAt(index: number): void;
    removeRange(index: number, count: number): void;
    delete(): void;
    set(index: number, element: number): void;
    get(index: number): number;
}
export declare class TSRMesh {
    delete(): void;
}
export declare class TSRIndexedMesh extends TSRMesh {
    delete(): void;
}
export declare class eTSRTextureFormat {
}
export declare class StringVector {
    dataPtr(offset: number): number;
    push_back(element: string): void;
    pop_back(): void;
    size(): number;
    resize(size: number, initialValue: string): void;
    reserve(size: number): void;
    clear(): void;
    fill(element: string): void;
    insertAt(index: number, element: string): void;
    removeAt(index: number): void;
    removeRange(index: number, count: number): void;
    delete(): void;
    set(index: number, element: string): void;
    get(index: number): string;
}
/**
 *WebAssembly / Native CoordinateCalculator base class: Converts pixel coordinates to data-values and vice versa
 */
export declare class CoordinateCalculator {
    GetCoordinate(dataValue: number): number;
    GetDataValue(coordinate: number): number;
    CanSupportMatrices(): boolean;
    delete(): void;
}
/**
 *WebAssembly / Native Linear Coordinate Calculator: Converts pixel coordinates to data-values and vice versa. Double precision version.
 */
export declare class LinearCoordinateCalculatorDouble extends CoordinateCalculator {
    delete(): void;
}
/**
 *WebAssembly / Native Flipped Linear Coordinate Calculator: Converts pixel coordinates to data-values and vice versa.  Double precision version. Inverse of {@link FlippedLinearCoordinateCalculatorDouble}
 */
export declare class FlippedLinearCoordinateCalculatorDouble extends CoordinateCalculator {
    delete(): void;
}
/**
 *WebAssembly / Native Linear Coordinate Calculator: Converts pixel coordinates to data-values and vice versa. Float32 version.
 */
export declare class LinearCoordinateCalculatorSingle extends CoordinateCalculator {
    delete(): void;
}
/**
 *WebAssembly / Native Flipped Linear Coordinate Calculator: Converts pixel coordinates to data-values and vice versa. Float32 version. Inverse of {@link LinearCoordinateCalculatorSingle}
 */
export declare class FlippedLinearCoordinateCalculatorSingle extends CoordinateCalculator {
    delete(): void;
}
/**
 *WebAssembly / Native Catetory Coordinate Calculator: Converts pixel coordinates to data-values and vice versa. Uses index not data-value for conversion
 */
export declare class CategoryCoordinateCalculatorDouble extends CoordinateCalculator {
    TransformDataToIndex(dataValue: number, baseXValues: SCRTDoubleVector): number;
    TransformIndexToData(index: number, baseXValues: SCRTDoubleVector): number;
    delete(): void;
}
/**
 *WebAssembly / Native Catetory Coordinate Calculator: Converts pixel coordinates to data-values and vice versa. Uses index not data-value for conversion. Inverse of CategoryCoordinateCalculatorDouble
 */
export declare class FlippedCategoryCoordinateCalculatorDouble extends CoordinateCalculator {
    TransformDataToIndex(dataValue: number, baseXValues: SCRTDoubleVector): number;
    TransformIndexToData(index: number, baseXValues: SCRTDoubleVector): number;
    delete(): void;
}
/**
 *WebAssembly / Native Logarithmic Coordinate Calculator: Converts pixel coordinates to data-values and vice versa. Double precision version.
 */
export declare class LogarithmicCoordinateCalculator extends CoordinateCalculator {
    delete(): void;
}
/**
 *WebAssembly / Native Flipped Logarithmic Coordinate Calculator: Converts pixel coordinates to data-values and vice versa. Double precision version. Inverse of {@link LogarithmicCoordinateCalculator}
 */
export declare class FlippedLogarithmicCoordinateCalculator extends CoordinateCalculator {
    delete(): void;
}
/**
 *WebAssembly / Native Double-precision 64-bit Range object. A tuple which contains min and max values.
 */
export declare class DoubleRange {
    minD: number;
    maxD: number;
    delete(): void;
}
/**
 *WebAssembly / Native numerical methods with access to common functions and operations.
 */
export declare class NumberUtil {
    delete(): void;
}
export declare class SCRTLicenseType {
}
/**
 *@ignore
 */
export declare class SCRTCredentials {
    delete(): void;
}
export declare class WStringVector {
    dataPtr(offset: number): number;
    push_back(element: string): void;
    pop_back(): void;
    size(): number;
    resize(size: number, initialValue: string): void;
    reserve(size: number): void;
    clear(): void;
    fill(element: string): void;
    insertAt(index: number, element: string): void;
    removeAt(index: number): void;
    removeRange(index: number, count: number): void;
    delete(): void;
    set(index: number, element: string): void;
    get(index: number): string;
}
/**
 *WebAssembly / Native numerical methods for calculating tick spacing and scaling on axis.
 */
export declare class NiceDoubleScale {
    delete(): void;
}
/**
 *WebAssembly / Native numerical methods for calculating logarithmic tick spacing and scaling on axis.
 */
export declare class NiceLogScale {
    delete(): void;
}
/**
 *WebAssembly / Native numerical methods for calculating common functions in 3D space.
 */
export declare class Math3D {
    delete(): void;
}
export declare class TSRVector3 {
    Normalize(): void;
    Dot(param0: TSRVector3): number;
    Cross(param0: TSRVector3, param1: TSRVector3): void;
    Assign(x: number, y: number, z: number): void;
    x: number;
    y: number;
    z: number;
    delete(): void;
}
/**
 *WebAssembly / Native Double-precision 64-bit tuple object for Pitch and Yaw
 */
export declare class PitchYaw {
    pitch: number;
    yaw: number;
    delete(): void;
}
/**
 *WebAssembly / Native class to store style information for 3D Chart axis ticks. Contains stroke color in RGBA format, stroke thickness and start/end for size of the tick
 */
export declare class SCRTTickStyle {
    GetStrokeColorPtr(): TSRVector4;
    m_fStrokeThickness: number;
    m_fStart: number;
    m_fEnd: number;
    delete(): void;
}
export declare class eSCRTTextAlignement {
}
/**
 *WebAssembly / Native class to store style information for 3D Chart axis fonts. Contains font color in ARGB format, font family as a string, font size and dpi scaling factor
 */
export declare class SCRTTextStyle {
    GetAlignment(): eSCRTTextAlignement;
    SetAlignment(alignment: eSCRTTextAlignement): void;
    m_strFont: string;
    m_fSize: number;
    m_uiARGBColor: number;
    m_fDpiScaling: number;
    delete(): void;
}
/**
 *WebAssembly / Native class to store style information for 3D Chart Axis.
 */
export declare class SCRTAxisDescriptor {
    SetTextStyle(textStyle: SCRTTextStyle): void;
    SetTitleTextStyle(textStyle: SCRTTextStyle): void;
    GetMinors(): FloatVector;
    SetMinors(minors: FloatVector): void;
    GetMajors(): FloatVector;
    SetMajors(majors: FloatVector): void;
    GetMajorLabels(): WStringVector;
    SetMajorLabels(labels: WStringVector): void;
    GetMajorLineStylePtr(): SCRTTickStyle;
    GetMinorLineStylePtr(): SCRTTickStyle;
    GetMinorTickStylePtr(): SCRTTickStyle;
    GetMajorTickStylePtr(): SCRTTickStyle;
    GetBandColorPtr(): TSRVector4;
    GetBorderColorPtr(): TSRVector4;
    GetBackgroundColorPtr(): TSRVector4;
    GetTextStylePtr(): SCRTTextStyle;
    GetTitleTextStylePtr(): SCRTTextStyle;
    m_strTitle: string;
    m_fTitleOffset: number;
    m_fRangeSize: number;
    m_uiLabelStyle: number;
    m_uiAxisBandStyle: number;
    m_bMajorLinesEnabled: boolean;
    m_bMinorLinesEnabled: boolean;
    m_bMajorTicksEnabled: boolean;
    m_bMinorTicksEnabled: boolean;
    m_bLabelsEnabled: boolean;
    m_bBandsEnabled: boolean;
    m_bDepthIgnoreEnabled: boolean;
    m_fTextOffset: number;
    m_bSmoothLabelOverlapAvoidance: boolean;
    m_fBorderThickness: number;
    delete(): void;
}
/**
 *WebAssembly / Native Scene graph root object. Add and remove entities from the 3D scene to see them rendered in the viewport
 */
export declare class SCRTSceneWorld {
    ClearEntities(): void;
    AddEntity(entity: SCRTSceneEntity): void;
    RemoveEntity(entity: SCRTSceneEntity): void;
    GetMainCamera(): TSRCamera;
    Update(deltaTime: number): void;
    RenderHUD(): void;
    RenderObjects(camera: TSRCamera): void;
    RenderObjectsRaw(camera: TSRCamera): void;
    GetEntitiesCount(): number;
    GetEntity(index: number): SCRTSceneEntity;
    Init(): void;
    SetWorldDimensions(worldDimensions: TSRVector3): void;
    GetWorldDimensions(): TSRVector3;
    TransformWorldToScreenCoords(_worldCoords: TSRVector3): TSRVector2;
    AquireFont(fontKey: SCRTFontKey): SCRTFont;
    delete(): void;
}
/**
 *WebAssembly / Native base class for entities added to the 3D Scene via {@link SCRTSceneWorld}
 */
export declare class SCRTSceneEntity {
    SetPosition(position: TSRVector3): void;
    SetEntityId(entityId: number): void;
    GetEntityId(): number;
    Update(deltaTime: number): void;
    Render(): void;
    ClearChildEntitiesInternal(): void;
    AddChildEntityInternal(childEntity: SCRTSceneEntity): void;
    RemoveChildEntityInternal(childEntity: SCRTSceneEntity): void;
    delete(): void;
}
export declare class SCRTSceneEntityWrapper {
    Update(deltaTime: number): void;
    Render(): void;
}
export declare class TSRCamera {
    SetLoc(location: TSRVector3): void;
    GetLoc(): TSRVector3;
    SetAt(target: TSRVector3): void;
    GetAt(): TSRVector3;
    SetUp(upVector: TSRVector3): void;
    GetUp(): TSRVector3;
    SetFarClip(farClip: number): void;
    GetFarClip(): number;
    SetNearClip(nearClip: number): void;
    GetNearClip(): number;
    SetFovAngle(fovRadians: number): void;
    GetFovAngle(): number;
    SetProjectionMode(projectionMode: eTSRCameraProjectionMode): void;
    GetProjectionMode(): eTSRCameraProjectionMode;
    SetOrthoWidth(orthoWidth: number): void;
    GetOrthoWidth(): number;
    SetOrthoHeight(orthoHeight: number): void;
    GetOrthoHeight(): number;
    SetAspectRatio(aspectRatio: number): void;
    GetAspectRatio(): number;
    SetYaw(yawRadians: number): void;
    GetYaw(): number;
    SetPitch(pitchRadians: number): void;
    GetPitch(): number;
    SetRoll(rollRadians: number): void;
    GetRoll(): number;
    ComputeVectorsFromAngles(): void;
    delete(): void;
}
export declare class TSRVector2 {
    x: number;
    y: number;
    delete(): void;
}
export declare class SCRTFont extends TSRFont {
    DrawString(text: string, color: number, x: number, y: number): void;
    DrawStringAdvanced(text: string, color: number, x: number, y: number, rotationDepth: TSRVector4, alignment: eTSRTextAlignMode, lineSpacing: number): void;
    CalculateStringBounds(text: string, bounds: TSRTextBounds, lineSpacing: number): void;
    IsAdvanced(): boolean;
    GetFaceName(): string;
    GetSize(): number;
    GetScale(): number;
    SetScale(scale: number): void;
    delete(): void;
}
export declare class SCRTFontKey {
    m_strName: string;
    m_uiSize: number;
    m_reload: boolean;
    delete(): void;
}
/**
 *WebAssembly / Native Scene entity which renders an XYZ Gizmo. Add to {@link SCRTSceneWorld} to render it in the 3D world
 */
export declare class SCRTXyzGizmoEntity extends SCRTSceneEntity {
    Update(deltaTime: number): void;
    Render(): void;
    GetOverrideEnableGizmo(): boolean;
    SetOverrideEnableGizmo(_bEnableGizmo: boolean): void;
    delete(): void;
}
export declare class SCRTXyzGizmoEntityWrapper {
    Update(deltaTime: number): void;
    Render(): void;
}
export declare class eSCRT_POINT_MARKER_TYPE {
}
/**
 *WebAssembly / Native Scatter, Bubble or Point-cloud drawing params passed to {@link SCRTPoint3DSceneEntity}
 */
export declare class SCRTPoint3DSceneEntityParams {
    SetCoordinateCalculators(xCalc: CoordinateCalculator, yCalc: CoordinateCalculator, zCalc: CoordinateCalculator): void;
    useDefaultColors: boolean;
    useDefaultScale: boolean;
    delete(): void;
}
/**
 *WebAssembly / Native 3D Scatter, Bubble or Point-cloud scene entity. Inherits {@link SCRTSceneEntity} and may be added to the 3D Scene via {@link SCRTSceneWorld}
 */
export declare class SCRTPoint3DSceneEntity extends SCRTSceneEntity {
    Update(deltaTime: number): void;
    Render(): void;
    SetOpacity(opacity: number): void;
    SetPointMarkerType(markerType: eSCRT_POINT_MARKER_TYPE): void;
    GetPointMarkerType(): eSCRT_POINT_MARKER_TYPE;
    SetPointMarkerTexture(texture: TSRTexture): void;
    GetPointMarkerTexture(): TSRTexture;
    SetPointMarkerMesh(mesh: TSRIndexedMesh): void;
    SetPointSize(pointSize: number): void;
    SetPointColor(pointColor: number): void;
    UpdateMeshesVec(xValues: SCRTDoubleVector, yValues: SCRTDoubleVector, zValues: SCRTDoubleVector, colors: IntVector, scaleFactors: FloatVector, params: SCRTPoint3DSceneEntityParams): void;
    delete(): void;
}
export declare class SCRTPoint3DSceneEntityWrapper {
    Update(deltaTime: number): void;
    Render(): void;
}
/**
 *WebAssembly / Native 3D Columns drawing params passed to {@link SCRTColumnsSceneEntity}
 */
export declare class SCRTColumnsSceneEntityParams {
    SetCoordinateCalculators(xCalc: CoordinateCalculator, yCalc: CoordinateCalculator, zCalc: CoordinateCalculator): void;
    m_bUseDefaultColors: boolean;
    m_bUseDefaultScale: boolean;
    delete(): void;
}
/**
 *WebAssembly / Native 3D Columns scene entity. Inherits {@link SCRTSceneEntity} and may be added to the 3D Scene via {@link SCRTSceneWorld}
 */
export declare class SCRTColumnsSceneEntity extends SCRTSceneEntity {
    Update(deltaTime: number): void;
    Render(): void;
    SetInstanceSize(instanceSize: number): void;
    SetInstanceMesh(mesh: TSRIndexedMesh): void;
    SetOpacity(opacity: number): void;
    SetColor(color: number): void;
    UpdateMeshesVec(xValues: SCRTDoubleVector, yValues: SCRTDoubleVector, zValues: SCRTDoubleVector, scaleFactors: FloatVector, colors: IntVector, params: SCRTColumnsSceneEntityParams): void;
    delete(): void;
}
export declare class SCRTColumnsSceneEntityWrapper {
    Update(deltaTime: number): void;
    Render(): void;
}
/**
 *WebAssembly / Native 3D Line drawing params passed to {@link SCRTPointLine3DSceneEntity}
 */
export declare class SCRTPointLines3DSceneEntityParams {
    SetCoordinateCalculators(xCalc: CoordinateCalculator, yCalc: CoordinateCalculator, zCalc: CoordinateCalculator): void;
    useDefaultColors: boolean;
    useDefaultScale: boolean;
    delete(): void;
}
/**
 *WebAssembly / Native 3D Line scene entity. Inherits {@link SCRTSceneEntity} and may be added to the 3D Scene via {@link SCRTSceneWorld}
 */
export declare class SCRTPointLine3DSceneEntity extends SCRTSceneEntity {
    Update(deltaTime: number): void;
    Render(): void;
    SetOpacity(opacity: number): void;
    SetPointMarkerType(markerType: eSCRT_POINT_MARKER_TYPE): void;
    GetPointMarkerType(): eSCRT_POINT_MARKER_TYPE;
    SetPointMarkerTexture(texture: TSRTexture): void;
    GetPointMarkerTexture(): TSRTexture;
    SetPointMarkerMesh(mesh: TSRIndexedMesh): void;
    SetPointSize(pointSize: number): void;
    SetStrokeColor(strokeColor: number): void;
    SetLineStrokeThickness(value: number): void;
    SetIsLineStrips(value: boolean): void;
    SetIsLineAntialiased(value: boolean): void;
    UpdateMeshesVec(xValues: SCRTDoubleVector, yValues: SCRTDoubleVector, zValues: SCRTDoubleVector, pointColors: IntVector, lineColors: IntVector, scaleFactors: FloatVector, params: SCRTPointLines3DSceneEntityParams): void;
    delete(): void;
}
export declare class SCRTPointLine3DSceneEntityWrapper {
    Update(deltaTime: number): void;
    Render(): void;
}
/**
 *WebAssembly / Native tuple object which contains min, max and diff for 3D Axis ranges
 */
export declare class SCRTAxisRange {
    m_fMin: number;
    m_fMax: number;
    m_fDiff: number;
    delete(): void;
}
export declare class eSCRTGridDrawingFeatures {
}
export declare class eSCRTGridMeshResolution {
}
/**
 *WebAssembly / Native 3D Surface mesh drawing params passed to {@link SCRTGridMeshEntity}
 */
export declare class SCRTGridDrawingProperties {
    SetDrawMeshAsInteger(drawMeshFlag: number): void;
    GetWireframeStrokePtr(): TSRVector4;
    GetContourColorPtr(): TSRVector4;
    m_eDrawMeshAs: eSCRTGridDrawingFeatures;
    m_bUseGradient: boolean;
    m_bUseSolidCells: boolean;
    m_fStrokeThickness: number;
    m_fContourThickness: number;
    m_fContourInterval: number;
    m_fContourOffset: number;
    m_fHardNormals: number;
    m_fHighlight: number;
    m_fShininess: number;
    m_fLightingAmount: number;
    m_bDrawBackSide: boolean;
    delete(): void;
}
/**
 *WebAssembly / Native 3D Surface Mesh scene entity. Inherits {@link SCRTSceneEntity} and may be added to the 3D Scene via {@link SCRTSceneWorld}
 */
export declare class SCRTGridMeshEntity extends SCRTSceneEntity {
    Update(deltaTime: number): void;
    Render(): void;
    SetTexture(texture: TSRTexture): void;
    GetHeightMap(): TSRTexture;
    SetOpacity(opacity: number): void;
    GetOpacity(): number;
    SetMeshRange(meshRangeX: SCRTAxisRange, meshRangeY: SCRTAxisRange, meshRangeZ: SCRTAxisRange): void;
    SetVisibleRange(visibleRangeX: SCRTAxisRange, visibleRangeY: SCRTAxisRange, visibleRangeZ: SCRTAxisRange): void;
    SetHeightmapScaleOffset(dataScaleY: number, dataOffsetY: number): void;
    SetGridDrawingProperties(properties: SCRTGridDrawingProperties): void;
    UpdateMeshesVec(heightCoords: FloatVector, zOffsets: FloatVector, cellColors: IntVector, gridWidth: number, gridHeight: number, meshResolution: eSCRTGridMeshResolution): void;
    UpdateHeightCoordinatesVec(heightCoords: FloatVector, gridWidth: number, gridHeight: number): void;
    delete(): void;
}
export declare class SCRTGridMeshEntityWrapper {
    Update(deltaTime: number): void;
    Render(): void;
}
export declare class eAxisPlaneDrawLabelsMode {
}
export declare class eAxisPlaneVisibilityMode {
}
/**
 *WebAssembly / Native class to store style information for 3D Chart Axis Cube.
 */
export declare class SCRTAxisCubeDescriptor {
    GetXAxisDescPtr(): SCRTAxisDescriptor;
    GetYAxisDescPtr(): SCRTAxisDescriptor;
    GetZAxisDescPtr(): SCRTAxisDescriptor;
    m_bIsAxisCubeVisible: boolean;
    m_ePlaneVisibilityMode: eAxisPlaneVisibilityMode;
    m_eZxPlaneDrawLabelsMode: eAxisPlaneDrawLabelsMode;
    m_eXyPlaneDrawLabelsMode: eAxisPlaneDrawLabelsMode;
    m_eZyPlaneDrawLabelsMode: eAxisPlaneDrawLabelsMode;
    m_bZxPlaneVisible: boolean;
    m_bXyPlaneVisible: boolean;
    m_bZyPlaneVisible: boolean;
    delete(): void;
}
/**
 *WebAssembly / Native 3D Axis Cube entity. Inherits {@link SCRTSceneEntity} and may be added to the 3D Scene via {@link SCRTSceneWorld}
 */
export declare class SCRTAxisCubeEntity extends SCRTSceneEntity {
    Update(deltaTime: number): void;
    Render(): void;
    GetDescriptorPtr(): SCRTAxisCubeDescriptor;
    SetDescriptor(descriptor: SCRTAxisCubeDescriptor): void;
    DebugDescriptor(): void;
    DestroyMeshes(): void;
    delete(): void;
}
export declare class SCRTAxisCubeEntityWrapper {
    Update(deltaTime: number): void;
    Render(): void;
}
export declare class SCRTMesh {
    delete(): void;
}
export declare class SCRTLinesMesh extends SCRTMesh {
    SetVertexColor(uiColorArgb: number): void;
    SetVertex3(x: number, y: number, z: number): void;
    SetStrokeThickness(strokeThickness: number): void;
    SetOpacity(opacity: number): void;
    Freeze(): void;
    Render(): void;
    delete(): void;
}
export declare class eSCRTMesh {
}
export declare class eSCRTTexture {
}
export declare class SCRTSelectionInfo {
    GetEntity(): SCRTSceneEntity;
    m_uiSelectionIndex: number;
    m_uiHeightMapIndexI: number;
    m_uiHeightMapIndexJ: number;
    delete(): void;
}
export declare class SCRTWaterMarkProperties {
    SetPosition(position: TSRVector2): void;
    SetOpacity(opacity: number): void;
    m_fCanvasWidth: number;
    m_bIsDarkBackground: boolean;
    delete(): void;
}
export declare class SCRTFrameRenderer3D extends SCRTFrameRenderer {
    delete(): void;
}
export declare class SCRTFrameRenderer {
    delete(): void;
}
export declare class eTSRPlatform {
}
export declare class eTSRMetaDataType {
}
export declare class eVariableUsage {
}
export declare class eTSRRendererType {
}
export declare class eTSRCameraProjectionMode {
}
export declare class TSRShadowPartitionMode {
}
export declare class TSRShadowCascadeSelectionModes {
}
export declare class TSRShadowMode {
}
export declare class TSRShadowMapSize {
}
export declare class TSRShadowDepthBufferFormat {
}
export declare class TSRShadowFixedFilterSize {
}
export declare class TSRShadowMSAA {
}
export declare class TSRShadowSMFormat {
}
export declare class TSRShadowAnisotropy {
}
export declare class eTSRTextAlignMode {
}
export declare class TSRTextLineBounds {
    m_fWidth: number;
    m_fHeight: number;
    m_fOffsetX: number;
    m_fOffsetY: number;
    delete(): void;
}
export declare class TSRTextBounds {
    GetLinesCount(): number;
    GetLineBounds(lineIndex: number): TSRTextLineBounds;
    m_fWidth: number;
    m_fHeight: number;
    delete(): void;
}
export declare class TSRFont {
    Begin(): void;
    End(): void;
    m_isDrawing: boolean;
    delete(): void;
}
export declare class SCRTSampleChartInterface {
    InitializeChart(): void;
    Draw(canvasId: string): void;
    Update(deltaTime: number): void;
    ShutDownChart(): void;
    SetFPSCounterEnabled(enabled: boolean): void;
    AddDestination(elementID: SCRTSurfaceDestination): void;
    ClearDestinations(): void;
    GetCurrentDestination(): SCRTSurfaceDestination;
    SetFrameRenderer(frameRenderer: SCRTFrameRenderer): void;
    GetFrameRenderer(): SCRTFrameRenderer;
    SetWasmBufferSizesKb(_iBufferSizeKb: number): void;
    delete(): void;
}
export declare class SCRTSampleChartInterfaceWrapper {
    InitializeChart(): void;
    Draw(canvasId: string): void;
    Update(deltaTime: number): void;
    ShutDownChart(): void;
}
export declare class SCRTCopyToDestinationInterface {
    CopyToDestination(destinationID: string): void;
    delete(): void;
}
export declare class SCRTCopyToDestinationInterfaceWrapper {
    CopyToDestination(destinationID: string): void;
}
export declare class SCRTFileLoadCallbackInterface {
    OnLoadComplete(success: boolean, message: string): void;
    delete(): void;
}
export declare class SCRTFileLoadCallbackInterfaceWrapper {
    OnLoadComplete(success: boolean, message: string): void;
}
export declare class SCRTSurfaceDestination {
    GetWidth(): number;
    GetHeight(): number;
    GetID(): string;
    delete(): void;
}
export declare class SCRTSurfaceDestinationWrapper {
    GetWidth(): number;
    GetHeight(): number;
    GetID(): string;
}
export declare type TSciChartCore = {
    canvas: HTMLCanvasElement;
    canvas2D: HTMLCanvasElement;
};
