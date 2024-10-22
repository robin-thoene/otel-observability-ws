import { getWorkshop } from "@/helper/workshop_api";
import { notFound } from "next/navigation";
import { HomeIcon } from "@heroicons/react/24/solid";
import { EditableWorkshop } from "@/components/editableWorkshop";

export default async function WorkshopDetail({
  params,
}: {
  params: { id: number };
}) {
  const workshop = await getWorkshop(params.id);
  if (!workshop) {
    notFound();
  }
  return (
    <div className="flex flex-col items-center">
      <a href="/" className="fixed top-4 left-4">
        <HomeIcon className="size-5" />
      </a>
      <EditableWorkshop workshop={workshop} />
    </div>
  );
}
