import { type ArrayToken, type ObjectToken } from '@playkostudios/jsonc-ast';

export interface WLECleanerContext {
    cleanedDefaults: number,
    cleanedInvalidComponents: number,
    tkObjects: ObjectToken,
    tkMeshes: ObjectToken,
    tkTextures: ObjectToken,
    tkImages: ObjectToken,
    tkMaterials: ObjectToken,
    tkShaders: ObjectToken,
    tkSettings: ObjectToken,
    tkAnimations: ObjectToken,
    tkSkins: ObjectToken,
    tkPipelines: ObjectToken,
    tkFiles: ArrayToken,
    tkFonts: ObjectToken,
    tkLanguages: ObjectToken,
}