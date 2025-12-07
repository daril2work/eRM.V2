import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "lucide-react"; // Wait, lucide doesn't have Badge. Shadcn has Badge. I don't have Badge. I'll make a simple span or create Badge later.
// I'll use simple span for now.

interface CardRMProps {
    patientName: string;
    noRM: string;
    age: number; // calculated
    gender: string;
    poli: string;
    status: string;
    onProcess?: () => void;
}

export function CardRM({ patientName, noRM, age, gender, poli, status, onProcess }: CardRMProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{patientName}</CardTitle>
                        <p className="text-sm text-slate-500 font-mono">{noRM}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${status === 'menunggu' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {status}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm space-y-1">
                <p>{gender === 'L' ? 'Laki-laki' : 'Perempuan'}, {age} Th</p>
                <p className="text-slate-500">Poli {poli}</p>
            </CardContent>
            <CardFooter className="p-4 pt-2">
                {onProcess && (
                    <Button className="w-full" onClick={onProcess}>
                        Proses
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
