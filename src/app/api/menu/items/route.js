import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../../../backend/middlewares/verify-token";
import connectToDatabase from "../../../../../backend/configurations/mongoose.config";
import { clearSearch, getErrorMessage } from "@/utility/server-utility";
import { MenuItemModel } from "../../../../../backend/models/menuItem";
import { MenuModel } from "../../../../../backend/models/menu";
import { RestaurentModel } from "../../../../../backend/models/restaurent";

export async function POST(req) {

    let session = null;

    try {

        await connectToDatabase();

        session = await mongoose.startSession();
        session.startTransaction();

        const decoded = await verifyToken(req);

        if (!decoded) {
            return NextResponse.json({ status: 'error', message: "Unauthorized access", data: null, error: "Unauthorized access" }, { status: 401 });
        }

        const { _id, restaurentId, menuId, sno, name, price, description } = await req.json();
        const maxSno = await MenuItemModel.findOne({ menuId, restaurentId }).sort({ sno: -1 });

        if (!restaurentId) {
            return NextResponse.json({ status: "error", message: "Restaurant is required", data: null, error: "Restaurant is required" }, { status: 400 });
        }

        const restaurant = await RestaurentModel.findById(restaurentId);

        if (!restaurant) {
            return NextResponse.json({ status: "error", message: "Restaurant not found", data: null, error: "Restaurant not found" }, { status: 404 });
        }

        if (!menuId) {
            return NextResponse.json({ status: "error", message: "Menu Category is required", data: null, error: "Menu Category is required" }, { status: 400 });
        }

        const category = await MenuModel.findById(menuId);

        if (!category) {
            return NextResponse.json({ status: "error", message: "Menu Category not found", data: null, error: "Restaurent not found" }, { status: 404 });
        }

        if (!name) {
            return NextResponse.json({ status: "error", message: "Name is required", data: null, error: "Name is required" }, { status: 400 });
        }

        if (!price) {
            return NextResponse.json({ status: "error", message: "Price is required", data: null, error: "Price is required" }, { status: 400 });
        }

        if (typeof Number(price) !== "number" || Number(price) <= 0) {
            return NextResponse.json({ status: "error", message: "Price should be a positive number", data: null, error: "Price should be a positive number" }, { status: 400 });
        }

        if (!description) {
            return NextResponse.json({ status: "error", message: "Description is required", data: null, error: "Description is required" }, { status: 400 });
        }

        if (_id) {

            if (!sno) {
                return NextResponse.json({ status: "error", message: "S No is required", data: null, error: "S No is required" }, { status: 400 });
            }

            const menuItem = await MenuItemModel.findById(_id);

            if (!menuItem) {
                return NextResponse.json({ status: "error", message: "Menu item not found", data: null, error: "Menu item not found" }, { status: 404 });
            }

            if (sno < menuItem.sno) {
                await MenuItemModel.updateMany({ sno: { $gte: sno, $lt: menuItem.sno } }, { $inc: { sno: 1 } }, { session });
            }

            if (sno > menuItem.sno) {
                await MenuItemModel.updateMany({ sno: { $gt: menuItem.sno, $lte: sno } }, { $inc: { sno: -1 } }, { session });
            }

            await MenuItemModel.findByIdAndUpdate(_id,
                {
                    sno: maxSno.sno >= sno ? sno : maxSno.sno,
                    restaurentId,
                    menuId,
                    sno,
                    name,
                    price,
                    description,
                }, { new: true, session });

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json({ status: "success", message: "Menu item updated successfully", data: null, error: null }, { status: 200 });

        } else {

            const snoPresent = await MenuItemModel.findOne({ restaurentId, menuId, sno });

            if (snoPresent) {
                await MenuItemModel.updateMany({ restaurentId, menuId, sno: { $gte: sno } }, { $inc: { sno: 1 } }, { session });
            }

            const newMenuItem = new MenuItemModel({
                sno: sno ? sno : maxSno?.sno ? maxSno?.sno + 1 : 1,
                restaurentId,
                menuId,
                name,
                price,
                description,
            });

            await newMenuItem.save({ session });

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json({ status: "success", message: "Menu item added successfully", data: null, error: null }, { status: 201 });
        }

    } catch (error) {
        console.log("ERROR ===>", error);
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}

export async function GET(req) {

    try {

        await connectToDatabase();

        const { searchParams } = new URL(req.url);

        const { _id, sortOrder = -1, sortKey = "createdAt", limit = 10, page = 1, searchValue = "", menuId, restaurentId } = Object.fromEntries(searchParams.entries());

        const search = {

            _id: mongoose.Types.ObjectId.isValid(_id) ? _id : undefined,
            menuId: mongoose.Types.ObjectId.isValid(menuId) ? menuId : undefined,
            restaurentId: mongoose.Types.ObjectId.isValid(restaurentId) ? restaurentId : undefined,

            $or: [
                {
                    name: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    description: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                }
            ],
        }

        clearSearch(search);

        const menu = await MenuItemModel.find(search).skip((Number(page) - 1) * Number(limit)).limit(limit).sort({ [sortKey]: Number(sortOrder) }).lean();

        const totalFilteredData = await MenuItemModel.find(search).countDocuments();
        const totalData = await MenuItemModel.find({}).countDocuments();

        const extra = {
            page: String(page),
            limit: String(limit),
            totalFilteredData: String(totalFilteredData),
            totalData: String(totalData),
            totalPages: String(Math.ceil(totalFilteredData / limit))
        };

        return NextResponse.json({ status: "success", message: "Menu items fetched successfully", data: { data: menu, extra }, error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(req) {

    let session = null;

    try {

        await connectToDatabase();

        session = await mongoose.startSession();
        session.startTransaction();

        const decoded = await verifyToken(req);

        if (!decoded) {
            return NextResponse.json({ status: 'error', message: "Unauthorized access", data: null, error: "Unauthorized access" }, { status: 401 });
        }

        const { _id } = await req.json();

        if (!_id) {
            return NextResponse.json({ status: "error", message: "_id is required", data: null, error: "_id is required" }, { status: 400 });
        }

        const deleted = await MenuItemModel.findByIdAndDelete(_id, { session });

        if (!deleted) {
            return NextResponse.json({ status: "error", message: "Menu item not found", data: null, error: "Menu item not found" }, { status: 404 });
        }

        await MenuItemModel.updateMany({ restaurentId: deleted.restaurentId, menuId: deleted.menuId, sno: { $gt: deleted.sno } }, { $inc: { sno: -1 } }, { session });

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ status: "success", message: "Menu item deleted successfully", data: null, error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}