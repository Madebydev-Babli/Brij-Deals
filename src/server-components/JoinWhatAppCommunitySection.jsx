import React from 'react';
import { FaWhatsapp, FaBell, FaTicketAlt, FaTags, FaOm, FaGift, FaGem } from 'react-icons/fa';

export default function JoinWhatAppCommunitySection() {
    return (
        <section className="pb-20 overflow-hidden">

            <div className="px-5 sm:px-10 max-w-[1370px] mx-auto">

                <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-[#4A0A04] shadow-2xl flex flex-col lg:flex-row items-center justify-between p-6 sm:p-10 md:p-16 lg:p-10 group">

                    {/* Left Content */}
                    <div className="relative z-10 w-full lg:w-[50%] text-center lg:text-left mb-16 lg:mb-0">

                        <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-md text-amber-400 rounded-full px-5 py-1.5 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] shadow-[0_0_8px_#25D366] animate-pulse"></span>
                            Exclusive VIP Access
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-cormorant-garamond text-white leading-tight mb-6 font-bold tracking-tight">
                            Join the <span className="text-primary">Brij Deals</span> <br className="hidden lg:block" /> WhatsApp VIP Club
                        </h2>

                        <p className="text-gray-300 font-nunito text-base md:text-lg max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-light">
                            Never miss a sacred moment. Get real-time darshan updates, secret hotel discounts, and local insider tips delivered straight to your phone.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch justify-center lg:justify-start gap-3 sm:gap-4 mb-12 w-full max-w-2xl mx-auto lg:mx-0">

                            {[
                                { icon: <FaBell className="text-amber-400 w-4 h-4" />, text: "Real-time Alerts" },
                                { icon: <FaTicketAlt className="text-amber-400 w-4 h-4" />, text: "VIP Darshan Passes" },
                                { icon: <FaTags className="text-amber-400 w-4 h-4" />, text: "Secret Lodging Deals" },
                            ].map((feature, idx) => (
                                <div key={idx} className="flex-1 flex items-center justify-start lg:justify-center gap-3 bg-black/20 px-3 md:px-4 py-3 rounded-xl backdrop-blur-sm border border-white/5 transition-colors hover:bg-black/30">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shadow-inner flex-shrink-0">
                                        {feature.icon}
                                    </div>
                                    <span className="text-gray-200 font-nunito text-sm font-semibold tracking-wide leading-tight">{feature.text}</span>
                                </div>
                            ))}

                        </div>

                        <a href="https://wa.me/YOUR_NUMBER" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#25D366] to-[#1EAA52] text-white px-8 md:px-10 py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 shadow-[0_10px_30px_rgba(37,211,102,0.3)] transform hover:-translate-y-1 group/btn border border-[#25D366]/50">
                            <FaWhatsapp className="w-7 h-7 group-hover/btn:scale-110 transition-transform duration-300" />
                            <span>Join Community Now</span>
                        </a>

                    </div>

                    {/* Right Image/Graphics */}
                    <div className="relative z-10 w-full lg:w-[45%] xl:w-[40%] flex justify-center lg:justify-end mt-10 lg:mt-0">

                        <div className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[320px] lg:h-[320px] xl:w-[400px] xl:h-[400px] flex-shrink-0 grid place-items-center">

                            {/* Decorative Rings via Grid Stacking */}
                            <div className="col-start-1 row-start-1 w-full h-full rounded-full border border-white/10 animate-[spin_12s_linear_infinite]"></div>
                            <div className="col-start-1 row-start-1 w-[84%] h-[84%] rounded-full border border-dashed border-white/20 animate-[spin_20s_linear_infinite_reverse]"></div>
                            <div className="col-start-1 row-start-1 w-[68%] h-[68%] rounded-full border border-white/5 animate-[spin_10s_linear_infinite]"></div>

                            {/* Main Icon Circle via Grid Stacking */}
                            <div className="col-start-1 row-start-1 w-[52%] h-[52%] rounded-full bg-gradient-to-br from-[#25D366] to-[#075E54] shadow-[0_0_50px_rgba(37,211,102,0.4)] flex items-center justify-center transform hover:scale-105 transition-transform duration-500 cursor-pointer group/icon border-[3px] border-green-800 relative">

                                <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"></div>
                                <FaWhatsapp className="text-white w-[50%] h-[50%] drop-shadow-2xl group-hover/icon:rotate-12 transition-transform duration-500 relative z-10" />

                                {/* Notification Badge overlay */}
                                <div className="absolute top-[0%] right-[0%] sm:-top-[2%] sm:-right-[2%] md:-top-[5%] md:-right-[5%] w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-red-500 rounded-full border-[2px] border-[#128C7E] flex items-center justify-center shadow-lg transform group-hover/icon:scale-110 transition-transform duration-300 z-20">
                                    <span className="text-white text-[10px] sm:text-xs md:text-sm font-bold">1</span>
                                </div>

                            </div>

                            {/* Floating decorative elements (Absolute to wrapper) */}
                            <div className="absolute top-[8%] left-[8%] sm:top-[12%] sm:left-[10%] w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center animate-bounce shadow-xl" style={{ animationDuration: '3.5s' }}>
                                <FaGift className="text-amber-400 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                            </div>

                            <div className="absolute bottom-[5%] right-[5%] sm:bottom-[10%] sm:right-[10%] w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center animate-bounce shadow-xl" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                                <FaOm className="text-amber-400 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 filter drop-shadow-md" />
                            </div>

                            <div className="absolute top-1/2 -left-[6%] md:-left-[8%] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center animate-pulse shadow-xl" style={{ animationDuration: '3s' }}>
                                <FaGem className="text-amber-400 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}