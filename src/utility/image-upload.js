export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;

export const IMAGE_UPLOAD_MESSAGES = {
    tooLarge: "Image size must be 5 MB or less. Please choose a smaller image.",
    requestTooLarge: "The upload request is too large for the server to accept. Please choose a smaller image.",
    unsupported: "Unsupported image format. Please upload a supported image file.",
    rejected: "The image service rejected this upload. Please try again later or contact support.",
    network: "Upload couldn't connect. Please check your internet connection and try again.",
    timeout: "Image upload took too long. Please try again.",
    unexpected: "We couldn't upload your image right now. Please try again.",
};

export function isSupportedImageType(type) {
    return ["image/png", "image/jpg", "image/jpeg"].includes(type?.toLowerCase());
}

export function getImageFileValidationMessage(file) {
    if (file.size > MAX_IMAGE_UPLOAD_BYTES) return IMAGE_UPLOAD_MESSAGES.tooLarge;
    if (!isSupportedImageType(file.type)) return IMAGE_UPLOAD_MESSAGES.unsupported;
    return null;
}

export function getImageDataValidationCode(image, maxSize = MAX_IMAGE_UPLOAD_BYTES) {
    const [header, base64Data] = image.split(",", 2);
    const mimeType = header.match(/^data:([^;,]+);base64$/i)?.[1]?.toLowerCase();

    if (!isSupportedImageType(mimeType)) return "UNSUPPORTED_IMAGE_FORMAT";
    const padding = base64Data?.endsWith("==") ? 2 : base64Data?.endsWith("=") ? 1 : 0;
    const content = base64Data?.slice(0, base64Data.length - padding) || "";
    if (
        !base64Data
        || base64Data.length % 4 !== 0
        || /[^A-Za-z0-9+/]/.test(content)
        || (padding === 2 && content.length % 4 !== 2)
        || (padding === 1 && content.length % 4 !== 3)
    ) {
        return "INVALID_IMAGE_DATA";
    }

    const sizeInBytes = Math.floor((base64Data.length * 3) / 4) - padding;
    return sizeInBytes > maxSize ? "IMAGE_TOO_LARGE" : null;
}

export function getFriendlyImageUploadMessage(error) {
    const code = error?.code;
    const name = error?.name;
    const message = `${error?.message || ""} ${error?.http_code || ""}`.toLowerCase();
    const httpCode = Number(error?.http_code || error?.statusCode);

    if (
        code === "REQUEST_TOO_LARGE"
    ) {
        return IMAGE_UPLOAD_MESSAGES.requestTooLarge;
    }

    if (
        code === "IMAGE_TOO_LARGE"
        || httpCode === 413
        || /file size|image size|too large|request entity too large/.test(message)
    ) {
        return IMAGE_UPLOAD_MESSAGES.tooLarge;
    }

    if (
        code === "UNSUPPORTED_IMAGE_FORMAT"
        || httpCode === 415
        || /unsupported.*format|invalid image|unknown image format|resource_type/.test(message)
    ) {
        return IMAGE_UPLOAD_MESSAGES.unsupported;
    }

    if (httpCode >= 400 && httpCode < 500) {
        return IMAGE_UPLOAD_MESSAGES.rejected;
    }

    if (
        code === "ETIMEDOUT"
        || code === "ESOCKETTIMEDOUT"
        || name === "TimeoutError"
        || name === "AbortError"
        || /timed?\s*out|timeout/.test(message)
    ) {
        return IMAGE_UPLOAD_MESSAGES.timeout;
    }

    if (
        code === "ECONNRESET"
        || code === "ECONNREFUSED"
        || code === "ENOTFOUND"
        || code === "EAI_AGAIN"
        || name === "TypeError"
        || /network|connection|fetch failed|socket hang up/.test(message)
    ) {
        return IMAGE_UPLOAD_MESSAGES.network;
    }

    return IMAGE_UPLOAD_MESSAGES.unexpected;
}
