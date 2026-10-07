import cloudinary from "../../backend/configurations/cloudinary.config";

export async function uploadImage(image, folder, maxSize = 1024 * 1024) {
    try {

        if (typeof image?.startsWith === "function" && image?.startsWith("data:image")) {

            const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

            const mimeType = image.split(";")[0].split(":")[1];

            if (!allowedTypes.includes(mimeType)) {
                return { status: false, message: "Only PNG, JPG and JPEG images are allowed" };
            }

            const base64Data = image.split(",")[1];
            const sizeInBytes = Buffer.from(base64Data, "base64").length;

            if (sizeInBytes > maxSize) {
                return { status: false, message: `Image size should not be greater than ${maxSize / 1024 / 1024} MB` };
            }

            return await cloudinary.uploader.upload(image, { folder });
        }

        return null;

    } catch (error) {
        throw new Error("Image upload failed");
    }
}

export async function deleteImage(publicId) {
    try {
        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error("Image delete failed");
    }
}

export async function bulkDeleteImages(publicIds = []) {

    try {

        return await Promise.allSettled(publicIds.map(async (publicId) => await cloudinary.uploader.destroy(publicId)));

    } catch (error) {
        throw new Error("Image delete failed");
    }

};

export function clearSearch(obj) {
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "object") {
            clearSearch(value); // Corrected recursive call
        } else {
            if (typeof value === 'undefined' || (typeof value === 'string' && value.length < 1)) {
                delete obj[key];
            }
        }
    }
}

export async function getErrorMessage(error, session = null) {

    if (session && typeof session.inTransaction === "function" && session.inTransaction()) {
        try {
            await session.abortTransaction();
        } catch (abortError) {
            console.log("[Session Abort Skipped]", abortError?.message || abortError);
        }

        try {
            session.endSession();
        } catch (endError) {
            console.log("[Session End Skipped]", endError?.message || endError);
        }

        console.log("[Session Aborted]");
    }

    if (process.env.ENVIORNMENT === "development") {
        console.log("[Error]", error);
        return error?.message;
    }

    return "Something went wrong";
}

export function validatePassword(password) {

    if (!password) return { status: false, message: "Password is required" };

    const cleaned = password.toString().trim();

    if (cleaned.length < 8) return { status: false, message: "Password must be at least 8 characters long" };

    if (!/[a-z]/.test(cleaned)) return { status: false, message: "Password must contain at least one lowercase letter" };

    if (!/[A-Z]/.test(cleaned)) return { status: false, message: "Password must contain at least one uppercase letter" };

    if (!/[0-9]/.test(cleaned)) return { status: false, message: "Password must contain at least one number" };

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(cleaned)) return { status: false, message: "Password must contain at least one special character" };

    return { status: true, message: "Password is valid" };
}

export function isValidEmail(email) {

    if (!email) return { status: false, message: "Email is required" };

    const cleaned = email.toString().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(cleaned)) {
        return { status: true, message: "Email is valid" };
    } else {
        return { status: false, message: "Invalid email address" };
    }
}

export function isValidPhoneNumber(phone) {

    if (!phone) return { status: false, message: "Phone number is required" };

    let cleaned = phone.toString().replace(/\D/g, "");

    if (cleaned.length !== 10) return { status: false, message: "Invalid phone number" };

    const phoneRegex = /^[6-9]\d{9}$/;

    if (phoneRegex.test(cleaned)) return { status: true, message: `${phone} is valid phone number` };

    return { status: false, message: "Invalid phone number" };
}