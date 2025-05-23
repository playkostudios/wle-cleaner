export const EPS = 0.0001;
export const customCollisionRadiusOptsType = Symbol('collision-radius-options');
export const customCollisionExtentsOptsType = Symbol('collision-extents-options');
export const customPhysxCapsuleOptsType = Symbol('physx-capsule-options');
export const customPhysxMeshOptsType = Symbol('physx-mesh-options');
export const customVec3Type = Symbol('vec3');
export const customVec4Type = Symbol('vec4');
export const customOpaqueColorType = Symbol('opaque-color');
export const NATIVE_COMPONENTS = ['animation', 'collision', 'input', 'light', 'mesh', 'physx', 'text', 'view'];
export const EDITOR_BUNDLE_DEFAULT_ROOT = 'cache';
export const EDITOR_BUNDLE_DEFAULT_FILE = 'js/_editor_bundle.cjs';
export const EDITOR_BUNDLE_EXTRA_DEFAULT = 'editor-bundle-extra.js';