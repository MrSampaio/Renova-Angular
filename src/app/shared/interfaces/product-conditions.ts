export enum ProductCondition {
    NEW = 'NEW',
    PREOWNED = 'PREOWNED',
    USED = 'USED'
}

export const CONDITION_OPTIONS = [
    { value: ProductCondition.NEW, label: 'Novo (com etiqueta)' },
    { value: ProductCondition.PREOWNED, label: 'Semi-novo (excelente estado)' },
    { value: ProductCondition.USED, label: 'Usado (bom estado)' }
];