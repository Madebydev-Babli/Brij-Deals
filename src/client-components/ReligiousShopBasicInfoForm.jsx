"use client";

import Image from "next/image";
import { LOCATION_ENUM } from "@/utility/utility-data";
import { handleImageChange, handleInputChange } from "@/utility/utility-function";

function imageSource(image) {
    return typeof image === "string" ? image : image?.data || image?.url || "";
}

function ShopImageInput({ name, label, image, setFormData }) {
    const source = imageSource(image);

    return (
        <div>
            <label htmlFor={name} className="form-label">{label}</label>
            <input
                type="file"
                id={name}
                name={name}
                accept="image/*"
                onChange={(event) => handleImageChange(event, setFormData)}
                className="form-input"
            />
            {source && (
                <Image
                    src={source}
                    alt={`${label} preview`}
                    width={160}
                    height={100}
                    unoptimized
                    className="mt-2 h-24 w-auto rounded-md object-cover"
                />
            )}
        </div>
    );
}

export default function ReligiousShopBasicInfoForm({
    formData,
    setFormData,
    onSubmit,
    postingData = false,
    submitLabel = "Save Basic Info",
}) {
    function handleSubmit(event) {
        event.preventDefault();

        const sno = Number(formData.sno);
        const snoField = event.currentTarget.elements.namedItem("sno");
        snoField.setCustomValidity(
            Number.isInteger(sno) && sno > 0
                ? ""
                : "S.No. must be a positive integer",
        );

        for (const name of ["title", "slug", "shortLocation"]) {
            const field = event.currentTarget.elements.namedItem(name);
            field.setCustomValidity(
                typeof formData[name] === "string" && formData[name].trim()
                    ? ""
                    : `${name === "shortLocation" ? "Short Location" : name} is required`,
            );
        }

        if (!event.currentTarget.reportValidity()) return;

        onSubmit(event, {
            ...formData,
            sno,
            title: formData.title.trim(),
            slug: formData.slug.trim(),
            shortLocation: formData.shortLocation.trim(),
        });
    }

    function handleRequiredFieldChange(event) {
        event.currentTarget.setCustomValidity("");
        handleInputChange(event, setFormData);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="sno" className="form-label">S.No. <span className="text-red-600">*</span></label>
                    <input required id="sno" name="sno" type="number" min="1" step="1" placeholder="Enter the serial number" value={formData.sno ?? ""} onChange={handleRequiredFieldChange} className="form-input" />
                </div>
                <div>
                    <label htmlFor="title" className="form-label">Title <span className="text-red-600">*</span></label>
                    <input required id="title" name="title" type="text" value={formData.title ?? ""} onChange={handleRequiredFieldChange} className="form-input" placeholder="Enter shop title" />
                </div>
                <div>
                    <label htmlFor="slug" className="form-label">Slug <span className="text-red-600">*</span></label>
                    <input required id="slug" name="slug" type="text" value={formData.slug ?? ""} onChange={handleRequiredFieldChange} className="form-input" placeholder="shop-slug" />
                </div>
                <div>
                    <label htmlFor="shortLocation" className="form-label">Short Location <span className="text-red-600">*</span></label>
                    <select required id="shortLocation" name="shortLocation" value={formData.shortLocation ?? ""} onChange={handleRequiredFieldChange} className="form-input">
                        <option value="">Select location</option>
                        {LOCATION_ENUM.map((location) => <option key={location} value={location}>{location}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="location" className="form-label">Location</label>
                    <input id="location" name="location" type="text" value={formData.location ?? ""} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" placeholder="Enter the full shop address" />
                </div>
                <div>
                    <label htmlFor="mapLink" className="form-label">Map Link</label>
                    <input id="mapLink" name="mapLink" type="text" value={formData.mapLink ?? ""} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" placeholder="Google Maps link" />
                </div>
                <div>
                    <label htmlFor="email" className="form-label">Email</label>
                    <input id="email" name="email" type="email" value={formData.email ?? ""} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" placeholder="shop@example.com" />
                </div>
                <div>
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input id="phone" name="phone" type="text" value={formData.phone ?? ""} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" placeholder="Phone number" />
                </div>
                <div>
                    <label htmlFor="whatsapp" className="form-label">WhatsApp</label>
                    <input id="whatsapp" name="whatsapp" type="text" value={formData.whatsapp ?? ""} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" placeholder="WhatsApp number" />
                </div>
                <div>
                    <label htmlFor="openingTime" className="form-label">Opening Time</label>
                    <input id="openingTime" name="openingTime" type="text" value={formData.openingTime ?? ""} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" placeholder="08:00 AM" />
                </div>
                <div>
                    <label htmlFor="closingTime" className="form-label">Closing Time</label>
                    <input id="closingTime" name="closingTime" type="text" value={formData.closingTime ?? ""} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" placeholder="10:30 PM" />
                </div>
                <div>
                    <label htmlFor="rating" className="form-label">Rating</label>
                    <input id="rating" name="rating" type="number" min="0" max="5" step="0.1" value={formData.rating ?? ""} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" placeholder="Enter a rating from 0 to 5" />
                </div>
                <div>
                    <label htmlFor="reviewCount" className="form-label">Review Count</label>
                    <input id="reviewCount" name="reviewCount" type="number" min="0" step="1" value={formData.reviewCount ?? ""} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" placeholder="Enter the number of reviews" />
                </div>
                <div>
                    <label htmlFor="googleReview" className="form-label">Google Review</label>
                    <input id="googleReview" name="googleReview" type="text" value={formData.googleReview ?? ""} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" placeholder="Google review link" />
                </div>
                <div>
                    <label htmlFor="startingPrice" className="form-label">Starting Price</label>
                    <input id="startingPrice" name="startingPrice" type="number" min="0" step="1" value={formData.startingPrice ?? ""} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" placeholder="Enter the starting price" />
                </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <ShopImageInput name="image" label="Main Image" image={formData.image} setFormData={setFormData} />
                <ShopImageInput name="logo" label="Logo" image={formData.logo} setFormData={setFormData} />
                <ShopImageInput name="banner" label="Banner" image={formData.banner} setFormData={setFormData} />
            </div>

            <div className="mb-2">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea id="description" name="description" value={formData.description ?? ""} onChange={(event) => handleInputChange(event, setFormData)} rows="4" className="form-input" placeholder="Enter shop description" />
            </div>

            <div className="mt-8 flex gap-3">
                <button type="submit" disabled={postingData} className="cursor-pointer rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-60">
                    {postingData ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
}
