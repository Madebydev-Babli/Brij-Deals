import { toast } from "react-toastify";
import {
    IMAGE_UPLOAD_MESSAGES,
    getImageFileValidationMessage,
} from "@/utility/image-upload";

export function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);

    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${day} ${month} ${year}\n${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
}

export function formatDate(dateStr) {
    const date = new Date(dateStr);

    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

export function handleInputChange(e, ...args) {
    const setFormData = typeof args[0] === "function" ? args[0] : args[1];
    const fieldName = e?.target?.name;

    if (!setFormData || !fieldName) return;

    setFormData((prev) => ({
        ...prev,
        [fieldName]: e.target.value,
    }));
}

export function handleImageChange(e, ...args) {
    const setFormData = typeof args[0] === "function" ? args[0] : args[1];
    const fieldName = e?.target?.name || args[2] || "image";
    const file = e?.target?.files?.[0];

    if (!setFormData || !file) return;

    const validationMessage = getImageFileValidationMessage(file);
    if (validationMessage) {
        toast.error(validationMessage, { position: "top-right" });
        e.target.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: {
                data: reader.result,
                name: file.name,
            },
        }));
    };

    reader.onerror = () => {
        toast.error(IMAGE_UPLOAD_MESSAGES.unexpected, { position: "top-right" });
        e.target.value = "";
    };

    reader.readAsDataURL(file);
}
