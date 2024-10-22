import { deleteWorkshop } from "@/helper/workshop_api";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: number } },
) {
  const wId = params.id;
  if (!wId) {
    return new Response("You need to provide the workshop id", {
      status: 400,
    });
  }
  const res = await deleteWorkshop(wId);
  if (res.ok) {
    return new Response();
  }
  return new Response("Error deleting workshop", {
    status: 500,
  });
}
