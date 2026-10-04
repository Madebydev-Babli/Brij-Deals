'use client';

import Link from 'next/link';
import { useRef } from 'react';

const categories = [
  {
    title: 'Restaurants',
    image: '/categories/restaurants.png',
    link: '#',
    colSpan: 'md:col-span-2 lg:col-span-2',
    rowSpan: 'md:row-span-1 lg:row-span-2',
    description: 'Authentic Dining & Fine Restaurants',
  },
  {
    title: 'Places to Visit',
    image: '/categories/places.png',
    link: '#',
    colSpan: 'md:col-span-1 lg:col-span-1',
    rowSpan: 'md:row-span-1 lg:row-span-1',
    description: 'Majestic Temples & Scenic Views',
  },
  {
    title: 'Hotels & Stays',
    image: '/categories/hotels.png',
    link: '#',
    colSpan: 'md:col-span-1 lg:col-span-1',
    rowSpan: 'md:row-span-1 lg:row-span-1',
    description: 'Luxurious & Premium Stays for you and your family',
  },
  {
    title: 'Religious Shops',
    image: '/categories/shops.png',
    link: '#',
    colSpan: 'md:col-span-1 lg:col-span-1',
    rowSpan: 'md:row-span-1 lg:row-span-1',
    description: 'Authentic Idols & Antiques',
  },
  {
    title: 'Tourist Packages',
    image: '/categories/packages.png',
    link: '#',
    colSpan: 'md:col-span-1 lg:col-span-1',
    rowSpan: 'md:row-span-1 lg:row-span-1',
    description: 'Guided Pilgrim Tours',
  },
];

export default function WhatAreYouLookingFor() {

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

  return (

    <section className="px-5 sm:px-10 xl:max-w-[1370px] mx-auto py-20">

      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">

        <div className="text-center md:text-left">

          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <span className="w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></span>
            <span className="text-sm font-bold tracking-widest text-primary uppercase">Explore Categories</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cormorant-garamond tracking-tight text-gray-900 mb-4">
            What are you <span className="text-primary">looking for?</span>
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

      <div ref={scrollContainerRef} className="flex overflow-x-auto gap-5 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" >

        {categories.map((category, index) => (

          <Link href={category.link} key={index} className="group relative flex-none w-[260px] sm:w-[280px] lg:w-[300px] xl:w-[320px] h-[250px] sm:h-[280px] lg:h-[320px] rounded-3xl overflow-hidden cursor-pointer snap-start shadow-md transition-all duration-500 border border-gray-200/50 dark:border-gray-800">

            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">

              <img src={category.image} alt={category.title} className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" />

            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Card Content */}
            <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end">

              <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-500">

                {/* Animated Arrow Icon */}
                <div className="w-10 h-10 mb-5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:bg-primary group-hover:border-primary transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                  <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>

                {/* Card Title */}
                <h3 className="text-xl md:text-xl lg:text-2xl font-bold text-white drop-shadow-md tracking-wide">
                  {category.title}
                </h3>

              </div>

              {/* Reveal Description on Hover via Grid Rows */}
              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500">

                <div className="overflow-hidden">
                  <p className="text-sm md:text-base text-gray-200 mt-2 font-nunito font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {category.description}
                  </p>
                </div>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </section>

  );

}