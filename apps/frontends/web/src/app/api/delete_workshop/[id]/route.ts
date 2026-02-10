import { deleteWorkshop } from "@/helper/workshop_api";
import { NextRequest } from "next/server";

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const pId = (await context.params).id;

  if (!pId) {
    return new Response("You need to provide the workshop id", {
      status: 400,
    });
  }
  const wId = parseInt(pId);

  const res = await deleteWorkshop(wId);
  if (res.ok) {
    return new Response();
  }
  return new Response("Error deleting workshop", {
    status: 500,
  });
}
