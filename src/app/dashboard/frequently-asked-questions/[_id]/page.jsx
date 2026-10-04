"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_ENDPOINTS } from "@/utility/constants";
import LoadingComponent from "@/server-components/LoadingComponent";
import { useFetchDetailsAPI, useFetchPostAPI } from "@/utility/custom-hooks";
import { handleInputChange } from "@/utility/utility-function";

export default function AddNewTestimonialPage() {

    const { _id } = useParams();
    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const { fetchDetailsAPI, fetchingDetails } = useFetchDetailsAPI();

    const [formData, setFormData] = useState({
        sno: '',
        title: '',
        image: '',
        link: '',
        button: '',
        description: '',
    });

    async function handleSubmit(e) {
        e.preventDefault();
        fetchPostAPI(API_ENDPOINTS.ADD_FAQ, formData, '/dashboard/frequently-asked-questions');
    }

    useEffect(() => {
        fetchDetailsAPI(API_ENDPOINTS.FETCH_FAQS, _id, setFormData);
    }, [_id]);

    if (fetchingDetails) {
        return <LoadingComponent message="Loading FAQ Details..." />;
    }

    return (
        <section>

            <form onSubmit={handleSubmit}>

                <div className="grid md:grid-cols-2 gap-4 mb-4">

                    <div>
                        <label htmlFor="sno" className="form-label">S.No.</label>
                        <input placeholder="Enter the serial number" type="text" id="sno" name="sno" value={formData.sno} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                        <p className="gray-600 text-xs">Leave this field empty if you want to add the FAQ in the last</p>
                    </div>

                    <div>
                        <label htmlFor="page" className="form-label">Page</label>
                        <input placeholder="Enter the page" type="text" id="page" name="page" value={formData.page} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                    </div>

                </div>

                <div className="mb-2 md:mb-4">
                    <label htmlFor="question" className="form-label">Question</label>
                    <textarea placeholder="Enter the question" id="question" name="question" value={formData.question} onChange={(e) => { handleInputChange(e, setFormData) }} rows="2" className="form-input"></textarea>
                </div>

                <div className="mb-2">
                    <label htmlFor="answer" className="form-label">Answer</label>
                    <textarea placeholder="Enter the answer" id="answer" name="answer" value={formData.answer} onChange={(e) => { handleInputChange(e, setFormData) }} rows="4" className="form-input"></textarea>
                </div>

                <div className="mt-6">
                    <button type="submit" disabled={postingData} className="cursor-pointer text-white px-4 py-2 rounded-md bg-primary hover:opacity-90">
                        {postingData ? 'Updating...' : 'Update FAQ'}
                    </button>
                </div>

            </form>

        </section>
    );
};