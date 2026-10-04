import { FaWifi, FaParking, FaMusic, FaGlassMartiniAlt, FaTree, FaPaw, FaWheelchair, FaSmoking, FaChild, FaCreditCard, FaFan, FaUtensils } from 'react-icons/fa';


export const hotels = [
    {
        _id: 1,
        slug: "nidhivan-sarovar-portico",
        title: "Nidhivan Sarovar Portico",
        description: "A premium luxury resort offering serene ambiance, modern amenities, and pure vegetarian dining.",
        image: "/categories/restaurants.png",
        logo: "/categories/restaurants.png",
        banner: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop",
        location: "123, Krishna Nagar, Mathura, Uttar Pradesh 281001",
        shortLocation: "Holi Gate, Mathura",
        mapLink: "https://maps.app.goo.gl/Z6q8q8q8q8q8q8q8",
        openingTime: "08:00 AM",
        closingTime: "10:30 PM",
        email: "akash@example.com",
        phone: "9876543210",
        whatsapp: "919876543210",
        instagram: "https://www.instagram.com/",
        facebook: "https://www.facebook.com/",
        youtube: "https://www.youtube.com/",
        website: "https://www.infotechistan.com/",
        rating: 4.5,
        reviewCount: 150,
        googleReview: "https://maps.app.goo.gl/Z6q8q8q8q8q8q8q8",
        startingPrice: "2,500",
        roomCategories: [
            {
                _id: 1,
                title: "Deluxe Single Room",
                description: "Experience comfort in our Deluxe Single Room, designed for the solo traveler seeking a blend of luxury and tranquility. Features modern decor and garden views.",
                heroImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&h=800&auto=format&fit=crop",
                gallery: [
                    "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&h=800",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&h=800",
                    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=800&h=800"
                ],
                size: "20 Sq Feet",
                bedType: "Single Bed",
                bedQuantity: 1,
                guests: 1,
                price: "2,500/-",
                amenities: ["Free WiFi", "AC", "TV", "Mini Bar"]
            },
            {
                _id: 2,
                title: "Executive Double Room",
                description: "Our Executive Double Room offers spacious accommodations for couples or small families, featuring premium bedding and a private balcony.",
                heroImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200&h=800&auto=format&fit=crop",
                gallery: [
                    "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&h=800",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&h=800",
                    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=800&h=800"
                ],
                size: "20 Sq Feet",
                bedType: "King Size Bed",
                bedQuantity: 1,
                guests: 2,
                price: "3,800/-",
                amenities: ["Free WiFi", "AC", "Smart TV", "Work Desk"]
            },
            {
                _id: 3,
                title: "Executive Double Room",
                description: "Our Executive Double Room offers spacious accommodations for couples or small families, featuring premium bedding and a private balcony.",
                heroImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200&h=800&auto=format&fit=crop",
                gallery: [
                    "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&h=800",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&h=800",
                    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=800&h=800"
                ],
                size: "20 Sq Feet",
                bedType: "King Size Bed",
                bedQuantity: 1,
                guests: 2,
                price: "4,200/-",
                amenities: ["Free WiFi", "AC", "Smart TV", "Work Desk"]
            },
            {
                _id: 4,
                title: "Executive Double Room",
                description: "Our Executive Double Room offers spacious accommodations for couples or small families, featuring premium bedding and a private balcony.",
                heroImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200&h=800&auto=format&fit=crop",
                gallery: [
                    "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&h=800",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&h=800",
                    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=800&h=800"
                ],
                size: "20 Sq Feet",
                bedType: "King Size Bed",
                bedQuantity: 1,
                guests: 2,
                price: "5,000/-",
                amenities: ["Free WiFi", "AC", "Smart TV", "Work Desk"]
            }
        ],

        offers: [
            {
                title: "20% OFF on Total Bill",
                description: "Celebrating your anniversary with us?",
                endDate: "Aug 31, 2026",
            },
            {
                title: "Free Dessert",
                description: "Celebrating your anniversary with us?",
                endDate: "Sep 15, 2026",
            },
            {
                title: "Buy 1 Get 1 Free Drinks",
                description: "Celebrating your anniversary with us?",
                endDate: "Limited Time",
            },
            {
                title: "Corporate Lunch",
                description: "Celebrating your anniversary with us?",
                endDate: "Dec 31, 2026",
            },
            {
                title: "Anniversary Special",
                description: "Celebrating your anniversary with us?",
                endDate: "Always Valid",
            }
        ],

        amenities: [
            { name: "Free High-Speed WiFi", icon: <FaWifi /> },
            { name: "Valet Parking Available", icon: <FaParking /> },
            { name: "Live Music & Entertainment", icon: <FaMusic /> },
            { name: "Full Bar / Beverages", icon: <FaGlassMartiniAlt /> },
            { name: "Outdoor & Rooftop Seating", icon: <FaTree /> },
            { name: "Pet Friendly Environment", icon: <FaPaw /> },
            { name: "Wheelchair Accessible", icon: <FaWheelchair /> },
            { name: "Designated Smoking Area", icon: <FaSmoking /> },
            { name: "Kid Friendly / Play Area", icon: <FaChild /> },
            { name: "Accepts Credit Cards", icon: <FaCreditCard /> },
            { name: "Fully Air Conditioned", icon: <FaFan /> },
            { name: "Private Dining Available", icon: <FaUtensils /> }
        ],

        attractions: [
            { title: "Banke Bihari Mandir", distance: "0.3 km", time: "2 Min Walk", mode: "walk" },
            { title: "Dwarkadhish Temple", distance: "0.7 km", time: "5 Min Walk", mode: "walk" },
            { title: "Mathura Bus Stand", distance: "2.0 km", time: "10 Min Drive", mode: "drive" },
            { title: "Mathura Junction", distance: "3.5 km", time: "15 Min Drive", mode: "drive" }
        ],

        gallery: [
            { image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&h=800&auto=format&fit=crop', label: 'Dining Hall' },
            { image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&h=1200&auto=format&fit=crop', label: 'Main Lobby' },
            { image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&h=1000&auto=format&fit=crop', label: 'Modern Kitchen' },
            { image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1400&h=800&auto=format&fit=crop', label: 'Reception Area' },
            { image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1400&h=800&auto=format&fit=crop', label: 'Guest Lounge' },
            { image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&h=1600&auto=format&fit=crop', label: 'Bar & Grill' },
            { image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1200&h=800&auto=format&fit=crop', label: 'Event Hall' },
            { image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1000&h=1200&auto=format&fit=crop', label: 'Fine Dining' }
        ]

    },

];
