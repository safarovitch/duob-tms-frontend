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

export const customerStuffTabs = [
    {
        value: 'active-cargo',
        label: 'Активные Грузы'
    },
    {
        value: 'received-cargo',
        label: 'Полученные Грузы'
    },
    {
        value: 'reconciliation-act',
        label: 'Акт сверки'
    }
];

export const roadStuffTabs = [
    {
        value: 'driver',
        label: 'Водители'
    },
    {
        value: 'truck',
        label: 'Машины'
    },
    {
        value: 'trailer',
        label: 'Прицепы'
    }
];

export const mapOfRoles = new Map(
    [
        ['MANAGER', 'Менеджер'],
        ['WAREHOUSEMAN', 'Завсклад'],
        ['CASHIER', 'Касир'],
        ['CLIENT', 'Клиент'],
        ['ADMIN', 'Админ'],
        ['ENGINEER', 'Инженер'],
    ]
)

export const mapOfTypeFuelTransactions = new Map(
    [
        ['INCOME', 'Приход'],
        ['TRANSFUSION', 'Переливание'],
        ['OUTCOME', 'Расход'],
    ]
)
