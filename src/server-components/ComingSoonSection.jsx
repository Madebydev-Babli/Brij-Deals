import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";

export default function ComingSoonSection() {
    return (
        <section className="h-[80vh] flex items-center justify-center px-5 sm:px-10 py-20 relative overflow-hidden">

            <div className="max-w-3xl mx-auto text-center z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-50 mb-8 border-2 border-orange-200 relative">
                    <FaCalendarAlt className="text-4xl text-primary relative z-10" />
                    <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20"></div>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-cormorant-garamond text-gray-900 mb-6">
                    Exciting Reads <span className="text-primary italic">Coming Soon</span>
                </h2>

                <p className="text-gray-600 font-nunito text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
                    We're crafting detailed guides, spiritual journeys, and local recommendations to help you experience the true essence of Brij Bhumi. Stay tuned!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/" className="px-8 py-3.5 bg-primary text-white font-nunito font-semibold rounded-lg hover:-translate-y-0.5 transition-all duration-300">
                        Explore Brij Deals
                    </Link>
                </div>
            </div>
        </section>
    )
}