"use client"

import { useState } from "react";
import { API_ENDPOINTS } from "@/utility/constants";
import { useFetchPostAPI } from "@/utility/custom-hooks";
import PlaceForm from "@/client-components/PlaceForm";

const initialFormData = {
    sno: "",
    title: "",
    description: "",
    history: "",
    image: "",
    banner: "",
    location: "",
    openingTime: "",
    closingTime: "",
    mapEmbed: "",
    mapLink: "",
    artiTimings: [],
    gallery: [],
    attractions: [],
    visitorTips: [],
};

export default function AddNewPlacePage() {
    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const [formData, setFormData] = useState(initialFormData);

    function handleSubmit(e) {
        e.preventDefault();
        fetchPostAPI(API_ENDPOINTS.ADD_PLACE, formData, "/dashboard/places");
    }

    return (
        <PlaceForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            postingData={postingData}
            submitLabel="Add Place"
        />
    );
}
