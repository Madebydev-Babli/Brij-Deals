"use client"

import { useState, useEffect } from "react";
import LoadingComponent from "@/server-components/LoadingComponent";
import { API_ENDPOINTS } from "@/utility/constants";
import { useFetchGetAPI, useFetchPostAPI } from "@/utility/custom-hooks";
import SharedSocialMediaFields from "@/client-components/SharedSocialMediaFields";

const emptySocialMedia = {
        restaurentId: '',
        whatsApp: "",
        instagram: "",
        facebook: "",
        youtube: "",
        website: "",
        googleReviewLink: "",
};

function SocialMediaForm({ restaurentId, initialData }) {
    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const [formData, setFormData] = useState(initialData);

    async function handleSubmit(e) {
        e.preventDefault();
        fetchPostAPI(API_ENDPOINTS.ADD_SOCIAL_MEDIA, { ...formData, restaurentId }, null);
    }

    function updateField(field, value) {
        setFormData((current) => ({ ...current, [field]: value }));
    }

    return (
        <>
            <section>

                <form onSubmit={handleSubmit}>
                    <SharedSocialMediaFields
                        fields={[
                            { name: "whatsApp", label: "WhatsApp", placeholder: "Enter the WhatsApp Number" },
                            { name: "instagram", label: "Instagram", placeholder: "Enter the Instagram Username" },
                            { name: "facebook", label: "Facebook", placeholder: "Enter the Facebook Username" },
                            { name: "youtube", label: "YouTube", placeholder: "Enter the YouTube Channel" },
                            { name: "website", label: "Website", placeholder: "Enter the Website" },
                            { name: "googleReviewLink", label: "Google Review Link", placeholder: "Enter the Google Review Link" },
                        ]}
                        value={formData}
                        onChange={updateField}
                        saving={postingData}
                        submitLabel="Update Schedule"
                    />
                </form>

            </section >

        </>
    );
}

export function SocialMediaTab({ restaurentId }) {
    const { fetchGetAPI, dataList, fetchingData, query } = useFetchGetAPI();

    useEffect(() => {
        fetchGetAPI(API_ENDPOINTS.FETCH_SOCIAL_MEDIAS, { restaurentId });
    }, [fetchGetAPI, query, restaurentId]);

    if (fetchingData) {
        return <LoadingComponent message="Loading Social Media Details..." />;
    }

    const initialData = dataList?.[0] || emptySocialMedia;
    return <SocialMediaForm key={initialData._id || "new"} restaurentId={restaurentId} initialData={initialData} />;
}