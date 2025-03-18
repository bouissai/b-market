import { ArrowDown, ArrowUp } from "lucide-react"

  // Composant pour afficher un indicateur de tendance
 export const TrendIndicator = ({ value }: { value: number }) => {
    if (value > 0) {
      return (
        <span className="flex items-center !text-emerald-600">
          <ArrowUp className="!text-emerald-600 h-4 w-4 mr-1" />
          {value}%
        </span>
      )
    } else if (value < 0) {
      return (
        <span className="flex items-center !text-red-600">
          <ArrowDown className="!text-red-600 h-4 w-4 mr-1" />
          {Math.abs(value)}%
        </span>
      )
    }
    return <span className="!text-gray-500">0%</span>
  }


export  const resetToMidnight = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
};
