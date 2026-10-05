"use client"

import { useState } from "react";
import { MdAdd } from "react-icons/md";
import { RiDeleteBin7Line } from "react-icons/ri";
import { API_ENDPOINTS } from "@/utility/constants";
import { LOCATION_ENUM } from "@/utility/utility-data";
import { useFetchPostAPI } from "@/utility/custom-hooks";
import { handleImageChange, handleInputChange } from "@/utility/utility-function";

const initialFormData = {
    _id: "",
    sno: "",
    slug: "",
    title: "",
    description: "",
    image: "",
    logo: "",
    banner: "",
    location: "",
    shortLocation: "",
    mapLink: "",
    openingTime: "",
    closingTime: "",
    email: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    youtube: "",
    website: "",
    rating: "",
    reviewCount: "",
    googleReview: "",
    startingPrice: "",
    roomCategories: [],
    offers: [],
    amenities: [],
    attractions: [],
    gallery: [],
};

function hasImage(image) {
    if (!image) return false;
    if (typeof image === "string") return Boolean(image);
    return Boolean(image?.data || image?.url);
}

function emptyRoom() {
    return {
        _id: "",
        title: "",
        description: "",
        heroImage: "",
        gallery: [],
        size: "",
        bedType: "",
        bedQuantity: "",
        guests: "",
        price: "",
        amenities: [],
    };
}

function emptyOffer() {
    return { title: "", description: "", endDate: "" };
}

function emptyAmenity() {
    return { name: "", icon: "" };
}

function emptyAttraction() {
    return { title: "", distance: "", time: "", mode: "" };
}

function emptyGalleryItem() {
    return { image: "", label: "" };
}

