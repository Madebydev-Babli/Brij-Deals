import { NextResponse } from "next/server";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import mongoose from "mongoose";
import { clearSearch, getErrorMessage } from "@/utility/server-utility";
import { RestaurentModel } from "../../../../backend/models/restaurent";
import { MenuModel } from "../../../../backend/models/menu";
import { MenuItemModel } from "../../../../backend/models/menuItem";

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

        const { _id, restaurentId, sno, category } = await req.json();
        const maxSno = await MenuModel.findOne({ restaurentId }).sort({ sno: -1 });

        const restaurant = await RestaurentModel.findById(restaurentId);

        if (!restaurant) {
            return NextResponse.json({ status: "error", message: "Restaurant not found", data: null, error: "Restaurant not found" }, { status: 404 });
        }

        if (!category) {
            return NextResponse.json({ status: "error", message: "Category is required", data: null, error: "Category is required" }, { status: 400 });
        }

        if (_id) {

            if (!sno) {
                return NextResponse.json({ status: "error", message: "S No is required", data: null, error: "S No is required" }, { status: 400 });
            }

            const menu = await MenuModel.findById(_id);

            if (!menu) {
                return NextResponse.json({ status: "error", message: "Menu not found", data: null, error: "Menu not found" }, { status: 404 });
            }

            if (sno < menu.sno) {
                await MenuModel.updateMany({ sno: { $gte: sno, $lt: menu.sno } }, { $inc: { sno: 1 } }, { session });
            }

            if (sno > menu.sno) {
                await MenuModel.updateMany({ sno: { $gt: menu.sno, $lte: sno } }, { $inc: { sno: -1 } }, { session });
            }

            await MenuModel.findByIdAndUpdate(_id,
                {
                    sno: maxSno.sno >= sno ? sno : maxSno.sno,
                    restaurentId,
                    category,
                }, { new: true, session });

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json({ status: "success", message: "Menu updated successfully", data: null, error: null }, { status: 200 });

        } else {

            const snoPresent = await MenuModel.findOne({ restaurentId, sno });

            if (snoPresent) {
                await MenuModel.updateMany({ sno: { $gte: sno } }, { $inc: { sno: 1 } }, { session });
            }

            const newMenu = new MenuModel({
                sno: sno ? sno : maxSno?.sno ? maxSno?.sno + 1 : 1,
                restaurentId,
                category
            });

            await newMenu.save({ session });

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json({ status: "success", message: "Menu added successfully", data: null, error: null }, { status: 201 });
        }

    } catch (error) {
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}

export async function GET(req) {

    try {

        await connectToDatabase();

        const { searchParams } = new URL(req.url);

        const { _id, sortOrder = -1, sortKey = "createdAt", limit = 10, page = 1, searchValue = "", restaurentId } = Object.fromEntries(searchParams.entries());

        const search = {

            _id: mongoose.Types.ObjectId.isValid(_id) ? _id : undefined,
            restaurentId: mongoose.Types.ObjectId.isValid(restaurentId) ? restaurentId : undefined,

            $or: [
                {
                    category: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
            ],
        }

        clearSearch(search);

        const menu = await MenuModel.find(search).skip((Number(page) - 1) * Number(limit)).limit(limit).sort({ [sortKey]: Number(sortOrder) }).lean();

        const totalFilteredData = await MenuModel.find(search).countDocuments();
        const totalData = await MenuModel.find({}).countDocuments();

        const extra = {
            page: String(page),
            limit: String(limit),
            totalFilteredData: String(totalFilteredData),
            totalData: String(totalData),
            totalPages: String(Math.ceil(totalFilteredData / limit))
        };

        return NextResponse.json({ status: "success", message: "Menu fetched successfully", data: { data: menu, extra }, error: null }, { status: 200 });

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

        const deleted = await MenuModel.findByIdAndDelete(_id, { session });


        if (!deleted) {
            return NextResponse.json({ status: "error", message: "Menu not found", data: null, error: "Menu not found" }, { status: 404 });
        }

        await MenuModel.updateMany({ sno: { $gt: deleted.sno } }, { $inc: { sno: -1 } }, { session });
        await MenuItemModel.deleteMany({ menuId: _id }, { session });

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ status: "success", message: "Menu deleted successfully", data: null, error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}