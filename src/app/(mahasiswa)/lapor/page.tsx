export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user-actions";
import { getKategoriList, getTingkatList, getProgramStudiList } from "@/server/prestasi-actions";
import LaporForm from "./LaporForm";

export default async function LaporPrestasiPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [kategoriList, tingkatList, programStudiList] = await Promise.all([
    getKategoriList(),
    getTingkatList(),
    getProgramStudiList(),
  ]);

  return (
    <LaporForm
      mahasiswaId={user.mahasiswaId}
      nim={user.nim}
      kategoriList={kategoriList}
      tingkatList={tingkatList}
      programStudiList={programStudiList}
    />
  );
}
