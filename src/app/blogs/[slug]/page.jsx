import WebsiteLayout from "@/client-components/WebsiteLayout";
import Link from "next/link";
import { notFound } from "next/navigation";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { BlogModel } from "../../../../backend/models/blog";

async function getBlogDetails(slug) {
    await connectToDatabase();

    const blog = await BlogModel.findOne({ slug }).lean();

    if (!blog) {
        return null;
    }

    return JSON.parse(JSON.stringify(blog));
}

async function getRelatedBlogs(slug) {
    await connectToDatabase();

    const blogs = await BlogModel.find({ slug: { $ne: slug } })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

    return JSON.parse(JSON.stringify(blogs));
}

export default async function Page({ params }) {
    const { slug } = await params;
    const blog = await getBlogDetails(slug);

    if (!blog) {
        notFound();
    }

    const relatedBlogs = await getRelatedBlogs(slug);

    return (
        <WebsiteLayout>
            <section className="relative">
                <div className="relative w-full h-[220px] md:h-[300px] lg:h-[360px]">
                    <img
                        src={blog?.image?.url}
                        alt={blog?.title}
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent" />

                    <div className="absolute inset-x-0 top-0 max-w-[1370px] mx-auto w-full px-5 sm:px-10 pt-6 md:pt-8 z-10">
                        <nav aria-label="breadcrumb" className="w-full">
                            <ol className="flex items-center gap-2 text-sm text-gray-200 font-nunito overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
                                <li className="flex items-center gap-2">
                                    <Link href="/" className="flex items-center gap-1.5 hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <span>Home</span>
                                    </Link>
                                    <span className="text-gray-400">/</span>
                                    <Link href="/blogs" className="hover:text-white transition-colors">
                                        Blogs
                                    </Link>
                                    <span className="text-gray-400">/</span>
                                    <span className="text-white font-semibold truncate max-w-[180px] sm:max-w-none">
                                        {blog?.title}
                                    </span>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <div className="max-w-[1370px] mx-auto px-5 sm:px-10 relative z-20">
                    <article className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] rounded-3xl border border-gray-100 p-6 sm:p-8 lg:p-10 -mt-16 md:-mt-24 lg:-mt-28 mb-10 w-full relative overflow-hidden">
                        <div className="absolute -right-20 -bottom-20 w-[280px] h-[280px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-200/40 via-orange-100/10 to-transparent rounded-full blur-2xl pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex flex-wrap items-center gap-3 mb-5">
                                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-primary font-nunito">
                                    {blog?.category}
                                </span>
                            </div>

                            <h1 className="max-w-4xl text-4xl md:text-5xl lg:text-6xl font-bold font-cormorant-garamond text-gray-900 leading-[1.05]">
                                {blog?.title}
                            </h1>

                            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-600 font-nunito">
                                <span>{blog?.date}</span>
                                <span className="text-gray-400">•</span>
                                <span>By {blog?.author}</span>
                            </div>

                            {blog?.description && (
                                <p className="mt-6 max-w-4xl text-base md:text-xl text-gray-600 font-nunito leading-relaxed">
                                    {blog.description}
                                </p>
                            )}
                        </div>
                    </article>
                </div>
            </section>

            <section className="py-8 md:py-10 pb-20">
                <div className="px-5 sm:px-10 max-w-[1370px] mx-auto">
                    <div className="mb-10 overflow-hidden rounded-[28px] border border-gray-100 shadow-[0_14px_34px_rgba(17,24,39,0.08)]">
                        <img
                            src={blog?.image?.url}
                            alt={blog?.title}
                            className="block w-full h-[300px] md:h-[450px] lg:h-[560px] object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_320px] gap-8 lg:gap-10 items-start">
                        <article className="bg-white rounded-[28px] border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8 lg:p-10">
                            <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 mb-8 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-primary font-nunito">
                                        Story
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 font-nunito">
                                    <span>{blog?.date}</span>
                                    <span className="text-gray-400">•</span>
                                    <span>By {blog?.author}</span>
                                </div>
                            </div>

                            <div
                                className="rich-text-content"
                                dangerouslySetInnerHTML={{
                                    __html: blog?.content || ""
                                }}
                            />
                        </article>

                        <aside className="space-y-6">
                            <div className="rounded-[28px] border border-gray-200 bg-[#F8F5F0] p-6 shadow-sm">
                                <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-primary font-nunito mb-5">
                                    Story Details
                                </p>

                                <div className="space-y-5">
                                    <div className="pb-4 border-b border-gray-200">
                                        <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-nunito mb-2">
                                            Category
                                        </p>
                                        <p className="text-lg font-bold font-nunito text-gray-900">
                                            {blog?.category}
                                        </p>
                                    </div>

                                    <div className="pb-4 border-b border-gray-200">
                                        <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-nunito mb-2">
                                            Author
                                        </p>
                                        <p className="text-lg font-bold font-nunito text-gray-900">
                                            {blog?.author}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-nunito mb-2">
                                            Published
                                        </p>
                                        <p className="text-lg font-bold font-nunito text-gray-900">
                                            {blog?.date}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {relatedBlogs?.length > 0 && (
                <section className="pb-20">
                    <div className="px-5 sm:px-10 max-w-[1370px] mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                            <div>
                                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-primary font-nunito mb-4">
                                    More Stories
                                </span>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-cormorant-garamond text-gray-900 leading-tight">
                                    Explore More Stories
                                </h2>
                            </div>

                            <Link
                                href="/blogs"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-primary font-nunito hover:text-primary/80 transition-colors"
                            >
                                View all blogs
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                            {relatedBlogs.map((item) => (
                                <article
                                    key={item._id}
                                    className="group bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <Link href={`/blogs/${item.slug}`}>
                                        <div className="relative h-[240px] overflow-hidden">
                                            <img
                                                src={item?.image?.url || item?.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />

                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1.5 rounded-full bg-white/95 text-primary text-xs font-semibold font-nunito">
                                                    {item.category}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="p-5">
                                        <div className="flex items-center justify-between gap-3 mb-3">
                                            <span className="text-xs text-gray-500 font-nunito">
                                                {item.date}
                                            </span>
                                            <span className="text-xs text-gray-500 font-nunito">
                                                By {item.author}
                                            </span>
                                        </div>

                                        <Link href={`/blogs/${item.slug}`}>
                                            <h3 className="text-2xl font-bold font-cormorant-garamond text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                        </Link>

                                        <p className="mt-3 text-sm text-gray-600 font-nunito leading-relaxed line-clamp-3">
                                            {item.description}
                                        </p>

                                        <Link
                                            href={`/blogs/${item.slug}`}
                                            className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-primary font-nunito hover:gap-3 transition-all"
                                        >
                                            Read More
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </WebsiteLayout>
    );
}