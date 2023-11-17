"use client";

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";
import { DocumentData } from "firebase-admin/firestore";

type ContextProps = {
  userData: DocumentData[] | null;
  setUserData: Dispatch<SetStateAction<DocumentData[] | null>>;
};

const UserDataContext = createContext<ContextProps>({
  userData: null,
  setUserData: () => {},
});

export const UserDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userData, setUserData] = useState<DocumentData[] | null>(
    null
  );

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserDataContext = () => useContext(UserDataContext);
