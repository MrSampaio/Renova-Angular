export enum ProductCategory {
    TSHIRTS = 'TSHIRTS',
    PANTS = 'PANTS',
    SHORTS = 'SHORTS',
    DRESSES = 'DRESSES',
    SWEATSHIRTS = 'SWEATSHIRTS',
    SHIRTS = 'SHIRTS',
    SKIRTS = 'SKIRTS',
    SOCKS = 'SOCKS',
    GLOVES = 'GLOVES',
    ACCESSORIES = 'ACCESSORIES',
    OTHER = 'OTHER'
}

export const CATEGORY_OPTIONS = [
    { value: ProductCategory.TSHIRTS, label: 'Camisetas' },
    { value: ProductCategory.PANTS, label: 'Calças' },
    { value: ProductCategory.SHORTS, label: 'Shorts' },
    { value: ProductCategory.DRESSES, label: 'Vestidos' },
    { value: ProductCategory.SWEATSHIRTS, label: 'Moletons' },
    { value: ProductCategory.SHIRTS, label: 'Camisas' },
    { value: ProductCategory.SKIRTS, label: 'Saias' },
    { value: ProductCategory.SOCKS, label: 'Meias' },
    { value: ProductCategory.GLOVES, label: 'Luvas' },
    { value: ProductCategory.ACCESSORIES, label: 'Acessórios' },
    { value: ProductCategory.OTHER, label: 'Outros' }
];