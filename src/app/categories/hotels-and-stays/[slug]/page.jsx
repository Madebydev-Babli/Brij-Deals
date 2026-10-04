"use client";

import WebsiteLayout from "@/client-components/WebsiteLayout";
import PhotoGallery from "@/client-components/GallerySection";
import RestaurentIntro from "@/client-components/RestaurentIntro";
import RestaurantAmenities from "@/server-components/RestaurantAmenities";
import RestaurantOffers from "@/client-components/RestaurantOffers";
import NearbyAttractions from "@/server-components/NearbyAttractions";
import RoomCategoriesSection from "@/client-components/RoomCategoriesSection";
import { hotels } from "../../../../../database/hotel";
import { useParams } from "next/navigation";

export default function Page() {

    const { slug } = useParams();
    const hotel = hotels.find((r) => r.slug === slug);

    return (
        <WebsiteLayout>

            <RestaurentIntro restaurant={hotel} />

            <RestaurantOffers offers={hotel?.offers} whatsapp={hotel?.whatsapp} />

            <RoomCategoriesSection
                rooms={hotel?.roomCategories}
                phone={hotel?.phone}
                whatsapp={hotel?.whatsapp}
            />

            <RestaurantAmenities amenities={hotel?.amenities} />

            <NearbyAttractions attractions={hotel?.attractions} />

            <PhotoGallery gallery={hotel?.gallery} />

        </WebsiteLayout>
    );
}