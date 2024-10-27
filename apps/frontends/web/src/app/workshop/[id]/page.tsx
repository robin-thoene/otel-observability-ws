import { getWorkshop } from "@/helper/workshop_api";
import { notFound } from "next/navigation";
import { HomeIcon } from "@heroicons/react/24/solid";
import { EditableWorkshop } from "@/components/editableWorkshop";
import { IUser } from "@/types/user";
import { getUsers } from "@/helper/user_api";

export default async function WorkshopDetail({
  params,
}: {
  params: { id: number };
}) {
  const workshop = await getWorkshop(params.id);
  const users: IUser[] = await getUsers() ?? [];
  if (!workshop) {
    notFound();
  }
  return (
    <div className="flex flex-col items-center">
      <a href="/" className="fixed top-4 left-4">
        <HomeIcon className="size-5" />
      </a>
      <EditableWorkshop workshop={workshop} users={users}/>
    </div>
  );
}
