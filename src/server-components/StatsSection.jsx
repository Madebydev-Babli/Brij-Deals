export default function StatsSection() {
    const deals = [
        { title: 'Vrindavan Darshan', detail: '₹999/person', suffix: 'only' },
        { title: 'Prem Mandir Aarti Tour', detail: 'Free entry', suffix: 'with hotel booking' },
        { title: 'Braj Bhoomi Thali', detail: 'Flat ₹50 OFF', suffix: 'on first order' },
        { title: 'Govardhan Parikrama', detail: 'Special Package', suffix: 'available' },
    ];

    const stats = [
        { number: '500+', label: 'RESTAURANTS' },
        { number: '120+', label: 'HOTELS & STAYS' },
        { number: '80+', label: 'SACRED PLACES' },
        { number: '50+', label: 'TOUR PACKAGES' },
    ];

    return (
        <section className="w-full relative z-20 mx-auto px-5 sm:px-10 xl:max-w-[1370px] mb-20">

            <div className="w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col border-2 border-[#4A0A04]">

                {/* Hot Deals Ticker */}
                <div className="flex bg-gray-100 relative items-stretch h-12 md:h-14 overflow-hidden">

                    {/* Badge */}
                    <div className="relative z-20 flex-shrink-0 flex items-center justify-center px-4 md:px-8 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-xs md:text-sm tracking-widest uppercase shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
                        HOT DEALS
                        <div className=" hidden sm:block absolute top-0 -right-5 h-full w-8 bg-amber-500 transform -skew-x-[20deg] origin-bottom -z-10 shadow-lg"></div>
                    </div>

                    {/* Scrolling Marquee */}
                    <div className="flex-1 overflow-hidden flex items-center relative [mask-image:linear-gradient(to_right,black,black_5%,black_95%,black)]">
                        <div className="animate-marquee flex whitespace-nowrap items-center hover:[animation-play-state:paused] w-max">
                            {/* Duplicate deals to ensure seamless loop */}
                            {[...deals, ...deals, ...deals, ...deals].map((deal, idx) => (
                                <div key={idx} className="flex items-center text-gray-800 text-xs md:text-sm px-6">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-3 hidden sm:block"></span>
                                    <span className="text-gray-800 mr-1.5">{deal.title}</span> -
                                    <span className="mx-1.5 px-3 py-0.5 border border-white/20 rounded-full font-semibold bg-white/5">{deal.detail}</span>
                                    <span className="text-gray-800">{deal.suffix}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-[#4A0A04] py-8 md:py-5 px-2 md:px-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none"></div>

                    <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-y-10 divide-x-0 md:divide-x divide-white/10 lg:divide-white/10">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center justify-center text-center px-4">
                                <h3 className="text-4xl lg:text-5xl font-cormorant-garamond font-bold text-[#F77F00] mb-2 drop-shadow-md">{stat.number}</h3>
                                <p className="text-xs lg:text-sm font-semibold text-white/70 tracking-widest font-nunito uppercase">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}