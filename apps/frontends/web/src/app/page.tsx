import { CreateNewWorkshop } from "@/components/createNewWorkshop";
import { getWorkshops } from "@/helper/workshop_api";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default async function Home() {
  const availableWorkshops = await getWorkshops();
  return (
    <div className="flex justify-center w-screen">
      <div className="flex flex-col gap-6 justify-center w-full max-w-screen-md">
        <h1>Workshop overview</h1>
        <div className="flex flex-col w-full">
          {availableWorkshops?.map((ws) => (
            <a key={`ws-${ws.id}`} href={`/workshop/${ws.id}`}>
              <div className="flex justify-between items-center gap-6 border rounded-xl border-white p-4 mb-4 w-full">
                <div>{ws.title}</div>
                <ArrowRightIcon className="size-5" />
              </div>
            </a>
          ))}
        </div>
        <CreateNewWorkshop />
      </div>
    </div>
  );
}
