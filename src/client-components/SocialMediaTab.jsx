"use client"

import { useState, useEffect } from "react";
import LoadingComponent from "@/server-components/LoadingComponent";
import { API_ENDPOINTS } from "@/utility/constants";
import { useFetchGetAPI, useFetchPostAPI } from "@/utility/custom-hooks";
import { handleInputChange } from "@/utility/utility-function";

export function SocialMediaTab({ restaurentId }) {

    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const { fetchGetAPI, dataList, fetchingData, query, setQuery, extra } = useFetchGetAPI();

    const [formData, setFormData] = useState({
        restaurentId: '',
        whatsApp: "",
        instagram: "",
        facebook: "",
        youtube: "",
        website: "",
        googleReviewLink: "",

    });

    async function handleSubmit(e) {
        e.preventDefault();
        fetchPostAPI(API_ENDPOINTS.ADD_SOCIAL_MEDIA, { ...formData, restaurentId }, null);
    }

    useEffect(() => {
        fetchGetAPI(API_ENDPOINTS.FETCH_SOCIAL_MEDIAS, { restaurentId });
    }, [query]);

    useEffect(() => {
        if (dataList && dataList?.length) {
            setFormData(dataList?.[0]);
        }
    }, [dataList])

    if (fetchingData) {
        return <LoadingComponent message="Loading Social Media Details..." />;
    }

    return (
        <>
            <section>

                <form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">

                        <div>
                            <label htmlFor="whatsApp" className="form-label">WhatsApp</label>
                            <input placeholder="Enter the WhatsApp Number" type="text" id="whatsApp" name="whatsApp" value={formData.whatsApp} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                        </div>

                        <div>
                            <label htmlFor="instagram" className="form-label">Instagram</label>
                            <input placeholder="Enter the Instagram Username" type="text" id="instagram" name="instagram" value={formData.instagram} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                        </div>

                        <div>
                            <label htmlFor="facebook" className="form-label">Facebook</label>
                            <input placeholder="Enter the Facebook Username" type="text" id="facebook" name="facebook" value={formData.facebook} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                        </div>

                        <div>
                            <label htmlFor="youtube" className="form-label">YouTube</label>
                            <input placeholder="Enter the YouTube Channel" type="text" id="youtube" name="youtube" value={formData.youtube} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                        </div>

                        <div>
                            <label htmlFor="website" className="form-label">Website</label>
                            <input placeholder="Enter the Website" type="text" id="website" name="website" value={formData.website} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                        </div>

                        <div>
                            <label htmlFor="googleReviewLink" className="form-label">Google Review Link</label>
                            <input placeholder="Enter the Google Review Link" type="text" id="googleReviewLink" name="googleReviewLink" value={formData.googleReviewLink} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                        </div>

                    </div>

                    <div className="mt-8 flex gap-3">

                        <button onClick={handleSubmit} disabled={postingData} className="cursor-pointer text-white px-4 py-2 rounded-md bg-primary hover:opacity-90">
                            {postingData ? 'Updating...' : 'Update Schedule'}
                        </button>

                    </div>

                </form>

            </section >

        </>
    );
};