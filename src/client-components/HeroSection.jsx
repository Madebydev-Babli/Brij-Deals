'use client';

import NoDataComponent from '@/server-components/NoDataComponent';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function HeroSectionClient({ slides = [] }) {

    const [currentSlide, setCurrentSlide] = useState(1); // Start at 1 (first real slide)
    const [isTransitioning, setIsTransitioning] = useState(false);
    const timeoutRef = useRef(null);

    // Touch support states
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    // Create extended slides array with clones for infinite loop
    const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

    const handleNextSlide = () => {
        setIsTransitioning(true);
        setCurrentSlide((prev) => prev + 1);
    };

    const handlePrevSlide = () => {
        setIsTransitioning(true);
        setCurrentSlide((prev) => prev - 1);
    };

    // Auto-slide effect
    useEffect(() => {
        const timer = setInterval(() => {
            handleNextSlide();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [currentSlide, handleNextSlide]);

    const goToSlide = (index) => {
        setIsTransitioning(true);
        setCurrentSlide(index + 1); // +1 because of the cloned first slide
    };

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNextSlide();
        } else if (isRightSwipe) {
            handlePrevSlide();
        }
    };

    // Handle infinite loop reset
    useEffect(() => {
        if (currentSlide === 0) {
            // We're at the cloned last slide, jump to real last slide
            timeoutRef.current = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentSlide(slides.length);
            }, 700);
        } else if (currentSlide === extendedSlides.length - 1) {
            // We're at the cloned first slide, jump to real first slide
            timeoutRef.current = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentSlide(1);
            }, 700);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentSlide, slides.length, extendedSlides.length]);


    if (slides?.length === 0) {
        return <NoDataComponent message="No Banner Available" />;
    }

    return (

        <section className="mt-5 px-5 sm:px-10 xl:max-w-[1370px] mx-auto">

            <div className="relative h-[400px] overflow-hidden rounded-3xl">

                {/* Slides Container */}
                <div
                    className={`flex h-full ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >

                    {extendedSlides.map((slide, index) => (

                        <div key={index} className="min-w-full h-full relative">

                            {/* Background Image */}
                            <div className="absolute inset-0">

                                <img src={slide?.image?.url} alt={slide?.title} className="w-full h-full object-cover" />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>

                            </div>

                            {/* Content Overlay */}
                            <div className="relative h-full">

                                <div className="h-full flex flex-col justify-between md:justify-center items-center md:items-start p-5 md:p-10 max-w-2xl">

                                    <div>
                                        <h1 className="text-3xl md:text-4xl text-white mb-4 leading-tight text-center md:text-left"> {slide?.title}</h1>
                                        <p className="text-base md:text-xl text-white/90 mb-8 text-center md:text-left"> {slide?.description}</p>
                                    </div>

                                    <div>
                                        <Link href={slide?.link || "Sample_Text"} className="text-center block md:inline-block bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">{slide?.button}</Link>
                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

                {/* Navigation Dots */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-5 hidden md:block">
                    {slides.map((_, index) => (
                        <button key={index} onClick={() => goToSlide(index)} className={`cursor-pointer mx-1 transition-all duration-300 rounded-full ${(currentSlide - 1) % slides.length === index ? 'w-8 h-3 bg-white' : 'w-3 h-3 bg-white/50 hover:bg-white/75'}`} aria-label={`Go to slide ${index + 1}`} />
                    ))}
                </div>

            </div>
        </section>);

}