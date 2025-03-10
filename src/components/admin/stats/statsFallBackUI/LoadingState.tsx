import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-96 rounded-lg" />
                <Skeleton className="h-96 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-80 rounded-lg" />)}
            </div>
        </div>
    )
} 