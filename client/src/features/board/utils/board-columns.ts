export const BOARD_COLUMNS = [
  {
    id: "APPLIED",
    title: "Applied",
  },
  {
    id: "INTERVIEW",
    title: "Interview",
  },
  {
    id: "OFFER",
    title: "Offer",
  },
  {
    id: "REJECTED",
    title: "Rejected",
  },
] as const;

export type BoardColumnId = (typeof BOARD_COLUMNS)[number]["id"];
