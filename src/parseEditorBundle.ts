import ivm from 'isolated-vm';
import { readFileSync } from 'node:fs';
import { type ModifiedComponentPropertyRecord } from './ModifiedComponentProperty.js';

// FIXME there's probably more missing stuff from the global scope
const BUNDLE_PREAMBLE = `
function _registerEditor(regExports) {
    for (const possibleComponent of Object.values(regExports)) {
        const typeName = possibleComponent.TypeName;
        if (typeof typeName === 'string') {
            const properties = {};
            if (possibleComponent.Properties) {
                for (const [propName, propType] of Object.entries(possibleComponent.Properties)) {
                    properties[propName] = propType;
                }
            }
            __marshalled__registerEditor(typeName, properties);
        }
    }
}

const window = {
    navigator: {},
    location: {}
};

class URL {}

const HowlerGlobal = {
    prototype: {}
};

const Howl = {
    prototype: {}
};

const Sound = {
    prototype: {}
};
`;

export function parseEditorBundle(editorExtraBundlePath: string | null) {
    const isolate = new ivm.Isolate({ memoryLimit: 128 });
    const context = isolate.createContextSync();
    const jail = context.global;
    const components = new Map<string, ModifiedComponentPropertyRecord>();

    jail.setSync('__marshalled__registerEditor', function(typeName: string, properties: ModifiedComponentPropertyRecord) {
        components.set(typeName, properties);
    });

    let editorBundleText: string
    try {
        editorBundleText = readFileSync('cache/js/_editor_bundle.cjs', { encoding: 'utf8' });
    } catch(err) {
        console.error(err);
        throw new Error('Could not open editor bundle. Make sure you have build the project in the Wonderland Editor before running this tool');
    }

    let editorExtraBundleText = '';
    if (editorExtraBundlePath) editorExtraBundleText = readFileSync(editorExtraBundlePath, { encoding: "utf8" });

    editorBundleText = `${BUNDLE_PREAMBLE}\n${editorExtraBundleText}\n${editorBundleText}`;

    const editorIndexModule = isolate.compileModuleSync(editorBundleText);
    editorIndexModule.instantiateSync(context, (specifier) => {
        throw new Error(`Unexpected import in editor bundle: ${specifier}`);
    });
    editorIndexModule.evaluateSync();

    context.release();
    isolate.dispose();

    return components;
}