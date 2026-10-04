import React from 'react';
import { FaShieldAlt, FaComments, FaMapMarkedAlt, FaGem } from 'react-icons/fa';

const reasons = [
    {
        title: "Verified Listings",
        desc: "Every hotel, restaurant, and religious shop is handpicked and personally reviewed by our local Brij team.",
        icon: <FaShieldAlt className="w-8 h-8 transition-colors duration-500" />
    },
    {
        title: "Zero Middlemen",
        desc: "Connect instantly with property owners via WhatsApp or direct call. We don't charge hidden commission fees.",
        icon: <FaComments className="w-8 h-8 transition-colors duration-500" />
    },
    {
        title: "Authentic Experiences",
        desc: "From hidden gems to local cuisines, get genuine recommendations to make your Brij Yatra truly spiritual.",
        icon: <FaMapMarkedAlt className="w-8 h-8 transition-colors duration-500" />
    },
    {
        title: "Exclusive Deals",
        desc: "Enjoy VIP access, festival alerts, and special community discounts available only to our platform users.",
        icon: <FaGem className="w-8 h-8 transition-colors duration-500" />
    }
];

export default function WhyChooseUsSection() {
    return (
        <section className="pt-20 pb-10">

            <div className="px-5 sm:px-10 max-w-[1370px] mx-auto">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto relative">

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cormorant-garamond tracking-tight text-gray-900 mb-4">
                        Why Choose <span className="text-primary">Brij Deals?</span>
                    </h2>

                    <p className="text-gray-600 text-base md:text-lg max-w-2xl font-nunito">
                        We bridge the gap between you and the divine land of Brij Bhumi with complete transparency, reliability, and exclusive benefits.
                    </p>

                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 py-10">

                    {reasons.map((reason, index) => (

                        <div key={index} className="relative flex flex-col items-start p-5 rounded-3xl bg-yellow-50 shadow-xl shadow-gray-200/50 border-2 border-orange-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-100 group overflow-hidden z-10">

                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>

                            {/* Content */}
                            <div className="relative z-10">

                                {/* Icon Wrapper */}
                                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4 border border-orange-100 group-hover:bg-primary group-hover:-rotate-6 transition-all duration-500 shadow-sm">
                                    <div className="text-primary group-hover:text-white transition-colors duration-500 flex items-center justify-center">
                                        {reason.icon}
                                    </div>
                                </div>

                                <h3 className="text-xl md:text-2xl font-bold font-cormorant-garamond text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                    {reason.title}
                                </h3>

                                <p className="text-gray-600 font-nunito text-sm md:text-base leading-relaxed">
                                    {reason.desc}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}