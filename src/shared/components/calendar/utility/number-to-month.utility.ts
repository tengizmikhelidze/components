export function NumberToMonth(value: number | string | undefined): string {
    return NumberToMonthEnum[Number(value)]
}

export enum NumberToMonthEnum {
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
}
