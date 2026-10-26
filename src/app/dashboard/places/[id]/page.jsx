"use client"

import { useEffect, useState } from "react";
import {
    FaImages,
    FaInfoCircle,
    FaLightbulb,
    FaMapMarkerAlt,
    FaRegClock,
} from "react-icons/fa";
import { useParams } from "next/navigation";
import LoadingComponent from "@/server-components/LoadingComponent";
import NoDataComponent from "@/server-components/NoDataComponent";
import Tabs from "@/server-components/Tabs";
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
    const [activeTab, setActiveTab] = useState("basic-info");
    const [formData, setFormData] = useState(initialFormData);
    const [requestedPlaceId, setRequestedPlaceId] = useState(null);
    const tabs = [
        {
            id: "basic-info",
            label: "Basic Info",
            icon: <FaInfoCircle className="mr-2 inline" />,
        },
        {
            id: "schedule",
            label: "Schedule",
            icon: <FaRegClock className="mr-2 inline" />,
        },
        {
            id: "attractions",
            label: "Attractions",
            icon: <FaMapMarkerAlt className="mr-2 inline" />,
        },
        {
            id: "visitor-tips",
            label: "Visitor Tips",
            icon: <FaLightbulb className="mr-2 inline" />,
        },
        {
            id: "gallery",
            label: "Gallery",
            icon: <FaImages className="mr-2 inline" />,
        },
    ];

    useEffect(() => {
        if (!id) return;
        fetchDetailsAPI(API_ENDPOINTS.FETCH_PLACES, id, (place) => {
            setFormData(normalizePlaceData(place));
        }).finally(() => setRequestedPlaceId(id));
    }, [fetchDetailsAPI, id]);

    function handleSubmit(e, validatedFormData) {
        e.preventDefault();
        if (!formData._id) return;
        fetchPostAPI(API_ENDPOINTS.ADD_PLACE, validatedFormData, "/dashboard/places");
    }

    function handleSectionSave(field, items, onSuccess) {
        if (!formData._id) return;
        const updatedPlace = { ...formData, [field]: items };
        fetchPostAPI(
            API_ENDPOINTS.ADD_PLACE,
            updatedPlace,
            null,
            (response) => {
                const savedPlace = response?.data?.data;
                if (!savedPlace?._id) return;
                setFormData(normalizePlaceData(savedPlace));
                onSuccess?.();
            },
        );
    }

    if (fetchingDetails || (id && requestedPlaceId !== id)) {
        return <LoadingComponent message="Loading Place Details..." />;
    }

    if (!formData._id) {
        return <NoDataComponent message="Place not found" />;
    }

    return (
        <>
            <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            <PlaceForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onSaveSection={handleSectionSave}
                postingData={postingData}
                submitLabel="Update Place"
                activeTab={activeTab}
            />
        </>
    );
}
