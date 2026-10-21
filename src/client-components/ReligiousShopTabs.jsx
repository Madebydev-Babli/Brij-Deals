"use client";

import { useState } from "react";
import Image from "next/image";
import CollectionTabEditor from "@/client-components/CollectionTabEditor";
import SharedSocialMediaFields from "@/client-components/SharedSocialMediaFields";

const socialFields = [
    { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/" },
    { name: "facebook", label: "Facebook", placeholder: "https://facebook.com/" },
    { name: "youtube", label: "YouTube", placeholder: "https://youtube.com/" },
    { name: "website", label: "Website", placeholder: "https://" },
];

function imageUrl(image) {
    return typeof image === "string" ? image : image?.data || image?.url || "";
}

function validateSerialNumber(formData, _view, records, editIndex) {
    const serialNumber = Number(formData.sno);
    if (!Number.isInteger(serialNumber) || serialNumber < 1) {
        return "Enter a valid serial number greater than zero.";
    }
    if (records.some((record, index) => index !== editIndex && Number(record.sno) === serialNumber)) {
        return "That serial number is already in use.";
    }
    return null;
}

export function ReligiousShopSocialMediaTab({ shop, onSave, saving }) {
    const [value, setValue] = useState(() => Object.fromEntries(
        socialFields.map(({ name }) => [name, shop?.[name] || ""]),
    ));

    function handleSubmit(event) {
        event.preventDefault();
        onSave(value);
    }

    return (
        <form onSubmit={handleSubmit}>
            <SharedSocialMediaFields
                fields={socialFields}
                value={value}
                onChange={(name, fieldValue) => setValue((previous) => ({ ...previous, [name]: fieldValue }))}
                saving={saving}
                submitLabel="Save Social Media"
            />
        </form>
    );
}

export function ReligiousShopProductsTab({ shop, onSave, saving }) {
    return (
        <CollectionTabEditor
            items={shop?.products}
            onSave={(products, onSuccess) => onSave({ products }, onSuccess)}
            saving={saving}
            title="Product"
            addLabel="Add Product"
            emptyMessage="No Products Found"
            persistSerialNumber
            validate={validateSerialNumber}
            fields={[
                { name: "sno", type: "number", min: 1, step: 1, required: true, helperText: "" },
                { name: "title", label: "Title", placeholder: "Enter the product title", required: true },
                { name: "price", label: "Price", placeholder: "Enter the price" },
                { name: "originalPrice", label: "Original Price", placeholder: "Enter the original price" },
                { name: "offer", label: "Offer", placeholder: "Enter the offer" },
                {
                    name: "description",
                    label: "Description",
                    type: "textarea",
                    placeholder: "Enter the product description",
                },
                { name: "image", label: "Product Image", type: "image" },
                {
                    name: "highlights",
                    label: "Highlights",
                    type: "textarea",
                    placeholder: "Enter one highlight per line",
                    toFormValue: (highlights) => Array.isArray(highlights) ? highlights.join("\n") : "",
                    fromFormValue: (highlights) => highlights.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
                },
            ]}
            columns={[
                { name: "sno", label: "S.N." },
                {
                    name: "image",
                    label: "Image",
                    render: (product) => {
                        const src = imageUrl(product.image);
                        return src
                            ? <Image src={src} alt={product.title || "Product"} width={48} height={48} unoptimized className="mx-auto h-12 w-12 rounded-md object-cover" />
                            : "N/A";
                    },
                },
                { name: "title", label: "Title" },
                { name: "price", label: "Price" },
                { name: "offer", label: "Offer" },
            ]}
            getMobileImage={(product) => imageUrl(product.image)}
            formLayout={[
                {
                    fields: ["sno", "title", "price", "originalPrice", "offer"],
                    className: "grid grid-cols-1 gap-4 mb-4 md:grid-cols-2",
                },
                { fields: ["description"], className: "mb-4" },
                { fields: ["image"], className: "mb-4" },
                { fields: ["highlights"], className: "mb-4" },
            ]}
        />
    );
}

export function ReligiousShopAttractionsTab({ shop, onSave, saving }) {
    return (
        <CollectionTabEditor
            items={shop?.attractions}
            onSave={(attractions, onSuccess) => onSave({ attractions }, onSuccess)}
            saving={saving}
            title="Attraction"
            addLabel="Add Attraction"
            emptyMessage="No Attractions Found"
            persistSerialNumber
            validate={validateSerialNumber}
            fields={[
                { name: "sno", type: "number", min: 1, step: 1, required: true, helperText: "" },
                { name: "title", label: "Title", placeholder: "Enter the attraction title", required: true },
                { name: "distance", label: "Distance", placeholder: "Enter the distance" },
                { name: "time", label: "Time", placeholder: "Enter the time or duration" },
                { name: "mode", label: "Mode", placeholder: "Enter the mode of travel" },
            ]}
            columns={[
                { name: "sno", label: "S.N." },
                { name: "title", label: "Title" },
                { name: "distance", label: "Distance" },
                { name: "time", label: "Time" },
                { name: "mode", label: "Mode" },
            ]}
            formLayout={[
                {
                    fields: ["sno", "title", "distance", "time", "mode"],
                    className: "grid grid-cols-1 gap-4 mb-4 md:grid-cols-2",
                },
            ]}
        />
    );
}
