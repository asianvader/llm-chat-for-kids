"use client";
/**
 * This file contains the implementation of the UserDataProvider component and the useUserDataContext hook.
 * The UserDataProvider component is responsible for providing the user data context to its children components.
 * The useUserDataContext hook is used to access the user data context within functional components.
 */

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState
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
