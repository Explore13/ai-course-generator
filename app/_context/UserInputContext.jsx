import { createContext } from "react";

export const UserInputContext = createContext({
  category: "",
  description: "",
  displayVideo: "",
  duration: "",
  level: "",
  noOfChapters: "",
  topic: "",
  activeInput: false,
});
