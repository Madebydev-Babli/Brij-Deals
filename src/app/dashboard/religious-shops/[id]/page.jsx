"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaBoxOpen, FaInfoCircle, FaMapMarkerAlt, FaShareAlt } from "react-icons/fa";
import ReligiousShopBasicInfoForm from "@/client-components/ReligiousShopBasicInfoForm";
import {
    ReligiousShopAttractionsTab,
    ReligiousShopProductsTab,
    ReligiousShopSocialMediaTab,
} from "@/client-components/ReligiousShopTabs";
import Tabs from "@/server-components/Tabs";
import LoadingComponent from "@/server-components/LoadingComponent";
import NoDataComponent from "@/server-components/NoDataComponent";
import { API_ENDPOINTS } from "@/utility/constants";
import { useFetchDetailsAPI, useFetchPostAPI } from "@/utility/custom-hooks";
import { initialReligiousShopFormData } from "@/utility/religious-shop-data";

function normalizeReligiousShopData(shop) {
    return {
        ...initialReligiousShopFormData,
        ...shop,
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
                ...product,
                _id: product?._id || "",
                sno: product?.sno ?? "",
                title: product?.title || "",
                description: product?.description || "",
                price: product?.price ?? "",
                originalPrice: product?.originalPrice ?? "",
                offer: product?.offer ?? "",
                image: product?.image || "",
                highlights: Array.isArray(product?.highlights)
                    ? product.highlights.map((highlight) => highlight || "")
                    : [],
            }))
            : [],
        attractions: Array.isArray(shop?.attractions)
            ? shop.attractions.map((attraction) => ({
                ...attraction,
                sno: attraction?.sno ?? "",
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
    const [formData, setFormData] = useState(initialReligiousShopFormData);
    const [requestedShopId, setRequestedShopId] = useState(null);
    const [activeTab, setActiveTab] = useState("basic-info");

    const tabs = [
        { id: "basic-info", label: "Basic Info", icon: <FaInfoCircle className="mr-2 inline" /> },
        { id: "social-media", label: "Social Media", icon: <FaShareAlt className="mr-2 inline" /> },
        { id: "products", label: "Products", icon: <FaBoxOpen className="mr-2 inline" /> },
        { id: "attractions", label: "Attractions", icon: <FaMapMarkerAlt className="mr-2 inline" /> },
    ];

    useEffect(() => {
        if (!id) return;
        fetchDetailsAPI(API_ENDPOINTS.FETCH_RELIGIOUS_SHOPS, id, (shop) => {
            setFormData(normalizeReligiousShopData(shop));
        }).finally(() => setRequestedShopId(id));
    }, [fetchDetailsAPI, id]);

    function saveShop(changes, onSuccess) {
        if (!formData._id) return;
        const updatedShop = { ...formData, ...changes, _id: id };
        fetchPostAPI(API_ENDPOINTS.ADD_RELIGIOUS_SHOP, updatedShop, null, (response) => {
            const savedShop = response?.data?.data?.[0];
            if (!savedShop?._id) return;
            setFormData(normalizeReligiousShopData(savedShop));
            onSuccess?.();
        });
    }

    function handleBasicInfoSubmit(event, validatedFormData) {
        event.preventDefault();
        saveShop(validatedFormData);
    }

    function handleSectionSave(changes, onSuccess) {
        saveShop(changes, onSuccess);
    }

    if (fetchingDetails || (id && requestedShopId !== id)) {
        return <LoadingComponent message="Loading Religious Shop Details..." />;
    }

    if (!formData._id) {
        return <NoDataComponent message="Religious shop not found" />;
    }

    return (
        <>
            <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === "basic-info" && (
                <ReligiousShopBasicInfoForm
                    key={`${formData._id}-${formData.updatedAt || ""}`}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleBasicInfoSubmit}
                    postingData={postingData}
                    submitLabel="Save Basic Info"
                />
            )}
            {activeTab === "social-media" && (
                <ReligiousShopSocialMediaTab
                    shop={formData}
                    onSave={handleSectionSave}
                    saving={postingData}
                />
            )}
            {activeTab === "products" && (
                <ReligiousShopProductsTab
                    shop={formData}
                    onSave={handleSectionSave}
                    saving={postingData}
                />
            )}
            {activeTab === "attractions" && (
                <ReligiousShopAttractionsTab
                    shop={formData}
                    onSave={handleSectionSave}
                    saving={postingData}
                />
            )}
        </>
    );
}
