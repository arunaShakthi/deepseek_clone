import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req){
    const wh = new Webhook(process.env.SIGNING_SECRET)
    const hederPayload = await headers()
    const svixHeaders = {
        "svix-id": hederPayload.get(svix-id),
        "svix-timestamp": hederPayload.get(svix-timestamp),
        "svix-signature": hederPayload.get(svix-signature)
    };

    //get the payload and verify

    const payload = await req.json();
    const body = JSON.stringify(payload);
    const {data, type} = wh.verify(body, svixHeaders)

    //prepare the user data to be saved in the database

    const userData = {
        _id: data.id,
        email: data.email_address[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
    };

    await connectDB();


    switch (type) {
        case 'user.created':
            await User.create(userData)
         break;
        case 'user.updated':
            await User.findByIdAndUpdate(data.id, userData)
        break;
        case 'user.deleted':
            await User.findByIdAndDelete(data.id)
        break;
            
        default:
            break;
    }

    return NextRequest.json({message: 'Event Received'});
}