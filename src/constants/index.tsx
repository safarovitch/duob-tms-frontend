const
    LIGHT = 'LIGHT',
    ONE_DARK = 'ONE_DARK',
    UNICORN = 'UNICORN',
    INCOME = 'INCOME',
    INCOME_POSTFIX = 'income',
    OUTCOME = 'OUTCOME',
    OUTCOME_POSTFIX = 'outcome',
    TJS = 'TJS',
    RUB = 'RUB',
    USD = 'USD',
    CNY = 'CNY',
    MANAGER = 'MANAGER',
    WAREHOUSEMAN = 'WAREHOUSEMAN',
    CASHIER = 'CASHIER',
    CLIENT = 'CLIENT',
    ADMIN = 'ADMIN',
    ENGINEER = 'ENGINEER',
    TRANSFUSION = 'TRANSFUSION',
    REFILL = 'REFILL',
    RETURN = 'RETURN',
    WAITING = 'WAITING',
    PAID = 'PAID',
    ON_ROAD = 'ON_ROAD',
    ISSUED = 'ISSUED',
    THING = 'THING',
    TON = 'TON'

export const THEMES = {LIGHT, ONE_DARK, UNICORN}

export const ARTICLES = {INCOME, INCOME_POSTFIX, OUTCOME, OUTCOME_POSTFIX}

export enum Currency {
    USD = "USD",
    TJS = "TJS",
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
        [USD, "Доллар США - $"],
        [TJS, "Таджикский сомони - TJS"],
        [RUB, "Российский Рубль - ₽"],
        [CNY, "Китайский Юань - ¥"],
    ]
)

export enum RoadStatusEnum {
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    ARRIVED = "ARRIVED",
}

export const mapOfRoadStatus = new Map(
    [
        [RoadStatusEnum.ACTIVE, "Активный"],
        [RoadStatusEnum.COMPLETED, "Завершенный"],
        [RoadStatusEnum.ARRIVED, "Прибыл"],
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
        value: 'cargos',
        label: 'Грузы',
    },
    {
        value: 'reconciliation-act',
        label: 'Акт сверки',
    },
    {
        value: 'credits',
        label: 'Кредиты',
    },
    {
        value: 'notification',
        label: 'Уведомление',
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
        privateTruck: false,
    },
    {
        value: 'on-road',
        label: 'Заправка в пути',
        privateTruck: false,
    },
    {
        value: 'additional-outcome',
        label: 'Дополнительный расход',
        privateTruck: false,
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
    },
    {
        value: 'road-driver',
        label: 'Рейсы и водители'
    }
]

export enum RoadDriverApplicationType {
    INCOME = "INCOME",
    OUTCOME = "OUTCOME",
}

export const mapOfRoadDriverApplicationType = new Map(
    [
        [INCOME, 'Приход'],
        [OUTCOME, 'Расход'],
    ]
)

export enum RoadDriverApplicationMoneyUnit {
    TJS = "TJS",
    USD = "USD"
}

export const mapOfRoles = new Map(
    [
        [MANAGER, 'Менеджер'],
        [WAREHOUSEMAN, 'Завсклад'],
        [CASHIER, 'Кассир'],
        [CLIENT, 'Клиент'],
        [ADMIN, 'Админ'],
        [ENGINEER, 'Инженер'],
    ]
)

export const mapOfTypeFuelTransactions = new Map(
    [
        [INCOME, 'Приход'],
        [TRANSFUSION, 'Переливание'],
        [OUTCOME, 'Расход'],
    ]
)

export const mapOfActionTypeApplication = new Map(
    [
        [REFILL, 'Пополнение'],
        [RETURN, 'Возврат'],
    ]
)

export const mapOfStatusApplication = new Map<string, string>(
    [
        [WAITING, 'Ожидается'],
        [PAID, 'Оплачено'],
        [ON_ROAD, 'В пути'],
    ]
)

export enum TypeCargoCustomerEnum {
    ACTIVE = "ACTIVE",
    ISSUED = "ISSUED",
    RETURNED = "RETURNED",
}

export const mapOfTypeCargoCustomer = new Map<string, string>(
    [
        [TypeCargoCustomerEnum.ACTIVE, 'Активные'],
        [TypeCargoCustomerEnum.ISSUED, 'Полученные'],
        [TypeCargoCustomerEnum.RETURNED, 'Возвращенные'],
    ]
)

export enum StatusCargoEnum {
    FORMALIZED = "FORMALIZED",
    ONROAD = "ONROAD",
    ARRIVED = "ARRIVED",
    ISSUED = "ISSUED",
    RETURNED = "RETURNED",
}

export const mapOfStatusCargo = new Map<string, string>(
    [
        [StatusCargoEnum.FORMALIZED, 'Оформлен'],
        [StatusCargoEnum.ONROAD, 'В пути'],
        [StatusCargoEnum.ARRIVED, 'Прибыл'],
        [StatusCargoEnum.ISSUED, 'Выдано'],
        [StatusCargoEnum.RETURNED, 'Возврат'],
    ]
)

export const mapOfColorStatusCargo = new Map<string, string>(
    [
        [StatusCargoEnum.FORMALIZED, '#000000'],
        [StatusCargoEnum.ONROAD, '#FDD231'],
        [StatusCargoEnum.ARRIVED, '#2196F3'],
        [StatusCargoEnum.ISSUED, '#03A075'],
        [StatusCargoEnum.RETURNED, '#D33833'],
    ]
)

export const mapOfStatusCargoIssue = new Map<string, string> (
    [
        [WAITING, 'Ожидание'],
        [PAID, 'Выплачено'],
        [ISSUED, 'Выдано'],
    ]
)

export const mapOfStatusColorCargoIssue = new Map<string, string> (
    [
        [WAITING, '#FDAD00'],
        [PAID, '#039F75'],
        [ISSUED, '#03A075'],
    ]
)

export const mapOfUnits = new Map<string, string>(
    [
        [THING, 'штука'],
        [TON, 'тонна'],
    ]
)
