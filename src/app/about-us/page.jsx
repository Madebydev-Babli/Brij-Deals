import BlogsSection from "@/client-components/BlogsSection";
import JoinWhatAppCommunitySection from "@/server-components/JoinWhatAppCommunitySection";
import PageIntroSection from "@/server-components/PageIntroSection";
import WebsiteLayout from "@/client-components/WebsiteLayout";
import WhyChooseUsSection from "@/server-components/WhyChooseUsSection";
import FAQsSection from "@/server-components/FAQsSection";
import { BsLightningCharge } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa";


export default function Page() {
    return (
        <>
            <WebsiteLayout>

                <PageIntroSection title="About Us" description="Discover the most sacred temples, spiritual sites, and must-visit destinations in Mathura, Vrindavan, and Govardhan." breadcrumbs={[{ route: "/", label: "Home" }, { route: "/about-us", label: "About Us" }]} showSearchAndFilters={false} />

                <div className="min-h-screen">

                    <section>

                        <div className="px-5 sm:px-10 max-w-[1370px] mx-auto">

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                                {/* Left Content: Text */}
                                <div>

                                    <div className="text-center md:text-left">

                                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                            <span className="w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></span>
                                            <span className="text-sm font-bold tracking-widest text-primary uppercase">About Us</span>
                                        </div>

                                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cormorant-garamond tracking-tight text-gray-900 mb-4">
                                            Your Ultimate Guide to <span className="text-primary">Brij Bhumi</span>
                                        </h2>

                                        <p className="text-gray-600 text-base md:text-lg max-w-2xl font-nunito">
                                            Whether you are looking for a peaceful ashram stay, the finest vegetarian thali, or a trusted local guide for your parikrama, we eliminate the middlemen. We connect you directly with verified local businesses, ensuring transparency, trust, and true devotion in your service.
                                        </p>

                                        <p className="text-gray-600 text-base md:text-lg max-w-2xl font-nunito mb-10 mt-5">
                                            Whether you are looking for a peaceful ashram stay, the finest vegetarian thali, or a trusted local guide for your parikrama, we eliminate the middlemen. We connect you directly with verified local businesses, ensuring transparency, trust, and true devotion in your service.
                                        </p>

                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-5 pt-6 border-t border-gray-200">

                                        <div>
                                            <h4 className="text-3xl md:text-4xl font-bold text-gray-900 font-cormorant-garamond mb-1">500<span className="text-primary">+</span></h4>
                                            <p className="text-xs sm:text-sm text-gray-600 font-nunito font-semibold uppercase tracking-wider">Verified Listings</p>
                                        </div>

                                        <div>
                                            <h4 className="text-3xl md:text-4xl font-bold text-gray-900 font-cormorant-garamond mb-1">10k<span className="text-primary">+</span></h4>
                                            <p className="text-xs sm:text-sm text-gray-600 font-nunito font-semibold uppercase tracking-wider">Happy Yatris</p>
                                        </div>

                                        <div>
                                            <h4 className="text-3xl md:text-4xl font-bold text-gray-900 font-cormorant-garamond mb-1">0<span className="text-primary">%</span></h4>
                                            <p className="text-xs sm:text-sm text-gray-600 font-nunito font-semibold uppercase tracking-wider">Platform Fees</p>
                                        </div>

                                    </div>

                                </div>

                                {/* Right Content: Values/Mission */}
                                <div className="space-y-6 lg:mt-0">

                                    {/* Mission */}
                                    <div className="relative flex flex-col items-start p-5 rounded-3xl bg-yellow-50 shadow-xl shadow-gray-200/50 border-2 border-orange-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-100 group overflow-hidden z-10">

                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform duration-700 group-hover:scale-125"></div>

                                        <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4 border border-orange-100 group-hover:bg-primary group-hover:-rotate-6 transition-all duration-500 shadow-sm">
                                            <div className="text-primary group-hover:text-white transition-colors duration-500 flex items-center justify-center">
                                                <BsLightningCharge className="w-8 h-8 transition-colors duration-500" />
                                            </div>
                                        </div>

                                        <h3 className="text-2xl sm:text-3xl font-bold font-cormorant-garamond text-gray-900 mb-4 relative z-10">Our Mission</h3>

                                        <p className="text-gray-600 font-nunito leading-relaxed text-base sm:text-lg relative z-10">
                                            To simplify local discovery in Brij Bhumi by empowering direct connections between pilgrims, tourists, and authentic local businesses without any hidden fees.
                                        </p>

                                    </div>

                                    {/* Vision */}
                                    <div className="relative flex flex-col items-start p-5 rounded-3xl bg-yellow-50 shadow-xl shadow-gray-200/50 border-2 border-orange-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-100 group overflow-hidden z-10">

                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform duration-700 group-hover:scale-125"></div>

                                        <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4 border border-orange-100 group-hover:bg-primary group-hover:-rotate-6 transition-all duration-500 shadow-sm">
                                            <div className="text-primary group-hover:text-white transition-colors duration-500 flex items-center justify-center">
                                                <FaRegEye className="w-8 h-8 transition-colors duration-500" />
                                            </div>
                                        </div>

                                        <h3 className="text-2xl sm:text-3xl font-bold font-cormorant-garamond text-gray-900 mb-4 relative z-10">Our Vision</h3>

                                        <p className="text-gray-600 font-nunito leading-relaxed text-base sm:text-lg relative z-10">
                                            To become the most trusted digital companion for every individual visiting Mathura, Vrindavan, and Govardhan, preserving the cultural essence while embracing modern convenience.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>

                    <WhyChooseUsSection />
                    <JoinWhatAppCommunitySection />
                    <BlogsSection />
                    <FAQsSection page="/about-us" />

                </div>

            </WebsiteLayout>
        </>
    );
}