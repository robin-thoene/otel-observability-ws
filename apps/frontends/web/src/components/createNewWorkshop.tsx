"use client";

import { defErrorMessage } from "@/helper/static_texts";
import { IWorkshopDetail } from "@/types/workshop";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export function CreateNewWorkshop() {
  const router = useRouter();
  const [workshop, setWorkshop] = useState<IWorkshopDetail>({
    id: 0,
    title: "",
    description: "",
    participants: [],
  });

  const isSubmitEnabled = useMemo(
    () => workshop.title && workshop.description,
    [workshop.description, workshop.title],
  );

  return (
    <div className="gap-6 flex flex-col">
      <h2 className="text-center">Create new workshop</h2>
      <input
        className="w-full"
        value={workshop?.title}
        onChange={(e) => {
          const x = { ...workshop };
          x.title = e.target.value;
          setWorkshop(x);
        }}
      />
      <textarea
        rows={15}
        className="min-w-full"
        value={workshop?.description}
        onChange={(e) => {
          const x = { ...workshop };
          x.description = e.target.value;
          setWorkshop(x);
        }}
      />
      <button
        disabled={!isSubmitEnabled}
        className="rounded-lg border border-sky-500 text-sky-500 disabled:opacity-75"
        onClick={async () => {
          try {
            const body = {
              title: workshop.title,
              description: workshop.description,
            };
            const res = await fetch("/api/create_workshop", {
              method: "POST",
              body: JSON.stringify(body),
            });
            if (res.ok) {
              setWorkshop({
                id: 0,
                title: "",
                description: "",
                participants: [],
              });
              // because I am lazy
              router.refresh();
            } else {
              const err = await res.text();
              toast.error(err && err !== "" ? err : defErrorMessage);
            }
          } catch {
            toast.error(defErrorMessage);
          }
        }}
      >
        create
      </button>
    </div>
  );
}
