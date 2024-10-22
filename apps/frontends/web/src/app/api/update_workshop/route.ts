import { updateWorkshop } from "@/helper/workshop_api";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const body = await request.json();
  const id = body.id;
  const title = body.title;
  const desc = body.description;
  if (!id || !title || !desc) {
    return new Response("You need to provide all the workshop details", {
      status: 400,
    });
  }
  const res = await updateWorkshop(id, title, desc);
  if (res.ok) {
    const result = await res.json();
    return NextResponse.json(result);
  }
  return new Response("Error updating workshop", {
    status: 500,
  });
}
