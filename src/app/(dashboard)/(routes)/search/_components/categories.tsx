"use client";

import { Category } from "@prisma/client";
import {
  FcEngineering,
  FcMusic,
  FcFilmReel,
  FcMultipleDevices,
  FcOldTimeCamera,
  FcSportsMode,
  FcSalesPerformance
} from "react-icons/fc"
import { IconType } from "react-icons/lib";
import CategoryItem from "./category-item";


interface CategoriesProps{
  items: Category[]
}

const iconMap: Record<Category["name"], IconType> = {
  "Music": FcMusic,
  "Computer Science": FcMultipleDevices,
  "Engineering": FcEngineering,
  "Accounting": FcSalesPerformance,
  "Filming": FcFilmReel,
  "Photography": FcOldTimeCamera,
  "Fitness": FcSportsMode
}

const Categories = (
  {items}: CategoriesProps
) => {
  return ( 
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map(item => (
        <CategoryItem 
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
}

export default Categories;