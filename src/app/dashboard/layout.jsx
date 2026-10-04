'use client'
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminHeader from "@/server-components/AdminHeader";
import AdminTopBar from "@/server-components/AdminTopbar";
import { API_ENDPOINTS } from "@/utility/constants";
import LoadingComponent from "@/server-components/LoadingComponent";
import { toast } from "react-toastify";

export default function Layout({ children }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const [loading, setLoading] = useState({
        validatingUser: false,
    })

    async function validateUser() {

        setLoading({ ...loading, validatingUser: true });

        try {

            const token = sessionStorage.getItem('token');

            if (!token) throw new Error("No token found");

            const res = await fetch(API_ENDPOINTS.VALIDATE_USER.path, {
                method: API_ENDPOINTS.VALIDATE_USER.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await res.json();

            if (data.status != "success") {
                toast.error(data.message, { position: "top-right" });
                sessionStorage.removeItem('email');
                router.push("/login");
            }

        } catch (error) {
            toast.error(error.message, { position: "top-right" });
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('email');
            router.push("/login");

        } finally {
            setLoading({ ...loading, validatingUser: false });
        }

    };

    useEffect(() => {
        validateUser();
    }, [pathname]);

    return <>

        <div>

            <div className="flex">

                <div className={`fixed h-screen transition-all duration-300 ease-in-out z-20  ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'lg:w-20' : 'lg:w-52'} `}>

                    <AdminHeader onClose={() => setIsDrawerOpen(false)} isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} />

                </div>

                <div className={`flex-1 min-w-0 min-h-screen relative transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:ml-20' : 'lg:ml-52'}`}>

                    <div className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:left-20' : 'lg:left-52'}`}>
                        <AdminTopBar onMenuClick={() => setIsDrawerOpen(true)} />
                    </div>

                    <div className="pt-[105px] p-5 min-h-screen rounded-2xl">
                        {loading.validatingUser ? <LoadingComponent message="Verifying Authentication..." /> : children}
                    </div>

                </div>

                {isDrawerOpen && <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-10 lg:hidden" onClick={() => setIsDrawerOpen(false)} />}

            </div>

        </div>

    </>;
} 