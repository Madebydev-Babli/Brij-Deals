"use client";

import Footer from "@/server-components/Footer";
import Header from "@/client-components/Header";
import Link from "next/link";
import { FaWhatsapp, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function WebsiteLayout({ children }) {

    return (
        <>
            <Header />

            <main className="min-h-screen">

                {children}

            </main>

            <Footer />
            {/* 
            <SocialMediaMenu />

            <Link
                href="https://wa.me/919090909090?text=Hello%20Brij%20Deals!%20I%20want%20to%20know%20more%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-4 right-4 z-50"
            >


                <div className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 rounded-full shadow-lg transition duration-300 w-16 h-16 p-4 flex items-center justify-center animate-pulse hover:scale-110 hover:shadow-2xl hover:animate-none">
                    <div className="absolute inset-0 rounded-full bg-green-500 opacity-50 blur-lg animate-ping"></div>
                    <FaWhatsapp className="text-white" size={40} />
                </div>

            </Link> */}
        </>
    );
}

function SocialMediaMenu() {

    const socialLinks = [
        {
            icon: FaFacebook,
            url: "#",
            color: "from-blue-500 to-blue-600",
            hoverColor: "from-blue-600 to-blue-700"
        },
        {
            icon: FaInstagram,
            url: "#",
            color: "from-pink-500 to-purple-600",
            hoverColor: "from-pink-600 to-purple-700"
        },
        {
            icon: FaYoutube,
            url: "#",
            color: "from-red-500 to-red-600",
            hoverColor: "from-red-600 to-red-700"
        }
    ];

    return (

        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
            {/* Desktop Menu - Always visible */}
            <div className="hidden md:flex flex-col space-y-3">
                {socialLinks.map((social, index) => (
                    <Link
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                    >
                        <div className={`bg-gradient-to-r ${social.color} hover:${social.hoverColor} rounded-full shadow-lg transition-all duration-300 w-12 h-12 flex items-center justify-center hover:scale-110 hover:shadow-xl`}>
                            <social.icon className="w-6 h-6 text-white" />
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
}
