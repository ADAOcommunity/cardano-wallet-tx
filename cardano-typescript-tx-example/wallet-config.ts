export const walletConfig = {
    'nami': typeof window === 'undefined' ? {} : (window as any).cardano.nami,
    'eternl': typeof window === 'undefined' ? {} : (window as any).cardano.eternl, //  ==   'ccvault': typeof window === 'undefined' ? {} : (window as any).cardano.ccvault
    'flint': typeof window === 'undefined' ? {} : (window as any).cardano.flint,
    'yoroi': typeof window === 'undefined' ? {} : (window as any).cardano.yoroi,
    'cardwallet': typeof window === 'undefined' ? {} : (window as any).cardano.cardwallet,
    'gerowallet': typeof window === 'undefined' ? {} : (window as any).cardano.gerowallet
}