"use client";

import { IWorkshopDetail } from "@/types/workshop";
import { Participants } from "./participants";
import { useRouter } from "next/navigation";
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { toast } from "react-toastify";
import { defErrorMessage } from "@/helper/static_texts";

interface IProps {
  workshop: IWorkshopDetail;
}

export function EditableWorkshop(props: IProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editWorkshop, setEditWorkshop] = useState<IWorkshopDetail>(
    props.workshop,
  );
  const [workshop, setWorkshop] = useState<IWorkshopDetail>(props.workshop);

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full flex justify-between">
        {isEditing ? (
          <input
            value={editWorkshop.title}
            onChange={(e) => {
              const x = { ...editWorkshop };
              x.title = e.target.value;
              setEditWorkshop(x);
            }}
          />
        ) : (
          <h1>{workshop.title}</h1>
        )}
        <div className="flex gap-4">
          {isEditing ? (
            <button
              onClick={() => {
                setIsEditing(false);
                setEditWorkshop({ ...workshop });
              }}
            >
              <XMarkIcon className="size-5" />
            </button>
          ) : (
            <button
              onClick={async () => {
                try {
                  const res = await fetch(
                    `/api/delete_workshop/${workshop.id}`,
                    {
                      method: "DELETE",
                    },
                  );
                  if (!res.ok) {
                    const err = await res.text();
                    toast.error(err && err !== "" ? err : defErrorMessage);
                  } else {
                    router.push("/");
                  }
                } catch {
                  toast.error(defErrorMessage);
                }
              }}
            >
              <TrashIcon className="size-5 text-red-700" />
            </button>
          )}
          <button
            onClick={async () => {
              if (isEditing) {
                try {
                  const body = {
                    id: editWorkshop.id,
                    title: editWorkshop.title,
                    description: editWorkshop.description,
                  };
                  const res = await fetch("/api/update_workshop", {
                    method: "PUT",
                    body: JSON.stringify(body),
                  });
                  if (res.ok) {
                    const updated = (await res.json()) as IWorkshopDetail;
                    setWorkshop({
                      id: updated.id,
                      title: updated.title,
                      description: updated.description,
                      participants: workshop.participants,
                    });
                  } else {
                    const err = await res.text();
                    toast.error(err && err !== "" ? err : defErrorMessage);
                  }
                } catch {
                  toast.error(defErrorMessage);
                } finally {
                  setIsEditing(false);
                }
              } else {
                const curr = { ...workshop };
                setEditWorkshop(curr);
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? (
              <CheckIcon className="size-5" />
            ) : (
              <PencilIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
      <h2>Summary</h2>
      <div className="flex max-w-[800px] min-w-[800px]">
        {isEditing ? (
          <textarea
            rows={15}
            className="min-w-full"
            value={editWorkshop.description}
            onChange={(e) => {
              const x = { ...editWorkshop };
              x.description = e.target.value;
              setEditWorkshop(x);
            }}
          />
        ) : (
          <p className="min-w-full">{workshop.description}</p>
        )}
      </div>
      <Participants
        workshopId={workshop.id}
        participants={workshop.participants}
        updateParticipants={(users) => {
          const x = { ...workshop };
          x.participants = users;
          setWorkshop(x);
        }}
      />
    </div>
  );
}
