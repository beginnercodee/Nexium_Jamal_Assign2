import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/createClient"; // ✅ updated import

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    console.log("🧪 Deleting summary with id:", id);

    const { error } = await supabase.from("summaries").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error.message);
      return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
    }

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE handler error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