function SectionHeading({ title, onAdd }) {
    return (
        <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-semibold text-lg">{title}</h2>
            <button type="button" onClick={onAdd} className="flex items-center gap-1 cursor-pointer text-white px-4 py-2 rounded-md bg-primary hover:opacity-90">
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
    return <img src={src} alt={alt} className="mt-2 h-24 w-auto object-cover rounded-md" />;
}

export function HotelForm({ formData, setFormData, onSubmit, submitLabel, postingData = false }) {

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

    function updateRoomHeroImage(roomIndex, file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => {
                const roomCategories = [...prev.roomCategories];
                roomCategories[roomIndex] = {
                    ...roomCategories[roomIndex],
                    heroImage: { data: reader.result, name: file.name },
                };
                return { ...prev, roomCategories };
            });
        };
        reader.readAsDataURL(file);
    }

    function updateRoomGalleryImage(roomIndex, galleryIndex, file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => {
                const roomCategories = [...prev.roomCategories];
                const roomGallery = [...(roomCategories[roomIndex]?.gallery || [])];
                roomGallery[galleryIndex] = {
                    ...roomGallery[galleryIndex],
                    image: { data: reader.result, name: file.name },
                };
                roomCategories[roomIndex] = { ...roomCategories[roomIndex], gallery: roomGallery };
                return { ...prev, roomCategories };
            });
        };
        reader.readAsDataURL(file);
    }

    function updateHotelGalleryImage(index, file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => {
                const gallery = [...prev.gallery];
                gallery[index] = { ...gallery[index], image: { data: reader.result, name: file.name } };
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
                        <input type="text" id="sno" name="sno" value={formData.sno} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="Enter serial number" />
                    </div>
                    <div>
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="Enter hotel title" required />
                    </div>
                    <div>
                        <label htmlFor="slug" className="form-label">Slug</label>
                        <input type="text" id="slug" name="slug" value={formData.slug} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="hotel-slug" />
                    </div>
                    <div>
                        <label htmlFor="shortLocation" className="form-label">Short Location</label>
                        <select id="shortLocation" name="shortLocation" value={formData.shortLocation} onChange={(e) => handleInputChange(e, setFormData)} className="form-input">
                            <option value="">Select location</option>
                            {LOCATION_ENUM.map((location) => (
                                <option key={location} value={location}>{location}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={(e) => handleInputChange(e, setFormData)} rows="4" className="form-input" placeholder="Enter hotel description" required />
                    </div>
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <h2 className="font-semibold text-lg mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="location" className="form-label">Location</label>
                            <input type="text" id="location" name="location" value={formData.location} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="Full address" required />
                        </div>
                        <div>
                            <label htmlFor="mapLink" className="form-label">Map Link</label>
                            <input type="text" id="mapLink" name="mapLink" value={formData.mapLink} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="Google Maps link" />
                        </div>
                        <div>
                            <label htmlFor="openingTime" className="form-label">Opening Time</label>
                            <input type="text" id="openingTime" name="openingTime" value={formData.openingTime} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="09:00 AM" />
                        </div>
                        <div>
                            <label htmlFor="closingTime" className="form-label">Closing Time</label>
                            <input type="text" id="closingTime" name="closingTime" value={formData.closingTime} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="10:30 PM" />
                        </div>
                    </div>
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <h2 className="font-semibold text-lg mb-4">Hotel Images</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="image" className="form-label">Main Image</label>
                            <input type="file" id="image" name="image" accept="image/*" onChange={(e) => handleImageChange(e, setFormData)} className="form-input" required={!hasImage(formData.image)} />
                            <ImagePreview image={formData.image} alt="Hotel main preview" />
                        </div>
                        <div>
                            <label htmlFor="logo" className="form-label">Logo</label>
                            <input type="file" id="logo" name="logo" accept="image/*" onChange={(e) => handleImageChange(e, setFormData)} className="form-input" required={!hasImage(formData.logo)} />
                            <ImagePreview image={formData.logo} alt="Hotel logo preview" />
                        </div>
                        <div>
                            <label htmlFor="banner" className="form-label">Banner</label>
                            <input type="file" id="banner" name="banner" accept="image/*" onChange={(e) => handleImageChange(e, setFormData)} className="form-input" required={!hasImage(formData.banner)} />
                            <ImagePreview image={formData.banner} alt="Hotel banner preview" />
                        </div>
                    </div>
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="hello@hotel.com" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input type="text" id="phone" name="phone" value={formData.phone} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="9876543210" />
                        </div>
                        <div>
                            <label htmlFor="whatsapp" className="form-label">WhatsApp</label>
                            <input type="text" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="919876543210" />
                        </div>
                        <div>
                            <label htmlFor="googleReview" className="form-label">Google Review Link</label>
                            <input type="text" id="googleReview" name="googleReview" value={formData.googleReview} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="https://maps.google.com/..." />
                        </div>
                    </div>
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <h2 className="font-semibold text-lg mb-4">Social Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="instagram" className="form-label">Instagram</label>
                            <input type="text" id="instagram" name="instagram" value={formData.instagram} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="facebook" className="form-label">Facebook</label>
                            <input type="text" id="facebook" name="facebook" value={formData.facebook} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="youtube" className="form-label">YouTube</label>
                            <input type="text" id="youtube" name="youtube" value={formData.youtube} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="website" className="form-label">Website</label>
                            <input type="text" id="website" name="website" value={formData.website} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" />
                        </div>
                    </div>
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <h2 className="font-semibold text-lg mb-4">Hotel Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="rating" className="form-label">Rating</label>
                            <input type="number" min="0" max="5" step="0.1" id="rating" name="rating" value={formData.rating} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="4.5" />
                        </div>
                        <div>
                            <label htmlFor="reviewCount" className="form-label">Review Count</label>
                            <input type="number" id="reviewCount" name="reviewCount" value={formData.reviewCount} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="150" />
                        </div>
                        <div>
                            <label htmlFor="startingPrice" className="form-label">Starting Price</label>
                            <input type="number" id="startingPrice" name="startingPrice" value={formData.startingPrice} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="2500" required />
                        </div>
                    </div>
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <SectionHeading title="Room Categories" onAdd={() => addItem("roomCategories", emptyRoom())} />
                    <div className="space-y-5">
                        {formData.roomCategories.map((room, roomIndex) => (
                            <div key={roomIndex} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-medium">Room Category {roomIndex + 1}</h3>
                                    <RemoveButton onClick={() => removeItem("roomCategories", roomIndex)} label="room" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="form-label">Title</label>
                                        <input type="text" value={room.title} onChange={(e) => updateItem("roomCategories", roomIndex, "title", e.target.value)} className="form-input" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="form-label">Description</label>
                                        <textarea value={room.description} onChange={(e) => updateItem("roomCategories", roomIndex, "description", e.target.value)} rows="3" className="form-input" />
                                    </div>
                                    <div>
                                        <label className="form-label">Hero Image</label>
                                        <input type="file" accept="image/*" onChange={(e) => updateRoomHeroImage(roomIndex, e.target.files?.[0])} className="form-input" />
                                        <ImagePreview image={room.heroImage} alt={`Room ${roomIndex + 1} hero`} />
                                    </div>
                                    <div>
                                        <label className="form-label">Price</label>
                                        <input type="text" value={room.price} onChange={(e) => updateItem("roomCategories", roomIndex, "price", e.target.value)} className="form-input" placeholder="₹2500" />
                                    </div>
                                    <div>
                                        <label className="form-label">Size</label>
                                        <input type="text" value={room.size} onChange={(e) => updateItem("roomCategories", roomIndex, "size", e.target.value)} className="form-input" />
                                    </div>
                                    <div>
                                        <label className="form-label">Bed Type</label>
                                        <input type="text" value={room.bedType} onChange={(e) => updateItem("roomCategories", roomIndex, "bedType", e.target.value)} className="form-input" />
                                    </div>
                                    <div>
                                        <label className="form-label">Bed Quantity</label>
                                        <input type="number" value={room.bedQuantity} onChange={(e) => updateItem("roomCategories", roomIndex, "bedQuantity", e.target.value)} className="form-input" />
                                    </div>
                                    <div>
                                        <label className="form-label">Guests</label>
                                        <input type="number" value={room.guests} onChange={(e) => updateItem("roomCategories", roomIndex, "guests", e.target.value)} className="form-input" />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium">Amenities</h4>
                                        <button type="button" onClick={() => updateItem("roomCategories", roomIndex, "amenities", [...(room.amenities || []), ""]) } className="flex items-center gap-1 cursor-pointer text-primary text-sm"> <MdAdd /> Add Amenity</button>
                                    </div>
                                    <div className="space-y-2">
                                        {(room.amenities || []).map((amenity, amenityIndex) => (
                                            <div key={amenityIndex} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={amenity}
                                                    onChange={(e) => {
                                                        const nextAmenities = [...(room.amenities || [])];
                                                        nextAmenities[amenityIndex] = e.target.value;
                                                        updateItem("roomCategories", roomIndex, "amenities", nextAmenities);
                                                    }}
                                                    className="form-input flex-1"
                                                    placeholder="Amenity name"
                                                />
                                                <RemoveButton onClick={() => {
                                                    const nextAmenities = [...(room.amenities || [])];
                                                    nextAmenities.splice(amenityIndex, 1);
                                                    updateItem("roomCategories", roomIndex, "amenities", nextAmenities);
                                                }} label="room amenity" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium">Room Gallery</h4>
                                        <button type="button" onClick={() => {
                                            const nextGallery = [...(room.gallery || []), { image: "", label: "" }];
                                            updateItem("roomCategories", roomIndex, "gallery", nextGallery);
                                        }} className="flex items-center gap-1 cursor-pointer text-primary text-sm"><MdAdd /> Add Image</button>
                                    </div>
                                    <div className="space-y-3">
                                        {(room.gallery || []).map((galleryItem, galleryIndex) => (
                                            <div key={galleryIndex} className="grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-3 items-end">
                                                <div>
                                                    <label className="form-label">Image</label>
                                                    <input type="file" accept="image/*" onChange={(e) => updateRoomGalleryImage(roomIndex, galleryIndex, e.target.files?.[0])} className="form-input" />
                                                    <ImagePreview image={galleryItem.image} alt={`Gallery item ${galleryIndex + 1}`} />
                                                </div>
                                                <div>
                                                    <label className="form-label">Label</label>
                                                    <input type="text" value={galleryItem.label || ""} onChange={(e) => {
                                                        const nextGallery = [...(room.gallery || [])];
                                                        nextGallery[galleryIndex] = { ...nextGallery[galleryIndex], label: e.target.value };
                                                        updateItem("roomCategories", roomIndex, "gallery", nextGallery);
                                                    }} className="form-input" />
                                                </div>
                                                <RemoveButton onClick={() => {
                                                    const nextGallery = [...(room.gallery || [])];
                                                    nextGallery.splice(galleryIndex, 1);
                                                    updateItem("roomCategories", roomIndex, "gallery", nextGallery);
                                                }} label="room gallery item" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <SectionHeading title="Offers" onAdd={() => addItem("offers", emptyOffer())} />
                    <div className="space-y-3">
                        {formData.offers.map((offer, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end border rounded-lg p-3 bg-gray-50">
                                <div>
                                    <label className="form-label">Title</label>
                                    <input type="text" value={offer.title} onChange={(e) => updateItem("offers", index, "title", e.target.value)} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Description</label>
                                    <input type="text" value={offer.description} onChange={(e) => updateItem("offers", index, "description", e.target.value)} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">End Date</label>
                                    <input type="text" value={offer.endDate} onChange={(e) => updateItem("offers", index, "endDate", e.target.value)} className="form-input" />
                                </div>
                                <RemoveButton onClick={() => removeItem("offers", index)} label="offer" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <SectionHeading title="Amenities" onAdd={() => addItem("amenities", emptyAmenity())} />
                    <div className="space-y-3">
                        {formData.amenities.map((amenity, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end border rounded-lg p-3 bg-gray-50">
                                <div>
                                    <label className="form-label">Name</label>
                                    <input type="text" value={amenity.name} onChange={(e) => updateItem("amenities", index, "name", e.target.value)} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Icon</label>
                                    <input type="text" value={amenity.icon} onChange={(e) => updateItem("amenities", index, "icon", e.target.value)} className="form-input" placeholder="FaWifi" />
                                </div>
                                <RemoveButton onClick={() => removeItem("amenities", index)} label="amenity" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <SectionHeading title="Nearby Attractions" onAdd={() => addItem("attractions", emptyAttraction())} />
                    <div className="space-y-3">
                        {formData.attractions.map((attraction, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_auto] gap-3 items-end border rounded-lg p-3 bg-gray-50">
                                <div>
                                    <label className="form-label">Title</label>
                                    <input type="text" value={attraction.title} onChange={(e) => updateItem("attractions", index, "title", e.target.value)} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Distance</label>
                                    <input type="text" value={attraction.distance} onChange={(e) => updateItem("attractions", index, "distance", e.target.value)} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Time</label>
                                    <input type="text" value={attraction.time} onChange={(e) => updateItem("attractions", index, "time", e.target.value)} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Mode</label>
                                    <input type="text" value={attraction.mode} onChange={(e) => updateItem("attractions", index, "mode", e.target.value)} className="form-input" placeholder="Walk/Drive" />
                                </div>
                                <RemoveButton onClick={() => removeItem("attractions", index)} label="attraction" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <SectionHeading title="Hotel Gallery" onAdd={() => addItem("gallery", emptyGalleryItem())} />
                    <div className="space-y-3">
                        {formData.gallery.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-3 items-end border rounded-lg p-3 bg-gray-50">
                                <div>
                                    <label className="form-label">Image</label>
                                    <input type="file" accept="image/*" onChange={(e) => updateHotelGalleryImage(index, e.target.files?.[0])} className="form-input" />
                                    <ImagePreview image={item.image} alt={`Gallery image ${index + 1}`} />
                                </div>
                                <div>
                                    <label className="form-label">Label</label>
                                    <input type="text" value={item.label} onChange={(e) => updateItem("gallery", index, "label", e.target.value)} className="form-input" />
                                </div>
                                <RemoveButton onClick={() => removeItem("gallery", index)} label="gallery item" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <button type="submit" disabled={postingData} className="cursor-pointer text-white px-4 py-2 rounded-md bg-primary hover:opacity-90 disabled:opacity-60">
                        {postingData ? (submitLabel === "Add Hotel" ? "Adding..." : "Updating...") : submitLabel}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default function CreateHotelPage() {
    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const [formData, setFormData] = useState(initialFormData);

    async function handleSubmit(e) {
        e.preventDefault();
        fetchPostAPI(API_ENDPOINTS.ADD_HOTEL, formData, "/dashboard/hotels");
    }

    return <HotelForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} submitLabel="Add Hotel" postingData={postingData} />;
}
