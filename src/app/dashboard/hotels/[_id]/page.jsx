'use client'

import { FaImages, FaInfoCircle, FaList, FaMapMarkerAlt, FaRegClock, FaTag, FaUtensils } from "react-icons/fa";
import EditRestaurentTab from "@/client-components/RestaurentTab";
import Tabs from "@/server-components/Tabs";
import { useState } from "react";
import { useParams } from "next/navigation";
import { OffersTab } from "@/client-components/OffersTab";
import { AmenitiesTab } from "@/client-components/AmenitiesTab";
import { AttractionsTab } from "@/client-components/AttractionsTab";
import { GalleryTab } from "@/client-components/GalleryTab";
import { MenuTab } from "@/client-components/MenuTab";
import { ScheduleTab } from "@/client-components/ScheduleTab";
import { SocialMediaTab } from "@/client-components/SocialMediaTab";

export default function Page() {

    const { _id } = useParams();
    const [activeTab, setActiveTab] = useState('basic-info');

    const tabs = [
        { id: 'basic-info', label: 'Basic Info', icon: <FaInfoCircle className="mr-2 inline" /> },
        { id: 'social-media', label: 'Social Media', icon: <FaInfoCircle className="mr-2 inline" /> },
        { id: 'offers', label: 'Offers', icon: <FaTag className="mr-2 inline" /> },
        { id: 'schedule', label: 'Schedule', icon: <FaRegClock className="mr-2 inline" /> },
        { id: 'menu', label: 'Menu', icon: <FaUtensils className="mr-2 inline" /> },
        { id: 'amenities', label: 'Amenities', icon: <FaList className="mr-2 inline" /> },
        { id: 'attractions', label: 'Attractions', icon: <FaMapMarkerAlt className="mr-2 inline" /> },
        { id: 'gallery', label: 'Gallery', icon: <FaImages className="mr-2 inline" /> }
    ];

    return <>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "basic-info" && <EditRestaurentTab _id={_id} setActiveTab={setActiveTab} />}
        {activeTab === "social-media" && <SocialMediaTab restaurentId={_id} />}
        {activeTab === "offers" && <OffersTab restaurentId={_id} />}
        {activeTab === "schedule" && <ScheduleTab restaurentId={_id} />}
        {activeTab === "menu" && <MenuTab restaurentId={_id} />}
        {activeTab === "amenities" && <AmenitiesTab restaurentId={_id} />}
        {activeTab === "attractions" && <AttractionsTab restaurentId={_id} />}
        {activeTab === "gallery" && <GalleryTab restaurentId={_id} />}
    </>
}