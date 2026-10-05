import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";
import NoDataComponent from "./NoDataComponent";

export default function CardLayout({ dataList, loading, callBackUrl }) {

    if (loading) {

        return (

            <section className="px-5 sm:px-10 max-w-[1370px] mx-auto pb-20 mt-8 md:mt-12">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">

                    {[...Array(5)].map((_, index) => (

                        <div key={index} className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse" >

                            <div className="relative w-full h-[220px] bg-gray-200"></div>

                            {/* Content Placeholder */}
                            <div className="p-5 flex flex-col flex-grow space-y-4">

                                {/* Title */}
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>

                                {/* Location */}
                                <div className="flex items-center gap-2">
                                    <div className="w-3.5 h-3.5 bg-gray-200 rounded-full shrink-0"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2 flex-grow">
                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </section>
        );
    }

    if (!dataList || dataList.length === 0) {
        return (
            <div>
                <NoDataComponent message="No Results Found" />
            </div>
        );
    }

    return <>

        <section className="px-5 sm:px-10 max-w-[1370px] mx-auto pb-20 mt-8 md:mt-12">

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">

                {dataList.map(data => {
                    const imageSrc = data.logo?.url || data.image?.url || data.image;
                    const location = data.shortLocation || data.location;

                    return (
                    <Link key={data._id} href={callBackUrl + data.slug} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-500">

                        {/* Image */}
                        <div className="relative w-full h-[220px] overflow-hidden">

                            <Image fill src={imageSrc} alt={data.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />

                            {/* Veg/Non-veg Badge */}
                            {typeof data.isVeg === "boolean" && (
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5">

                                    <span className={`w-2 h-2 rounded-full ${data.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>

                                    <span className="text-gray-900 text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                                        {data.isVeg ? 'Pure Veg' : 'Non Veg'}
                                    </span>

                                </div>
                            )}

                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-grow">

                            <h3 className="text-xl font-bold font-cormorant-garamond text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                {data.title}
                            </h3>

                            <div className="flex items-start gap-2 text-gray-500 text-sm font-nunito mb-4">
                                <FaMapMarkerAlt className="w-3.5 h-3.5 mt-1 text-primary shrink-0" />
                                <span className="line-clamp-2">{location}</span>
                            </div>

                            <p className="text-gray-600 font-nunito text-sm leading-relaxed line-clamp-2 flex-grow">
                                {data.description}
                            </p>

                        </div>

                    </Link>

                    );
                })}

            </div>


        </section>

    </>
}