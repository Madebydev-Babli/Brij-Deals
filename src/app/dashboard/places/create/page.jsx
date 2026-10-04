
"use client";

import { useState } from "react";
import Image from "next/image";
import { MdAdd, MdDelete } from "react-icons/md";

import { API_ENDPOINTS } from "@/utility/constants";
import { useFetchPostAPI } from "@/utility/custom-hooks";
import {
    handleImageChange,
    handleInputChange,
} from "@/utility/utility-function";

export default function AddNewPlacePage() {
    const { fetchPostAPI, postingData } = useFetchPostAPI();

    const [formData, setFormData] = useState({
        sno: "",
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
    });

    function handleSubmit(e) {
        e.preventDefault();

        fetchPostAPI(
            API_ENDPOINTS.ADD_PLACE,
            formData,
            "/dashboard/places"
        );
    }

    /* -------------------------------------------------------
       Aarti Timings
    ------------------------------------------------------- */

    function addAartiTiming() {
        setFormData((prev) => ({
            ...prev,
            artiTimings: [
                ...prev.artiTimings,
                {
                    name: "",
                    time: "",
                },
            ],
        }));
    }

    function updateAartiTiming(index, field, value) {
        setFormData((prev) => {
            const updated = [...prev.artiTimings];

            updated[index] = {
                ...updated[index],
                [field]: value,
            };

            return {
                ...prev,
                artiTimings: updated,
            };
        });
    }

    function removeAartiTiming(index) {
        setFormData((prev) => ({
            ...prev,
            artiTimings: prev.artiTimings.filter(
                (_, i) => i !== index
            ),
        }));
    }

    /* -------------------------------------------------------
       Gallery
    ------------------------------------------------------- */

    function addGalleryItem() {
        setFormData((prev) => ({
            ...prev,
            gallery: [
                ...prev.gallery,
                {
                    image: "",
                    title: "",
                },
            ],
        }));
    }

    function updateGalleryTitle(index, value) {
        setFormData((prev) => {
            const updated = [...prev.gallery];

            updated[index] = {
                ...updated[index],
                title: value,
            };

            return {
                ...prev,
                gallery: updated,
            };
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

                return {
                    ...prev,
                    gallery: updated,
                };
            });
        };

        reader.readAsDataURL(file);
    }

    function removeGalleryItem(index) {
        setFormData((prev) => ({
            ...prev,
            gallery: prev.gallery.filter(
                (_, i) => i !== index
            ),
        }));
    }

    /* -------------------------------------------------------
       Attractions
    ------------------------------------------------------- */

    function addAttraction() {
        setFormData((prev) => ({
            ...prev,
            attractions: [
                ...prev.attractions,
                {
                    title: "",
                    distance: "",
                    time: "",
                    mode: "",
                },
            ],
        }));
    }

    function updateAttraction(index, field, value) {
        setFormData((prev) => {
            const updated = [...prev.attractions];

            updated[index] = {
                ...updated[index],
                [field]: value,
            };

            return {
                ...prev,
                attractions: updated,
            };
        });
    }

    function removeAttraction(index) {
        setFormData((prev) => ({
            ...prev,
            attractions: prev.attractions.filter(
                (_, i) => i !== index
            ),
        }));
    }

    /* -------------------------------------------------------
       Visitor Tips
    ------------------------------------------------------- */

    function addVisitorTip() {
        setFormData((prev) => ({
            ...prev,
            visitorTips: [
                ...prev.visitorTips,
                {
                    icon: "",
                    label: "",
                    description: "",
                },
            ],
        }));
    }

    function updateVisitorTip(index, field, value) {
        setFormData((prev) => {
            const updated = [...prev.visitorTips];

            updated[index] = {
                ...updated[index],
                [field]: value,
            };

            return {
                ...prev,
                visitorTips: updated,
            };
        });
    }

    function removeVisitorTip(index) {
        setFormData((prev) => ({
            ...prev,
            visitorTips: prev.visitorTips.filter(
                (_, i) => i !== index
            ),
        }));
    }

    return (
        <section>
            <form onSubmit={handleSubmit}>

                {/* -------------------------------------------------------
                    Basic Information
                ------------------------------------------------------- */}

                <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-5">

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Basic Information
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Add the basic details of the place.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className="form-label">
                                Serial Number
                            </label>

                            <input
                                type="number"
                                name="sno"
                                value={formData.sno}
                                onChange={(e) =>
                                    handleInputChange(
                                        e,
                                        formData,
                                        setFormData
                                    )
                                }
                                className="form-input"
                                placeholder="Optional"
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={(e) =>
                                    handleInputChange(
                                        e,
                                        formData,
                                        setFormData
                                    )
                                }
                                className="form-input"
                                placeholder="e.g. Banke Bihari Temple"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={(e) =>
                                    handleInputChange(
                                        e,
                                        formData,
                                        setFormData
                                    )
                                }
                                className="form-input"
                                placeholder="e.g. Vrindavan, Mathura"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Opening Time
                            </label>

                            <input
                                type="text"
                                name="openingTime"
                                value={formData.openingTime}
                                onChange={(e) =>
                                    handleInputChange(
                                        e,
                                        formData,
                                        setFormData
                                    )
                                }
                                className="form-input"
                                placeholder="e.g. 7:00 AM"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Closing Time
                            </label>

                            <input
                                type="text"
                                name="closingTime"
                                value={formData.closingTime}
                                onChange={(e) =>
                                    handleInputChange(
                                        e,
                                        formData,
                                        setFormData
                                    )
                                }
                                className="form-input"
                                placeholder="e.g. 9:00 PM"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Map Link
                            </label>

                            <input
                                type="url"
                                name="mapLink"
                                value={formData.mapLink}
                                onChange={(e) =>
                                    handleInputChange(
                                        e,
                                        formData,
                                        setFormData
                                    )
                                }
                                className="form-input"
                                placeholder="Google Maps URL"
                            />
                        </div>

                    </div>

                    <div className="mt-4">
                        <label className="form-label">
                            Map Embed URL
                        </label>

                        <textarea
                            name="mapEmbed"
                            value={formData.mapEmbed}
                            onChange={(e) =>
                                handleInputChange(
                                    e,
                                    formData,
                                    setFormData
                                )
                            }
                            className="form-input min-h-[90px]"
                            placeholder="Google Maps embed URL"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="form-label">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={(e) =>
                                handleInputChange(
                                    e,
                                    formData,
                                    setFormData
                                )
                            }
                            className="form-input min-h-[140px]"
                            placeholder="Short description of the place"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="form-label">
                            History
                        </label>

                        <textarea
                            name="history"
                            value={formData.history}
                            onChange={(e) =>
                                handleInputChange(
                                    e,
                                    formData,
                                    setFormData
                                )
                            }
                            className="form-input min-h-[180px]"
                            placeholder="History of the place"
                            required
                        />
                    </div>

                </div>

                {/* -------------------------------------------------------
                    Images
                ------------------------------------------------------- */}

                <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-5">

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Images
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Add the main image and banner image.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Main Image */}
                        <div>
                            <label className="form-label">
                                Main Image
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    handleImageChange(
                                        e,
                                        formData,
                                        setFormData,
                                        "image"
                                    )
                                }
                                className="form-input"
                                required
                            />

                            {formData.image?.data && (
                                <div className="relative mt-4 w-full h-52 rounded-xl overflow-hidden border border-gray-200">
                                    <Image
                                        src={formData.image.data}
                                        alt="Place preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Banner */}
                        <div>
                            <label className="form-label">
                                Banner Image
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    handleImageChange(
                                        e,
                                        formData,
                                        setFormData,
                                        "banner"
                                    )
                                }
                                className="form-input"
                                required
                            />

                            {formData.banner?.data && (
                                <div className="relative mt-4 w-full h-52 rounded-xl overflow-hidden border border-gray-200">
                                    <Image
                                        src={formData.banner.data}
                                        alt="Banner preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* -------------------------------------------------------
                    Aarti Timings
                ------------------------------------------------------- */}

                <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-5">

                    <div className="flex items-center justify-between gap-4 mb-6">

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Aarti Timings
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Add daily aarti or ritual timings.
                            </p>
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
                            <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 p-4 bg-gray-50 rounded-xl"
                            >

                                <input
                                    type="text"
                                    value={arti.name}
                                    onChange={(e) =>
                                        updateAartiTiming(
                                            index,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    className="form-input"
                                    placeholder="Aarti name"
                                />

                                <input
                                    type="text"
                                    value={arti.time}
                                    onChange={(e) =>
                                        updateAartiTiming(
                                            index,
                                            "time",
                                            e.target.value
                                        )
                                    }
                                    className="form-input"
                                    placeholder="e.g. 6:30 AM"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeAartiTiming(index)
                                    }
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                >
                                    <MdDelete size={22} />
                                </button>

                            </div>
                        ))}

                    </div>
                </div>

                {/* -------------------------------------------------------
                    Gallery
                ------------------------------------------------------- */}

                <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-5">

                    <div className="flex items-center justify-between gap-4 mb-6">

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Gallery
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Add photos and titles for the place gallery.
                            </p>
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
                            <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-4 p-4 bg-gray-50 rounded-xl"
                            >

                                <div>
                                    <label className="form-label">
                                        Image
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            updateGalleryImage(
                                                index,
                                                e.target.files?.[0]
                                            )
                                        }
                                        className="form-input"
                                    />

                                    {galleryItem.image?.data && (
                                        <div className="relative mt-3 h-32 rounded-lg overflow-hidden border border-gray-200">
                                            <Image
                                                src={galleryItem.image.data}
                                                alt={galleryItem.title || "Gallery"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="form-label">
                                        Title
                                    </label>

                                    <input
                                        type="text"
                                        value={galleryItem.title}
                                        onChange={(e) =>
                                            updateGalleryTitle(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="form-input"
                                        placeholder="Gallery image title"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeGalleryItem(index)
                                    }
                                    className="p-2 h-fit text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                >
                                    <MdDelete size={22} />
                                </button>

                            </div>
                        ))}

                    </div>
                </div>

                {/* -------------------------------------------------------
                    Attractions
                ------------------------------------------------------- */}

                <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-5">

                    <div className="flex items-center justify-between gap-4 mb-6">

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Nearby Attractions
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Add nearby places and travel information.
                            </p>
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
                            <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-3 p-4 bg-gray-50 rounded-xl"
                            >

                                <input
                                    type="text"
                                    value={attraction.title}
                                    onChange={(e) =>
                                        updateAttraction(
                                            index,
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    className="form-input"
                                    placeholder="Attraction title"
                                />

                                <input
                                    type="text"
                                    value={attraction.distance}
                                    onChange={(e) =>
                                        updateAttraction(
                                            index,
                                            "distance",
                                            e.target.value
                                        )
                                    }
                                    className="form-input"
                                    placeholder="Distance"
                                />

                                <input
                                    type="text"
                                    value={attraction.time}
                                    onChange={(e) =>
                                        updateAttraction(
                                            index,
                                            "time",
                                            e.target.value
                                        )
                                    }
                                    className="form-input"
                                    placeholder="Travel time"
                                />

                                <input
                                    type="text"
                                    value={attraction.mode}
                                    onChange={(e) =>
                                        updateAttraction(
                                            index,
                                            "mode",
                                            e.target.value
                                        )
                                    }
                                    className="form-input"
                                    placeholder="Mode"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeAttraction(index)
                                    }
                                    className="p-2 h-fit text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                >
                                    <MdDelete size={22} />
                                </button>

                            </div>
                        ))}

                    </div>
                </div>

                {/* -------------------------------------------------------
                    Visitor Tips
                ------------------------------------------------------- */}

                <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-5">

                    <div className="flex items-center justify-between gap-4 mb-6">

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Visitor Tips
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Add useful information for visitors.
                            </p>
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
                            <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-3 p-4 bg-gray-50 rounded-xl"
                            >

                                <input
                                    type="text"
                                    value={tip.icon}
                                    onChange={(e) =>
                                        updateVisitorTip(
                                            index,
                                            "icon",
                                            e.target.value
                                        )
                                    }
                                    className="form-input"
                                    placeholder="Icon name"
                                />

                                <div className="space-y-3">

                                    <input
                                        type="text"
                                        value={tip.label}
                                        onChange={(e) =>
                                            updateVisitorTip(
                                                index,
                                                "label",
                                                e.target.value
                                            )
                                        }
                                        className="form-input"
                                        placeholder="Tip title"
                                    />

                                    <textarea
                                        value={tip.description}
                                        onChange={(e) =>
                                            updateVisitorTip(
                                                index,
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className="form-input min-h-[90px]"
                                        placeholder="Tip description"
                                    />

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeVisitorTip(index)
                                    }
                                    className="p-2 h-fit text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                >
                                    <MdDelete size={22} />
                                </button>

                            </div>
                        ))}

                    </div>
                </div>

                {/* -------------------------------------------------------
                    Submit
                ------------------------------------------------------- */}

                <div className="flex justify-end pb-8">

                    <button
                        type="submit"
                        disabled={postingData}
                        className="px-7 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {postingData ? "Adding..." : "Add Place"}
                    </button>

                </div>

            </form>
        </section>
    );
}
