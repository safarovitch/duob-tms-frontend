export const THEMES = {
    LIGHT: 'LIGHT',
    ONE_DARK: 'ONE_DARK',
    UNICORN: 'UNICORN'
}

export const ARTICLES = {
    INCOME: 'INCOME',
    INCOME_POSTFIX: 'income',
    OUTCOME: 'OUTCOME',
    OUTCOME_POSTFIX: 'outcome',
}

export const moneyUnitApplication = [
    'TJS',
    'RUB',
    'USD',
    'CNY'
]

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
    },
    {
        value: 'truck-type',
        label: 'Тип машины'
    }
];

export const roadsStuffTabs = [
    {
        value: 'main',
        label: 'Основные',
        privateTruck: true,
    },
    {
        value: 'mileage',
        label: 'Километраж',
        privateTruck: false,
    },
    {
        value: 'money',
        label: 'Денежные расходы',
        privateTruck: true,
    },
    {
        value: 'fuel',
        label: 'Топливо',
        privateTruck: false,
    },
    {
        value: 'cargos',
        label: 'Грузы',
        privateTruck: true,
    },
]

export const articleStuffTabs = [
    {
        value: 'income',
        label: 'Приход'
    },
    {
        value: 'outcome',
        label: 'Расход'
    }
]

export const applicationStuffTabs = [
    {
        value: 'refill-balance',
        label: 'Пополнение баланса'
    },
    {
        value: 'income-article',
        label: 'Приход по статьям '
    },
    {
        value: 'outcome-article',
        label: 'Расход по сатьям'
    },
    {
        value: 'outcome-transfer-warehouse',
        label: 'Перевод денег'
    }
]

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

export const mapOfActionTypeApplication = new Map(
    [
        ['REFILL', 'Пополнение'],
        ['RETURN', 'Возврат'],
    ]
)

export const mapOfStatusApplication = new Map<string, string>(
    [
        ['WAITING', 'Ожидается'],
        ['PAID', 'Оплачено'],
        ['ON_ROAD', 'В пути'],
    ]
)
