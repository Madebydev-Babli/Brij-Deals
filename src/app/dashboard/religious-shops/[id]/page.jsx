"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LoadingComponent from "@/server-components/LoadingComponent";
import NoDataComponent from "@/server-components/NoDataComponent";
import { API_ENDPOINTS } from "@/utility/constants";
import { useFetchDetailsAPI, useFetchPostAPI } from "@/utility/custom-hooks";
import { ReligiousShopForm, initialFormData } from "../create/page";

function normalizeReligiousShopData(shop) {
    return {
        ...initialFormData,
        _id: shop?._id || "",
        sno: shop?.sno ?? "",
        slug: shop?.slug || "",
        title: shop?.title || "",
        description: shop?.description || "",
        image: shop?.image || "",
        logo: shop?.logo || "",
        banner: shop?.banner || "",
        location: shop?.location || "",
        shortLocation: shop?.shortLocation || "",
        mapLink: shop?.mapLink || "",
        email: shop?.email || "",
        phone: shop?.phone || "",
        whatsapp: shop?.whatsapp || "",
        instagram: shop?.instagram || "",
        facebook: shop?.facebook || "",
        youtube: shop?.youtube || "",
        website: shop?.website || "",
        openingTime: shop?.openingTime || "",
        closingTime: shop?.closingTime || "",
        rating: shop?.rating ?? "",
        reviewCount: shop?.reviewCount ?? "",
        googleReview: shop?.googleReview || "",
        startingPrice: shop?.startingPrice ?? "",
        products: Array.isArray(shop?.products)
            ? shop.products.map((product) => ({
                    _id: product?._id || "",
                    title: product?.title || "",
                    description: product?.description || "",
                    price: product?.price ?? "",
                    originalPrice: product?.originalPrice ?? "",
                    offer: product?.offer ?? "",
                    image: product?.image || "",
                    highlights: Array.isArray(product?.highlights) ? product.highlights.map((highlight) => highlight || "") : [],
                }))
            : [],
        attractions: Array.isArray(shop?.attractions)
            ? shop.attractions.map((attraction) => ({
                    title: attraction?.title || "",
                    distance: attraction?.distance || "",
                    time: attraction?.time || "",
                    mode: attraction?.mode || "",
                }))
            : [],
    };
}

export default function EditReligiousShopPage() {
    const { id } = useParams();
    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const { fetchDetailsAPI, fetchingDetails } = useFetchDetailsAPI();
    const [formData, setFormData] = useState(initialFormData);
    const [requestedShopId, setRequestedShopId] = useState(null);

    useEffect(() => {
        if (!id) return;
        fetchDetailsAPI(API_ENDPOINTS.FETCH_RELIGIOUS_SHOPS, id, (shop) => {
            setFormData(normalizeReligiousShopData(shop));
        }).finally(() => setRequestedShopId(id));
    }, [id]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!formData._id) return;
        fetchPostAPI(API_ENDPOINTS.ADD_RELIGIOUS_SHOP, formData, "/dashboard/religious-shops");
    }

    if (fetchingDetails || (id && requestedShopId !== id)) {
        return <LoadingComponent message="Loading Religious Shop Details..." />;
    }

    if (!formData._id) {
        return <NoDataComponent message="Religious shop not found" />;
    }

    return (
        <ReligiousShopForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            postingData={postingData}
            submitLabel="Update Religious Shop"
        />
    );
}
