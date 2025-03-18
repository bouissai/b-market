import { startOfMonth, startOfWeek, startOfYear, subDays, endOfDay } from "date-fns";
import { resetToMidnight } from "./statsHelpers";
import { DateRange, StatsPeriod } from "@/types/stats";

export function calculateDateRanges(period: StatsPeriod): {
    current: DateRange;
    previous: DateRange;
} | null {
    const today = new Date();
    
    switch (period) {
        case "today": {
            const startDate = resetToMidnight(today);
            const endDate = endOfDay(today);
            return {
                current: { startDate, endDate },
                previous: {
                    startDate: resetToMidnight(subDays(today, 1)),
                    endDate: endOfDay(subDays(today, 1))
                }
            };
        }
        
        case "week": {
            const startDate = resetToMidnight(startOfWeek(today, { weekStartsOn: 1 }));
            const endDate = endOfDay(today);
            
            // Calcul du nombre de jours depuis le début de la semaine
            const daysSinceStartOfWeek = Math.floor(
                (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            
            const previousEndDate = endOfDay(subDays(startDate, 1));
            const previousStartDate = resetToMidnight(subDays(previousEndDate, daysSinceStartOfWeek));
            
            return {
                current: { startDate, endDate },
                previous: { startDate: previousStartDate, endDate: previousEndDate }
            };
        }
        
        case "month": {
            const startDate = resetToMidnight(startOfMonth(today));
            const endDate = endOfDay(today);
            
            // Calcul du nombre de jours depuis le début du mois
            const daysSinceStartOfMonth = Math.floor(
                (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            
            const previousEndDate = endOfDay(subDays(startDate, 1));
            const previousStartDate = resetToMidnight(subDays(previousEndDate, daysSinceStartOfMonth));
            
            return {
                current: { startDate, endDate },
                previous: { startDate: previousStartDate, endDate: previousEndDate }
            };
        }
        
        case "year": {
            const startDate = resetToMidnight(startOfYear(today));
            const endDate = endOfDay(today);
            
            // Calcul du nombre de jours depuis le début de l'année
            const daysSinceStartOfYear = Math.floor(
                (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            
            const previousEndDate = endOfDay(subDays(startDate, 1));
            const previousStartDate = resetToMidnight(subDays(previousEndDate, daysSinceStartOfYear));
            
            return {
                current: { startDate, endDate },
                previous: { startDate: previousStartDate, endDate: previousEndDate }
            };
        }
        
        default:
            return null;
    }
} 