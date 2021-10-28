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

export enum Currency {
    TJS = "TJS",
    USD = "USD",
    RUB = "RUB",
    CNY = "CNY"
}

export enum AccountabilityType {
    PAYMENT = "PAYMENT",
    MONEY_STATEMENT = "MONEY_STATEMENT",
    REFUND = "REFUND"
}

export enum AccountabilityMoneyUnit {
    TJS = "TJS",
    USD = "USD"
}

export const mapOfAccountabilityType = new Map(
    [
        [AccountabilityType.PAYMENT, "Выдача"],
        [AccountabilityType.MONEY_STATEMENT, "Отчет"],
        [AccountabilityType.REFUND, "Возврат"],
    ]
)

export const currencyMap = new Map(
    [
        ["USD", "Доллар США - $"],
        ["RUB", "Российский Рубль - ₽"],
        ["TJS", "Смн."],
        ["CNY", "Китайский Юань - ¥"],
    ]
)

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
        value: 'truck',
        label: 'Машины'
    },
    {
        value: 'driver',
        label: 'Водители'
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
    {
        value: 'on-base',
        label: 'Заправка на базе',
        privateTruck: true,
    },
    {
        value: 'on-road',
        label: 'Заправка в пути',
        privateTruck: true,
    },
    {
        value: 'additional-outcome',
        label: 'Дополнительный расход',
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
        ['CASHIER', 'Кассир'],
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


export const mapOfStatusCargo = new Map<string, string>(
    [
        ['FORMALIZED', 'Оформлен'],
        ['ONROAD', 'В пути'],
        ['ARRIVED', 'Прибыл'],
        ['ISSUED', 'Выдано'],
    ]
)

export const mapOfColorStatusCargo = new Map<string, string>(
    [
        ['FORMALIZED', '#000000'],
        ['ONROAD', '#FDD231'],
        ['ARRIVED', '#2196F3'],
        ['ISSUED', '#03A075'],
    ]
)

export const mapOfUnits = new Map<string, string>(
    [
        ['THING', 'штука'],
        ['TON', 'тонна'],
    ]
)
