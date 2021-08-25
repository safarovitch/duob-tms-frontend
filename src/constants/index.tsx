export const THEMES = {
    LIGHT: 'LIGHT',
    ONE_DARK: 'ONE_DARK',
    UNICORN: 'UNICORN'
}

export const cargoStuffTabs = [
    {
        value: 'product',
        label: 'Наименования'
    },
    {
        value: 'customs',
        label: 'Томоженные коды'
    },
    {
        value: 'type',
        label: 'Виды груза'
    },
    {
        value: 'tariff',
        label: 'Тарифы'
    }
];

export const mapOfRoles = new Map(
    [
        ['MANAGER', 'Менеджер'],
        ['WAREHOUSEMAN', 'Завсклад'],
        ['CASHIER', 'Касир'],
        ['CLIENT', 'Клиент'],
        ['ADMIN', 'Админ']
    ]
)
