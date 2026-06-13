import { createContext, useContext, useEffect, useState, } from "react";
import type { ReactNode } from 'react';
import type { Campus } from "../types/campus";
import type { Category } from "../types/category";
import { lookupService } from "../services/lookupService";

interface LookupContextType {
  campuses: Campus[];
  categories: Category[];
  campusesMap: Record<number, string>;
  categoriesMap: Record<number, string>;
  isLoading: boolean;
}

const LookupContext = createContext<LookupContextType | undefined>(undefined);

export const LookupProvider = ({ children }: { children: ReactNode }) => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([lookupService.getCampuses(), lookupService.getCategories()])
      .then(([campusesData, categoriesData]) => {
        setCampuses(campusesData);
        setCategories(categoriesData);
      })
      .catch(error => console.error("Ошибка загрузки справочников:", error))
      .finally(() => setIsLoading(false));
  }, []);

  // Преобразование массивов в словари для мгновенного поиска по ID
  const campusesMap = campuses.reduce((acc, campus) => {
    acc[campus.id] = campus.address;
    return acc;
  }, {} as Record<number, string>);

  const categoriesMap = categories.reduce((acc, category) => {
    acc[category.id] = category.name;
    return acc;
  }, {} as Record<number, string>);

  return (
    <LookupContext.Provider value={{ campuses, categories, campusesMap, categoriesMap, isLoading }}>
      {children}
    </LookupContext.Provider>
  );
};

// Хук для доступа к данным из любого компонента
export const useLookup = () => {
  const context = useContext(LookupContext);
  if (context === undefined) {
    throw new Error('useLookup должен использоваться внутри LookupProvider');
  }
  return context;
};
