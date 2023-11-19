import toast from "react-hot-toast";

export const delay = (time: number) => new Promise((r) => setTimeout(r, time));

export const notify = (message: string) => toast(message);
