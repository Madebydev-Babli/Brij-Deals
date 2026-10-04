'use client'

import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt, FaShareAlt, FaStar, FaGlobe, FaRegClock, FaCamera, FaMap } from 'react-icons/fa';

export default function PlaceIntro({ place }) {

    const breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Places to Visit', path: '/categories/places-to-visit' },
        { label: place?.title, path: `/categories/places-to-visit/${place?.slug}` },
    ];

    return (
        <section>

            {/* 1. Compact Banner Image */}
            <div className="relative w-full h-[200px] md:h-[280px] lg:h-[320px]">

                {place?.banner && (<Image src={place.banner?.url || place.banner} alt={place?.title} fill className="w-full h-full object-cover" />)}

                {/* Dark gradient for breadcrumbs readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent"></div>

                {/* Breadcrumbs inside banner at top left */}
                <div className="absolute inset-x-0 top-0 max-w-[1370px] mx-auto w-full px-5 sm:px-10 pt-6 md:pt-8 z-10">

                    <nav aria-label="breadcrumb" className="w-full">

                        <ol className="flex items-center gap-2 text-sm text-gray-200 font-nunito overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">

                            {breadcrumbs.map((item, index) => {
                                const isFirst = index === 0;
                                const isLast = index === breadcrumbs.length - 1;
                                const isHome = item.label === 'Home';

                                return (
                                    <li key={index} className="flex items-center gap-2">
                                        {!isFirst && <span className="text-gray-400">/</span>}
                                        {isLast ? (
                                            <Link href={item.path} className="text-white font-semibold" aria-current="page">
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <Link href={item.path} className="flex items-center gap-1.5 hover:text-white transition-colors">
                                                {isHome && (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                    </svg>
                                                )}
                                                <span>{item.label}</span>
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                </div>

            </div>

            {/* 2. Content Container (Floating White Card) */}
            <div className="max-w-[1370px] mx-auto px-5 sm:px-10 relative z-20">

                {/* Out of the Box Compact Floating Card */}
                <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] rounded-3xl border border-gray-100 p-6 sm:p-8 lg:p-10 -mt-16 md:-mt-24 lg:-mt-28 mb-10 w-full relative overflow-hidden flex flex-col">

                    {/* Background Decorative Glow (Out of the box touch) */}
                    <div className="absolute -right-20 -bottom-20 w-[300px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200/40 via-amber-100/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 relative z-10">

                        {/* Title and Badges */}
                        <div className="flex-1 text-center lg:text-left w-full pt-2">

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest font-nunito border border-primary/20">
                                    Spiritual Destination
                                </span>
                                <span className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest font-nunito border border-amber-200/50 flex items-center gap-1.5">
                                    <FaStar className="w-3 h-3" /> Must Visit
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-cormorant-garamond text-gray-900 leading-[1.1]">
                                {place?.title}
                            </h1>

                            <div className="flex items-center justify-center lg:justify-start gap-2 mt-4 text-gray-500 font-nunito text-sm sm:text-base">
                                <FaMapMarkerAlt className="text-primary/70" />
                                <span>{place?.location || 'Brij Bhumi, Uttar Pradesh'}</span>
                            </div>

                        </div>

                        {/* Quick Info Grid (Right side, 2x2 layout) */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto shrink-0 mt-6 lg:mt-0 lg:min-w-[400px] xl:min-w-[450px]">

                            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50 hover:bg-amber-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                    <FaRegClock size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aarti</span>
                                    <span className="text-gray-900 font-bold font-nunito text-sm sm:text-base">{place?.artiTimings?.length || 0} Schedules</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-orange-50/50 border border-orange-100/50 hover:bg-orange-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-primary shrink-0">
                                    <FaMapMarkerAlt size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</span>
                                    <span className="text-gray-900 font-bold font-nunito text-sm sm:text-base">{place?.location || 'Mathura, UP'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 hover:bg-blue-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                    <FaCamera size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gallery</span>
                                    <span className="text-gray-900 font-bold font-nunito text-sm sm:text-base">{place?.gallery?.length || 0} Photos</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-green-50/50 border border-green-100/50 hover:bg-green-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                    <FaMap size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nearby</span>
                                    <span className="text-gray-900 font-bold font-nunito text-sm sm:text-base">{place?.attractions?.length || 0} Places</span>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}