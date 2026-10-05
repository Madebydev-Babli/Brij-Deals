"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LoadingComponent from "@/server-components/LoadingComponent";
import NoDataComponent from "@/server-components/NoDataComponent";
import { API_ENDPOINTS } from "@/utility/constants";
import { useFetchDetailsAPI, useFetchPostAPI } from "@/utility/custom-hooks";
import { HotelForm } from "../create/page";

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

function normalizeHotelData(hotel) {
    return {
        ...initialFormData,
        _id: hotel?._id || "",
        sno: hotel?.sno ?? "",
        slug: hotel?.slug || "",
        title: hotel?.title || "",
        description: hotel?.description || "",
        image: hotel?.image || "",
        logo: hotel?.logo || "",
        banner: hotel?.banner || "",
        location: hotel?.location || "",
        shortLocation: hotel?.shortLocation || "",
        mapLink: hotel?.mapLink || "",
        openingTime: hotel?.openingTime || "",
        closingTime: hotel?.closingTime || "",
        email: hotel?.email || "",
        phone: hotel?.phone || "",
        whatsapp: hotel?.whatsapp || "",
        instagram: hotel?.instagram || "",
        facebook: hotel?.facebook || "",
        youtube: hotel?.youtube || "",
        website: hotel?.website || "",
        rating: hotel?.rating ?? "",
        reviewCount: hotel?.reviewCount ?? "",
        googleReview: hotel?.googleReview || "",
        startingPrice: hotel?.startingPrice ?? "",
        roomCategories: Array.isArray(hotel?.roomCategories)
            ? hotel.roomCategories.map((room) => ({
                  _id: room?._id || "",
                  title: room?.title || "",
                  description: room?.description || "",
                  heroImage: room?.heroImage || "",
                  gallery: Array.isArray(room?.gallery)
                      ? room.gallery.map((item) => ({
                            ...item,
                            image: item?.image || "",
                        }))
                      : [],
                  size: room?.size || "",
                  bedType: room?.bedType || "",
                  bedQuantity: room?.bedQuantity ?? "",
                  guests: room?.guests ?? "",
                  price: room?.price ?? "",
                  amenities: Array.isArray(room?.amenities)
                      ? room.amenities.map((item) => (typeof item === "string" ? item : item?.name || item?.title || ""))
                      : [],
              }))
            : [],
        offers: Array.isArray(hotel?.offers)
            ? hotel.offers.map((offer) => ({
                  title: offer?.title || "",
                  description: offer?.description || "",
                  endDate: offer?.endDate || "",
              }))
            : [],
        amenities: Array.isArray(hotel?.amenities)
            ? hotel.amenities.map((amenity) => ({
                  name: amenity?.name || amenity?.title || "",
                  icon: amenity?.icon || "",
              }))
            : [],
        attractions: Array.isArray(hotel?.attractions)
            ? hotel.attractions.map((attraction) => ({
                  title: attraction?.title || "",
                  distance: attraction?.distance || "",
                  time: attraction?.time || "",
                  mode: attraction?.mode || "",
              }))
            : [],
        gallery: Array.isArray(hotel?.gallery)
            ? hotel.gallery.map((item) => ({
                  image: item?.image || "",
                  label: item?.label || "",
              }))
            : [],
    };
}

export default function EditHotelPage() {
    const { id } = useParams();
    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const { fetchDetailsAPI, fetchingDetails } = useFetchDetailsAPI();
    const [formData, setFormData] = useState(initialFormData);
    const [requestedHotelId, setRequestedHotelId] = useState(null);

    useEffect(() => {
        if (!id) return;
        fetchDetailsAPI(API_ENDPOINTS.FETCH_HOTELS, id, (hotel) => {
            setFormData(normalizeHotelData(hotel));
        }).finally(() => setRequestedHotelId(id));
    }, [id]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!formData._id) return;
        fetchPostAPI(API_ENDPOINTS.ADD_HOTEL, formData, "/dashboard/hotels");
    }

    if (fetchingDetails || (id && requestedHotelId !== id)) {
        return <LoadingComponent message="Loading Hotel Details..." />;
    }

    if (!formData._id) {
        return <NoDataComponent message="Hotel not found" />;
    }

    return (
        <HotelForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            postingData={postingData}
            submitLabel="Update Hotel"
        />
    );
}
