import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";

export default function AdminHome() {
    return (
        <div className="p-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Dashboard admin</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul>
                        <li><Link href="admin/article">Gérer les articles</Link></li>
                        <li><Link href="admin/category">Gérer les catégories</Link></li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
