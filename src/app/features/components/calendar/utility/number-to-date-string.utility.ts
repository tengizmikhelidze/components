export function NumberToDateString(value: number): string {
    return value < 10 ? '0'+value.toString() :  value.toString();
}
