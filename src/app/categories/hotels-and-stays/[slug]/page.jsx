"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import WebsiteLayout from "@/client-components/WebsiteLayout";
import PhotoGallery from "@/client-components/GallerySection";
import RestaurentIntro from "@/client-components/RestaurentIntro";
import RestaurantAmenities from "@/server-components/RestaurantAmenities";
import RestaurantOffers from "@/client-components/RestaurantOffers";
import NearbyAttractions from "@/server-components/NearbyAttractions";
import RoomCategoriesSection from "@/client-components/RoomCategoriesSection";
import LoadingComponent from "@/server-components/LoadingComponent";
import NoDataComponent from "@/server-components/NoDataComponent";

export default function Page() {
    const { slug } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        async function fetchHotel() {
            try {
                const response = await fetch(`/api/hotel?slug=${encodeURIComponent(slug)}`);
                const data = await response.json();
                const foundHotel = data?.data?.data?.[0] || null;
                setHotel(foundHotel);
            } catch (error) {
                console.error("Failed to fetch hotel:", error);
                setHotel(null);
            } finally {
                setLoading(false);
            }
        }

        fetchHotel();
    }, [slug]);

    if (loading) {
        return (
            <WebsiteLayout>
                <LoadingComponent message="Loading Hotel Details..." />
            </WebsiteLayout>
        );
    }

    if (!hotel) {
        return (
            <WebsiteLayout>
                <NoDataComponent message="Hotel not found" />
            </WebsiteLayout>
        );
    }

    const normalizedHotel = {
        ...hotel,
        amenities: (hotel?.amenities || []).map((amenity) => ({
            ...amenity,
            title: amenity?.name || amenity?.title || "",
        })),
        gallery: (hotel?.gallery || []).map((item) => ({
            ...item,
            title: item?.label || item?.title || "",
            image: {
                ...(item?.image || {}),
                url: item?.image?.url || item?.image || "",
                publicId: item?.image?.publicId || "",
                title: item?.label || item?.title || "",
            },
        })),
        roomCategories: (hotel?.roomCategories || []).map((room) => ({
            ...room,
            id: room?._id || room?.id || room?.title || Math.random().toString(36).slice(2),
            heroImage: room?.heroImage?.url || room?.heroImage || "",
            gallery: (room?.gallery || []).map((imageItem) => imageItem?.image?.url || imageItem?.image || ""),
        })),
    };

    return (
        <WebsiteLayout>

            <RestaurentIntro restaurant={normalizedHotel} />

            <RestaurantOffers offers={normalizedHotel?.offers} whatsapp={normalizedHotel?.whatsapp} />

            <RoomCategoriesSection
                rooms={normalizedHotel?.roomCategories}
                phone={normalizedHotel?.phone}
                whatsapp={normalizedHotel?.whatsapp}
            />

            <RestaurantAmenities amenities={normalizedHotel?.amenities} />

            <NearbyAttractions attractions={normalizedHotel?.attractions} />

            <PhotoGallery gallery={normalizedHotel?.gallery} />

        </WebsiteLayout>
    );
}