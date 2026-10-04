import Link from 'next/link';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaHeart, FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-5">

            <div className="px-5 sm:px-10 max-w-[1370px] mx-auto">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand & Intro */}
                    <div className="flex flex-col space-y-5">
                        <Link href="/" className="text-3xl font-bold font-display text-primary tracking-wide">
                            <span className="text-white">Brij</span> Deals
                        </Link>
                        <p className="text-gray-400 font-sans text-sm leading-relaxed">
                            Your ultimate guide to exploring the magic of Mathura, Vrindavan, and Govardhan. Discover premium stays, finest dining, authentic religious shops, and customized tour packages.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4 pt-4">
                            <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(247,127,0,0.4)]">
                                <FaInstagram className="w-5 h-5" />
                            </a>
                            <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(247,127,0,0.4)]">
                                <FaFacebookF className="w-4 h-4" />
                            </a>
                            <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(247,127,0,0.4)]">
                                <FaYoutube className="w-5 h-5" />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(247,127,0,0.4)]">
                                <FaLinkedinIn className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links 1 */}
                    <div>
                        <h3 className="text-white font-semibold font-sans mb-5 text-lg tracking-wide">QUICK LINKS</h3>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-gray-400 hover:text-primary transition-colors text-sm">Home</Link></li>
                            {/* <li><Link href="/blogs" className="text-gray-400 hover:text-primary transition-colors text-sm">Blogs</Link></li> */}
                            <li><Link href="/about-us" className="text-gray-400 hover:text-primary transition-colors text-sm">About Us</Link></li>
                            <li><Link href="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
                            <li><Link href="/terms-and-conditions" className="text-gray-400 hover:text-primary transition-colors text-sm">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links 2 (Categories) */}
                    <div>
                        <h3 className="text-white font-semibold font-sans mb-5 text-lg tracking-wide">CATEGORIES</h3>
                        <ul className="space-y-3">
                            <li><Link href="/categories/restaurants" className="text-gray-400 hover:text-primary transition-colors text-sm">Restaurants</Link></li>
                            <li><Link href="/categories/places-to-visit" className="text-gray-400 hover:text-primary transition-colors text-sm">Places to Visit</Link></li>
                            <li><Link href="/categories/hotels-and-stays" className="text-gray-400 hover:text-primary transition-colors text-sm">Hotels & Stays</Link></li>
                            {/* <li><Link href="/categories/religious-shops" className="text-gray-400 hover:text-primary transition-colors text-sm">Religious Shops</Link></li> */}
                            <li><Link href="/categories/tourist-packages" className="text-gray-400 hover:text-primary transition-colors text-sm">Tourist Packages</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold font-sans mb-5 text-lg tracking-wide">CONTACT INFO</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start group">
                                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-primary/20 transition-colors mt-0.5">
                                    <FaMapMarkerAlt className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="ml-3 text-gray-400 text-sm mt-1.5 leading-tight">123 Heritage Road, Vrindavan, Mathura, UP 281121</span>
                            </li>
                            <li className="flex items-center group">
                                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <FaPhoneAlt className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="ml-3 text-gray-400 text-sm mt-1">+91 90909 09090</span>
                            </li>
                            <li className="flex items-center group">
                                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <FaEnvelope className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="ml-3 text-gray-400 text-sm mt-1">support@brijdeals.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-white/10 pt-5 text-center text-gray-400 text-sm flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2">
                    <p>© {new Date().getFullYear()} Brij Deals. All rights reserved.</p>
                    <p className='flex justify-center items-center gap-1'>Developed with <span className="text-primary mx-1"><FaHeart /> </span> by <a className='hover:text-primary' href="https://www.infotechistan.com/" target="_blank" rel="noopener noreferrer"> Infotechistan</a></p>
                </div>

            </div>

        </footer>
    );
}