import React from 'react';
import { FaMapMarkerAlt, FaWalking, FaCar } from 'react-icons/fa';

export default function NearbyAttractions({ attractions }) {

    const getModeIcon = (mode) => {
        return mode?.toLowerCase() === 'walk' ? <FaWalking className="text-gray-400 group-hover:text-primary transition-colors" /> : <FaCar className="text-gray-400 group-hover:text-primary transition-colors" />;
    };

    return (
        <section className="relative py-10">

            <div className="absolute top-0 right-0 p-16 opacity-[0.1] pointer-events-none hidden md:block">
                <FaMapMarkerAlt className="w-96 h-96 text-primary" />
            </div>

            <div className="max-w-[1370px] mx-auto px-5 sm:px-10">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">

                    <div className="text-center md:text-left">

                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <span className="w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></span>
                            <span className="text-sm font-bold tracking-widest text-primary uppercase">Location Info</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cormorant-garamond tracking-tight text-gray-900 mb-4">
                            Nearby <span className="text-primary">Attractions</span>
                        </h2>

                        <p className="text-gray-600 text-base md:text-lg max-w-2xl font-nunito">
                            Conveniently located near the most popular temples and transit spots in Mathura & Vrindavan.
                        </p>

                    </div>

                </div>

                {/* Highly Polished Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">

                    {attractions.map((spot, index) => (

                        <div key={index} className="z-10 flex flex-col items-center text-center justify-start p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group cursor-default transform hover:-translate-y-1">

                            {/* Details */}
                            <div className="flex flex-col flex-1">

                                <h3 className="text-2xl font-cormorant-garamond tracking-tight font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug mb-1.5">
                                    {spot.title}
                                </h3>

                                <div className="flex items-center gap-2">

                                    <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold font-nunito text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                        {getModeIcon(spot.mode)} {spot.time || spot.duration}
                                    </span>

                                    <span className="text-[11px] sm:text-xs font-bold font-nunito text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100/50">
                                        {spot.distance}
                                    </span>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}