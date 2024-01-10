import ivm from 'isolated-vm';
import { readFileSync } from 'node:fs';
import { type ModifiedComponentPropertyRecord } from './ModifiedComponentProperty.js';
import { EDITOR_BUNDLE_EXTRA_DEFAULT } from './constants.js';
import { CommanderError } from 'commander';
import { prettyError } from './prettyError.js';

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
`;

// TODO remove this in 1.0.0
const LEGACY_PREAMBLE = `
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
`

export function parseEditorBundle(editorBundlePath: string, editorExtraBundlePath: string | null, legacyPreamble: boolean) {
    const isolate = new ivm.Isolate({ memoryLimit: 128 });
    const context = isolate.createContextSync();
    const jail = context.global;
    const components = new Map<string, ModifiedComponentPropertyRecord>();

    jail.setSync('__marshalled__registerEditor', function(typeName: string, properties: ModifiedComponentPropertyRecord) {
        components.set(typeName, properties);
    });

    let editorBundleText: string
    try {
        editorBundleText = readFileSync(editorBundlePath, { encoding: 'utf8' });
    } catch(err) {
        prettyError(err);
        throw new CommanderError(1, 'bundle-open-fail', 'Could not open editor bundle. Make sure you have build the project in the Wonderland Editor before running this tool');
    }

    let editorExtraBundleText = '';
    if (editorExtraBundlePath) {
        try {
            editorExtraBundleText = readFileSync(editorExtraBundlePath, { encoding: "utf8" });
        } catch(err) {
            prettyError(err);
            throw new CommanderError(1, 'bundle-extra-open-fail', 'Could not open editor bundle extra script');
        }
    } else {
        try {
            editorExtraBundleText = readFileSync(EDITOR_BUNDLE_EXTRA_DEFAULT, { encoding: 'utf8' });
        } catch(err) {}
    }

    let preambleExtras = '';
    if (legacyPreamble) {
        console.warn('WARNING: Using legacy preamble. Consider using the option --no-legacy-preamble and supplying your own editor bundle extras script for missing type definitions');
        preambleExtras = LEGACY_PREAMBLE;
    }

    editorBundleText = `${BUNDLE_PREAMBLE}\n${preambleExtras}\n${editorExtraBundleText}\n${editorBundleText}`;

    const editorIndexModule = isolate.compileModuleSync(editorBundleText);
    editorIndexModule.instantiateSync(context, (specifier) => {
        throw new CommanderError(1, 'bundle-import', `Unexpected import in editor bundle: ${specifier}`);
    });
    editorIndexModule.evaluateSync();

    context.release();
    isolate.dispose();

    return components;
}