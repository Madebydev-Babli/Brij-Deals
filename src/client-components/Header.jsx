"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

const navLinks = [
    { name: "Restaurants", href: "/categories/restaurants" },
    { name: "Places to Visit", href: "/categories/places-to-visit" },
    { name: "Hotels", href: "/categories/hotels-and-stays" },
    { name: "Religious Shops", href: "/categories/religious-shops" },
    // { name: "Tourist Packages", href: "/categories/tourist-packages" },
    { name: "Blogs", href: "/blogs" },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white border-b border-gray-200 transition-colors duration-300">

            <div className="max-w-[1370px] mx-auto px-5 sm:px-10">

                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-3xl font-bold font-display text-primary tracking-wide">
                            <span className="text-black">Brij</span> Deals
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex gap-5">

                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="text-gray-800 hover:text-primary font-sans font-medium transition-colors duration-200 relative group text-sm xl:text-base">
                                {link.name}
                                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}

                    </nav>

                    {/* Actions */}
                    <div className="hidden lg:flex items-center space-x-5">

                        <Link href="/list-your-business" className="px-6 py-2.5 rounded-full bg-primary text-white hover:opacity-90 transition-opacity duration-200 xl:text-base">
                            List Your Business
                        </Link>

                    </div>

                    {/* Mobile menu button */}
                    <div className="flex lg:hidden items-center space-x-4">

                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none transition-colors" aria-expanded={isMobileMenuOpen}>
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <FiX className="w-7 h-7" /> : <FiMenu className="w-7 h-7" />}
                        </button>

                    </div>

                </div>

            </div>

            {/* Mobile Navigation */}
            <div className={`lg:hidden absolute w-full bg-white border-t border-gray-200 shadow-2xl transition-all duration-300 ease-in-out origin-top ${isMobileMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}`}>

                <div className="px-4 py-6 space-y-4 font-sans">

                    {navLinks.map((link) => (

                        <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base text-gray-800 hover:text-white">
                            {link.name}
                        </Link>

                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-200">

                        <Link href="/list-your-business" className="block w-full text-center px-5 py-3.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity shadow-lg" onClick={() => setIsMobileMenuOpen(false)}>
                            List Your Business
                        </Link>

                    </div>

                </div>

            </div>

        </header>
    );
}