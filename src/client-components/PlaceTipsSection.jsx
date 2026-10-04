'use client';

import React, { useRef } from 'react';

export default function PlaceTipsSection({ place }) {

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


    return <>

        <section className="py-10">

            <div className="max-w-[1370px] mx-auto px-5 sm:px-10">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

                    <div className="text-center md:text-left">

                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <span className="w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></span>
                            <span className="text-sm font-bold tracking-widest text-primary uppercase">Travel Guide</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cormorant-garamond tracking-tight text-gray-900 mb-4">
                            Visitor <span className="text-primary">Guidelines & Tips</span>
                        </h2>

                        <p className="text-gray-600 text-base md:text-lg max-w-2xl font-nunito">
                            Essential advice to ensure a respectful and enlightened journey through the sacred grounds of {place?.title}.
                        </p>

                    </div>

                    {/* Scroll Buttons */}
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

                {/* Scrolling Tips Container */}
                <div ref={scrollContainerRef} className="flex overflow-x-auto gap-5 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-5 px-5 sm:mx-0 sm:px-0 scroll-smooth relative z-20 pb-10 pt-10">

                    {place?.visitorTips?.map((tip, index) => (

                        <div key={index} className="flex-none w-[280px] sm:w-[300px] lg:w-[300px] xl:w-[320px] snap-start group relative bg-white p-5 rounded-[2rem] border-2 border-primary/30 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">

                            {/* Abstract Decoration */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="relative z-10">

                                <h4 className="text-2xl font-bold font-cormorant-garamond text-gray-900 mb-2 tracking-wide">
                                    {tip.label}
                                </h4>

                                <p className="text-gray-600 font-nunito text-base leading-relaxed">
                                    {tip.description}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    </>
}