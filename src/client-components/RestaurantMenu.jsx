"use client";

import React, { useState, useRef } from 'react';

export default function RestaurantMenu({ menuCategories = [], menuItems = [] }) {
    // Map items to their respective categories based on menuId matching category._id
    const categoriesWithItems = menuCategories.map(cat => ({
        ...cat,
        items: menuItems.filter(item => item.menuId === cat._id)
    }));

    const [activeCategory, setActiveCategory] = useState(
        categoriesWithItems.length > 0 ? categoriesWithItems[0].category : ""
    );
    const menuContentRef = useRef(null);

    const handleCategoryClick = (categoryName) => {
        setActiveCategory(categoryName);
        // Smoothly scroll to the menuCategories content area with a slight offset for aesthetics
        if (menuContentRef.current) {
            const yOffset = -100;
            const y = menuContentRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    if (categoriesWithItems.length === 0) {
        return null;
    }

    const activeCatObj = categoriesWithItems.find((c) => c.category === activeCategory);

    return (
        <section className="pt-10 lg:py-10">

            <div className="max-w-[1370px] mx-auto px-5 sm:px-10">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">

                    <div className="text-center md:text-left">

                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <span className="w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></span>
                            <span className="text-sm font-bold tracking-widest text-primary uppercase">Delicious Offerings</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cormorant-garamond tracking-tight text-gray-900 mb-4">
                            Explore <span className="text-primary">Our Menu</span>
                        </h2>

                        <p className="text-gray-600 text-base md:text-lg max-w-2xl font-nunito">
                            Discover authentic pure veg flavors and local specialties crafted with love and devotion.
                        </p>

                    </div>

                </div>

                {/* Master-Detail Layout for Massive Scalability */}
                <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 items-start">

                    {/* Sidebar: Categories Navigation */}
                    {/* Mobile: Horizontal scroll | Desktop: Sticky vertical list */}
                    <div className="w-full lg:w-1/4 shrink-0 lg:sticky lg:top-24 z-10 px-5 sm:px-10 lg:px-0">

                        <div className="flex lg:flex-col gap-3 lg:gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 whitespace-nowrap lg:whitespace-normal snap-x no-scrollbar lg:max-h-[60vh] lg:overflow-y-auto px-5 sm:px-10 lg:px-2 -mx-5 sm:-mx-10 lg:mx-0 [&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:block lg:[&::-webkit-scrollbar]:w-1.5 lg:[&::-webkit-scrollbar-thumb]:bg-gray-200 lg:[&::-webkit-scrollbar-track]:bg-transparent">

                            {categoriesWithItems.map((category) => (

                                <button
                                    key={category._id}
                                    onClick={() => handleCategoryClick(category.category)}
                                    className={`cursor-pointer shrink-0 snap-start text-left px-3 py-1 lg:px-5 lg:py-3 rounded-full lg:rounded-xl font-nunito font-semibold transition-all duration-300 ${activeCategory === category.category ? 'bg-primary text-white shadow-md shadow-primary/20 lg:transform lg:scale-[1.02]' : 'bg-gray-50 lg:bg-transparent text-gray-600 hover:bg-gray-100 hover:text-primary border border-gray-200 lg:border-transparent'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm md:text-base">{category.category}</span>
                                        <span className="ml-1 text-xs opacity-70 hidden lg:block">({category.items?.length || 0})</span>
                                    </div>
                                </button>

                            ))}

                            {/* Extra spacer to preserve right padding on mobile scroll (WebKit bug workaround) */}
                            <div className="w-1 shrink-0 lg:hidden"></div>

                        </div>

                    </div>

                    {/* Main Content: Menu Items List */}
                    <div className="w-full pb-10" ref={menuContentRef}>

                        {/* Selected Category Sticky Title */}
                        <div className="mb-8 pb-4 border-b border-gray-100 flex items-center justify-between">

                            <h3 className="text-3xl font-bold font-cormorant-garamond text-gray-900">
                                {activeCategory}
                            </h3>

                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold font-nunito uppercase tracking-widest hidden sm:block">
                                {activeCatObj?.items?.length || 0} Items
                            </span>

                        </div>

                        {/* Items Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500">

                            {activeCatObj?.items?.map((item, index) => (

                                <div key={item._id || index} className="flex flex-col group cursor-default">

                                    <div className="flex items-center justify-between gap-4 mb-1">

                                        <h4 className="text-xl md:text-2xl font-bold font-cormorant-garamond text-gray-900 group-hover:text-primary transition-colors pr-2">
                                            {item.name}
                                        </h4>

                                        {/* CSS Flex Spacer for Dots */}
                                        <div className="flex-1 border-b-[3px] border-dotted border-gray-200 relative mb-1 mx-2"></div>

                                        <span className="text-xl font-bold text-primary font-nunito whitespace-nowrap pl-2">
                                            ₹{item.price}
                                        </span>

                                    </div>

                                    <p className="text-gray-500 font-nunito text-sm leading-relaxed pr-12 md:pr-16 lg:pr-24">
                                        {item.description}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}