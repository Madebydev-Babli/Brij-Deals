"use client";

import WebsiteLayout from "@/client-components/WebsiteLayout";
import { shops } from "../../../../../database/religious-shop";
import { useParams } from "next/navigation";
import ShopIntro from "@/client-components/ShopIntro";
import NearbyAttractions from "@/server-components/NearbyAttractions";
import Link from "next/link";
import ProductListSection from "@/client-components/ProductSection";

export default function Page() {

    const { slug } = useParams();
    const shop = shops.find((r) => r.slug === slug);

    return (
        <>
            <WebsiteLayout>

                <ShopIntro shop={shop} />

                <section className="min-h-screen">

                    {/* <section className="px-5 sm:px-10 max-w-[1370px] mx-auto pb-10 mt-8 md:mt-12">

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">

                            {shop.products.map(product => (

                                <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-500">

                                    <div className="relative w-full h-[220px] overflow-hidden">

                                        <img src={product.image} alt={product.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />

                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5">

                                            <span className={`w-2 h-2 rounded-full bg-green-500`}></span>

                                            <span className="text-gray-900 text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                                                {product.offer}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="p-5 flex flex-col flex-grow">

                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-green-600 font-nunito">₹{product.price}</span>
                                            {product.originalPrice && (
                                                <span className="text-gray-400 text-sm line-through font-nunito">₹{product.originalPrice}</span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold font-cormorant-garamond text-gray-900 my-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                            {product.title}
                                        </h3>

                                        <p className="text-gray-600 font-nunito text-sm leading-relaxed line-clamp-2 flex-grow">
                                            {product.description}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </section> */}

                    <ProductListSection products={shop?.products} />

                    <section className="lg:pb-20">
                        <NearbyAttractions attractions={shop?.attractions} />
                    </section>

                </section>

            </WebsiteLayout>
        </>
    );
}