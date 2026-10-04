'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaArrowRight, FaCalendarAlt, FaUserCircle } from 'react-icons/fa';

export default function BlogsSection() {


const scrollContainerRef = useRef(null);
const [blogs, setBlogs] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    async function fetchBlogs() {
        try {
            const response = await fetch('/api/blog?limit=10&sortKey=createdAt&sortOrder=-1');
            const data = await response.json();

            if (data.status === 'success') {
                setBlogs(data.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
        } finally {
            setLoading(false);
        }
    }

    fetchBlogs();
}, []);

const scrollLeft = () => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({
            left: -350,
            behavior: 'smooth'
        });
    }
};

const scrollRight = () => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({
            left: 350,
            behavior: 'smooth'
        });
    }
};

if (!loading && blogs.length === 0) {
    return null;
}

return (
    <section className="bg-[#FDF9F1] pt-10 overflow-hidden">

        <div className="px-5 sm:px-10 max-w-[1370px] mx-auto">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

                <div className="text-center md:text-left">

                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                        <span className="w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></span>
                        <span className="text-sm font-bold tracking-widest text-primary uppercase">
                            Brij Yatra Insights
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cormorant-garamond tracking-tight text-gray-900 mb-4">
                        Latest from <span className="text-primary">Our Blog</span>
                    </h2>

                    <p className="text-gray-600 text-base md:text-lg max-w-2xl font-nunito">
                        Experience the divine beauty of Brij Bhumi. Navigate through our handpicked selection of premium stays, authentic dining, and spiritual tours.
                    </p>

                </div>

                <div className="hidden md:flex items-center gap-3">

                    <button
                        onClick={scrollLeft}
                        className="cursor-pointer w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 bg-white shadow-sm"
                        aria-label="Scroll left"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={scrollRight}
                        className="cursor-pointer w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 bg-white shadow-sm"
                        aria-label="Scroll right"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    d="M9 5l7 7-7 7"
/>
                        </svg>
                    </button>

                </div>

            </div>

            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-5 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-5 px-5 sm:mx-0 sm:px-0 scroll-smooth relative z-20 pb-10 pt-10"
            >

                {blogs.map((blog) => (

                    <div
                        key={blog._id}
                        className="relative flex-none w-[280px] sm:w-[300px] lg:w-[300px] xl:w-[320px] snap-center sm:snap-start group rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 flex flex-col"
                    >

                        <div className="relative w-full h-[220px] sm:h-[250px] overflow-hidden bg-orange-100">

                            {blog.image && (
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                />
                            )}

                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] sm:text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-sm">
                                {blog.category}
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        </div>

                        <div className="p-6 md:p-8 flex flex-col flex-grow">

                            <div className="flex items-center gap-4 text-xs text-gray-500 font-nunito mb-4">

                                <div className="flex items-center gap-1.5">
                                    <FaCalendarAlt className="text-orange-400" />
                                    <span>{blog.date}</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <FaUserCircle className="text-orange-400" />
                                    <span>{blog.author}</span>
                                </div>

                            </div>

                            <h3 className="text-xl md:text-2xl font-bold font-cormorant-garamond text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                {blog.title}
                            </h3>

                            <p className="text-gray-600 font-nunito text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
                                {blog.description}
                            </p>

                            <div className="mt-auto pt-2">

                                <Link
                                    href={`/blogs/${blog.slug}`}
                                    className="inline-flex items-center gap-2 text-primary font-semibold font-nunito text-sm md:text-base group/link hover:text-orange-600 transition-colors"
                                >
                                    Read More
                                    <FaArrowRight className="w-4 h-4 transform transition-transform group-hover/link:translate-x-1" />
                                </Link>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    </section>
);


}
