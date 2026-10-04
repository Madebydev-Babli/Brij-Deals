'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function PhotoGallery({ gallery }) {

    const [selectedIndex, setSelectedIndex] = useState(null);

    // Touch swipe logic for mobile devices
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const handlePrev = (e) => {
        e?.stopPropagation(); // Prevent modal close
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1));
    };

    const handleNext = (e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0));
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) {
            handleNext();
        }
        if (isRightSwipe) {
            handlePrev();
        }
    };

    // Handle keyboard navigation
    useEffect(() => {
        if (selectedIndex === null) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') setSelectedIndex(null);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, gallery, handleNext, handlePrev]);

    return (

        <section className="max-w-[1370px] mx-auto px-5 sm:px-10 relative pt-10 pb-20">

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
                        Never miss a sacred moment — live aarti schedule for major temples across <br className="hidden md:block" /> Mathura & Vrindavan.
                    </p>

                </div>

            </div>

            <div className="columns-3 sm:columns-4 gap-1 sm:gap-2 max-w-7xl m-auto">

                {gallery?.map((image, index) => (

                    <button key={index} type="button" onClick={() => setSelectedIndex(index)} className="cursor-pointer group w-full outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 block break-inside-avoid mb-1 sm:mb-2">
                        <div className="relative w-full overflow-hidden shadow-xl shadow-emerald-900/5 ring-1 ring-emerald-100/60 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-emerald-900/10 rounded-lg sm:rounded-xl">
                            <Image src={image.image.url} alt={image.title} width={1200} height={800} className="w-full h-auto object-contain bg-slate-100" sizes="(max-width: 1024px) 100vw, 33vw" />

                            {/* Desktop/Mobile Tag Overlay */}
                            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <div className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/30 text-[10px] sm:text-xs font-bold text-white tracking-wider uppercase shadow-lg">
                                    {image.title}
                                </div>
                            </div>

                            {/* Mobile Only Permanent Tag (Optional, but looks good for touch users) */}
                            <div className="absolute top-2 right-2 sm:hidden">
                                <div className="px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-[8px] font-bold text-white uppercase tracking-tighter">
                                    {image.title}
                                </div>
                            </div>
                        </div>
                    </button>
                ))}

            </div>

            {selectedIndex !== null && (

                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-5" onClick={() => setSelectedIndex(null)} role="dialog" aria-modal="true">

                    <div
                        className="relative w-full max-w-6xl h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >

                        {/* Close Button */}
                        <button type="button" onClick={() => setSelectedIndex(null)} className="cursor-pointer absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Left Arrow */}
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="cursor-pointer absolute left-1 sm:left-4 z-50 p-2 sm:p-3 rounded-full bg-black/40 sm:bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all group"
                            aria-label="Previous image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-active:-translate-x-1 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>

                        {/* Main Image Container */}
                        <div className="relative w-full h-[85vh] rounded-xl overflow-hidden shadow-2xl">
                            <Image
                                src={gallery[selectedIndex].image?.url}
                                alt={gallery[selectedIndex].title}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />

                            {/* Label Tag in Modal */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none">
                                <div className="px-6 py-2 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 text-xs sm:text-sm font-bold text-white tracking-[0.2em] uppercase shadow-2xl">
                                    {gallery[selectedIndex].title}
                                </div>
                            </div>

                            {/* Bottom navigation info */}
                            <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm bg-black/40 py-2 backdrop-blur-sm w-fit mx-auto px-4 rounded-full border border-white/10">
                                {selectedIndex + 1} / {gallery.length}
                            </div>
                        </div>

                        {/* Right Arrow */}
                        <button
                            type="button"
                            onClick={handleNext}
                            className="cursor-pointer absolute right-1 sm:right-4 z-50 p-2 sm:p-3 rounded-full bg-black/40 sm:bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all group"
                            aria-label="Next image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-active:translate-x-1 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>

                    </div>

                </div>

            )}

        </section>

    );


}