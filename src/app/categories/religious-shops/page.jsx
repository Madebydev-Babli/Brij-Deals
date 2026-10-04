import PageIntroSection from "@/server-components/PageIntroSection";
import WebsiteLayout from "@/client-components/WebsiteLayout";
import Link from "next/link";
import { FaChevronDown, FaMapMarkerAlt, FaSearch, FaTag } from 'react-icons/fa';

const shops = [
    {
        _id: 1,
        slug: "radha-govind-poshak-bhandar",
        title: "Radha Govind Poshak Bhandar",
        description: "Premium deity dresses, mukuts, and complete shringar accessories crafted by local artisans.",
        image: "/categories/places.png",
        location: "Loi Bazaar, Vrindavan",
        openingTime: "09:30 AM",
        closingTime: "08:30 PM",
    },
    {
        _id: 2,
        slug: "braj-bhoomi-puja-store",
        title: "Braj Bhoomi Puja Store",
        description: "Authentic pooja samagri, brass idols, and sacred holy text books available at wholesale prices.",
        image: "/categories/places.png",
        location: "Chowk Bazaar, Mathura",
        openingTime: "09:00 AM",
        closingTime: "09:00 PM",
    },
    {
        _id: 3,
        slug: "iskcon-devotional-gallery",
        title: "ISKCON Devotional Gallery",
        description: "Incense sticks, bead bags, and spiritual souvenirs strictly from the Hare Krishna movement.",
        image: "/categories/places.png",
        location: "ISKCON Temple Complex",
        openingTime: "08:00 AM",
        closingTime: "08:30 PM",
    },
    {
        _id: 4,
        slug: "gopi-nath-mala-emporium",
        title: "Gopi Nath Mala Emporium",
        description: "Specialists in genuine Tulsi malas, rudraksha, and sacred japa beads hand-carved in Brij.",
        image: "/categories/places.png",
        location: "Bankey Bihari Bazar",
        openingTime: "08:30 AM",
        closingTime: "08:00 PM",
    },
    {
        _id: 5,
        slug: "shri-yamuna-kripa-store",
        title: "Shri Yamuna Kripa Store",
        description: "Offering pure Yamuna jal, sacred mud (raj), and essential items for daily offering and puja.",
        image: "/categories/places.png",
        location: "Vishram Ghat, Mathura",
        openingTime: "06:00 AM",
        closingTime: "09:00 PM",
    },
    {
        _id: 6,
        slug: "gopala-perfumes-attars",
        title: "Gopala Perfumes & Attars",
        description: "Traditional non-alcoholic attars and fragrant dhoop to enhance your daily worship experience.",
        image: "/categories/places.png",
        location: "Nidhivan Marg, Vrindavan",
        openingTime: "10:00 AM",
        closingTime: "08:30 PM",
    }
];

export default function Page() {
    return (
        <>
            <WebsiteLayout>

                <section className="bg-primary/20">

                    <div className="px-5 sm:px-10 max-w-[1370px] mx-auto py-10 mb-10">

                        {/* Breadcrumbs */}
                        <div className="mb-5">

                            <nav aria-label="breadcrumb" className="w-full">
                                <ol className="flex items-center gap-2 text-sm text-gray-500 font-nunito overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
                                    {[{ route: "/", label: "Home" }, { route: "/categories/religious-shops", label: "Religious Shops" }].map((item, index) => {
                                        const isFirst = index === 0;
                                        const isLast = index === [{ route: "/", label: "Home" }, { route: "/categories/religious-shops", label: "Religious Shops" }].length - 1;
                                        const label = item.label || item.path || item.lable;
                                        const isHome = label === 'Home';

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
                                                    <Link href={item.route || '#'} className="flex items-center gap-1.5 hover:text-primary transition-colors">
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

                        {/* Title, Description & Filters Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:items-end justify-between w-full">

                            {/* Text Content */}
                            <div className="grid max-w-xl">

                                <h1 className="text-3xl lg:text-4xl font-bold font-cormorant-garamond text-gray-900 mb-1.5 lg:mb-2">
                                    Religious Shops
                                </h1>

                                <p className="text-gray-600 font-nunito text-sm lg:text-base leading-relaxed">
                                    Discover the most sacred temples, spiritual sites, and must-visit destinations in Mathura, Vrindavan, and Govardhan.
                                </p>

                            </div>

                            {/* Search & Filters */}
                            <div className={`grid grid-cols-2 gap-5`}>

                                <div className="col-span-1 relative border border-gray-400 rounded-lg bg-white transition-all">

                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />

                                    <input type="text" placeholder="Search..." className="w-full bg-transparent text-gray-800 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/60 font-nunito" />

                                </div>

                                <div className={`col-span-1 relative border border-gray-400 rounded-lg bg-white transition-all`}>

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

                </section >

                <section className="min-h-screen">

                    <section className="px-5 sm:px-10 max-w-[1370px] mx-auto pb-20 mt-8 md:mt-12">

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">

                            {shops.map(shop => (

                                <Link href={`/categories/religious-shops/${shop.slug}`} key={shop._id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-500">

                                    {/* Image */}
                                    <div className="relative w-full h-[220px] overflow-hidden">

                                        <img src={shop.image} alt={shop.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-grow">

                                        <h3 className="text-xl font-bold font-cormorant-garamond text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                            {shop.title}
                                        </h3>

                                        <div className="flex items-start gap-2 text-gray-500 text-sm font-nunito mb-4">
                                            <FaMapMarkerAlt className="w-3.5 h-3.5 mt-1 text-primary shrink-0" />
                                            <span className="line-clamp-2">{shop.location}</span>
                                        </div>

                                        <p className="text-gray-600 font-nunito text-sm leading-relaxed line-clamp-2 flex-grow">
                                            {shop.description}
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