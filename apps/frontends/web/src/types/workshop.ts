import { IUser } from "./user";

interface IWorkshop {
  id: number;
  title: string;
}

interface IWorkshopDetail extends IWorkshop {
  description: string;
  participants: IUser[];
}

export type { IWorkshop, IWorkshopDetail };
