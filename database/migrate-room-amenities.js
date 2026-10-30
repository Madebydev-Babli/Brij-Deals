import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";
import { HotelModel } from "../backend/models/hotel.js";
import {
    AMENITY_ICON_BY_IDENTIFIER,
    AMENITY_ICON_MAP,
    FALLBACK_AMENITY_ICON,
} from "../src/utility/utility-data.js";

loadEnvConfig(process.cwd());

function migrateAmenity(amenity) {
    const isLegacyString = typeof amenity === "string";
    const rawName = isLegacyString ? amenity : amenity?.name || amenity?.title;
    const name = typeof rawName === "string" ? rawName.trim() : "";
    if (!name) return null;

    const mappedIcon = AMENITY_ICON_MAP[name]?.iconName;
    const savedIcon = typeof amenity?.icon === "string" ? amenity.icon.trim() : "";
    const icon = mappedIcon ||
        (AMENITY_ICON_BY_IDENTIFIER[savedIcon] ? savedIcon : FALLBACK_AMENITY_ICON.iconName);

    return { name, icon };
}

async function migrateRoomAmenities() {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is required to migrate room amenities");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    const cursor = HotelModel.collection.find({ roomCategories: { $exists: true } });
    let updated = 0;

    try {
        for await (const hotel of cursor) {
            let needsUpdate = false;
            const roomCategories = (Array.isArray(hotel.roomCategories) ? hotel.roomCategories : []).map((room) => {
                if (!room || !Array.isArray(room.amenities)) return room;

                const amenities = room.amenities
                    .map((amenity) => {
                        const normalized = migrateAmenity(amenity);
                        if (
                            !normalized ||
                            typeof amenity === "string" ||
                            typeof amenity !== "object" ||
                            normalized.name !== amenity.name ||
                            normalized.icon !== amenity.icon
                        ) {
                            needsUpdate = true;
                        }
                        return normalized;
                    })
                    .filter(Boolean);

                return { ...room, amenities };
            });

            if (!needsUpdate) continue;

            const result = await HotelModel.collection.updateOne(
                { _id: hotel._id, roomCategories: hotel.roomCategories },
                { $set: { roomCategories } },
            );
            if (result.matchedCount !== 1) {
                throw new Error(`Hotel ${hotel._id} changed during migration; rerun the migration`);
            }
            updated += 1;
        }
    } finally {
        await cursor.close();
    }

    console.log(`Migrated room amenities for ${updated} hotel(s).`);
}

migrateRoomAmenities()
    .catch((error) => {
        console.error("Room amenities migration failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
