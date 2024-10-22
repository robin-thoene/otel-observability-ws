import { IWorkshop, IWorkshopDetail } from "@/types/workshop";

const API_BASE_URL = "http://localhost:6046";

export async function getWorkshops() {
  const response = await fetch(`${API_BASE_URL}/workshops`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as IWorkshop[];
}

export async function getWorkshop(id: number) {
  const response = await fetch(`${API_BASE_URL}/workshops/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as IWorkshopDetail;
}

export async function removeParticipant(workshopId: number, userId: number) {
  return await fetch(
    `${API_BASE_URL}/workshops/${workshopId}/participant/${userId}`,
    {
      method: "DELETE",
    },
  );
}

export async function updateWorkshop(
  id: number,
  title: string,
  description: string,
) {
  const body = {
    id,
    title,
    description,
    participants: [],
  };
  return await fetch(`${API_BASE_URL}/workshops`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function deleteWorkshop(id: number) {
  return await fetch(`${API_BASE_URL}/workshops/${id}`, {
    method: "DELETE",
  });
}

export async function createWorkshop(title: string, description: string) {
  const body = {
    title,
    description,
  };
  return await fetch(`${API_BASE_URL}/workshops`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
