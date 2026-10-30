export function hasPublicText(value) {
    return typeof value === "string" && value.trim().length > 0;
}

export function hasPublicValue(value) {
    return hasPublicText(value) ||
        (typeof value === "number" && Number.isFinite(value));
}

export function getPublicImageUrl(value) {
    const url = typeof value === "string"
        ? value.trim()
        : typeof value?.url === "string"
            ? value.url.trim()
            : "";
    if (!url) return "";
    if (url.startsWith("/") || url.startsWith("data:image/")) return url;

    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
            ? url
            : "";
    } catch {
        return "";
    }
}

export function getGalleryImageUrl(item) {
    return getPublicImageUrl(item) ||
        getPublicImageUrl(item?.image) ||
        getPublicImageUrl(item?.url);
}

export function getPublicLinkUrl(value) {
    if (!hasPublicText(value)) return "";

    try {
        const url = new URL(value.trim());
        return url.protocol === "http:" || url.protocol === "https:"
            ? value.trim()
            : "";
    } catch {
        return "";
    }
}
