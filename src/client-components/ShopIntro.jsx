'use client'

import { useState, useRef, useEffect } from "react";
import Link from 'next/link';
import { FaMapMarkerAlt, FaStar, FaPhoneAlt, FaShareAlt, FaRegClock, FaInstagram, FaFacebookF, FaLinkedinIn, FaEnvelope, FaWhatsapp, FaLink, FaCheck, FaTimes, FaYoutube, FaGoogle, FaGlobe } from 'react-icons/fa';

export default function ShopIntro({ shop }) {

    const [isShareOpen, setIsShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const shareRef = useRef(null);

    // Close popup on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (shareRef.current && !shareRef.current.contains(event.target)) {
                setIsShareOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://brijdeals.com';
    const shareTitle = 'Check out the shop on Brij Deals!';
    const bannerImage = shop?.banner?.url || shop?.banner || "";
    const logoImage = shop?.logo?.url || shop?.logo || "";

    const handleCopy = () => {
        navigator.clipboard.writeText(pageUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Placeholder Breadcrumb Data
    const breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Religious Shops', path: '/categories/religious-shops' },
        { label: shop?.title, path: `/categories/religious-shops/${shop?.slug}` },
    ];

    return (
        <section>

            {/* 1. Banner Image */}
            <div className="relative w-full h-[250px] md:h-[350px] lg:h-[450px]">
                <img
                    src={bannerImage}
                    alt={shop?.title}
                    className="w-full h-full object-cover"
                />
                {/* Dark gradient to ensure breadcrumbs readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent"></div>

                {/* Breadcrumbs inside banner at top left */}
                <div className="absolute inset-x-0 top-0 max-w-[1370px] mx-auto w-full px-5 sm:px-10 pt-6 md:pt-8 z-10">
                    <nav aria-label="breadcrumb" className="w-full">
                        <ol className="flex items-center gap-2 text-sm text-gray-200 font-nunito overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
                            {breadcrumbs.map((item, index) => {
                                const isFirst = index === 0;
                                const isLast = index === breadcrumbs.length - 1;
                                const isHome = item.label === 'Home';

                                return (
                                    <li key={index} className="flex items-center gap-2">
                                        {!isFirst && <span className="text-gray-400">/</span>}
                                        {isLast ? (
                                            <Link href={item.path} className="text-white font-semibold" aria-current="page">
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <Link href={item.path} className="flex items-center gap-1.5 hover:text-white transition-colors">
                                                {isHome && (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                    </svg>
                                                )}
                                                <span>{item.label}</span>
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                </div>
            </div>

            {/* 2. Content Container (White Card) */}
            <div className="max-w-[1370px] mx-auto px-5 sm:px-10 relative z-20">

                {/* Floating White Card */}
                <div className="bg-white shadow-xl rounded-3xl border border-gray-100 p-6 md:p-8 lg:p-10 -mt-20 md:-mt-40 lg:-mt-36 mb-10 w-full">

                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 w-full">

                        {/* Logo Wrapper */}
                        <div className="shrink-0 -mt-24 md:-mt-24 lg:-mt-34 flex justify-center md:block">
                            <div className="w-[150px] h-[150px] lg:w-[220px] lg:h-[220px] rounded-full border-[6px] lg:border-[8px] border-white shadow-xl bg-white overflow-hidden relative group">
                                <img
                                    src={logoImage}
                                    alt={shop?.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/5 pointer-events-none"></div>

                            </div>

                            <div className="flex flex-col w-full gap-3 mt-5 lg:hidden md:flex hidden">

                                <button className="cursor-pointer flex items-center justify-center gap-2 px-8 h-12 w-full xl:w-[220px] rounded-full bg-primary hover:bg-primary/90 text-white font-nunito font-semibold transition-all shadow-md shadow-primary/20 transform hover:-translate-y-0.5">
                                    <FaPhoneAlt />
                                    <a href={`tel:${shop?.phone}`}>Call Now</a>
                                </button>

                                <button className="cursor-pointer flex items-center justify-center gap-2 px-8 h-12 w-full xl:w-[220px] rounded-full bg-gray-800 hover:bg-gray-900 text-white font-nunito font-semibold transition-all shadow-md transform hover:-translate-y-0.5">
                                    <FaEnvelope />
                                    <a href={`mailto:${shop?.email}`}>Send Email</a>
                                </button>

                            </div>

                        </div>

                        {/* Details Container */}
                        <div className="flex-1 w-full flex flex-col xl:flex-row xl:items-start justify-between gap-8 pt-2 md:pt-0">

                            {/* Text Details */}
                            <div className="space-y-4 max-w-3xl">

                                {/* Badges & Share */}
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 relative" ref={shareRef}>
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-nunito border border-primary/20">
                                        Authentic Religious Shop
                                    </span>
                                    <div className="flex items-center gap-1.5 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                                        <FaStar className="w-3.5 h-3.5" />
                                        <span className="text-gray-800 text-sm font-bold font-nunito">{shop?.rating} <span className="text-gray-500 font-normal">({shop?.reviewCount} Reviews)</span></span>
                                    </div>

                                    {/* Share Trigger Button */}
                                    <button
                                        onClick={() => setIsShareOpen(!isShareOpen)}
                                        className="flex items-center justify-center w-8 h-8 hover:text-primary text-gray-400 cursor-pointer ml-1"
                                        title="Share this page"
                                    >
                                        <FaShareAlt size={20} />
                                    </button>

                                    {/* Share Popup */}
                                    {isShareOpen && (
                                        <div className="absolute top-10 left-1/2 md:left-auto md:right-0 -translate-x-1/2 md:translate-x-0 w-[320px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">

                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-nunito font-bold text-gray-800 text-base">Share this place</h3>
                                                <button onClick={() => setIsShareOpen(false)} className="cursor-pointer text-gray-400 hover:text-gray-600">
                                                    <FaTimes />
                                                </button>
                                            </div>

                                            {/* Copy Link */}
                                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2 mb-4">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={window.location.href}
                                                    className="bg-transparent text-sm text-gray-500 font-nunito w-full outline-none px-1 overflow-hidden text-ellipsis whitespace-nowrap"
                                                />
                                                <button
                                                    onClick={handleCopy}
                                                    className="flex items-center justify-center shrink-0 w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer shadow-sm"
                                                    title="Copy Link"
                                                >
                                                    {copied ? <FaCheck className="text-green-500" /> : <FaLink />}
                                                </button>
                                            </div>

                                            {/* Social Media Grid */}
                                            <div className="grid grid-cols-5 gap-2">
                                                <a href={`https://wa.me/${shop?.phone}?text=${encodeURIComponent(`Hello ${shop?.title}, I have seen your shop on Brij Deals, I want to know more about your shop.`)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group cursor-pointer">
                                                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all border border-green-100">
                                                        <FaWhatsapp size={18} />
                                                    </div>
                                                    <span className="text-[10px] font-nunito font-semibold text-gray-500 group-hover:text-green-600">WhatsApp</span>
                                                </a>

                                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group cursor-pointer">
                                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all border border-blue-100">
                                                        <FaFacebookF size={18} />
                                                    </div>
                                                    <span className="text-[10px] font-nunito font-semibold text-gray-500 group-hover:text-blue-600">Facebook</span>
                                                </a>

                                                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group cursor-pointer">
                                                    <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all border border-sky-100">
                                                        <FaLinkedinIn size={18} />
                                                    </div>
                                                    <span className="text-[10px] font-nunito font-semibold text-gray-500 group-hover:text-sky-600">LinkedIn</span>
                                                </a>

                                                <a href={`https://instagram.com/`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={(e) => { e.preventDefault(); handleCopy(); alert("Link copied! You can now paste it in Instagram."); }}>
                                                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-all border border-pink-100">
                                                        <FaInstagram size={18} />
                                                    </div>
                                                    <span className="text-[10px] font-nunito font-semibold text-gray-500 group-hover:text-pink-600">Instagram</span>
                                                </a>

                                                <a href={shop?.googleReview} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group cursor-pointer">
                                                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all border border-red-100">
                                                        <FaGoogle size={18} />
                                                    </div>
                                                    <span className="text-[10px] font-nunito font-semibold text-gray-500 group-hover:text-red-600">Review</span>
                                                </a>

                                            </div>

                                        </div>
                                    )}

                                </div>

                                {/* Title */}
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-cormorant-garamond text-gray-900 leading-tight text-center md:text-left">
                                    {shop?.title}
                                </h1>

                                {/* Meta Info (Location & Time) */}
                                <div className="flex flex-col gap-2.5 items-center md:items-start">
                                    <div className="flex items-start gap-2 text-gray-600 font-nunito text-sm md:text-base">
                                        <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />
                                        <span>{shop?.location}</span><a href={shop?.mapLink} className="text-blue-600 hover:text-primary">View on Map</a>
                                    </div>
                                    <div className="flex items-start gap-2 text-gray-600 font-nunito text-sm md:text-base">
                                        <FaRegClock className="text-primary mt-1 shrink-0" />
                                        <span><strong className="text-green-600 font-semibold">Open Now</strong> • {shop?.openingTime} - {shop?.closingTime}</span>
                                    </div>
                                </div>

                            </div>

                            {/* Actions Container */}
                            <div className="flex flex-col sm:flex-row xl:flex-col items-center xl:items-end gap-3 shrink-0 pt-2 xl:pt-0 border-t border-gray-100/80 xl:border-none w-full xl:w-auto">

                                {/* Primary Actions */}
                                <div className="flex flex-col sm:flex-row xl:flex-col w-full gap-3">

                                    <a href={`tel:${shop?.phone}`} className="lg:flex hidden cursor-pointer flex items-center justify-center gap-2 px-8 h-12 w-full xl:w-[220px] rounded-full bg-primary hover:bg-primary/90 text-white font-nunito font-semibold transition-all shadow-md shadow-primary/20 transform hover:-translate-y-0.5">
                                        <FaPhoneAlt />
                                        <span>Call Now</span>
                                    </a>

                                    <a href={shop?.website} target="_blank" rel="noopener noreferrer" className="lg:flex hidden cursor-pointer flex items-center justify-center gap-2 px-8 h-12 w-full xl:w-[220px] rounded-full bg-gray-800 hover:bg-gray-900 text-white font-nunito font-semibold transition-all shadow-md transform hover:-translate-y-0.5">
                                        <FaGlobe />
                                        <span>Go To Website</span>
                                    </a>

                                    {/* Social Media Circular Buttons */}
                                    <div className="flex items-center justify-center gap-2 pt-2 w-full xl:w-[220px]">

                                        <a href={`tel:${shop?.phone}`} target="_blank" rel="noopener noreferrer" className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full bg-pink-50 text-blue-600 hover:bg-pink-600 hover:text-white transition-all border border-blue-100 transform hover:-translate-y-0.5 shadow-sm">
                                            <FaPhoneAlt size={20} />
                                        </a>

                                        <a href={`mailto:${shop?.email}`} target="_blank" rel="noopener noreferrer" className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full bg-pink-50 text-red-600 hover:bg-pink-600 hover:text-white transition-all border border-red-100 transform hover:-translate-y-0.5 shadow-sm">
                                            <FaEnvelope size={20} />
                                        </a>

                                        <a href={shop?.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white transition-all border border-pink-100 transform hover:-translate-y-0.5 shadow-sm">
                                            <FaInstagram size={20} />
                                        </a>

                                        <a href={shop?.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 transform hover:-translate-y-0.5 shadow-sm">
                                            <FaFacebookF size={20} />
                                        </a>

                                        <a href={shop?.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-100 transform hover:-translate-y-0.5 shadow-sm">
                                            <FaYoutube size={20} />
                                        </a>

                                        <a href={`https://wa.me/${shop?.phone}?text=${encodeURIComponent(`Hello ${shop?.title}, I have seen your shop on Brij Deals, I want to know more about your shop.`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all border border-green-100 transform hover:-translate-y-0.5 shadow-sm">
                                            <FaWhatsapp size={20} />
                                        </a>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );
}