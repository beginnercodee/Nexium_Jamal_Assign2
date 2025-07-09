import connectToDatabase from "@/lib/mongodb"; // ✅ Correct
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Received payload:", body);

    const db = await connectToDatabase();
    const result = await db.collection("summaries").insertOne(body);

    console.log("✅ MongoDB insert result:", result);

    return NextResponse.json({ message: "Saved", insertedId: result.insertedId });
  } catch (error) {
    console.error("❌ Failed to save:", error);
    return NextResponse.json({ message: "Failed to save" }, { status: 500 });
  }
}

console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("MONGODB_URI:", process.env.MONGODB_URI);
