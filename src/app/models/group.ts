import { User } from "./user";

export interface Group {
    id?: string;
    groupName: string | null | undefined;
    members: any[];
}
