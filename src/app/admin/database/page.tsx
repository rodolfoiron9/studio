
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DatabasePage() {
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-4 font-headline">Data Management</h1>
            <p className="text-muted-foreground mb-8">Manage your application's data.</p>
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>This section is under construction. Check back later for data management features.</CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
