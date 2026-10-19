"use client";

import { useRouter } from "next/navigation";
import HotelBasicInfoTab from "@/client-components/HotelBasicInfoTab";
import { API_ENDPOINTS } from "@/utility/constants";
import { useFetchPostAPI } from "@/utility/custom-hooks";

export default function CreateHotelPage() {
    const router = useRouter();
    const { fetchPostAPI, postingData } = useFetchPostAPI();

    function handleSave(formData) {
        fetchPostAPI(API_ENDPOINTS.ADD_HOTEL, formData, null, (response) => {
            const hotelId = response?.data?.data?.[0]?._id;
            if (hotelId) router.push(`/dashboard/hotels/${hotelId}`);
        });
    }

    return (
        <HotelBasicInfoTab
            hotel={null}
            onSave={handleSave}
            postingData={postingData}
            submitLabel="Create Hotel"
        />
    );
}
