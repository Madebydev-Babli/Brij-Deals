import { BannerModel } from '../../backend/models/banner';
import connectToDatabase from '../../backend/configurations/mongoose.config';
import HeroSectionClient from '@/client-components/HeroSection';

async function getBanners() {
    await connectToDatabase();

    const banners = await BannerModel.find()
        .sort({ sno: 1 })
        .lean();

    return JSON.parse(JSON.stringify(banners));

}

export default async function HeroSectionServer() {

    const banners = await getBanners();

    return <HeroSectionClient slides={banners} />
}