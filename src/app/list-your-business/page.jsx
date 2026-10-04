import PageIntroSection from "@/server-components/PageIntroSection";
import WebsiteLayout from "@/client-components/WebsiteLayout";
import Link from "next/link";
import { FaUtensils, FaHotel, FaOm, FaMapMarkedAlt } from "react-icons/fa";

export default function Page() {
    return (
        <WebsiteLayout>

            <PageIntroSection title="List Your Business" description="Discover the most sacred temples, spiritual sites, and must-visit destinations in Mathura, Vrindavan, and Govardhan." breadcrumbs={[{ route: "/", label: "Home" }, { route: "/list-your-business", label: "List Your Business" }]} showSearchAndFilters={false} />

            <div className="min-h-screen pb-20">

                <div className="px-5 sm:px-10 max-w-[1370px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 items-center relative z-10 gap-10">

                    {/* Left Column Content */}
                    <div>
                        <div className="inline-block border border-primary/40 rounded-full px-4 py-1.5 mb-8">
                            <span className="text-primary text-xs flex gap-2 items-center font-semibold tracking-[0.2em] uppercase">For Business Owners</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cormorant-garamond tracking-tight mb-2">
                            List Your Business, <br />
                            <span className="text-primary">Reach Thousands</span>
                        </h1>

                        <p className="text-gray-600 text-base md:text-lg max-w-2xl font-nunito max-w-lg mb-10">
                            Brij Deals pe apna restaurant, hotel, shop ya tour package list karo. Customer directly aapke paas aayega — hum sirf connect karate hain.
                        </p>

                        <div className="space-y-8 mb-12 font-nunito">

                            {/* Step 1 */}
                            <div className="flex items-start gap-5">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0 mt-1">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-gray-900 font-semibold text-lg mb-1">Fill the listing form</h3>
                                    <p className="text-gray-600 text-base">Basic info — name, category, address, contact number</p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-start gap-5">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0 mt-1">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-gray-900 font-semibold text-lg mb-1">We verify & publish</h3>
                                    <p className="text-gray-600 text-base">Our team reviews and puts your business live within 24 hours</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-start gap-5">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0 mt-1">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-gray-900 font-semibold text-lg mb-1">Customer contacts you directly</h3>
                                    <p className="text-gray-600 text-base">No middleman — calls, WhatsApp, walk-ins — all direct to you</p>
                                </div>
                            </div>

                        </div>

                        <div className="flex flex-wrap items-center gap-6">
                            <Link href="#" className="px-6 py-2.5 rounded-full bg-primary text-white hover:opacity-90 transition-opacity duration-200 xl:text-base flex gap-2">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                List My Business
                            </Link>
                            <Link href="#" className="border border-gray-600 hover:border-gray-400 text-gray-900 hover:text-primary px-6 py-2.5 rounded-full transition-colors duration-300 flex items-center gap-2">
                                Learn More <span className="text-xl leading-none">&rarr;</span>
                            </Link>
                        </div>

                    </div>

                    {/* Right Column Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 lg:mt-0 font-nunito">

                        {/* Card 1 */}
                        <div className="bg-[#15122B] border border-gray-800 rounded-2xl p-7 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="text-3xl mb-5 inline-block p-4 rounded-xl bg-white/5 text-gray-200 group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all origin-left"><FaUtensils /></div>
                            <h3 className="text-white font-semibold font-cormorant-garamond tracking-tight uppercase mb-2">Restaurant</h3>
                            <p className="text-gray-200 text-sm mb-6 max-w-[150px]">Dhaba, cafe, thali, sweet shop</p>
                            <p className="text-[#E5B55C] font-bold text-sm">213 LISTED</p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#15122B] border border-gray-800 rounded-2xl p-7 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="text-3xl mb-5 inline-block p-4 rounded-xl bg-white/5 text-gray-200 group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all origin-left"><FaHotel /></div>
                            <h3 className="text-white font-semibold font-cormorant-garamond tracking-tight uppercase mb-2">Hotel / Stay</h3>
                            <p className="text-gray-200 text-sm mb-6 max-w-[150px]">Hotel, dharamshala, homestay</p>
                            <p className="text-[#E5B55C] font-bold text-sm">98 LISTED</p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[#15122B] border border-gray-800 rounded-2xl p-7 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="text-3xl mb-5 inline-block p-4 rounded-xl bg-white/5 text-gray-200 group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all origin-left"><FaOm /></div>
                            <h3 className="text-white font-semibold font-cormorant-garamond tracking-tight uppercase mb-2">Religious Shop</h3>
                            <p className="text-gray-200 text-sm mb-6 max-w-[150px]">Idols, puja samagri, mala</p>
                            <p className="text-[#E5B55C] font-bold text-sm">156 LISTED</p>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-[#15122B] border border-gray-800 rounded-2xl p-7 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="text-3xl mb-5 inline-block p-4 rounded-xl bg-white/5 text-gray-200 group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all origin-left"><FaMapMarkedAlt /></div>
                            <h3 className="text-white font-semibold font-cormorant-garamond tracking-tight uppercase mb-2">Tour Package</h3>
                            <p className="text-gray-200 text-sm mb-6 max-w-[150px]">Yatra, parikrama, pilgrimage</p>
                            <p className="text-[#E5B55C] font-bold text-sm">47 LISTED</p>
                        </div>

                    </div>

                </div>
            </div>
        </WebsiteLayout>
    );
}