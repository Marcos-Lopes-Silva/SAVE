import { createContext, useContext } from "react";

// Lets leaf question components (Text/TextArea/Number) trigger an immediate
// progress save on blur, instead of relying on the whole-form keystroke
// watcher used for discrete answers (radio/checkbox/select/etc).
export const AutosaveContext = createContext<() => void>(() => {});

export const useAutosave = () => useContext(AutosaveContext);
