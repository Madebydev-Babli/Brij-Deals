"use client"

import { useState } from "react";
import { MdAdd } from "react-icons/md";
import { RiDeleteBin7Line } from "react-icons/ri";
import { API_ENDPOINTS } from "@/utility/constants";
import { LOCATION_ENUM } from "@/utility/utility-data";
import { useFetchPostAPI } from "@/utility/custom-hooks";
import { handleImageChange, handleInputChange } from "@/utility/utility-function";

export const initialFormData = {
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
    email: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    youtube: "",
    website: "",
    openingTime: "",
    closingTime: "",
    rating: "",
    reviewCount: "",
    googleReview: "",
    startingPrice: "",
    products: [],
    attractions: [],
};

function hasImage(image) {
    if (!image) return false;
    if (typeof image === "string") return Boolean(image);
    return Boolean(image?.data || image?.url);
}

function emptyProduct() {
    return {
        _id: "",
        title: "",
        description: "",
        price: "",
        originalPrice: "",
        offer: "",
        image: "",
        highlights: [],
    };
}

function emptyAttraction() {
    return {
        title: "",
        distance: "",
        time: "",
        mode: "",
    };
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

export function ReligiousShopForm({ formData, setFormData, onSubmit, submitLabel, postingData = false }) {
    function addProduct() {
        setFormData((prev) => ({ ...prev, products: [...prev.products, emptyProduct()] }));
    }

    function updateProduct(index, key, value) {
        setFormData((prev) => {
            const products = [...prev.products];
            products[index] = { ...products[index], [key]: value };
            return { ...prev, products };
        });
    }

    function removeProduct(index) {
        setFormData((prev) => ({
            ...prev,
            products: prev.products.filter((_, itemIndex) => itemIndex !== index),
        }));
    }

    function addAttraction() {
        setFormData((prev) => ({ ...prev, attractions: [...prev.attractions, emptyAttraction()] }));
    }

    function updateAttraction(index, key, value) {
        setFormData((prev) => {
            const attractions = [...prev.attractions];
            attractions[index] = { ...attractions[index], [key]: value };
            return { ...prev, attractions };
        });
    }

    function removeAttraction(index) {
        setFormData((prev) => ({
            ...prev,
            attractions: prev.attractions.filter((_, itemIndex) => itemIndex !== index),
        }));
    }

    function updateProductImage(index, file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => {
                const products = [...prev.products];
                products[index] = { ...products[index], image: { data: reader.result, name: file.name } };
                return { ...prev, products };
            });
        };
        reader.readAsDataURL(file);
    }

    function updateHighlight(index, highlightIndex, value) {
        setFormData((prev) => {
            const products = [...prev.products];
            const highlights = [...(products[index]?.highlights || [])];
            highlights[highlightIndex] = value;
            products[index] = { ...products[index], highlights };
            return { ...prev, products };
        });
    }

    function addHighlight(productIndex) {
        setFormData((prev) => {
            const products = [...prev.products];
            const highlights = [...(products[productIndex]?.highlights || [])];
            highlights.push("");
            products[productIndex] = { ...products[productIndex], highlights };
            return { ...prev, products };
        });
    }

    function removeHighlight(productIndex, highlightIndex) {
        setFormData((prev) => {
            const products = [...prev.products];
            const highlights = [...(products[productIndex]?.highlights || [])].filter((_, idx) => idx !== highlightIndex);
            products[productIndex] = { ...products[productIndex], highlights };
            return { ...prev, products };
        });
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
                        <input type="text" id="title" name="title" value={formData.title} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="Enter shop title" required />
                    </div>
                    <div>
                        <label htmlFor="slug" className="form-label">Slug</label>
                        <input type="text" id="slug" name="slug" value={formData.slug} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="shop-slug" />
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
                        <textarea id="description" name="description" value={formData.description} onChange={(e) => handleInputChange(e, setFormData)} rows="4" className="form-input" placeholder="Enter shop description" required />
                    </div>
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <h2 className="font-semibold text-lg mb-4">Images</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="image" className="form-label">Main Image</label>
                            <input type="file" id="image" name="image" accept="image/*" onChange={(e) => handleImageChange(e, setFormData)} className="form-input" required={!hasImage(formData.image)} />
                            <ImagePreview image={formData.image} alt="Shop main preview" />
                        </div>
                        <div>
                            <label htmlFor="logo" className="form-label">Logo</label>
                            <input type="file" id="logo" name="logo" accept="image/*" onChange={(e) => handleImageChange(e, setFormData)} className="form-input" required={!hasImage(formData.logo)} />
                            <ImagePreview image={formData.logo} alt="Shop logo preview" />
                        </div>
                        <div>
                            <label htmlFor="banner" className="form-label">Banner</label>
                            <input type="file" id="banner" name="banner" accept="image/*" onChange={(e) => handleImageChange(e, setFormData)} className="form-input" required={!hasImage(formData.banner)} />
                            <ImagePreview image={formData.banner} alt="Shop banner preview" />
                        </div>
                    </div>
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <h2 className="font-semibold text-lg mb-4">Location & Contact</h2>
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
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="shop@example.com" />
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
                            <label htmlFor="website" className="form-label">Website</label>
                            <input type="text" id="website" name="website" value={formData.website} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="https://" />
                        </div>
                    </div>
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <h2 className="font-semibold text-lg mb-4">Social Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="instagram" className="form-label">Instagram</label>
                            <input type="text" id="instagram" name="instagram" value={formData.instagram} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="https://instagram.com/" />
                        </div>
                        <div>
                            <label htmlFor="facebook" className="form-label">Facebook</label>
                            <input type="text" id="facebook" name="facebook" value={formData.facebook} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="https://facebook.com/" />
                        </div>
                        <div>
                            <label htmlFor="youtube" className="form-label">YouTube</label>
                            <input type="text" id="youtube" name="youtube" value={formData.youtube} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="https://youtube.com/" />
                        </div>
                        <div>
                            <label htmlFor="googleReview" className="form-label">Google Review</label>
                            <input type="text" id="googleReview" name="googleReview" value={formData.googleReview} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="https://maps.google.com/" />
                        </div>
                    </div>
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <h2 className="font-semibold text-lg mb-4">Business Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="openingTime" className="form-label">Opening Time</label>
                            <input type="text" id="openingTime" name="openingTime" value={formData.openingTime} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="08:00 AM" />
                        </div>
                        <div>
                            <label htmlFor="closingTime" className="form-label">Closing Time</label>
                            <input type="text" id="closingTime" name="closingTime" value={formData.closingTime} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="10:30 PM" />
                        </div>
                        <div>
                            <label htmlFor="rating" className="form-label">Rating</label>
                            <input type="number" step="0.1" min="0" max="5" id="rating" name="rating" value={formData.rating} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="4.5" />
                        </div>
                        <div>
                            <label htmlFor="reviewCount" className="form-label">Review Count</label>
                            <input type="number" id="reviewCount" name="reviewCount" value={formData.reviewCount} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="100" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="startingPrice" className="form-label">Starting Price</label>
                            <input type="number" id="startingPrice" name="startingPrice" value={formData.startingPrice} onChange={(e) => handleInputChange(e, setFormData)} className="form-input" placeholder="2500" required />
                        </div>
                    </div>
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <SectionHeading title="Products" onAdd={addProduct} />
                    {formData.products.map((product, index) => (
                        <div key={product._id || index} className="border rounded-xl p-4 mb-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium">Product #{index + 1}</h3>
                                <RemoveButton onClick={() => removeProduct(index)} label="Product" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Title</label>
                                    <input type="text" value={product.title} onChange={(e) => updateProduct(index, "title", e.target.value)} className="form-input" placeholder="Product title" />
                                </div>
                                <div>
                                    <label className="form-label">Price</label>
                                    <input type="text" value={product.price} onChange={(e) => updateProduct(index, "price", e.target.value)} className="form-input" placeholder="499" />
                                </div>
                                <div>
                                    <label className="form-label">Original Price</label>
                                    <input type="text" value={product.originalPrice} onChange={(e) => updateProduct(index, "originalPrice", e.target.value)} className="form-input" placeholder="799" />
                                </div>
                                <div>
                                    <label className="form-label">Offer</label>
                                    <input type="text" value={product.offer} onChange={(e) => updateProduct(index, "offer", e.target.value)} className="form-input" placeholder="35% OFF" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="form-label">Description</label>
                                    <textarea value={product.description} onChange={(e) => updateProduct(index, "description", e.target.value)} rows="3" className="form-input" placeholder="Product description" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="form-label">Product Image</label>
                                    <input type="file" accept="image/*" onChange={(e) => updateProductImage(index, e.target.files?.[0])} className="form-input" />
                                    <ImagePreview image={product.image} alt={`Product ${index + 1}`} />
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">Highlights</h4>
                                    <button type="button" onClick={() => addHighlight(index)} className="flex items-center gap-1 cursor-pointer text-white px-3 py-1.5 rounded-md bg-primary hover:opacity-90">
                                        <MdAdd />
                                        Add Highlight
                                    </button>
                                </div>
                                {(product.highlights || []).map((highlight, highlightIndex) => (
                                    <div key={highlightIndex} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={highlight}
                                            onChange={(e) => updateHighlight(index, highlightIndex, e.target.value)}
                                            className="form-input"
                                            placeholder="Highlight"
                                        />
                                        <RemoveButton onClick={() => removeHighlight(index, highlightIndex)} label="Highlight" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mb-6 border rounded-xl p-4">
                    <SectionHeading title="Nearby Attractions" onAdd={addAttraction} />
                    {formData.attractions.map((attraction, index) => (
                        <div key={index} className="border rounded-xl p-4 mb-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium">Attraction #{index + 1}</h3>
                                <RemoveButton onClick={() => removeAttraction(index)} label="Attraction" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Title</label>
                                    <input type="text" value={attraction.title} onChange={(e) => updateAttraction(index, "title", e.target.value)} className="form-input" placeholder="Attraction title" />
                                </div>
                                <div>
                                    <label className="form-label">Distance</label>
                                    <input type="text" value={attraction.distance} onChange={(e) => updateAttraction(index, "distance", e.target.value)} className="form-input" placeholder="0.5 km" />
                                </div>
                                <div>
                                    <label className="form-label">Time</label>
                                    <input type="text" value={attraction.time} onChange={(e) => updateAttraction(index, "time", e.target.value)} className="form-input" placeholder="10 Min Walk" />
                                </div>
                                <div>
                                    <label className="form-label">Mode</label>
                                    <input type="text" value={attraction.mode} onChange={(e) => updateAttraction(index, "mode", e.target.value)} className="form-input" placeholder="walk" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <button type="submit" disabled={postingData} className="cursor-pointer text-white px-4 py-2 rounded-md bg-primary hover:opacity-90">
                        {postingData ? "Saving..." : submitLabel}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default function AddNewReligiousShopPage() {
    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const [formData, setFormData] = useState(initialFormData);

    function handleSubmit(e) {
        e.preventDefault();
        fetchPostAPI(API_ENDPOINTS.ADD_RELIGIOUS_SHOP, formData, "/dashboard/religious-shops");
    }

    return (
        <ReligiousShopForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            submitLabel="Add Religious Shop"
            postingData={postingData}
        />
    );
}
