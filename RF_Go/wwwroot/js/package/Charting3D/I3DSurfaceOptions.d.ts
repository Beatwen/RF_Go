import { ISurfaceOptionsBase } from "../Charting/Visuals/SciChartSurfaceBase";
import { ICameraOptions } from "./CameraController";
import { Vector3 } from "./Vector3";
/**
 * Options passed to a {@link SciChart3DSurface} in the {@link SciChart3DSurface.create} function
 */
export interface I3DSurfaceOptions extends ISurfaceOptionsBase {
    cameraOptions?: ICameraOptions;
    worldDimensions?: Vector3;
    isZXPlaneVisible?: boolean;
    isXYPlaneVisible?: boolean;
    isZYPlaneVisible?: boolean;
}
