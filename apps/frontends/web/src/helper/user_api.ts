import { IUser } from "@/types/user";

const API_BASE_URL = "http://localhost:5046";

export async function getUsers(searchTerm?: string | null) {
  let url = `${API_BASE_URL}/users`;
  if (searchTerm) {
    url = `${url}?s=${searchTerm}`;
  }
  const response = await fetch(url, {
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as IUser[];
}
