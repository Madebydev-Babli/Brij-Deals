import { notFound } from "next/navigation";
import WebsiteLayout from "@/client-components/WebsiteLayout";
import PlaceIntro from "@/client-components/PlaceIntro";
import PhotoGallery from "@/client-components/GallerySection";
import NearbyAttractions from "@/server-components/NearbyAttractions";
import PlaceTipsSection from "@/client-components/PlaceTipsSection";
import connectToDatabase from "../../../../../backend/configurations/mongoose.config";
import { PlaceModel } from "../../../../../backend/models/place";
import { GoDot } from "react-icons/go";

async function getPlaceDetails(slug) {
    await connectToDatabase();
    const place = await PlaceModel.findOne({ slug }).lean();
    return JSON.parse(JSON.stringify(place));
}

export default async function Page({ params }) {
    const { slug } = await params;
    const place = await getPlaceDetails(slug);

    if (!place) {
        notFound();
    }

    return (
        <>
            <WebsiteLayout>
                <PlaceIntro place={place} />

                <section className="pt-10 pb-20">
                    <div className="max-w-[1370px] mx-auto px-5 sm:px-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                            <div className="lg:col-span-4">
                                <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold font-cormorant-garamond text-gray-900 mb-5 leading-tight">
                                    History of {place?.title}
                                </h2>
                                <div className="w-20 h-1.5 bg-primary rounded-full"></div>
                            </div>

                            <div className="lg:col-span-8">
                                <div className="bg-gray-50/50 p-5 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
                                    <p className="text-gray-700 font-nunito text-lg md:text-xl leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:font-cormorant-garamond">
                                        {place?.history}
                                    </p>

                                    <div className="mt-10 flex items-center gap-4 text-sm font-semibold text-gray-400 font-nunito uppercase tracking-[0.2em]">
                                        <div className="flex-grow h-[1px] bg-gray-200"></div>
                                        A Part of Brij Heritage
                                        <div className="flex-grow h-[1px] bg-gray-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-10 bg-[#FDF9F1]">
                    <div className="max-w-[1370px] mx-auto px-5 sm:px-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                    <span className="w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></span>
                                    <span className="text-sm font-bold tracking-widest text-primary uppercase">Divine Schedule</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cormorant-garamond tracking-tight text-gray-900 mb-4">
                                    Aarti <span className="text-primary">Timings</span>
                                </h2>

                                <p className="text-gray-600 text-base md:text-lg max-w-2xl font-nunito">
                                    Experience the spiritual energy of the sacred ceremonies. Here is the scheduled timing for daily rituals at {place?.title}.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 py-10 gap-5">
                            {place?.artiTimings?.map((arti, index) => (
                                <div key={index} className="group relative bg-white p-5 rounded-3xl border-2 border-primary/20 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity">
                                        <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                                        </svg>
                                    </div>

                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold font-cormorant-garamond text-gray-900 mb-2">{arti.name}</h3>
                                        <p className="text-primary font-bold font-nunito tracking-wider uppercase text-sm">{arti.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-5 bg-amber-100 rounded-2xl border border-amber-200 flex items-start gap-4">
                            <div className="text-amber-500 mt-1">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                </svg>
                            </div>

                            <p className="text-amber-800 text-sm font-nunito leading-relaxed">
                                <strong>Note:</strong> Aarti timings may vary slightly depending on the Hindu lunar calendar, festivals, and specific temple traditions. It is recommended to arrive 15-20 minutes early.
                            </p>
                        </div>
                    </div>
                </section>

                <PhotoGallery gallery={place?.gallery} />

                <section className="py-10 bg-[#FDF9F1] -mt-10">
                    <div className="max-w-[1370px] mx-auto px-5 sm:px-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                    <span className="w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></span>
                                    <span className="text-sm font-bold tracking-widest text-primary uppercase">Location Info</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cormorant-garamond tracking-tight text-gray-900 mb-4">
                                    How To <span className="text-primary">Reach</span>
                                </h2>

                                <ul className="text-gray-600 text-base md:text-lg max-w-2xl font-nunito">
                                    <li className="flex gap-1 items-center"><GoDot /> {place?.location}</li>
                                </ul>
                            </div>

                            <div>
                                <div className="relative p-1 bg-white rounded-lg shadow-2xl overflow-hidden group">
                                    <iframe
                                        src={place?.mapEmbed}
                                        width="100%"
                                        height="200"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="rounded-lg grayscale-[0.2] contrast-[1.1] brightness-[0.95] group-hover:grayscale-0 transition-all duration-700"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <NearbyAttractions attractions={place?.attractions || []} />
                <PlaceTipsSection place={place} />
            </WebsiteLayout>
        </>
    );
}
