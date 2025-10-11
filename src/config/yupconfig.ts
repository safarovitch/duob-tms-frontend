import {setLocale} from 'yup';

setLocale({
    string: {
        max: ({ max }: {max: number}): string => (`Количество символов не может превышать ${max}.`),
        min: ({ min }: {min: number}): string => (`Количество символов должно быть не меньше ${min}.`),
    },
    number: {
        positive: 'Сумма должна быть положительным числом'
    }
})
