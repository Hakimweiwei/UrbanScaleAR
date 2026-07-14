// MOD-002: URL Router
// Bertugas membaca parameter ?varian= dari URL

import { variants, DEFAULT_VARIANT } from './variant-config.js';

export function getVariantFromURL() {
    const params = new URLSearchParams(window.location.search);
    const varianId = params.get('varian');

    if (varianId && variants[varianId]) {
        console.log(`[URL Router] Varian terdeteksi: ${varianId} (${variants[varianId].name})`);
        return variants[varianId];
    } else {
        console.warn(`[URL Router] Varian tidak ditemukan atau tidak valid. Fallback ke default (${DEFAULT_VARIANT}).`);
        return variants[DEFAULT_VARIANT];
    }
}
