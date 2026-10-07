"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import { FaPhoneAlt, FaWhatsapp, FaBed, FaUserFriends, FaTag } from 'react-icons/fa';

export default function ProductListSection({ products, phone, whatsapp }) {


    if (!products || products.length === 0) return null;

    return (
        <section className="py-10">

            <div className="max-w-[1370px] mx-auto px-5 sm:px-10">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

                    <div className="text-center md:text-left">

                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <span className="w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></span>
                            <span className="text-sm font-bold tracking-widest text-primary uppercase">Accommodations</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cormorant-garamond tracking-tight text-gray-900 mb-4">
                            Exceptional <span className="text-primary">Room Categories</span>
                        </h2>

                        <p className="text-gray-600 text-base md:text-lg max-w-2xl font-nunito">
                            Discover the perfect blend of luxury and spiritual serenity in our carefully curated product selections.
                        </p>

                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-5 pt-10">

                    {products.map((product, index) => {

                        const productImage = product?.image?.url || product?.image || "";

                        return (

                            <div key={product?._id || product?.id || index} className="group flex flex-col sm:flex-row md:flex-col xl:flex-row bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden ring-1 ring-black/5">

                                {/* Left: Image & Action Section */}
                                <div className="sm:w-2/5 md:w-full xl:w-2/5 p-5 sm:p-2 md:p-5 xl:p-2 flex flex-col gap-4 border-r border-gray-100">

                                    {/* Separate Hero Image (Square) */}
                                    <div className="aspect-square rounded-2xl overflow-hidden shadow-md border border-white relative">

                                        <Image width={200} height={200} src={productImage} alt={product.title} className="w-full h-full object-cover object-center transition-all duration-500" />

                                        {/* Price Tag */}
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 z-10">
                                            <FaTag className="text-primary w-2.5 h-2.5" />
                                            <span className="text-gray-900 text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                                                ₹{product.offer}
                                            </span>
                                        </div>

                                    </div>

                                    {/* Booking Actions (Moved Here) */}
                                    <div className="flex items-center gap-2 hidden sm:flex md:hidden xl:flex">

                                        <a href={`tel:${phone}`} className="cursor-pointer flex items-center justify-center gap-2 py-3 w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-nunito font-semibold transition-all shadow-md shadow-primary/20 transform hover:-translate-y-0.5">
                                            <FaPhoneAlt />
                                            <span>Call Now</span>
                                        </a>

                                        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hello ${product?.title}, I have seen your hotel on Brij Deals, I want to know more about your hotel.`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center py-3 px-5 rounded-xl bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all border border-green-100 transform hover:-translate-y-0.5 shadow-sm">
                                            <FaWhatsapp size={20} />
                                        </a>

                                    </div>

                                </div>

                                {/* Right: Content Section */}
                                <div className="p-5 sm:w-3/5 md:w-full xl:w-3/5 flex flex-col justify-between bg-white -mt-5 sm:mt-0 md:-mt-5 xl:mt-0">

                                    <div>

                                        <h3 className="text-2xl md:text-3xl font-bold font-cormorant-garamond text-gray-900 group-hover:text-[#F77F00] transition-colors leading-tight">
                                            {product.title}
                                        </h3>

                                        <h3 className="text-xl md:text-2xl font-semibold text-green-600 mt-1 mb-4">
                                            ₹{product.originalPrice}/-
                                        </h3>

                                        <p className="text-gray-500 font-nunito text-sm leading-relaxed mb-5">
                                            {product.description}
                                        </p>

                                        {/* Amenities Capsules (Placed Here) */}
                                        <div className="border-t border-gray-50 pt-5">
                                            <div className="flex flex-wrap gap-2">
                                                {product?.highlights?.map((highlight, idx) => (
                                                    <div key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-bold border border-gray-100 flex items-center gap-1.5 capitalize">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#F77F00]"></span>
                                                        {highlight}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex items-center gap-2 mt-5 sm:hidden md:flex xl:hidden">

                                        <a href={`tel:${phone}`} className="cursor-pointer flex items-center justify-center gap-2 py-3 w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-nunito font-semibold transition-all shadow-md shadow-primary/20 transform hover:-translate-y-0.5">
                                            <FaPhoneAlt />
                                            <span>Call Now</span>
                                        </a>

                                        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hello ${product?.title}, I have seen your hotel on Brij Deals, I want to know more about your hotel.`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center py-3 px-5 rounded-xl bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all border border-green-100 transform hover:-translate-y-0.5 shadow-sm">
                                            <FaWhatsapp size={20} />
                                        </a>

                                    </div>

                                </div>

                            </div>

                        );
                    })}

                </div>

            </div>

        </section>
    );
}

