import { api } from "@/lib/axios";

interface getProfileResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "admin" | "customer";
  createAt: Date | null;
  updateAt: Date | null;
}

export async function getProfile() {
  const response = await api.get<getProfileResponse>("/me");

  return response.data;
}
