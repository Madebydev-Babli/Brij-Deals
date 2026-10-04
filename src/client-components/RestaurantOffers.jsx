"use client";
import React, { useRef } from 'react';
import { FaClock, FaTicketAlt } from 'react-icons/fa';

export default function RestaurantOffers({ offers, whatsapp }) {

    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
    };

    if (offers?.length === 0) return null;

    return (
        <section className="relative py-10">

            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 p-16 opacity-[0.1] pointer-events-none hidden md:block">
                <FaTicketAlt className="w-96 h-96 text-primary transform rotate-12" />
            </div>

            <div className="max-w-[1370px] mx-auto px-5 sm:px-10 relative z-10">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

                    <div className="text-center md:text-left">

                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <span className="w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></span>
                            <span className="text-sm font-bold tracking-widest text-primary uppercase">Hot Deals</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cormorant-garamond tracking-tight text-gray-900 mb-4">
                            Exclusive Deals & <span className="text-primary">Offers</span>
                        </h2>

                        <p className="text-gray-600 text-base md:text-lg max-w-2xl font-nunito">
                            Experience the divine beauty of Brij Bhumi. Navigate through our handpicked selection of premium stays, authentic dining, and spiritual tours.
                        </p>

                    </div>

                    {/* Scroll Buttons - Hidden on scroll sizes smaller than md */}
                    <div className="hidden md:flex items-center gap-3">

                        <button onClick={scrollLeft} className="cursor-pointer w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 bg-white shadow-sm" aria-label="Scroll left">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button onClick={scrollRight} className="cursor-pointer w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 bg-white shadow-sm" aria-label="Scroll right">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                    </div>

                </div>

                {/* Offers Horizontal Scroll Container */}
                <div ref={scrollContainerRef} className="pt-10 flex overflow-x-auto gap-5 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" >

                    {offers?.map((offer, index) => (

                        <div key={index} className="flex-none w-[280px] sm:w-[320px] lg:w-[340px] shrink-0 snap-start flex flex-col bg-white rounded-3xl border-2 border-dashed border-primary/30 p-5 md:p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/60 transition-all duration-300 group relative overflow-hidden transform hover:-translate-y-1">

                            <div className="flex-1 relative z-20">

                                <h3 className="text-2xl font-bold font-cormorant-garamond text-gray-900 mb-3 group-hover:text-primary transition-colors pr-2">
                                    {offer.title}
                                </h3>

                                <p className="text-gray-500 font-nunito text-sm leading-relaxed mb-6">
                                    {offer.description}
                                </p>

                            </div>

                            <div className="pt-5 border-t-[1.5px] border-dashed border-gray-200 mt-auto relative z-20">

                                <div className="flex flex-col gap-4">

                                    <div className="flex items-center gap-1.5 text-[11px] font-bold font-nunito text-orange-600 bg-orange-100 px-3 py-1 rounded-full self-start w-fit">
                                        <FaClock className="text-orange-500 w-3 h-3" />
                                        <span>Ends: {offer.endDate}</span>
                                    </div>

                                    <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hello , I have seen an offer "${offer.title}" from your restaurant on Brij Deals.`)}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-sm font-bold uppercase tracking-wider text-primary hover:text-white border-2 border-primary hover:bg-primary px-5 py-2 rounded-xl transition-colors font-nunito w-full shadow-sm text-center">
                                        Claim Offer
                                    </a>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </section >
    );
}