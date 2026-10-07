export const API_ENDPOINTS = {

    LOGIN: { method: "POST", path: "/api/auth/login" },
    REGISTER: { method: "POST", path: "/api/auth/register" },
    SEND_OTP: { method: "POST", path: "/api/auth/send-otp" },
    VERIFY_OTP: { method: "POST", path: "/api/auth/verify-otp" },
    VALIDATE_USER: { method: "GET", path: "/api/auth/validate-user" },
    LOGOUT: { method: "POST", path: "/api/auth/logout" },

    DASHBOARD: { method: "GET", path: "/api/dashboard" },

    ADD_FAQ: { method: "POST", path: "/api/faq" },
    FETCH_FAQS: { method: "GET", path: "/api/faq" },
    DELETE_FAQ: { method: "DELETE", path: "/api/faq" },

    ADD_BANNER: { method: "POST", path: "/api/banner" },
    FETCH_BANNERS: { method: "GET", path: "/api/banner" },
    DELETE_BANNER: { method: "DELETE", path: "/api/banner" },

    ADD_BLOG: { method: "POST", path: "/api/blog" },
    FETCH_BLOGS: { method: "GET", path: "/api/blog" },
    DELETE_BLOG: { method: "DELETE", path: "/api/blog" },

    ADD_PLACE: { method: "POST", path: "/api/place" },
    FETCH_PLACES: { method: "GET", path: "/api/place" },
    DELETE_PLACE: { method: "DELETE", path: "/api/place" },

    ADD_RESTAURENT: { method: "POST", path: "/api/restaurent" },
    FETCH_RESTAURENTS: { method: "GET", path: "/api/restaurent" },
    DELETE_RESTAURENT: { method: "DELETE", path: "/api/restaurent" },

    ADD_HOTEL: { method: "POST", path: "/api/hotel" },
    FETCH_HOTELS: { method: "GET", path: "/api/hotel" },
    DELETE_HOTEL: { method: "DELETE", path: "/api/hotel" },

    ADD_RELIGIOUS_SHOP: { method: "POST", path: "/api/religious-shop" },
    FETCH_RELIGIOUS_SHOPS: { method: "GET", path: "/api/religious-shop" },
    DELETE_RELIGIOUS_SHOP: { method: "DELETE", path: "/api/religious-shop" },

    ADD_SCHEDULE: { method: "POST", path: "/api/schedule" },
    FETCH_SCHEDULES: { method: "GET", path: "/api/schedule" },

    ADD_SOCIAL_MEDIA: { method: "POST", path: "/api/social-media" },
    FETCH_SOCIAL_MEDIAS: { method: "GET", path: "/api/social-media" },

    ADD_OFFER: { method: "POST", path: "/api/offer" },
    FETCH_OFFERS: { method: "GET", path: "/api/offer" },
    DELETE_OFFER: { method: "DELETE", path: "/api/offer" },

    ADD_AMENITY: { method: "POST", path: "/api/amenity" },
    FETCH_AMENITIES: { method: "GET", path: "/api/amenity" },
    DELETE_AMENITY: { method: "DELETE", path: "/api/amenity" },

    ADD_ATTRACTION: { method: "POST", path: "/api/attraction" },
    FETCH_ATTRACTIONS: { method: "GET", path: "/api/attraction" },
    DELETE_ATTRACTION: { method: "DELETE", path: "/api/attraction" },

    ADD_GALLERY: { method: "POST", path: "/api/gallery" },
    FETCH_GALLERY: { method: "GET", path: "/api/gallery" },
    DELETE_GALLERY: { method: "DELETE", path: "/api/gallery" },

    ADD_MENU: { method: "POST", path: "/api/menu" },
    FETCH_MENU: { method: "GET", path: "/api/menu" },
    DELETE_MENU: { method: "DELETE", path: "/api/menu" },

    ADD_MENU_ITEM: { method: "POST", path: "/api/menu/items" },
    FETCH_MENU_ITEM: { method: "GET", path: "/api/menu/items" },
    DELETE_MENU_ITEM: { method: "DELETE", path: "/api/menu/items" },
};