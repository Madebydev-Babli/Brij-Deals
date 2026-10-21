"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReligiousShopBasicInfoForm from "@/client-components/ReligiousShopBasicInfoForm";
import { API_ENDPOINTS } from "@/utility/constants";
import { useFetchPostAPI } from "@/utility/custom-hooks";
import { initialReligiousShopFormData } from "@/utility/religious-shop-data";
import { toast } from "react-toastify";

export default function CreateReligiousShopPage() {
    const router = useRouter();
    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const [formData, setFormData] = useState(initialReligiousShopFormData);

    function handleSubmit(event) {
        event.preventDefault();
        fetchPostAPI(API_ENDPOINTS.ADD_RELIGIOUS_SHOP, formData, null, (response) => {
            const createdShop = response?.data?.data?.[0] || response?.data?.data;
            if (!createdShop?._id) {
                toast.error("Religious shop was created, but its ID was not returned.", { position: "top-right" });
                return;
            }
            router.push(`/dashboard/religious-shops/${createdShop._id}`);
        });
    }

    return (
        <section>
            <h1 className="mb-6 text-2xl font-semibold">Create Religious Shop</h1>
            <ReligiousShopBasicInfoForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                postingData={postingData}
                submitLabel="Create Religious Shop"
            />
        </section>
    );
}
