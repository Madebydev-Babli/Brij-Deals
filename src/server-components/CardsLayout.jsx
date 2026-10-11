
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaTag } from "react-icons/fa";
import NoDataComponent from "./NoDataComponent";

export default function CardLayout({
    dataList,
    loading,
    callBackUrl,
    type = "restaurant",
}) {
    if (loading) {
        return (
            <section className="px-5 sm:px-10 max-w-[1370px] mx-auto pb-20 mt-8 md:mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse"
                        >
                            <div className="w-full h-[220px] bg-gray-200" />
                            <div className="p-5 space-y-4">
                                <div className="h-6 bg-gray-200 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (!dataList || dataList.length === 0) {
        return <NoDataComponent message="No Results Found" />;
    }

    return (
        <section className="px-5 sm:px-10 max-w-[1370px] mx-auto pb-20 mt-8 md:mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {dataList.map((data) => {
                    const imageSrc =
                        data.logo?.url ||
                        data.image?.url ||
                        (typeof data.image === "string" ? data.image : "");

                    const location = data.shortLocation || data.location;

                    return (
                        <Link
                            key={data._id}
                            href={`${callBackUrl}${data.slug}`}
                            className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-500"
                        >
                            {/* Image and type-specific badges */}
                            <div className="relative w-full h-[220px] overflow-hidden bg-gray-100">
                                {imageSrc && (
                                    <Image
                                        fill
                                        src={imageSrc}
                                        alt={data.title || "Listing image"}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                    />
                                )}

                                {/* Blog category */}
                                {type === "blog" && data.category && (
                                    <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-xl shadow-sm">
                                        <span className="text-primary text-xs font-semibold">
                                            {data.category}
                                        </span>
                                    </div>
                                )}

                                {/* Hotel starting price */}
                                {type === "hotel" && data.startingPrice != null && (
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5">
                                        <FaTag className="text-primary w-2.5 h-2.5" />
                                        <span className="text-gray-900 text-[10px] sm:text-xs font-bold tracking-wider">
                                            Starting ₹{data.startingPrice}
                                        </span>
                                    </div>
                                )}

                                {/* Restaurant veg/non-veg badge */}
                                {type === "restaurant" &&
                                    typeof data.isVeg === "boolean" && (
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5">
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    data.isVeg
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                }`}
                                            />
                                            <span className="text-gray-900 text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                                                {data.isVeg ? "Pure Veg" : "Non Veg"}
                                            </span>
                                        </div>
                                    )}
                            </div>

                            {/* Card content */}
                            <div className="p-5 flex flex-col flex-grow">
                                {/* Blog date and author */}
                                {type === "blog" && (
                                    <div className="flex flex-wrap items-center justify-between gap-2 text-gray-500 text-xs font-nunito mb-3">
                                        {data.date && <span>{data.date}</span>}
                                        {data.author && <span>By {data.author}</span>}
                                    </div>
                                )}

                                <h3 className="text-xl font-bold font-cormorant-garamond text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                    {data.title}
                                </h3>

                                {/* Location for non-blog cards */}
                                {type !== "blog" && (
                                    <div className="flex items-start gap-2 text-gray-500 text-sm font-nunito mb-4">
                                        <FaMapMarkerAlt className="w-3.5 h-3.5 mt-1 text-primary shrink-0" />
                                        <span className="line-clamp-2">
                                            {location || "Location not available"}
                                        </span>
                                    </div>
                                )}

                                <p className="text-gray-600 font-nunito text-sm leading-relaxed line-clamp-3 flex-grow">
                                    {data.description}
                                </p>

                                {type === "blog" && (
                                    <span className="text-primary font-semibold text-sm mt-4">
                                        Read More →
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
