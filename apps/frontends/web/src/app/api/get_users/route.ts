import { getUsers } from "@/helper/user_api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchTerm = request.nextUrl.searchParams.get("s");
  const res = await getUsers(searchTerm);
  if (res) {
    return NextResponse.json(res);
  }
  return new Response("Error getting users", {
    status: 500,
  });
}
