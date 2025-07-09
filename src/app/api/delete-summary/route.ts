import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    console.log("🧪 Deleting summary with id:", id);

    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.from("summaries").delete().eq("id", id);

    if (error) {
      console.error("❌ Supabase delete error:", error.message);
      return NextResponse.json(
        { success: false, message: "Failed to delete from Supabase" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Deleted from Supabase" });
  } catch (err) {
    console.error("❌ DELETE route error:", err);
    return NextResponse.json(
      { success: false, message: "Server error while deleting" },
      { status: 500 }
    );
  }
}
