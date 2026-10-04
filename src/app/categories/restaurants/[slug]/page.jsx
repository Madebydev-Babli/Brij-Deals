import WebsiteLayout from "@/client-components/WebsiteLayout";
import PhotoGallery from "@/client-components/GallerySection";
import RestaurentIntro from "@/client-components/RestaurentIntro";
import RestaurantMenu from "@/client-components/RestaurantMenu";
import RestaurantAmenities from "@/server-components/RestaurantAmenities";
import RestaurantOffers from "@/client-components/RestaurantOffers";
import NearbyAttractions from "@/server-components/NearbyAttractions";
import connectToDatabase from "../../../../../backend/configurations/mongoose.config";
import { RestaurentModel } from "../../../../../backend/models/restaurent";
import { OfferModel } from "../../../../../backend/models/offer";
import { MenuModel } from "../../../../../backend/models/menu";
import { MenuItemModel } from "../../../../../backend/models/menuItem";
import { AmenityModel } from "../../../../../backend/models/amenity";
import { AttractionModel } from "../../../../../backend/models/attraction";
import { GalleryModel } from "../../../../../backend/models/gallery";
import { SocialMediaModel } from "../../../../../backend/models/socialMedia";
import { TimingScheduleModel } from "../../../../../backend/models/timingSchedule";

async function getRestaurantDetails(slug) {

    await connectToDatabase();

    const restaurant = await RestaurentModel.findOne({ slug }).lean();
    const offers = await OfferModel.find({ restaurentId: restaurant._id }).lean();
    const menuCategories = await MenuModel.find({ restaurentId: restaurant._id }).lean();
    const menuItems = await MenuItemModel.find({ restaurentId: restaurant._id }).lean();
    const amenities = await AmenityModel.find({ restaurentId: restaurant._id }).lean();
    const attractions = await AttractionModel.find({ restaurentId: restaurant._id }).lean();
    const gallery = await GalleryModel.find({ restaurentId: restaurant._id }).lean();
    const socialMedia = await SocialMediaModel.findOne({ restaurentId: restaurant._id }).lean();
    const schedule = await TimingScheduleModel.findOne({ restaurentId: restaurant._id }).lean();

    return JSON.parse(JSON.stringify({ restaurant, offers, menuCategories, menuItems, amenities, attractions, gallery, socialMedia, schedule }));
}

export default async function Page({ params }) {

    const { slug } = await params;

    const { restaurant, socialMedia, schedule, offers, menuCategories, menuItems, amenities, attractions, gallery } = await getRestaurantDetails(slug);

    return (
        <WebsiteLayout>

            <RestaurentIntro restaurant={restaurant} socialMedia={socialMedia} schedule={schedule} />

            <RestaurantOffers offers={offers} whatsapp={restaurant.phone} />

            <RestaurantMenu menuCategories={menuCategories} menuItems={menuItems} />

            <RestaurantAmenities amenities={amenities} />

            <NearbyAttractions attractions={attractions} />

            <PhotoGallery gallery={gallery} />

        </WebsiteLayout>
    );
}