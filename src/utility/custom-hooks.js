import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export function useFetchPostAPI() {

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function fetchPostAPI(API_ENDPOINT, formData, pathToRedirect, onSuccess = () => { }, secured = true) {

        try {

            const token = sessionStorage.getItem('token');
            if (secured) {
                if (!token) {
                    toast.error("Session Expired", { position: "top-right" });
                    router.push("/login");
                    return;
                }
            }

            setLoading(true);

            const response = await fetch(API_ENDPOINT.path, {
                method: API_ENDPOINT.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.status === "success") {

                onSuccess(data);
                toast.success(data.message, { position: "top-right" });
                if (pathToRedirect) router.push(pathToRedirect);

            } else {
                toast.error(data.message, { position: "top-right" });
            }

        } catch (error) {
            toast.error(error.message, { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    return { fetchPostAPI, postingData: loading }
}

export function useFetchGetAPI() {

    const router = useRouter();

    const [dataList, setDataList] = useState([]);

    const [loading, setLoading] = useState(false)

    const [extra, setExtra] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
        totalData: 0,
        totalFilteredData: 0,
    });

    const [query, setQuery] = useState({
        page: 1,
        limit: 10,
        searchValue: "",
        sortKey: "sno",
        sortOrder: "1",
    });

    async function fetchGetAPI(API_ENDPOINT, extraQuery = {}, secured = true) {

        try {

            const token = sessionStorage.getItem('token');
            if (secured) {
                if (!token) {
                    toast.error("Session Expired", { position: "top-right" });
                    router.push("/login");
                    return;
                }
            }

            setLoading(true);

            const queryParams = new URLSearchParams({
    ...query,
    ...extraQuery,
    sortKey: extraQuery.sortKey || query.sortKey || "createdAt",
    sortOrder: extraQuery.sortOrder || query.sortOrder || "-1",
});
            const res = await fetch(`${API_ENDPOINT.path}?${queryParams.toString()}`, {
                method: API_ENDPOINT.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await res.json();

            if (data.status === "success") {
                setDataList(data.data.data);
                setExtra({
                    page: data.data.extra.page,
                    limit: data.data.extra.limit,
                    totalData: data.data.extra.totalData,
                    totalFilteredData: data.data.extra.totalFilteredData,
                    totalPages: data.data.extra.totalPages
                });
            } else {
                toast.error(data.message, { position: "top-right" });
            }

        } catch (error) {
            toast.error(error.message, { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    return { fetchGetAPI, dataList, fetchingData: loading, query, setQuery, extra };
}

export function useFetchDeleteAPI() {

    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        _id: null
    });

    const router = useRouter();

    function handleDeleteClick(_id) {
        setShowDeletePopup(true);
        setFormData((prev) => ({ ...prev, _id }));
    }

    function cancelDelete() {
        setShowDeletePopup(false);
        setFormData((prev) => ({ ...prev, _id: null }));
    }

    async function fetchDeleteAPI(API_ENDPOINT, callBack, secured = true) {

        try {

            const token = sessionStorage.getItem('token');
            if (secured) {
                if (!token) {
                    toast.error("Session Expired", { position: "top-right" });
                    router.push("/login");
                    return;
                }
            }

            setLoading(true);

            const response = await fetch(API_ENDPOINT.path, {
                method: API_ENDPOINT.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.status === "success") {
                toast.success(data.message, { position: "top-right" });
                callBack();
                cancelDelete();
            } else {
                toast.error(data.message, { position: "top-right" });
            }

        } catch (error) {
            toast.error(error.message, { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    return { handleDeleteClick, cancelDelete, showDeletePopup, fetchDeleteAPI, deletingData: loading }
}

export function useFetchDetailsAPI() {

    const router = useRouter();
    const [loading, setLoading] = useState(false)

    async function fetchDetailsAPI(API_ENDPOINT, _id, setFormData, secured = true) {

        try {

            const token = sessionStorage.getItem('token');
            if (secured) {
                if (!token) {
                    toast.error("Session Expired", { position: "top-right" });
                    router.push("/login");
                    return;
                }
            }

            setLoading(true);

            const res = await fetch(`${API_ENDPOINT.path}?_id=${_id}`, {
                method: API_ENDPOINT.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await res.json();

            if (data.status === "success") {
                setFormData(data.data.data[0]);
            } else {
                toast.error(data.message, { position: "top-right" });
            }

        } catch (error) {
            toast.error(error.message, { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    return { fetchDetailsAPI, fetchingDetails: loading };
}