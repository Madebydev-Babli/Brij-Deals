"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MdAdd, MdDelete } from "react-icons/md";

import LoadingComponent from "@/server-components/LoadingComponent";
import NoDataComponent from "@/server-components/NoDataComponent";
import { API_ENDPOINTS } from "@/utility/constants";
import { useFetchDetailsAPI, useFetchPostAPI } from "@/utility/custom-hooks";
import { handleImageChange, handleInputChange } from "@/utility/utility-function";

const initialFormData = {
    _id: "",
    sno: "",
    slug: "",
    title: "",
    description: "",
    history: "",
    image: "",
    banner: "",
    location: "",
    openingTime: "",
    closingTime: "",
    artiTimings: [],
    gallery: [],
    mapEmbed: "",
    mapLink: "",
    attractions: [],
    visitorTips: [],
};

function normalizePlaceData(place) {
    return {
        _id: place?._id || "",
        sno: place?.sno ?? "",
        slug: place?.slug || "",
        title: place?.title || "",
        description: place?.description || "",
        history: place?.history || "",
        image: place?.image || "",
        banner: place?.banner || "",
        location: place?.location || "",
        openingTime: place?.openingTime || "",
        closingTime: place?.closingTime || "",
        artiTimings: Array.isArray(place?.artiTimings) ? place.artiTimings : [],
        gallery: Array.isArray(place?.gallery)
            ? place.gallery.map((item) => ({
                  ...item,
                  image: item?.image || "",
              }))
            : [],
        mapEmbed: place?.mapEmbed || "",
        mapLink: place?.mapLink || "",
        attractions: Array.isArray(place?.attractions) ? place.attractions : [],
        visitorTips: Array.isArray(place?.visitorTips) ? place.visitorTips : [],
    };
}

