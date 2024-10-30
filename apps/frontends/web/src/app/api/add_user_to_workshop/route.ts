import { addParticipant } from "@/helper/workshop_api";

export async function POST(request: Request) {
  const body = await request.json();
  const uId = body.userId;
  const wId = body.workshopId;
  if (!uId || !wId) {
    return new Response("You need to provide all the details", {
      status: 400,
    });
  }
  const res = await addParticipant(wId, uId);
  if (res.ok) {
    return new Response();
  }
  return new Response("Error adding user to workshop", {
    status: 500,
  });
}
