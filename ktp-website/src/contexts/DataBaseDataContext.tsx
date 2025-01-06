import { createContext } from "react";

interface DataBaseDataContextType {
    userData: any;
    pictureData: any;
}

export const DataBaseDataContext = createContext<DataBaseDataContextType | null>(null);

