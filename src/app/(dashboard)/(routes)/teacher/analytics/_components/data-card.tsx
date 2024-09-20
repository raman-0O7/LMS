import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { priceFormat } from "@/lib/format";

interface DataCardProps {
  label: string;
  value: number;
  shouldFormat?: boolean;
}
export const DataCard = ({
  label,
  value,
  shouldFormat
}: DataCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent >
        <div className="text-2xl font-bold">
          { shouldFormat? priceFormat(value): value}

        </div>
      </CardContent>
    </Card>
  )
}