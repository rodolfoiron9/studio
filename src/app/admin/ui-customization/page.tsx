
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function UICustomizationPage() {
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-4 font-headline">UI Customization</h1>
            <p className="text-muted-foreground mb-8">Customize the look and feel of your app.</p>
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>This section is under construction. Check back later for UI customization options.</CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
