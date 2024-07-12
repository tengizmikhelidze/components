export function NumberToDateString(value: number | undefined | string): string {
    return value ? typeof value === "number" ? value < 10 ? '0'+value.toString() :  value.toString() : value.toString() : "";
}
