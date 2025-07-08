import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { url, content } = body;

  console.log("📥 Received payload:", body);

  try {
    const client = await clientPromise;
    const db = client.db("blogs");
    const collection = db.collection("fullContent");

    const result = await collection.insertOne({
      url,
      content,
      createdAt: new Date(),
    });

    console.log("✅ MongoDB insert result:", result);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ MongoDB insert failed:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
