import WebsiteLayout from "@/client-components/WebsiteLayout";
import Link from "next/link";
import { FaChevronDown, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { PlaceModel } from "../../../../backend/models/place";

async function getPlaces() {
    await connectToDatabase();
    const places = await PlaceModel.find({}).sort({ sno: 1 }).lean();
    return JSON.parse(JSON.stringify(places));
}

export default async function Page() {
    const places = await getPlaces();

    return (
        <>
            <WebsiteLayout>
                <section className="bg-primary/20">
                    <div className="px-5 sm:px-10 max-w-[1370px] mx-auto py-10 mb-10">
                        <div className="mb-5">
                            <nav aria-label="breadcrumb" className="w-full">
                                <ol className="flex items-center gap-2 text-sm text-gray-500 font-nunito overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
                                    {[
                                        { route: "/", label: "Home" },
                                        { route: "/categories/places-to-visit", label: "Places to Visit" },
                                    ].map((item, index) => {
                                        const isFirst = index === 0;
                                        const isLast = index === 1;
                                        const label = item.label || item.path || item.lable;
                                        const isHome = label === "Home";

                                        return (
                                            <li key={index} className="flex items-center gap-2">
                                                {!isFirst && <span className="text-gray-400">/</span>}

                                                {isLast ? (
                                                    <span className="text-primary font-semibold truncate flex items-center gap-1.5" aria-current="page">
                                                        {isHome && (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                            </svg>
                                                        )}
                                                        {label}
                                                    </span>
                                                ) : (
                                                    <Link href={item.route || "#"} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                                        {isHome && (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                            </svg>
                                                        )}
                                                        <span>{label}</span>
                                                    </Link>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ol>
                            </nav>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:items-end justify-between w-full">
                            <div className="grid max-w-xl">
                                <h1 className="text-3xl lg:text-4xl font-bold font-cormorant-garamond text-gray-900 mb-1.5 lg:mb-2">
                                    Places to Visit
                                </h1>

                                <p className="text-gray-600 font-nunito text-sm lg:text-base leading-relaxed">
                                    Discover the most sacred temples, spiritual sites, and must-visit destinations in Mathura, Vrindavan, and Govardhan.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-1 relative border border-gray-400 rounded-lg bg-white transition-all">
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                                    <input type="text" placeholder="Search..." className="w-full bg-transparent text-gray-800 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/60 font-nunito" />
                                </div>

                                <div className="col-span-1 relative border border-gray-400 rounded-lg bg-white transition-all">
                                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={14} />
                                    <select className="w-full appearance-none bg-transparent text-gray-700 text-sm rounded-lg pl-10 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-nunito cursor-pointer">
                                        <option value="">Location</option>
                                        <option value="mathura">Mathura</option>
                                        <option value="vrindavan">Vrindavan</option>
                                        <option value="barsana">Barsana</option>
                                        <option value="govardhan">Govardhan</option>
                                        <option value="gokul">Gokul</option>
                                    </select>

                                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="min-h-screen">
                    <section className="px-5 sm:px-10 max-w-[1370px] mx-auto pb-20 mt-8 md:mt-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                            {places.map((place) => (
                                <Link href={`/categories/places-to-visit/${place.slug}`} key={place._id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-500">
                                    <div className="relative w-full h-[220px] overflow-hidden">
                                        <img src={place.image?.url || place.image} alt={place.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold font-cormorant-garamond text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                            {place.title}
                                        </h3>

                                        <div className="flex items-start gap-2 text-gray-500 text-sm font-nunito mb-4">
                                            <FaMapMarkerAlt className="w-3.5 h-3.5 mt-1 text-primary shrink-0" />
                                            <span className="line-clamp-2">{place.location}</span>
                                        </div>

                                        <p className="text-gray-600 font-nunito text-sm leading-relaxed line-clamp-2 flex-grow">
                                            {place.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </section>
            </WebsiteLayout>
        </>
    );
}