export default function EditPlacePage() {
    const { id } = useParams();
    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const { fetchDetailsAPI, fetchingDetails } = useFetchDetailsAPI();

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (!id) return;

        fetchDetailsAPI(API_ENDPOINTS.FETCH_PLACES, id, (place) => {
            setFormData(normalizePlaceData(place));
        });
    }, [id]);

    function handleSubmit(e) {
        e.preventDefault();

        if (!formData?._id) {
            return;
        }

        fetchPostAPI(API_ENDPOINTS.ADD_PLACE, formData, "/dashboard/places");
    }

    function addAartiTiming() {
        setFormData((prev) => ({
            ...prev,
            artiTimings: [...prev.artiTimings, { name: "", time: "" }],
        }));
    }

    function updateAartiTiming(index, field, value) {
        setFormData((prev) => {
            const updated = [...prev.artiTimings];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, artiTimings: updated };
        });
    }

    function removeAartiTiming(index) {
        setFormData((prev) => ({
            ...prev,
            artiTimings: prev.artiTimings.filter((_, i) => i !== index),
        }));
    }

    function addGalleryItem() {
        setFormData((prev) => ({
            ...prev,
            gallery: [...prev.gallery, { image: "", title: "" }],
        }));
    }

    function updateGalleryTitle(index, value) {
        setFormData((prev) => {
            const updated = [...prev.gallery];
            updated[index] = { ...updated[index], title: value };
            return { ...prev, gallery: updated };
        });
    }

    function updateGalleryImage(index, file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => {
                const updated = [...prev.gallery];
                updated[index] = {
                    ...updated[index],
                    image: {
                        data: reader.result,
                        name: file.name,
                    },
                };
                return { ...prev, gallery: updated };
            });
        };
        reader.readAsDataURL(file);
    }

    function removeGalleryItem(index) {
        setFormData((prev) => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index),
        }));
    }

    function addAttraction() {
        setFormData((prev) => ({
            ...prev,
            attractions: [...prev.attractions, { title: "", distance: "", time: "", mode: "" }],
        }));
    }

    function updateAttraction(index, field, value) {
        setFormData((prev) => {
            const updated = [...prev.attractions];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, attractions: updated };
        });
    }

    function removeAttraction(index) {
        setFormData((prev) => ({
            ...prev,
            attractions: prev.attractions.filter((_, i) => i !== index),
        }));
    }

    function addVisitorTip() {
        setFormData((prev) => ({
            ...prev,
            visitorTips: [...prev.visitorTips, { icon: "", label: "", description: "" }],
        }));
    }

    function updateVisitorTip(index, field, value) {
        setFormData((prev) => {
            const updated = [...prev.visitorTips];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, visitorTips: updated };
        });
    }

    function removeVisitorTip(index) {
        setFormData((prev) => ({
            ...prev,
            visitorTips: prev.visitorTips.filter((_, i) => i !== index),
        }));
    }

    function renderImagePreview(imageValue, altText) {
        if (!imageValue) return null;

        const src = imageValue?.data || imageValue?.url || "";

        if (!src) return null;

        return (
            <div className="relative mt-4 w-full h-52 overflow-hidden rounded-xl border border-gray-200">
                <img src={src} alt={altText} className="h-full w-full object-cover" />
            </div>
        );
    }

    if (fetchingDetails) {
        return <LoadingComponent message="Loading Place Details..." />;
    }

    if (!fetchingDetails && !formData?._id) {
        return <NoDataComponent message="Place not found" />;
    }

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-5">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                        <p className="text-sm text-gray-500 mt-1">Update the core details of the place.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="form-label">S.No.</label>
                            <input
                                type="number"
                                name="sno"
                                value={formData.sno}
                                onChange={(e) => handleInputChange(e, setFormData)}
                                className="form-input"
                                placeholder="Optional"
                            />
                        </div>

                        <div>
                            <label className="form-label">Slug</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={(e) => handleInputChange(e, setFormData)}
                                className="form-input"
                                placeholder="Auto-generated from title"
                            />
                        </div>

                        <div>
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange(e, setFormData)}
                                className="form-input"
                                placeholder="e.g. Banke Bihari Temple"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={(e) => handleInputChange(e, setFormData)}
                                className="form-input"
                                placeholder="e.g. Vrindavan, Mathura"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Opening Time</label>
                            <input
                                type="text"
                                name="openingTime"
                                value={formData.openingTime}
                                onChange={(e) => handleInputChange(e, setFormData)}
                                className="form-input"
                                placeholder="e.g. 7:00 AM"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Closing Time</label>
                            <input
                                type="text"
                                name="closingTime"
                                value={formData.closingTime}
                                onChange={(e) => handleInputChange(e, setFormData)}
                                className="form-input"
                                placeholder="e.g. 9:00 PM"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange(e, setFormData)}
                            className="form-input min-h-[140px]"
                            placeholder="Short description of the place"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="form-label">History</label>
                        <textarea
                            name="history"
                            value={formData.history}
                            onChange={(e) => handleInputChange(e, setFormData)}
                            className="form-input min-h-[180px]"
                            placeholder="History of the place"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="form-label">Map Embed URL</label>
                        <textarea
                            name="mapEmbed"
                            value={formData.mapEmbed}
                            onChange={(e) => handleInputChange(e, setFormData)}
                            className="form-input min-h-[90px]"
                            placeholder="Google Maps embed URL"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="form-label">Map Link</label>
                        <input
                            type="url"
                            name="mapLink"
                            value={formData.mapLink}
                            onChange={(e) => handleInputChange(e, setFormData)}
                            className="form-input"
                            placeholder="Google Maps URL"
                        />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-5">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Main Images</h2>
                        <p className="text-sm text-gray-500 mt-1">Update the image and banner shown on the public place page.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="form-label">Main Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                name="image"
                                onChange={(e) => handleImageChange(e, setFormData, "image")}
                                className="form-input"
                            />
                            {renderImagePreview(formData.image, "Main place preview")}
                        </div>

                        <div>
                            <label className="form-label">Banner Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                name="banner"
                                onChange={(e) => handleImageChange(e, setFormData, "banner")}
                                className="form-input"
                            />
                            {renderImagePreview(formData.banner, "Place banner preview")}
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-5">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Aarti Timings</h2>
                            <p className="text-sm text-gray-500 mt-1">Add or update daily ritual timings.</p>
                        </div>

                        <button
                            type="button"
                            onClick={addAartiTiming}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold cursor-pointer"
                        >
                            <MdAdd size={20} />
                            Add
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.artiTimings.length === 0 && (
                            <p className="text-sm text-gray-400 border border-dashed border-gray-300 rounded-lg p-5 text-center">
                                No aarti timings added.
                            </p>
                        )}

                        {formData.artiTimings.map((arti, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 p-4 bg-gray-50 rounded-xl">
                                <input
                                    type="text"
                                    value={arti.name}
                                    onChange={(e) => updateAartiTiming(index, "name", e.target.value)}
                                    className="form-input"
                                    placeholder="Aarti name"
                                />

                                <input
                                    type="text"
                                    value={arti.time}
                                    onChange={(e) => updateAartiTiming(index, "time", e.target.value)}
                                    className="form-input"
                                    placeholder="e.g. 6:30 AM"
                                />

                                <button
                                    type="button"
                                    onClick={() => removeAartiTiming(index)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                >
                                    <MdDelete size={22} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-5">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Gallery</h2>
                            <p className="text-sm text-gray-500 mt-1">Update gallery photos and titles.</p>
                        </div>

                        <button
                            type="button"
                            onClick={addGalleryItem}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold cursor-pointer"
                        >
                            <MdAdd size={20} />
                            Add
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.gallery.length === 0 && (
                            <p className="text-sm text-gray-400 border border-dashed border-gray-300 rounded-lg p-5 text-center">
                                No gallery images added.
                            </p>
                        )}

                        {formData.gallery.map((galleryItem, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-4 p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <label className="form-label">Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => updateGalleryImage(index, e.target.files?.[0])}
                                        className="form-input"
                                    />

                                    {galleryItem?.image?.data || galleryItem?.image?.url ? (
                                        <div className="relative mt-3 h-32 overflow-hidden rounded-lg border border-gray-200">
                                            <img
                                                src={galleryItem.image.data || galleryItem.image.url}
                                                alt={galleryItem.title || "Gallery preview"}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : null}
                                </div>

                                <div>
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        value={galleryItem.title}
                                        onChange={(e) => updateGalleryTitle(index, e.target.value)}
                                        className="form-input"
                                        placeholder="Gallery image title"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeGalleryItem(index)}
                                    className="p-2 h-fit text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                >
                                    <MdDelete size={22} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-5">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Nearby Attractions</h2>
                            <p className="text-sm text-gray-500 mt-1">Add or update attractions near the place.</p>
                        </div>

                        <button
                            type="button"
                            onClick={addAttraction}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold cursor-pointer"
                        >
                            <MdAdd size={20} />
                            Add
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.attractions.length === 0 && (
                            <p className="text-sm text-gray-400 border border-dashed border-gray-300 rounded-lg p-5 text-center">
                                No nearby attractions added.
                            </p>
                        )}

                        {formData.attractions.map((attraction, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-3 p-4 bg-gray-50 rounded-xl">
                                <input
                                    type="text"
                                    value={attraction.title}
                                    onChange={(e) => updateAttraction(index, "title", e.target.value)}
                                    className="form-input"
                                    placeholder="Attraction title"
                                />

                                <input
                                    type="text"
                                    value={attraction.distance}
                                    onChange={(e) => updateAttraction(index, "distance", e.target.value)}
                                    className="form-input"
                                    placeholder="Distance"
                                />

                                <input
                                    type="text"
                                    value={attraction.time}
                                    onChange={(e) => updateAttraction(index, "time", e.target.value)}
                                    className="form-input"
                                    placeholder="Travel time"
                                />

                                <input
                                    type="text"
                                    value={attraction.mode}
                                    onChange={(e) => updateAttraction(index, "mode", e.target.value)}
                                    className="form-input"
                                    placeholder="Mode"
                                />

                                <button
                                    type="button"
                                    onClick={() => removeAttraction(index)}
                                    className="p-2 h-fit text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                >
                                    <MdDelete size={22} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-5">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Visitor Tips</h2>
                            <p className="text-sm text-gray-500 mt-1">Add useful information for visitors.</p>
                        </div>

                        <button
                            type="button"
                            onClick={addVisitorTip}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold cursor-pointer"
                        >
                            <MdAdd size={20} />
                            Add
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.visitorTips.length === 0 && (
                            <p className="text-sm text-gray-400 border border-dashed border-gray-300 rounded-lg p-5 text-center">
                                No visitor tips added.
                            </p>
                        )}

                        {formData.visitorTips.map((tip, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-3 p-4 bg-gray-50 rounded-xl">
                                <input
                                    type="text"
                                    value={tip.icon}
                                    onChange={(e) => updateVisitorTip(index, "icon", e.target.value)}
                                    className="form-input"
                                    placeholder="Icon name"
                                />

                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={tip.label}
                                        onChange={(e) => updateVisitorTip(index, "label", e.target.value)}
                                        className="form-input"
                                        placeholder="Tip title"
                                    />

                                    <textarea
                                        value={tip.description}
                                        onChange={(e) => updateVisitorTip(index, "description", e.target.value)}
                                        className="form-input min-h-[90px]"
                                        placeholder="Tip description"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeVisitorTip(index)}
                                    className="p-2 h-fit text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                >
                                    <MdDelete size={22} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pb-8">
                    <button
                        type="submit"
                        disabled={postingData}
                        className="px-7 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {postingData ? "Updating..." : "Update Place"}
                    </button>
                </div>
            </form>
        </section>
    );
}
