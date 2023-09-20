import { type JSONParentToken, NumberToken } from '@playkostudios/jsonc-ast';
import { EPS } from './constants.js';
import { equalsEps } from './equalsEps.js';

export function normalizeZeroOneToken(tkNumVal: NumberToken, tkParent: JSONParentToken) {
    const numVal = tkNumVal.evaluate();

    if (equalsEps(numVal, 0, EPS)) {
        tkParent.replaceChild(tkNumVal, NumberToken.fromString('0.0'));
        return 0;
    } else if (equalsEps(numVal, 1, EPS)) {
        tkParent.replaceChild(tkNumVal, NumberToken.fromString('1.0'));
        return 1;
    } else {
        return null;
    }
}