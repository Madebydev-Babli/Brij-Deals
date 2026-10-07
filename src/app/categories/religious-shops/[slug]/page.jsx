"use client";

import { useEffect, useState } from "react";
import WebsiteLayout from "@/client-components/WebsiteLayout";
import { useParams } from "next/navigation";
import ShopIntro from "@/client-components/ShopIntro";
import NearbyAttractions from "@/server-components/NearbyAttractions";
import ProductListSection from "@/client-components/ProductSection";
import LoadingComponent from "@/server-components/LoadingComponent";
import NoDataComponent from "@/server-components/NoDataComponent";

export default function Page() {
    const { slug } = useParams();
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        async function fetchShop() {
            try {
                const response = await fetch(`/api/religious-shop?slug=${encodeURIComponent(slug)}`);
                const data = await response.json();
                const foundShop = data?.data?.data?.[0] || null;
                setShop(foundShop);
            } catch (error) {
                console.error("Failed to fetch religious shop:", error);
                setShop(null);
            } finally {
                setLoading(false);
            }
        }

        fetchShop();
    }, [slug]);

    if (loading) return <WebsiteLayout><LoadingComponent message="Loading Religious Shop Details..." /></WebsiteLayout>;
    if (!shop) return <WebsiteLayout><NoDataComponent message="Religious shop not found" /></WebsiteLayout>;

    return (
        <>
            <WebsiteLayout>
                <ShopIntro shop={shop} />

                <section className="min-h-screen">
                    <ProductListSection products={shop?.products} phone={shop?.phone} whatsapp={shop?.whatsapp} />

                    <section className="lg:pb-20">
                        <NearbyAttractions attractions={shop?.attractions} />
                    </section>
                </section>
            </WebsiteLayout>
        </>
    );
}