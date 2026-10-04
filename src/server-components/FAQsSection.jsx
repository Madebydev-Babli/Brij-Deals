import FAQItem from '@/client-components/FaqItem';
import connectToDatabase from '../../backend/configurations/mongoose.config';
import { FaqModel } from '../../backend/models/faq';

async function getFAQs(page) {
    await connectToDatabase();

    const faqs = await FaqModel.find({ page })
        .sort({ sno: 1 })
        .lean();

    return JSON.parse(JSON.stringify(faqs));

}

export default async function FAQsSection({ page, showTitleAndDescription = true }) {

    const faqs = await getFAQs(page);

    return (
        <section className="py-20">

            <div className="px-5 sm:px-10 max-w-[1370px] mx-auto">

                {showTitleAndDescription && <div className="text-center max-w-3xl mx-auto relative">

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cormorant-garamond tracking-tight text-gray-900 mb-4">
                        Frequently Asked <span className="text-primary">Questions</span>
                    </h2>

                    <p className="text-gray-600 text-base md:text-lg max-w-2xl font-nunito">
                        We bridge the gap between you and the divine land of Brij Bhumi with complete transparency, reliability, and exclusive benefits.
                    </p>

                </div>}

                <FAQItem faqs={faqs} />

            </div>

        </section>
    );
}
