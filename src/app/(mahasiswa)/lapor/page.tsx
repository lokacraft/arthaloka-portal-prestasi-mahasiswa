import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user-actions";
import { getKategoriList, getTingkatList } from "@/server/prestasi-actions";
import LaporForm from "./LaporForm";

export default async function LaporPrestasiPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [kategoriList, tingkatList] = await Promise.all([
    getKategoriList(),
    getTingkatList(),
  ]);

  return (
    <LaporForm
      mahasiswaId={user.mahasiswaId}
      kategoriList={kategoriList}
      tingkatList={tingkatList}
    />
  );
}
