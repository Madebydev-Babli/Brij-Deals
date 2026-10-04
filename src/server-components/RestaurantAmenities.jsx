import React from 'react';
import { RESTAURANT_AMENITIES_ENUM } from '@/utility/utility-data';

export default function RestaurantAmenities({ amenities }) {

    return (
        <section className="py-10">

            <div className="max-w-[1370px] mx-auto px-5 sm:px-10">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">

                    <div className="text-center md:text-left">

                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <span className="w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></span>
                            <span className="text-sm font-bold tracking-widest text-primary uppercase">Facilities</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cormorant-garamond tracking-tight text-gray-900 mb-4">
                            Amenities & <span className="text-primary">Features</span>
                        </h2>

                        <p className="text-gray-600 text-base md:text-lg max-w-2xl font-nunito">
                            Enjoy a seamless dining experience with the range of premium facilities and services offered at the restaurant.
                        </p>

                    </div>

                </div>

                {/* Amenities Grid */}
                {/* Uses a highly responsive auto-fit grid. Gracefully handles any n-number of amenities */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">

                    {amenities.map((amenity, index) => {
                        const matchedAmenity = RESTAURANT_AMENITIES_ENUM.find(
                            (item) => item.title.toLowerCase() === amenity?.title?.toLowerCase()
                        );
                        const IconComponent = matchedAmenity ? matchedAmenity.icon : null;

                        return (
                            <div key={index} className="flex flex-col items-center text-center justify-start p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group cursor-default transform hover:-translate-y-1">

                                {/* Icon Wrapper */}
                                <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary text-3xl mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                                    {IconComponent ? (
                                        <IconComponent className="transition-transform duration-300 group-hover:scale-110" />
                                    ) : (
                                        <span className="text-xs font-bold font-nunito">?</span>
                                    )}
                                </div>

                                {/* Amenity Title */}
                                <span className="text-gray-800 font-nunito font-bold text-sm leading-snug">
                                    {amenity?.title}
                                </span>

                            </div>
                        );
                    })}

                </div>

            </div>

        </section>
    );
}
