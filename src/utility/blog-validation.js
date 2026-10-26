export function hasMeaningfulBlogContent(content) {
    if (typeof content !== "string") return false;

    const text = content
        .replace(/&nbsp;|&#160;|&#xA0;/gi, " ")
        .replace(/&(?:ensp|emsp|thinsp|hairsp);/gi, " ")
        .replace(/&#(\d+);/g, (_, code) => {
            const point = Number(code);
            return Number.isInteger(point) && point <= 0x10ffff
                ? String.fromCodePoint(point)
                : " ";
        })
        .replace(/&#x([0-9a-f]+);/gi, (_, code) => {
            const point = parseInt(code, 16);
            return Number.isInteger(point) && point <= 0x10ffff
                ? String.fromCodePoint(point)
                : " ";
        })
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&apos;/gi, "'")
        .replace(/<[^>]*>/g, "")
        .replace(/[\s\u200B-\u200D\uFEFF]/g, "");

    return text.length > 0;
}

export function isValidBlogDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value.split("-").map(Number);
    if (month < 1 || month > 12) return false;

    const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const daysInMonth = [
        31,
        leapYear ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ];

    return day >= 1 && day <= daysInMonth[month - 1];
}
