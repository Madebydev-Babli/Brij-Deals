export const places = [
    {
        _id: 1,
        slug: "prem-mandir",
        title: "Prem Mandir",
        description: "A stunning white marble temple dedicated to Radha Krishna and Sita Ram, famous for its evening light show.",
        history: "Prem Mandir, established by Jagadguru Shri Kripalu Ji Maharaj in 2001, is a masterpiece of celestial love. Spanning 54 acres, the temple was meticulously constructed over 11 years using over 30,000 tons of Italian white marble. The temple features 84 panels depicting the pastimes of Radha Krishna and Rama, bringing to life the rich spiritual heritage of the Bhakti movement.",
        image: "/categories/places.png",
        banner: "/categories/places.png",
        location: "Chatikara Road, Vrindavan, Uttar Pradesh 281121",
        openingTime: "05:30 AM",
        closingTime: "08:30 PM",
        artiTimings: [
            { name: "Morning Aarti", time: "05:45 AM" },
            { name: "Morning Bhog", time: "11:30 AM" },
            { name: "Evening Aarti", time: "05:00 PM" },
            { name: "Musical Fountain", time: "07:30 PM" },
            { name: "Shayan Aarti", time: "08:15 PM" }
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
        ],
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.158226065666!2d77.6631855!3d27.55755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39736fe597d39ef5%3A0xe5450f38446b78d2!2sPrem%20Mandir%2C%20Vrindavan%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1713348000000!5m2!1sen!2sin",
        mapLink: "https://www.google.com/maps?daddr=Prem+Mandir,+Vrindavan",
        attractions: [
            { title: "Banke Bihari Mandir", distance: "0.3 km", time: "2 Min Walk", mode: "walk" },
            { title: "Dwarkadhish Temple", distance: "0.7 km", time: "5 Min Walk", mode: "walk" },
            { title: "Mathura Bus Stand", distance: "2.0 km", time: "10 Min Drive", mode: "drive" },
            { title: "Mathura Junction", distance: "3.5 km", time: "15 Min Drive", mode: "drive" }
        ],
        visitorTips: [
            { icon: "clock", label: "Best Time", description: "Visit after sunset (6 PM onwards) to witness the spectacular lighting and fountain show." },
            { icon: "clothing", label: "Dress Code", description: "Modest cultural attire is respected. Please wear comfortable walking shoes for the large complex." },
            { icon: "camera", label: "Photography", description: "Photography is permitted in the garden areas but prohibited inside the main temple sanctum." },
            { icon: "parking", label: "Parking", description: "Dedicated parking is available but can be a 5-minute walk from the main entrance." }
        ]
    },
    {
        _id: 2,
        slug: "banke-bihari-temple",
        title: "Banke Bihari Temple",
        description: "One of the holiest and most famous temples of Lord Krishna in India with a unique worship tradition.",
        history: "The mystical deity of Banke Bihari was first discovered in Nidhivan by the legendary saint-musician Swami Haridas in the 16th century. The deity, representing the combined form of Radha and Krishna, was originally hidden in the dense groves of Vrindavan. The current grand temple structure was constructed in 1864, funded by Goswamis, and remains the epicenter of Krishna devotion in the holy city.",
        image: "/categories/places.png",
        banner: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop",
        location: "Godham Road, Vrindavan, Uttar Pradesh 281121",
        openingTime: "07:45 AM",
        closingTime: "08:45 PM",
        artiTimings: [
            { name: "Shringar Aarti", time: "09:00 AM" },
            { name: "Rajbhog Aarti", time: "01:00 PM" },
            { name: "Uthapan Aarti", time: "05:30 PM" },
            { name: "Shayan Aarti", time: "08:30 PM" }
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
        ],
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.253075252554!2d77.6974128!3d27.55529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39736f86745585ef%3A0x6b43722956cf9e9e!2sShri%20Bankey%20Bihari%20Ji%20Temple%2C%20Vrindavan!5e0!3m2!1sen!2sin!4v1713348100000!5m2!1sen!2sin",
        mapLink: "https://www.google.com/maps?daddr=Banke+Bihari+Temple,+Vrindavan",
        attractions: [
            { title: "Banke Bihari Mandir", distance: "0.3 km", time: "2 Min Walk", mode: "walk" },
            { title: "Dwarkadhish Temple", distance: "0.7 km", time: "5 Min Walk", mode: "walk" },
            { title: "Mathura Bus Stand", distance: "2.0 km", time: "10 Min Drive", mode: "drive" },
            { title: "Mathura Junction", distance: "3.5 km", time: "15 Min Drive", mode: "drive" }
        ],
        visitorTips: [
            { icon: "alert", label: "Crowd Alert", description: "This is Vrindavan's busiest temple. Visit during early morning hours to avoid extreme crowds." },
            { icon: "shoes", label: "Shoe Storage", description: "Use designated shoe counters outside. Avoid leaving shoes in random places to ensure safety." },
            { icon: "money", label: "Security", description: "Keep your belongings, specifically phones and wallets, secure as the narrow lanes can be very crowded." },
            { icon: "monkey", label: "Monkeys", description: "Be careful of monkeys in the area; avoid carrying loose bags or wearing spectacles/sunglasses." }
        ]
    },
    {
        _id: 3,
        slug: "shri-krishna-janmasthan",
        title: "Shri Krishna Janmasthan",
        description: "The magnificent temple complex built around the exact prison cell where Lord Krishna was born.",
        history: "Considered the very epicenter of the Braj region, this site marks the exact prison cell where Lord Krishna manifested five millennia ago. The site has a turbulent history, having been built and demolished multiple times under different empires. The current magnificent structure, including the Keshavdeva Temple and the Janmabhoomi complex, was spearheaded by Pandit Madan Mohan Malaviya and completed in the mid-20th century.",
        image: "/categories/places.png",
        banner: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop",
        location: "Deeg Marg, Near Mathura Railway Station, Mathura, Uttar Pradesh 281001",
        openingTime: "05:00 AM",
        closingTime: "09:30 PM",
        artiTimings: [
            { name: "Mangala Aarti", time: "05:30 AM" },
            { name: "Shringar Aarti", time: "10:30 AM" },
            { name: "Rajbhog Aarti", time: "12:30 PM" },
            { name: "Sandhya Aarti", time: "06:00 PM" },
            { name: "Shayan Aarti", time: "09:00 PM" }
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
        ],
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.0654634289456!2d77.6691456!3d27.5005825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397371909983ed1f%3A0xf5982e5b8e97491!2sShri%20Krishna%20Janmabhoomi%20Temple%2C%20Mathura!5e0!3m2!1sen!2sin!4v1713348200000!5m2!1sen!2sin",
        mapLink: "https://www.google.com/maps?daddr=Shri+Krishna+Janmasthan,+Mathura",
        attractions: [
            { title: "Banke Bihari Mandir", distance: "0.3 km", time: "2 Min Walk", mode: "walk" },
            { title: "Dwarkadhish Temple", distance: "0.7 km", time: "5 Min Walk", mode: "walk" },
            { title: "Mathura Bus Stand", distance: "2.0 km", time: "10 Min Drive", mode: "drive" },
            { title: "Mathura Junction", distance: "3.5 km", time: "15 Min Drive", mode: "drive" }
        ],
        visitorTips: [
            { icon: "security", label: "Security Check", description: "Mobile phones, cameras, and all electronics are strictly prohibited inside the complex." },
            { icon: "locker", label: "Locker Facility", description: "Safe and reliable locker facilities are available near the entrance for a nominal fee." },
            { icon: "clock", label: "Queue Time", description: "Security screening can take 20-30 minutes during peak hours. Plan your visit accordingly." },
            { icon: "information", label: "ID Proof", description: "It is advisable to carry a valid ID proof as security personnel may request it for verification." }
        ]
    },
    {
        _id: 4,
        slug: "govardhan-hill",
        title: "Govardhan Hill",
        description: "The sacred 21km parikrama of the hill lifted by Lord Krishna to protect the villagers of Vrindavan.",
        history: "Govardhan Hill, or Giriraj, is central to Braj culture. According to Srimad Bhagavatam, Lord Krishna lifted this entire hill on his little finger for seven days to protect the people from the wrath of Lord Indra. For centuries, millions of pilgrims have performed the 21km parikrama of the hill, which is believed to be a physical manifestation of Krishna himself.",
        image: "/categories/places.png",
        banner: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop",
        location: "Govardhan, Mathura, Uttar Pradesh 281502",
        openingTime: "12:00 AM",
        closingTime: "11:59 PM",
        artiTimings: [
            { name: "Mansi Ganga Aarti", time: "06:30 PM" },
            { name: "Daily Parikrama", time: "Sunrise to Sunset" }
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
        ],
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14152.482865660608!2d77.4566373!3d27.5144342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3973801f6874872f%3A0x7d2876935ba622a!2sGovardhan%20Hill%2C%20Anyanypur!5e0!3m2!1sen!2sin!4v1713348300000!5m2!1sen!2sin",
        mapLink: "https://www.google.com/maps?daddr=Govardhan+Hill,+Mathura",
        attractions: [
            { title: "Banke Bihari Mandir", distance: "0.3 km", time: "2 Min Walk", mode: "walk" },
            { title: "Dwarkadhish Temple", distance: "0.7 km", time: "5 Min Walk", mode: "walk" },
            { title: "Mathura Bus Stand", distance: "2.0 km", time: "10 Min Drive", mode: "drive" },
            { title: "Mathura Junction", distance: "3.5 km", time: "15 Min Drive", mode: "drive" }
        ],
        visitorTips: [
            { icon: "walk", label: "Parikrama", description: "The full route is 21 km. Wear extremely comfortable footwear or walk barefoot as a spiritual practice." },
            { icon: "water", label: "Hydration", description: "Carry sufficient water. There are many stalls along the path, but hydration is key during the walk." },
            { icon: "sun", label: "Sun Protection", description: "Start your walk in the early morning or evening hours to avoid the harsh midday sun." },
            { icon: "e-rickshaw", label: "E-Rickshaws", description: "For those unable to walk, battery-operated e-rickshaws are available for partial or full tours." }
        ]
    },
    {
        _id: 5,
        slug: "dwarkadhish-temple",
        title: "Dwarkadhish Temple",
        description: "A stunningly carved temple near the Yamuna Ghats, known for its vibrant festivals and intricate architecture.",
        history: "Constructed in 1814 by Seth Gokul Das Parikh, the then-treasurer of the Gwalior State, this temple is one of the most visited in Mathura. It is dedicated to Dwarkadhish, the 'King of Dwarka' (Lord Krishna). The temple is famous for its intricate paintings and the spectacular celebrations of Hindola and Janmashtami, reflecting the architectural transition of the 19th century.",
        image: "/categories/places.png",
        banner: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop",
        location: "K Raja Marg, Chhatta Bazar, Mathura, Uttar Pradesh 281001",
        openingTime: "06:30 AM",
        closingTime: "07:00 PM",
        artiTimings: [
            { name: "Mangala Aarti", time: "06:30 AM" },
            { name: "Shringar Aarti", time: "07:30 AM" },
            { name: "Rajbhog Aarti", time: "10:30 AM" },
            { name: "Sandhya Aarti", time: "06:00 PM" },
            { name: "Shayan Aarti", time: "07:00 PM" }
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
        ],
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.2312683935273!2d77.7051!3d27.49818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3973717282adb1c3%3A0xe5450f38446b78d2!2sShri%20Dwarkadhish%20Temple%2C%20Mathura!5e0!3m2!1sen!2sin!4v1713348400000!5m2!1sen!2sin",
        mapLink: "https://www.google.com/maps?daddr=Dwarkadhish+Temple,+Mathura",
        attractions: [
            { title: "Banke Bihari Mandir", distance: "0.3 km", time: "2 Min Walk", mode: "walk" },
            { title: "Dwarkadhish Temple", distance: "0.7 km", time: "5 Min Walk", mode: "walk" },
            { title: "Mathura Bus Stand", distance: "2.0 km", time: "10 Min Drive", mode: "drive" },
            { title: "Mathura Junction", distance: "3.5 km", time: "15 Min Drive", mode: "drive" }
        ],
        visitorTips: [
            { icon: "ghat", label: "River Ghats", description: "The famous Vishram Ghat is just a 2-minute walk. Experience the Yamuna Aarti in the evening." },
            { icon: "market", label: "Bazaars", description: "The surrounding Chhatta Bazar is famous for Mathura Peda and traditional handicrafts." },
            { icon: "clothing", label: "Attire", description: "Traditional or modest clothing is highly recommended when visiting this historic temple." },
            { icon: "parking", label: "Traffic", description: "The lanes are narrow; it's best to park your vehicle at designated points and take an auto-rickshaw." }
        ]
    }
];