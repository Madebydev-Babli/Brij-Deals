import PageIntroSection from "@/server-components/PageIntroSection";
import WebsiteLayout from "@/client-components/WebsiteLayout";

export default function Page() {
    return (
        <>
            <WebsiteLayout>

                <PageIntroSection title="Terms & Conditions" description="Discover the most sacred temples, spiritual sites, and must-visit destinations in Mathura, Vrindavan, and Govardhan." breadcrumbs={[{ route: "/", label: "Home" }, { route: "/terms-and-conditions", label: "Terms & Conditions" }]} showSearchAndFilters={false} />

                <div className="min-h-screen">

                </div>

            </WebsiteLayout>
        </>
    );
}