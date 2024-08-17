import { IconBadge } from "@/components/icon-badge";
import { LucideIcon } from "lucide-react"

interface InfoCardProps {
  variant?: "default" | "success";
  icon: LucideIcon;
  label: string;
  numberOfItems: number
}
export const InfoCard = ({
  icon: Icon,
  label,
  variant,
  numberOfItems
}: InfoCardProps) => {
  return (
    <div className="border rounded-md gap-x-2 flex items-center p-3">
      <IconBadge 
        variant={variant}
        icon={Icon}
      />
      <div>
        <p className="font-medium">
          {label}
        </p>
        <p className="text-gray-500 text-sm">
          {numberOfItems} {numberOfItems === 1? "Course": "Course"}
        </p>
      </div>
    </div>
  )
}