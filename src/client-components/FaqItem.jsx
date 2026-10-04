'use client';

import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export default function FAQItem({ faqs }) {

    const [openIndex, setOpenIndex] = useState(-1);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (

        <div className="flex flex-col gap-5 mt-10">

            {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (

                    <div key={index} className={`border rounded-xl transition-all duration-300 overflow-hidden ${isOpen ? 'bg-white border-orange-200 shadow-[0_15px_40px_rgba(247,127,0,0.08)] transform scale-[1.01]' : 'bg-gray-50/50 border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`} >

                        <button onClick={() => toggleFAQ(index)} className="w-full flex items-center justify-between text-left p-5 cursor-pointer focus:outline-none group gap-5" >

                            <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold font-cormorant-garamond transition-colors duration-300 leading-snug ${isOpen ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
                                {faq.question}
                            </h3>

                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isOpen ? 'bg-primary text-white -rotate-180 shadow-md' : 'bg-gray-200 text-gray-500 group-hover:bg-orange-100 group-hover:text-primary rotate-0'}`}>
                                <FaChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>

                        </button>

                        {/* Animated Answer Body via Grid Trick */}
                        <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>

                            <div className="overflow-hidden">

                                <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 text-gray-600 font-nunito text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-5 mx-6 sm:mx-8">
                                    {faq.answer}
                                </div>

                            </div>

                        </div>

                    </div>

                );

            })}

        </div>

    );
}
