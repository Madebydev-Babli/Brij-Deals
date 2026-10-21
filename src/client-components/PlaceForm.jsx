"use client";

import Image from "next/image";
import CollectionTabEditor from "@/client-components/CollectionTabEditor";
import { handleImageChange, handleInputChange } from "@/utility/utility-function";

function hasImage(image) {
    return typeof image === "string"
        ? Boolean(image)
        : Boolean(image?.data || image?.url);
}

function imageUrl(image) {
    return typeof image === "string" ? image : image?.data || image?.url || "";
}

function ImagePreview({ image, alt }) {
    const src = imageUrl(image);
    if (!src) return null;

    return (
        <Image
            src={src}
            alt={alt}
            width={160}
            height={100}
            unoptimized
            className="mt-2 h-24 w-auto rounded-md object-cover"
        />
    );
}

function getCollectionTabConfig(tab, formData, onSaveSection, postingData) {
    const save = (field) => (records, onSuccess) =>
        onSaveSection(field, records, onSuccess);

    if (tab === "schedule") {
        return {
            items: formData.artiTimings,
            onSave: save("artiTimings"),
            saving: postingData,
            title: "Aarti Timing",
            addLabel: "Add Aarti Timing",
            emptyMessage: "No Aarti Timings Found",
            persistSerialNumber: true,
            fields: [
                { name: "sno", type: "number", min: 1, step: 1, required: true, helperText: "" },
                { name: "name", label: "Name", placeholder: "Enter the aarti name", required: true },
                { name: "time", label: "Time", placeholder: "Enter the aarti time", required: true },
            ],
            columns: [
                { name: "sno", label: "S.N." },
                { name: "name", label: "Name" },
                { name: "time", label: "Time" },
            ],
            formLayout: [
                {
                    fields: ["sno", "name", "time"],
                    className: "grid grid-cols-1 gap-4 mb-4 md:grid-cols-2",
                },
            ],
            validate: validateSerialNumber,
        };
    }

    if (tab === "attractions") {
        return {
            items: formData.attractions,
            onSave: save("attractions"),
            saving: postingData,
            title: "Attraction",
            addLabel: "Add Attraction",
            emptyMessage: "No Attractions Found",
            persistSerialNumber: true,
            fields: [
                { name: "sno", type: "number", min: 1, step: 1, required: true, helperText: "" },
                { name: "title", label: "Title", placeholder: "Enter the attraction title", required: true },
                { name: "distance", label: "Distance", placeholder: "Enter the distance" },
                { name: "time", label: "Time", placeholder: "Enter the time" },
                { name: "mode", label: "Mode", placeholder: "Enter the mode" },
            ],
            columns: [
                { name: "sno", label: "S.N." },
                { name: "title", label: "Title" },
                { name: "distance", label: "Distance" },
                { name: "time", label: "Time" },
                { name: "mode", label: "Mode" },
            ],
            formLayout: [
                {
                    fields: ["sno", "title", "distance", "time", "mode"],
                    className: "grid grid-cols-1 gap-4 mb-4 md:grid-cols-2",
                },
            ],
            validate: validateSerialNumber,
        };
    }

    if (tab === "visitor-tips") {
        return {
            items: formData.visitorTips,
            onSave: save("visitorTips"),
            saving: postingData,
            title: "Visitor Tip",
            addLabel: "Add Visitor Tip",
            emptyMessage: "No Visitor Tips Found",
            persistSerialNumber: true,
            fields: [
                { name: "sno", type: "number", min: 1, step: 1, required: true, helperText: "" },
                { name: "icon", label: "Icon", placeholder: "Enter the icon" },
                { name: "label", label: "Label", placeholder: "Enter the tip label", required: true },
                {
                    name: "description",
                    label: "Description",
                    placeholder: "Enter the tip description",
                    type: "textarea",
                    required: true,
                    wrapperClassName: "md:col-span-2",
                },
            ],
            columns: [
                { name: "sno", label: "S.N." },
                { name: "label", label: "Label" },
                { name: "description", label: "Description" },
                { name: "icon", label: "Icon" },
            ],
            formLayout: [
                {
                    fields: ["sno", "icon", "label"],
                    className: "grid grid-cols-1 gap-4 mb-4 md:grid-cols-2",
                },
                { fields: ["description"], className: "mb-4" },
            ],
            validate: validateSerialNumber,
        };
    }

    function validateSerialNumber(formData, _view, records, editIndex) {
        const serialNumber = Number(formData.sno);
        if (!Number.isInteger(serialNumber) || serialNumber < 1) {
            return "Enter a valid serial number greater than zero.";
        }
        if (records.some((record, index) =>
            index !== editIndex && Number(record.sno) === serialNumber,
        )) {
            return "That serial number is already in use.";
        }
        return null;
    }

    return {
        items: formData.gallery,
        onSave: save("gallery"),
        saving: postingData,
        title: "Image",
        addLabel: "Add Image",
        emptyMessage: "No Gallery Images Found",
        persistSerialNumber: true,
        fields: [
            {
                name: "sno",
                type: "number",
                min: 1,
                step: 1,
                required: true,
                helperText: "",
            },
            { name: "title", label: "Title", placeholder: "Enter the title" },
            { name: "image", label: "Image", type: "image", required: true },
        ],
        columns: [
            { name: "sno", label: "S.N." },
            {
                name: "image",
                label: "Image",
                render: (item) => {
                    const src = imageUrl(item.image);
                    return src
                        ? (
                            <Image
                                src={src}
                                alt={item.title || "Place gallery image"}
                                width={48}
                                height={48}
                                unoptimized
                                className="h-12 w-12 rounded-md object-cover"
                            />
                        )
                        : "N/A";
                },
            },
            { name: "title", label: "Title" },
        ],
        formLayout: [
            {
                fields: ["sno", "title"],
                className: "grid grid-cols-1 gap-4 mb-4 md:grid-cols-2",
            },
            { fields: ["image"], className: "mb-4" },
        ],
    };
}

