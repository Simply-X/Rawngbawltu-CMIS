
export type DenominationType = 'PCI' | 'BCM' | 'SA' | 'UPC' | 'Custom';

export interface LingoPreset {
    church: string; // e.g., Kohhran, Corps
    committee: string; // e.g., Committee, Board
    youth: string; // e.g., KTP, TKP, SAY, PYD
    women: string; // e.g., Kohhran Hmeichhia, BKHP, Hmeichhe Pawl
    men: string; // e.g., Pavalai, BMP
    elder: string; // e.g., Upa, Sergeant Major
}

export const DENOMINATION_LINGO: Record<DenominationType, LingoPreset> = {
    PCI: {
        church: 'Kohhran',
        committee: 'Committee',
        youth: 'KTP', // Kristian Thalai Pawl
        women: 'Kohhran Hmeichhia',
        men: 'Pavalai', // Or just "Pavalai Pawl"
        elder: 'Upa',
    },
    BCM: {
        church: 'Kohhran',
        committee: 'Committee',
        youth: 'TKP', // Thalai Kristian Pawl
        women: 'BKHP', // Baptist Kohhran Hmeichhe Pawl
        men: 'BMP', // Baptist Mipa Pawl
        elder: 'Upa',
    },
    SA: { // Salvation Army
        church: 'Corps',
        committee: 'Board', // Census Board?
        youth: 'SAY', // Salvation Army Youth
        women: 'Home League',
        men: 'Men\'s Fellowship',
        elder: 'Sergeant Major', // Local Officer
    },
    UPC: {
        church: 'Kohhran',
        committee: 'Board',
        youth: 'PYD', // Pentecostal Youth Department
        women: 'LAD', // Ladies Auxiliary Department
        men: 'MDO', // Men's Department Organization? Verifying common terms. Keeping Generic if unsure.
        elder: 'Upa',
    },
    Custom: {
        church: 'Kohhran',
        committee: 'Committee',
        youth: 'Thalai',
        women: 'Hmeichhia',
        men: 'Mipa',
        elder: 'Hruaitu',
    }
};

export const getLingo = (denomination: DenominationType) => {
    return DENOMINATION_LINGO[denomination] || DENOMINATION_LINGO.Custom;
};
