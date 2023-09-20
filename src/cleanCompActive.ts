import { JSONTokenType, type ObjectToken, type JSONValueToken } from '@playkostudios/jsonc-ast';
import { type WLECleanerContext } from './WLECleanerContext.js';

export function cleanCompActive(context: WLECleanerContext, tkValue: JSONValueToken, tkComponent: ObjectToken, compType: string | null, objectName: string) {
    if (tkValue.type === JSONTokenType.True) {
        tkComponent.deleteKey('active');
        context.cleanedDefaults++;
    } else if (tkValue.type !== JSONTokenType.False) {
        if (compType) {
            throw new Error(`Invalid "active" value for component with type "${compType}" from object with name "${objectName}"`);
        } else {
            throw new Error(`Invalid "active" value for linked component with unknown type from object with name "${objectName}"`);
        }
    }
}