export default function PlaceForm({
    formData,
    setFormData,
    onSubmit,
    onSaveSection,
    postingData,
    submitLabel,
    activeTab,
}) {
    if (activeTab && activeTab !== "basic-info") {
        const config = getCollectionTabConfig(
            activeTab,
            formData,
            onSaveSection,
            postingData,
        );
        return (
            <CollectionTabEditor
                key={activeTab}
                {...config}
            />
        );
    }

    return (
        <section>
            <form onSubmit={onSubmit}>
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="sno" className="form-label">S.No.</label>
                        <input
                            placeholder="Enter the serial number"
                            type="text"
                            id="sno"
                            name="sno"
                            value={formData.sno}
                            onChange={(event) => handleInputChange(event, setFormData)}
                            className="form-input"
                        />
                        <p className="gray-600 text-xs">Leave this field empty if you want to add the Place in the last</p>
                    </div>
                    <div>
                        <label htmlFor="title" className="form-label">Title</label>
                        <input
                            placeholder="Enter the title"
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={(event) => handleInputChange(event, setFormData)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className="form-label">Full Location/Address</label>
                        <input
                            placeholder="Enter the full place address"
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={(event) => handleInputChange(event, setFormData)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="openingTime" className="form-label">Opening Time</label>
                        <input
                            placeholder="Enter the opening time"
                            type="text"
                            id="openingTime"
                            name="openingTime"
                            value={formData.openingTime}
                            onChange={(event) => handleInputChange(event, setFormData)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="closingTime" className="form-label">Closing Time</label>
                        <input
                            placeholder="Enter the closing time"
                            type="text"
                            id="closingTime"
                            name="closingTime"
                            value={formData.closingTime}
                            onChange={(event) => handleInputChange(event, setFormData)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="mapLink" className="form-label">Map Link</label>
                        <input
                            placeholder="Enter the Google Maps link"
                            type="text"
                            id="mapLink"
                            name="mapLink"
                            value={formData.mapLink}
                            onChange={(event) => handleInputChange(event, setFormData)}
                            className="form-input"
                        />
                    </div>
                </div>
                <div className="mb-2">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        placeholder="Enter the description"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={(event) => handleInputChange(event, setFormData)}
                        rows="4"
                        className="form-input"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="history" className="form-label">History</label>
                    <textarea
                        placeholder="Enter the history"
                        id="history"
                        name="history"
                        value={formData.history}
                        onChange={(event) => handleInputChange(event, setFormData)}
                        rows="4"
                        className="form-input"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="mapEmbed" className="form-label">Map Embed</label>
                    <textarea
                        placeholder="Enter the Google Maps embed URL"
                        id="mapEmbed"
                        name="mapEmbed"
                        value={formData.mapEmbed}
                        onChange={(event) => handleInputChange(event, setFormData)}
                        rows="3"
                        className="form-input"
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="image" className="form-label">Image</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/jpeg,image/png"
                            onChange={(event) => handleImageChange(event, setFormData)}
                            className="form-input"
                            required={!hasImage(formData.image)}
                        />
                        <ImagePreview image={formData.image} alt="Place image preview" />
                    </div>
                    <div>
                        <label htmlFor="banner" className="form-label">Banner</label>
                        <input
                            type="file"
                            id="banner"
                            name="banner"
                            accept="image/jpeg,image/png"
                            onChange={(event) => handleImageChange(event, setFormData)}
                            className="form-input"
                            required={!hasImage(formData.banner)}
                        />
                        <ImagePreview image={formData.banner} alt="Place banner preview" />
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={postingData}
                        className="cursor-pointer rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
                    >
                        {postingData
                            ? submitLabel === "Add Place" ? "Adding..." : "Updating..."
                            : submitLabel}
                    </button>
                </div>
            </form>
        </section>
    );
}
