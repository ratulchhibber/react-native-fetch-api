import { atom } from "recoil";

export const productsState = atom({
  key: "productsState",
  default: [],
});

export const isLoadingState = atom({
  key: "isLoadingState",
  default: false,
});

export const errorMessageState = atom({
  key: "errorMessageState",
  default: "",
});

export const pageState = atom({
  key: "pageState",
  default: 1,
});

export const searchQueryState = atom({
  key: "searchQueryState",
  default: "",
});
