'use client';

import { useRef } from 'react';

const TempleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" fill="url(#templeGrad)">
        <defs>
            <linearGradient id="templeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
        </defs>
        <path d="M12 2l-6 6v2h12V8l-6-6zM4 12V10h16v2H4zm2 2v8h12v-8H6zm5 8v-4a1 1 0 0 1 2 0v4h-2z" />
    </svg>
);

const temples = [
    {
        name: "BANKE BIHARI MANDIR",
        location: "Vrindavan",
        icon: <TempleIcon />,
        status: "OPEN",
        schedule: [
            { name: "Mangala Aarti", time: "5:45 AM" },
            { name: "Shringar Aarti", time: "8:30 AM" },
            { name: "Rajbhog Aarti", time: "12:00 PM" },
            { name: "Sandhya Aarti", time: "6:30 PM", isNext: true },
            { name: "Shayan Aarti", time: "9:00 PM" },
        ]
    },
    {
        name: "PREM MANDIR",
        location: "Vrindavan",
        icon: <TempleIcon />,
        status: "OPEN",
        schedule: [
            { name: "Morning Aarti", time: "6:00 AM" },
            { name: "Mid-day Darshan", time: "11:00 AM" },
            { name: "Evening Aarti", time: "7:00 PM", isNext: true },
            { name: "Light Show", time: "7:30 PM" },
            { name: "Night Darshan", time: "8:30 PM" },
            { name: "Night Darshan", time: "8:30 PM" },
            { name: "Night Darshan", time: "8:30 PM" },
        ]
    },
    {
        name: "DWARKADHISH MANDIR",
        location: "Mathura",
        icon: <TempleIcon />,
        status: "OPEN",
        schedule: [
            { name: "Mangala Aarti", time: "6:30 AM" },
            { name: "Shringar Darshan", time: "9:00 AM" },
            { name: "Bhog Aarti", time: "12:30 PM" },
            { name: "Sandhya Aarti", time: "6:45 PM", isNext: true },
            { name: "Shayan Aarti", time: "9:15 PM" },
        ]
    },
    {
        name: "GOVARDHAN NATH JI",
        location: "Govardhan",
        icon: <TempleIcon />,
        status: "OPEN",
        schedule: [
            { name: "Mangala Aarti", time: "5:30 AM" },
            { name: "Shringar Darshan", time: "8:00 AM" },
            { name: "Rajbhog Aarti", time: "11:30 AM" },
            { name: "Sandhya Aarti", time: "6:00 PM", isNext: true },
            { name: "Shayan Aarti", time: "8:45 PM" },
        ]
    },
    {
        name: "GOVARDHAN NATH JI",
        location: "Govardhan",
        icon: <TempleIcon />,
        status: "OPEN",
        schedule: [
            { name: "Mangala Aarti", time: "5:30 AM" },
            { name: "Shringar Darshan", time: "8:00 AM" },
            { name: "Rajbhog Aarti", time: "11:30 AM" },
            { name: "Sandhya Aarti", time: "6:00 PM", isNext: true },
            { name: "Shayan Aarti", time: "8:45 PM" },
        ]
    },
    {
        name: "GOVARDHAN NATH JI",
        location: "Govardhan",
        icon: <TempleIcon />,
        status: "OPEN",
        schedule: [
            { name: "Mangala Aarti", time: "5:30 AM" },
            { name: "Shringar Darshan", time: "8:00 AM" },
            { name: "Rajbhog Aarti", time: "11:30 AM" },
            { name: "Sandhya Aarti", time: "6:00 PM", isNext: true },
            { name: "Shayan Aarti", time: "8:45 PM" },
        ]
    }
];

export default function ArtiSection() {

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
        <section className="bg-[#FDF9F1] pt-10">

            <div className="px-5 sm:px-10 max-w-[1370px] mx-auto">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

                    <div className="text-center md:text-left">

                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <span className="w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></span>
                            <span className="text-sm font-bold tracking-widest text-primary uppercase">Explore Categories</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cormorant-garamond tracking-tight text-gray-900 mb-4">
                            Temple <span className="text-primary">Aarti Timings</span>
                        </h2>

                        <p className="text-gray-600 text-base md:text-lg max-w-2xl font-nunito">
                            Never miss a sacred moment — live aarti schedule for major temples across <br className="hidden md:block" /> Mathura & Vrindavan.
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

                {/* Cards Grid */}
                <div ref={scrollContainerRef} className="flex overflow-x-auto py-10 gap-5 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    {temples.map((temple, index) => (

                        <div key={index} className="flex-none w-[280px] sm:w-[300px] lg:w-[300px] xl:w-[320px] flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 group transform hover:-translate-y-1 snap-start">

                            {/* Card Header (Matches the deep maroon/brown theme of Website) */}
                            <div className="bg-gradient-to-br from-[#4A0A04] to-[#2F0601] p-5 flex justify-between items-start relative h-[100px] md:h-[110px]">

                                <div className="flex gap-4 items-center relative z-10 w-full">

                                    <div className="flex-shrink-0 opacity-100">{temple.icon}</div>

                                    <div className="flex flex-col justify-center flex-1">
                                        <h3 className="text-amber-400 font-semibold font-cormorant-garamond">
                                            {temple.name}
                                        </h3>
                                        <p className="text-orange-200/80 text-[10px] md:text-[11px] flex items-center gap-1 mt-1 font-medium tracking-wide">
                                            <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            {temple.location}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1.5 relative z-10 mt-1 self-start bg-black/20 px-2 py-1 rounded-full border border-white/5 backdrop-blur-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                                        <span className="text-green-400 text-[9px] md:text-[10px] font-bold tracking-widest">{temple.status}</span>
                                    </div>

                                </div>

                            </div>

                            {/* Card Body (Light Theme) */}
                            <div className="p-5 flex-1 relative">

                                <div className="flex flex-col justify-between h-full">

                                    {temple.schedule.map((item, i) => (

                                        <div key={i} className="flex justify-between items-center group/item hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 py-1 rounded-lg transition-colors duration-200">

                                            <span className="text-gray-700 dark:text-gray-300 font-nunito text-[12px] md:text-[13px] font-semibold group-hover/item:text-primary transition-colors">{item.name}</span>

                                            <div className={` flex items-center px-3 py-1.5 rounded-full text-[10px] md:text-[11px] font-bold font-nunito transition-colors border ${item.isNext ? 'bg-orange-50 border-orange-200 text-primary dark:bg-orange-500/10 dark:border-orange-500/30' : 'bg-gray-100 border-transparent text-gray-800 dark:bg-gray-800 dark:text-gray-200'} `}>

                                                {item.time}

                                                {item.isNext && (
                                                    <span className="ml-1.5 flex items-center gap-0.5 opacity-100">
                                                        <span className="text-sm leading-none pt-0.5">&larr;</span>
                                                        <span>NEXT</span>
                                                    </span>
                                                )}

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}