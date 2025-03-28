import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Chat from "@/models/Chat";

export async function POST(req) {

    try {
        const {userId} = getAuth();
        const {chatId} = await req.json();

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User not authenticated"
            })
        }

        // Connect to the database and delete the chat
        
        await connectDB();
        await Chat.deleteOne({_id:chatId})

        return NextResponse.json({success: true, message: "Chat Deleted"})

    } catch (error) {
        return NextResponse.json({success: false, error: error.message})
    }
}