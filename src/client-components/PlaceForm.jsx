"use client"

import Image from "next/image";
import { MdAdd } from "react-icons/md";
import { RiDeleteBin7Line } from "react-icons/ri";
import { handleImageChange, handleInputChange } from "@/utility/utility-function";

function hasImage(image) {
    return typeof image === "string"
        ? Boolean(image)
        : Boolean(image?.data || image?.url);
}

function SectionHeading({ title, onAdd }) {
    return (
        <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-semibold text-lg">{title}</h2>
            <button
                type="button"
                onClick={onAdd}
                className="flex items-center gap-1 cursor-pointer text-white px-4 py-2 rounded-md bg-primary hover:opacity-90"
            >
                <MdAdd />
                Add
            </button>
        </div>
    );
}

function RemoveButton({ onClick, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center justify-center text-lg text-red-800 border-2 border-red-800 p-1 hover:bg-red-200 cursor-pointer"
            title={`Remove ${label}`}
            aria-label={`Remove ${label}`}
        >
            <RiDeleteBin7Line />
        </button>
    );
}

function ImagePreview({ image, alt }) {
    const src = typeof image === "string" ? image : image?.data || image?.url;

    if (!src) return null;

    return (
        <Image
            src={src}
            alt={alt}
            width={160}
            height={100}
            unoptimized
            className="mt-2 h-24 w-auto object-cover rounded-md"
        />
    );
}

export default function PlaceForm({ formData, setFormData, onSubmit, postingData, submitLabel }) {
    function addItem(field, item) {
        setFormData((prev) => ({ ...prev, [field]: [...prev[field], item] }));
    }

    function updateItem(field, index, key, value) {
        setFormData((prev) => {
            const items = [...prev[field]];
            items[index] = { ...items[index], [key]: value };
            return { ...prev, [field]: items };
        });
    }

    function removeItem(field, index) {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, itemIndex) => itemIndex !== index),
        }));
    }

    function updateGalleryImage(index, file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => {
                const gallery = [...prev.gallery];
                gallery[index] = {
                    ...gallery[index],
                    image: { data: reader.result, name: file.name },
                };
                return { ...prev, gallery };
            });
        };
        reader.readAsDataURL(file);
    }

    return (
        <section>
            <form onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="sno" className="form-label">S.No.</label>
                        <input
                            placeholder="Enter the serial number"
                            type="text"
                            id="sno"
                            name="sno"
                            value={formData.sno}
                            onChange={(e) => handleInputChange(e, setFormData)}
                            className="form-input"
                        />
                        <p className="gray-600 text-xs">Leave this field empty if you want to add the Place in the last</p>
                    </div>

                    <div>
                        <label htmlFor="title" className="form-label">Title</label>
                        <input
                            placeholder="Enter the place title"
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange(e, setFormData)}
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
                            onChange={(e) => handleInputChange(e, setFormData)}
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
                            onChange={(e) => handleInputChange(e, setFormData)}
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
                            onChange={(e) => handleInputChange(e, setFormData)}
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
                            onChange={(e) => handleInputChange(e, setFormData)}
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
                        onChange={(e) => handleInputChange(e, setFormData)}
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
                        onChange={(e) => handleInputChange(e, setFormData)}
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
                        onChange={(e) => handleInputChange(e, setFormData)}
                        rows="3"
                        className="form-input"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="image" className="form-label">Image</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, setFormData)}
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
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, setFormData)}
                            className="form-input"
                            required={!hasImage(formData.banner)}
                        />
                        <ImagePreview image={formData.banner} alt="Place banner preview" />
                    </div>
                </div>

                <div className="mb-4">
                    <SectionHeading
                        title="Arti Timings"
                        onAdd={() => addItem("artiTimings", { name: "", time: "" })}
                    />
                    <div className="space-y-3">
                        {formData.artiTimings.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                                <div>
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => updateItem("artiTimings", index, "name", e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Time</label>
                                    <input
                                        type="text"
                                        value={item.time}
                                        onChange={(e) => updateItem("artiTimings", index, "time", e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <RemoveButton onClick={() => removeItem("artiTimings", index)} label="arti timing" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <SectionHeading
                        title="Gallery"
                        onAdd={() => addItem("gallery", { image: "", title: "" })}
                    />
                    <div className="space-y-4">
                        {formData.gallery.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-4 items-end">
                                <div>
                                    <label className="form-label">Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => updateGalleryImage(index, e.target.files?.[0])}
                                        className="form-input"
                                    />
                                    <ImagePreview image={item.image} alt={item.title || "Gallery preview"} />
                                </div>
                                <div>
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => updateItem("gallery", index, "title", e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <RemoveButton onClick={() => removeItem("gallery", index)} label="gallery item" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <SectionHeading
                        title="Attractions"
                        onAdd={() => addItem("attractions", { title: "", distance: "", time: "", mode: "" })}
                    />
                    <div className="space-y-3">
                        {formData.attractions.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-3 items-end">
                                {[
                                    ["title", "Title"],
                                    ["distance", "Distance"],
                                    ["time", "Time"],
                                    ["mode", "Mode"],
                                ].map(([field, label]) => (
                                    <div key={field}>
                                        <label className="form-label">{label}</label>
                                        <input
                                            type="text"
                                            value={item[field]}
                                            onChange={(e) => updateItem("attractions", index, field, e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                ))}
                                <RemoveButton onClick={() => removeItem("attractions", index)} label="attraction" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-2">
                    <SectionHeading
                        title="Visitor Tips"
                        onAdd={() => addItem("visitorTips", { icon: "", label: "", description: "" })}
                    />
                    <div className="space-y-3">
                        {formData.visitorTips.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                                <div>
                                    <label className="form-label">Icon</label>
                                    <input
                                        type="text"
                                        value={item.icon}
                                        onChange={(e) => updateItem("visitorTips", index, "icon", e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="flex items-end gap-3">
                                    <div className="flex-1">
                                        <label className="form-label">Label</label>
                                        <input
                                            type="text"
                                            value={item.label}
                                            onChange={(e) => updateItem("visitorTips", index, "label", e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    <RemoveButton onClick={() => removeItem("visitorTips", index)} label="visitor tip" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        value={item.description}
                                        onChange={(e) => updateItem("visitorTips", index, "description", e.target.value)}
                                        rows="3"
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={postingData}
                        className="cursor-pointer text-white px-4 py-2 rounded-md bg-primary hover:opacity-90 disabled:opacity-60"
                    >
                        {postingData ? (submitLabel === "Add Place" ? "Adding..." : "Updating...") : submitLabel}
                    </button>
                </div>
            </form>
        </section>
    );
}
