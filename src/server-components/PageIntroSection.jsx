
import Link from 'next/link';
import { FaMapMarkerAlt, FaSearch, FaChevronDown, FaFilter } from 'react-icons/fa';

export default function PageIntroSection({ title, description, breadcrumbs, showSearch = false, showLocation = false, showCategory = false }) {

    return <>

        <div className="bg-primary/20">

            <div className="px-5 sm:px-10 max-w-[1370px] mx-auto py-10 mb-10">

                {/* Breadcrumbs */}
                <div className="mb-5">
                    <nav aria-label="breadcrumb" className="w-full">
                        <ol className="flex items-center gap-2 text-sm text-gray-500 font-nunito overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
                            {breadcrumbs.map((item, index) => {
                                const isFirst = index === 0;
                                const isLast = index === breadcrumbs.length - 1;
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
                            {title}
                        </h1>

                        <p className="text-gray-600 font-nunito text-sm lg:text-base leading-relaxed">
                            {description}
                        </p>

                    </div>

                    {/* Search & Filters */}
                    <div className={`grid grid-cols-2 gap-5`}>

                        {showSearch &&
                            < div className={`${!showLocation || !showCategory ? 'col-span-1' : 'col-span-2'} relative border border-gray-400 rounded-lg bg-white transition-all`}>

                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />

                                <input type="text" placeholder="Search..." className="w-full bg-transparent text-gray-800 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/60 font-nunito" />

                            </div>}

                        {showLocation &&
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

                            </div>}

                        {showCategory &&
                            <div className={`col-span-1 relative border border-gray-400 rounded-lg bg-white transition-all`}>

                                <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={14} />

                                <select className="w-full appearance-none bg-transparent text-gray-700 text-sm rounded-lg pl-10 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-nunito cursor-pointer">
                                    <option value="">Category</option>
                                    <option value="sweets">Sweets</option>
                                    <option value="family">Family Food</option>
                                    <option value="fastfood">Fast Food</option>
                                    <option value="cafe">Cafe & Bakery</option>
                                    <option value="dhaba">Dhaba</option>
                                </select>

                                <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-3 h-3" />

                            </div>}

                    </div>

                </div>

            </div>

        </div >
    </>
}