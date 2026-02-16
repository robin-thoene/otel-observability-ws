import { removeParticipant } from "@/helper/workshop_api";

export async function DELETE(request: Request) {
  const body = await request.json();
  const wId = body.workshopId;
  const uId = body.userId;
  if (!wId || !uId) {
    return new Response("You need to provide the workshop and user id", {
      status: 400,
    });
  }
  const res = await removeParticipant(wId, uId);
  if (res.ok) {
    return new Response();
  }
  return new Response("Error deleting participant", {
    status: res.status,
  });
}
