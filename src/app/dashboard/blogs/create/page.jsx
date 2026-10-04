"use client"

import { useState } from "react";
import Image from "next/image";
import { API_ENDPOINTS } from "@/utility/constants";
import { useFetchPostAPI } from "@/utility/custom-hooks";
import { handleImageChange, handleInputChange } from "@/utility/utility-function";

const initialFormData = {
    sno: '',
    title: '',
    slug: '',
    image: '',
    description: '',
    content: '',
    date: '',
    author: '',
    category: ''
};

export default function AddNewBlogPage() {

    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const [formData, setFormData] = useState(initialFormData);

    async function handleSubmit(e) {
        e.preventDefault();
        fetchPostAPI(API_ENDPOINTS.ADD_BLOG, formData, '/dashboard/blogs');
    }

    return (
        <section>

            <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label htmlFor="sno" className="form-label">S.No.</label>
                        <input placeholder="Enter the serial number" type="text" id="sno" name="sno" value={formData.sno} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                    </div>

                    <div>
                        <label htmlFor="title" className="form-label">Title</label>
                        <input placeholder="Enter the blog title" type="text" id="title" name="title" value={formData.title} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                    </div>

                    <div>
                        <label htmlFor="slug" className="form-label">Slug</label>
                        <input placeholder="Enter the blog slug" type="text" id="slug" name="slug" value={formData.slug} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                    </div>

                    <div>
                        <label htmlFor="author" className="form-label">Author</label>
                        <input placeholder="Enter the author name" type="text" id="author" name="author" value={formData.author} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                    </div>

                    <div>
                        <label htmlFor="category" className="form-label">Category</label>
                        <input placeholder="Enter the category" type="text" id="category" name="category" value={formData.category} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                    </div>

                    <div>
                        <label htmlFor="date" className="form-label">Date</label>
                        <input type="date" id="date" name="date" value={formData.date} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                    </div>

                </div>

                <div className="my-4">
                    <label htmlFor="image" className="form-label">Image</label>
                    <input type="file" id="image" name="image" accept="image/*" onChange={(e) => { handleImageChange(e, setFormData) }} className="form-input" />
                    {formData.image && typeof formData.image === 'string' && formData.image.startsWith('data:image') && (
                        <Image src={formData.image} alt="Blog Preview" width={120} height={120} className="mt-2 object-cover rounded-md" />
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="form-label">Short Description</label>
                    <textarea placeholder="Enter the short description" id="description" name="description" value={formData.description} onChange={(e) => { handleInputChange(e, setFormData) }} rows="2" className="form-input"></textarea>
                </div>

                <div className="mb-4">
                    <label htmlFor="content" className="form-label">Content</label>
                    <textarea placeholder="Enter the blog content" id="content" name="content" value={formData.content} onChange={(e) => { handleInputChange(e, setFormData) }} rows="6" className="form-input"></textarea>
                </div>

                <div className="mt-6">
                    <button type="submit" disabled={postingData} className="cursor-pointer text-white px-4 py-2 rounded-md bg-primary hover:opacity-90">
                        {postingData ? 'Adding...' : 'Add Blog'}
                    </button>
                </div>

            </form>

        </section>
    );
};
