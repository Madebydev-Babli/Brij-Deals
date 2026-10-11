
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

async function getRelatedBlogs(slug, category) {
    await connectToDatabase();

    // Get the latest blogs from the same category first.
    const sameCategoryBlogs = await BlogModel.find({
        slug: { $ne: slug },
        category,
    })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    let relatedBlogs = [...sameCategoryBlogs];

    // Fill the remaining slots with the latest blogs from other categories.
    if (relatedBlogs.length < 5) {
        const existingIds = relatedBlogs.map((blog) => blog._id);

        const otherBlogs = await BlogModel.find({
            slug: { $ne: slug },
            category: { $ne: category },
            _id: { $nin: existingIds },
        })
            .sort({ createdAt: -1 })
            .limit(5 - relatedBlogs.length)
            .lean();

        relatedBlogs = [...relatedBlogs, ...otherBlogs];
    }

    return JSON.parse(JSON.stringify(relatedBlogs));
}

export default async function Page({ params }) {
    const { slug } = await params;

    const blog = await getBlogDetails(slug);

    if (!blog) {
        notFound();
    }

    const relatedBlogs = await getRelatedBlogs(slug, blog.category);

    return (
        <WebsiteLayout>
            {/* Hero image and breadcrumbs */}
            <section className="relative">
                <div className="relative w-full h-[220px] md:h-[300px] lg:h-[360px]">
                    {blog?.image?.url && (
                        <img
                            src={blog.image.url}
                            alt={blog.title || "Blog image"}
                            className="w-full h-full object-cover"
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent" />

                    <div className="absolute inset-x-0 top-0 max-w-[1370px] mx-auto w-full px-5 sm:px-10 pt-6 md:pt-8 z-10">
                        <nav aria-label="breadcrumb" className="w-full">
                            <ol className="flex items-center gap-2 text-sm text-gray-200 font-nunito overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
                                <li className="flex items-center gap-2">
                                    <Link
                                        href="/"
                                        className="flex items-center gap-1.5 hover:text-white transition-colors"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a2.25 2.25 0 01-1 1h-3m-6 0h6"
                                            />
                                        </svg>
                                        <span>Home</span>
                                    </Link>

                                    <span className="text-gray-400">/</span>

                                    <Link
                                        href="/blogs"
                                        className="hover:text-white transition-colors"
                                    >
                                        Blogs
                                    </Link>

                                    <span className="text-gray-400">/</span>

                                    <span className="text-white font-semibold truncate max-w-[180px] sm:max-w-none">
                                        {blog.title}
                                    </span>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Blog title and description */}
                <div className="max-w-[1370px] mx-auto px-5 sm:px-10 relative z-20">
                    <article className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] rounded-3xl border border-gray-100 p-6 sm:p-8 lg:p-10 -mt-16 md:-mt-24 lg:-mt-28 mb-10 w-full relative overflow-hidden">
                        <div className="absolute -right-20 -bottom-20 w-[280px] h-[280px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-200/40 via-orange-100/10 to-transparent rounded-full blur-2xl pointer-events-none" />

                        <div className="relative z-10">
                            {blog?.category && (
                                <div className="flex flex-wrap items-center gap-3 mb-5">
                                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-primary font-nunito">
                                        {blog.category}
                                    </span>
                                </div>
                            )}

                            <h1 className="max-w-4xl text-4xl md:text-5xl lg:text-6xl font-bold font-cormorant-garamond text-gray-900 leading-[1.05]">
                                {blog.title}
                            </h1>

                            {blog?.description && (
                                <p className="mt-6 max-w-4xl text-base md:text-xl text-gray-600 font-nunito leading-relaxed">
                                    {blog.description}
                                </p>
                            )}
                        </div>
                    </article>
                </div>
            </section>

            {/* Blog content without a box or sidebar */}
            <section className="pt-2 pb-16 md:pb-20">
                <div className="px-5 sm:px-10 max-w-[1370px] mx-auto">
                    <article className="w-full max-w-4xl mx-auto">
                    
<div className="rich-text-content">
    <div
        dangerouslySetInnerHTML={{
            __html: blog?.content || ""
        }}
    />

    <style>{`
        .rich-text-content h2 {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 1.5rem 0 0.75rem;
            color: #111827;
        }

        .rich-text-content h3 {
            font-size: 1.3rem;
            font-weight: 600;
            margin: 1.5rem 0 0.75rem;
            color: #111827;
        }

        .rich-text-content h4,
        .rich-text-content h5,
        .rich-text-content h6 {
            font-weight: 600;
            margin: 1rem 0 0.75rem;
            color: #111827;
        }

        .rich-text-content p {
            margin: 0.5rem 0;
            color: #4b5563;
            line-height: 1.7;
        }

        .rich-text-content ul {
            list-style: disc;
            padding-left: 1.5rem;
            margin: 0.5rem 0;
        }

        .rich-text-content ol {
            list-style: decimal;
            padding-left: 1.5rem;
            margin: 0.5rem 0;
        }

        .rich-text-content strong {
            font-weight: 700;
            color: #111827;
        }

        .rich-text-content em {
            font-style: italic;
        }

        .rich-text-content u {
            text-decoration: underline;
        }

        .rich-text-content li {
            margin-bottom: 0.3rem;
            line-height: 1.7;
        }
    `}</style>
</div>

                    </article>
                </div>
            </section>

            {/* Five related blogs */}
            {relatedBlogs.length > 0 && (
                <section className="pb-20">
                    <div className="px-5 sm:px-10 max-w-[1370px] mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                            <div>
                                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-primary font-nunito mb-4">
                                    More Stories
                                </span>

                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-cormorant-garamond text-gray-900 leading-tight">
                                    Explore More Blogs
                                </h2>
                            </div>

                            <Link
                                href="/blogs"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-primary font-nunito hover:text-primary/80 transition-colors"
                            >
                                View all blogs
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                            {relatedBlogs.map((item) => {
                                const imageSrc =
                                    item?.image?.url ||
                                    (typeof item?.image === "string"
                                        ? item.image
                                        : "");

                                return (
                                    <article
                                        key={item._id}
                                        className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                    >
                                        <Link href={`/blogs/${item.slug}`}>
                                            <div className="relative h-[200px] overflow-hidden bg-gray-100">
                                                {imageSrc && (
                                                    <img
                                                        src={imageSrc}
                                                        alt={item.title || "Related blog image"}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                )}

                                                {item.category && (
                                                    <div className="absolute top-3 left-3">
                                                        <span className="px-3 py-1.5 rounded-full bg-white/95 text-primary text-xs font-semibold font-nunito">
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        <div className="p-4">
                                            <Link href={`/blogs/${item.slug}`}>
                                                <h3 className="text-xl font-bold font-cormorant-garamond text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                                    {item.title}
                                                </h3>
                                            </Link>

                                            {item.description && (
                                                <p className="mt-3 text-sm text-gray-600 font-nunito leading-relaxed line-clamp-3">
                                                    {item.description}
                                                </p>
                                            )}

                                            <Link
                                                href={`/blogs/${item.slug}`}
                                                className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-primary font-nunito hover:gap-3 transition-all"
                                            >
                                                Read More →
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </WebsiteLayout>
    );
}
