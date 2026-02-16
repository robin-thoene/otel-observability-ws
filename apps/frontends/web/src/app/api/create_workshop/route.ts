import { createWorkshop } from "@/helper/workshop_api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const title = body.title;
  const desc = body.description;
  if (!title || !desc) {
    return new Response("You need to provide all the workshop details", {
      status: 400,
    });
  }
  const res = await createWorkshop(title, desc);
  if (res.ok) {
    const result = await res.json();
    return NextResponse.json(result);
  }
  return new Response("Error creating workshop", {
    status: res.status,
  });
}
