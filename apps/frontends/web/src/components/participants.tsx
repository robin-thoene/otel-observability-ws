"use client";

import { IUser } from "@/types/user";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { defErrorMessage } from "@/helper/static_texts";

interface IProps {
  workshopId: number;
  participants: IUser[];
  updateParticipants: (p: IUser[]) => void;
}

export function Participants(props: IProps) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <h2>Participants</h2>
      <div>
        {props.participants.map((p) => (
          <div
            className="flex justify-between items-center gap-4 border rounded-xl border-white p-4 mb-4"
            key={`w-${props.workshopId}-p-${p.id}`}
          >
            <div>{`${p.firstName} ${p.lastName}`}</div>
            <button
              className="flex items-center justify-center"
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true);
                try {
                  const body = {
                    workshopId: props.workshopId,
                    userId: p.id,
                  };
                  const res = await fetch("/api/remove_participant", {
                    method: "DELETE",
                    body: JSON.stringify(body),
                  });
                  if (res.ok) {
                    const idx = props.participants.findIndex(
                      (x) => x.id === p.id,
                    );
                    const x = [...props.participants];
                    x.splice(idx, 1);
                    props.updateParticipants(x);
                  } else {
                    const err = await res.text();
                    toast.error(err && err !== "" ? err : defErrorMessage);
                  }
                } catch {
                  toast.error(defErrorMessage);
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <TrashIcon className="size-5" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
