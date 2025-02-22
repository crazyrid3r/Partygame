import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";

export default function Impressum() {
  const t = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/crazyrid3r-logo.gif"
              alt="Crazyrid3r Logo"
              className="w-48 h-48 object-contain"
            />
          </div>
          
          <h1 className="text-3xl font-bold mb-6 text-center">
            {t.impressum.title}
          </h1>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Crazyrid3r</h2>
              <p className="text-muted-foreground">
                Website: <a href="https://www.nerdoase.de" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.nerdoase.de</a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">{t.impressum.contact}</h2>
              <p className="text-muted-foreground">
                Email: info@nerdoase.de
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
