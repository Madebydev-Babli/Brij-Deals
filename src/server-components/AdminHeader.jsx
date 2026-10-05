import Link from "next/link";
import { MdOutlineDashboard, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight, MdOutlineDesignServices, MdOutlinePersonSearch, MdOutlineHub, MdOutlineAssignment, MdOutlineHandshake, MdOutlinePeople, MdOutlineInsights, MdOutlineArticle } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { FaRegQuestionCircle, FaRegStar } from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FiAlertCircle } from "react-icons/fi";
import { useState } from "react";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import { API_ENDPOINTS } from "@/utility/constants";

export default function AdminHeader({ onClose, isCollapsed, toggleCollapse }) {

    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    async function handleLogout() {
        try {
            setLoading(true);
            const res = await fetch(API_ENDPOINTS.LOGOUT.path, {
                method: API_ENDPOINTS.LOGOUT.method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: sessionStorage.getItem("email") })
            });

            const data = await res.json();

            if (data.status === "success") {
                toast.success("Logout successfully!");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("email");
                router.push("/login");
            } else {
                toast.error(data.message || "Failed to logout.");
            }

        } catch (error) {
            toast.error("An error occurred during logout");
        } finally {
            setLoading(false);
        }
    };

    const menuItems = [
        {
            title: "Dashboard",
            path: "/dashboard",
            icon: <MdOutlineDashboard />,
        },
        {
            title: "Banners",
            path: "/dashboard/banners",
            icon: <MdOutlineDesignServices />,
        },
        {
            title: "Restaurents",
            path: "/dashboard/restaurents",
            icon: <MdOutlinePersonSearch />,
        },
        {
            title: "Places to Visit",
            path: "/dashboard/places",
            icon: <MdOutlinePersonSearch />,
        },
        {
            title: "Hotels",
            path: "/dashboard/hotels",
            icon: <MdOutlinePersonSearch />,
        },
        // {
        //     title: "Channels",
        //     path: "/dashboard/channel-partners",
        //     icon: <MdOutlineHub />,
        // },
        // {
        //     title: "Applications",
        //     path: "/dashboard/loan-applications",
        //     icon: <MdOutlineAssignment />,
        // },
        // {
        //     title: "Partners",
        //     path: "/dashboard/partners",
        //     icon: <MdOutlineHandshake />,
        // },
        // {
        //     title: "Team Members",
        //     path: "/dashboard/team-members",
        //     icon: <MdOutlinePeople />,
        // },
        // {
        //     title: "Stats",
        //     path: "/dashboard/stats",
        //     icon: <MdOutlineInsights />,
        // },
        // {
        //     title: "Testimonials",
        //     path: "/dashboard/testimonials",
        //     icon: <FaRegStar />,
        // },
        {
            title: "Blogs",
            path: "/dashboard/blogs",
            icon: <MdOutlineArticle />,
        },
        {
            title: "FAQ",
            path: "/dashboard/frequently-asked-questions",
            icon: <FaRegQuestionCircle />,
        },
    ];

    return (

        <div className={`h-screen flex flex-col bg-white border-r border-gray-100 shadow-xl transition-all duration-300 relative z-50`}>

            {/* Logo and Close Button */}
            <div className={`flex items-center h-24 transition-all duration-300 ${isCollapsed ? 'justify-center p-2' : 'justify-between px-6'}`}>

                {!isCollapsed ? (
                    <div className="flex items-center gap-2 animate-fade-in">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold shadow-md font-display">
                            B
                        </div>
                        <h1 className="text-2xl font-bold font-display tracking-tight text-gray-800">
                            Braj <span className="text-primary font-bold">Deals</span>
                        </h1>
                    </div>
                ) : (
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md font-display">
                        B
                    </div>
                )}

            </div>

            {/* Toggle Button for Desktop - Floating on the border */}
            <button onClick={toggleCollapse} className="hidden lg:flex absolute -right-12 top-6 text-white bg-primary cursor-pointer p-1.5 rounded-full transition-all duration-200 z-50 items-center justify-center shadow-md hover:opacity-90">
                {isCollapsed ? (
                    <MdKeyboardDoubleArrowRight size={24} />
                ) : (
                    <MdKeyboardDoubleArrowLeft size={24} />
                )}
            </button>


            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">

                <ul className="space-y-1.5 px-3">

                    {menuItems.map((item, index) => {

                        const isActive = pathname === item.path;

                        return (

                            <li key={index}>

                                <Link href={item.path} onClick={onClose} title={isCollapsed ? item.title : ""} className={` group flex items-center px-4 py-2.5 rounded-md transition-all duration-300 relative overflow-hidden ${isActive ? "bg-primary text-white shadow-md translate-x-1" : "text-gray-500 hover:bg-primary/10 hover:text-primary"} ${isCollapsed ? 'justify-center' : ''}`} >

                                    <span className={`text-2xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        {item.icon}
                                    </span>

                                    {!isCollapsed && (
                                        <span className="ms-3 font-medium whitespace-nowrap font-nunito">
                                            {item.title}
                                        </span>
                                    )}

                                    {/* Active Indicator Dot for Collapsed Mode */}
                                    {isCollapsed && isActive && (
                                        <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                                    )}

                                </Link>

                            </li>

                        );

                    })}

                </ul>

            </nav>

            {/* User Profile / Logout Section */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">

                <button onClick={() => setShowLogoutConfirm(true)} className={`cursor-pointer w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 border border-transparent hover:bg-red-50 hover:border-red-100 hover:text-red-500 group ${isCollapsed ? 'justify-center text-red-400' : 'text-gray-500 font-nunito'}`} title="Logout">

                    <span className={`text-2xl transition-transform duration-300 group-hover:-translate-x-1`}>
                        <RiLogoutBoxLine />
                    </span>

                    {!isCollapsed && (
                        <div className="ms-3 text-left">

                            <p className={`text-sm font-bold transition-colors group-hover:text-red-600`}>Log Out</p>

                        </div>
                    )}

                </button>

            </div>

            {/* Logout Confirmation Modal - Portalled to body to escape parent transforms */}
            {showLogoutConfirm && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">

                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">

                        <div className="p-6 text-center">

                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiAlertCircle className="w-8 h-8 text-red-500" />
                            </div>

                            <h3 className="text-xl font-bold font-display text-gray-900 mb-2">Logout Confirmation</h3>
                            <p className="text-gray-500 font-nunito mb-6">Are you sure you want to log out of your account?</p>

                            <div className="flex gap-3 justify-center">

                                <button onClick={() => setShowLogoutConfirm(false)} className="cursor-pointer px-5 py-2.5 rounded-md border border-gray-200 text-gray-700 font-bold font-nunito hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>

                                <button onClick={handleLogout} disabled={loading} className="cursor-pointer px-5 py-2.5 rounded-md bg-red-500 text-white font-bold font-nunito hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                                    {loading ? 'Logging out...' : 'Yes, Logout'}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>,

                document.body
            )}

        </div>

    );
}