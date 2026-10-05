"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LoadingComponent from "@/server-components/LoadingComponent";
import NoDataComponent from "@/server-components/NoDataComponent";
import { API_ENDPOINTS } from "@/utility/constants";
import { useFetchDetailsAPI, useFetchPostAPI } from "@/utility/custom-hooks";
import PlaceForm from "@/client-components/PlaceForm";

const initialFormData = {
    _id: "",
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

function normalizePlaceData(place) {
    return {
        ...initialFormData,
        _id: place?._id || "",
        sno: place?.sno ?? "",
        title: place?.title || "",
        description: place?.description || "",
        history: place?.history || "",
        image: place?.image || "",
        banner: place?.banner || "",
        location: place?.location || "",
        openingTime: place?.openingTime || "",
        closingTime: place?.closingTime || "",
        mapEmbed: place?.mapEmbed || "",
        mapLink: place?.mapLink || "",
        artiTimings: Array.isArray(place?.artiTimings) ? place.artiTimings : [],
        gallery: Array.isArray(place?.gallery)
            ? place.gallery.map((item) => ({ ...item, image: item?.image || "" }))
            : [],
        attractions: Array.isArray(place?.attractions) ? place.attractions : [],
        visitorTips: Array.isArray(place?.visitorTips) ? place.visitorTips : [],
    };
}

export default function EditPlacePage() {
    const { id } = useParams();
    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const { fetchDetailsAPI, fetchingDetails } = useFetchDetailsAPI();
    const [formData, setFormData] = useState(initialFormData);
    const [requestedPlaceId, setRequestedPlaceId] = useState(null);

    useEffect(() => {
        if (!id) return;
        fetchDetailsAPI(API_ENDPOINTS.FETCH_PLACES, id, (place) => {
            setFormData(normalizePlaceData(place));
        }).finally(() => setRequestedPlaceId(id));
    }, [id]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!formData._id) return;
        fetchPostAPI(API_ENDPOINTS.ADD_PLACE, formData, "/dashboard/places");
    }

    if (fetchingDetails || (id && requestedPlaceId !== id)) {
        return <LoadingComponent message="Loading Place Details..." />;
    }

    if (!formData._id) {
        return <NoDataComponent message="Place not found" />;
    }

    return (
        <PlaceForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            postingData={postingData}
            submitLabel="Update Place"
        />
    );
}
