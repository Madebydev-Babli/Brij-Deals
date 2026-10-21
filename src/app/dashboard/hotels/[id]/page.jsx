"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FaBed,
  FaImages,
  FaInfoCircle,
  FaList,
  FaMapMarkerAlt,
  FaShareAlt,
  FaTag,
} from "react-icons/fa";
import HotelBasicInfoTab from "@/client-components/HotelBasicInfoTab";
import {
  HotelAmenitiesTab,
  HotelAttractionsTab,
  HotelGalleryTab,
  HotelOffersTab,
  HotelRoomCategoriesTab,
  HotelSocialMediaTab,
} from "@/client-components/HotelSectionTabs";
import LoadingComponent from "@/server-components/LoadingComponent";
import NoDataComponent from "@/server-components/NoDataComponent";
import Tabs from "@/server-components/Tabs";
import { API_ENDPOINTS } from "@/utility/constants";
import { useFetchDetailsAPI, useFetchPostAPI } from "@/utility/custom-hooks";

export default function EditHotelPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("basic-info");
  const [hotel, setHotel] = useState(null);
  const [loadedHotelId, setLoadedHotelId] = useState(null);
  const [hotelRevision, setHotelRevision] = useState(0);
  const { fetchDetailsAPI, fetchingDetails } = useFetchDetailsAPI();
  const { fetchPostAPI: saveBasicInfo, postingData: savingBasicInfo } =
    useFetchPostAPI();
  const { fetchPostAPI: saveSection, postingData: savingSection } =
    useFetchPostAPI();

  useEffect(() => {
    if (!id) return;
    fetchDetailsAPI(API_ENDPOINTS.FETCH_HOTELS, id, setHotel).finally(() =>
      setLoadedHotelId(id),
    );
  }, [id, fetchDetailsAPI]);

  function handleBasicInfoSave(formData) {
    saveBasicInfo(
      API_ENDPOINTS.ADD_HOTEL,
      { ...formData, _id: id },
      null,
      (response) => {
        const updatedHotel = response?.data?.data?.[0];
        if (updatedHotel) {
          setHotel(updatedHotel);
          setHotelRevision((revision) => revision + 1);
        }
      },
    );
  }

  function handleSectionSave(sectionData, onSuccess) {
    saveSection(
      API_ENDPOINTS.UPDATE_HOTEL_SECTION,
      { _id: id, ...sectionData },
      null,
      (response) => {
        const updatedHotel = response?.data?.data?.[0];
        if (updatedHotel) {
          setHotel(updatedHotel);
          setHotelRevision((revision) => revision + 1);
          onSuccess?.();
        }
      },
    );
  }

  if (fetchingDetails || (id && loadedHotelId !== id)) {
    return <LoadingComponent message="Loading Hotel Details..." />;
  }

  if (!hotel?._id) {
    return <NoDataComponent message="Hotel not found" />;
  }

  const tabs = [
    {
      id: "basic-info",
      label: "Basic Info",
      icon: <FaInfoCircle className="mr-2 inline" />,
    },
    {
      id: "social-media",
      label: "Social Media",
      icon: <FaShareAlt className="mr-2 inline" />,
    },
    { id: "offers", label: "Offers", icon: <FaTag className="mr-2 inline" /> },
    {
      id: "room-categories",
      label: "Room Categories",
      icon: <FaBed className="mr-2 inline" />,
    },
    {
      id: "amenities",
      label: "Amenities",
      icon: <FaList className="mr-2 inline" />,
    },
    {
      id: "attractions",
      label: "Attractions",
      icon: <FaMapMarkerAlt className="mr-2 inline" />,
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: <FaImages className="mr-2 inline" />,
    },
  ];

  return (
    <>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "basic-info" && (
        <HotelBasicInfoTab
          key={hotelRevision}
          hotel={hotel}
          onSave={handleBasicInfoSave}
          postingData={savingBasicInfo}
          submitLabel="Save Basic Info"
        />
      )}
      {activeTab === "social-media" && (
        <HotelSocialMediaTab
          key={hotelRevision}
          hotel={hotel}
          onSave={handleSectionSave}
          saving={savingSection}
        />
      )}
      {activeTab === "offers" && (
        <HotelOffersTab
          key={hotelRevision}
          hotel={hotel}
          onSave={handleSectionSave}
          saving={savingSection}
        />
      )}
      {activeTab === "room-categories" && (
        <HotelRoomCategoriesTab
          key={hotelRevision}
          hotel={hotel}
          onSave={handleSectionSave}
          saving={savingSection}
        />
      )}
      {activeTab === "amenities" && (
        <HotelAmenitiesTab
          key={hotelRevision}
          hotel={hotel}
          onSave={handleSectionSave}
          saving={savingSection}
        />
      )}
      {activeTab === "attractions" && (
        <HotelAttractionsTab
          key={hotelRevision}
          hotel={hotel}
          onSave={handleSectionSave}
          saving={savingSection}
        />
      )}
      {activeTab === "gallery" && (
        <HotelGalleryTab
          key={hotelRevision}
          hotel={hotel}
          onSave={handleSectionSave}
          saving={savingSection}
        />
      )}
    </>
  );
}
