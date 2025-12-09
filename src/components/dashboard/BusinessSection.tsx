import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Users, Edit2, Save, X } from "lucide-react";

interface BusinessSectionProps {
  sellerDetails: any;
  onUpdate: () => void;
}

export const BusinessSection = ({ sellerDetails, onUpdate }: BusinessSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [employeesCount, setEmployeesCount] = useState(
    sellerDetails?.employees_count?.toString() || "1"
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!sellerDetails?.id) return;
    
    const count = parseInt(employeesCount);
    if (isNaN(count) || count < 1) {
      toast({
        title: "Erreur",
        description: "Le nombre d'employés doit être au moins 1",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    const { error } = await supabase
      .from("seller_details")
      .update({ employees_count: count } as any)
      .eq("id", sellerDetails.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Nombre d'employés mis à jour",
      });
      setIsEditing(false);
      onUpdate();
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEmployeesCount(sellerDetails?.employees_count?.toString() || "1");
    setIsEditing(false);
  };

  if (!sellerDetails) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mon entreprise</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Informations non disponibles</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Mon entreprise</CardTitle>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "..." : "Enregistrer"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Nom de l'entreprise</label>
            <p className="font-medium">{sellerDetails.business_name}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Type</label>
            <p className="font-medium capitalize">{sellerDetails.business_type?.replace("_", " ")}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Région</label>
            <p className="font-medium capitalize">{sellerDetails.region?.replace("_", " ")}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Secteur</label>
            <p className="font-medium capitalize">{sellerDetails.activity_sector}</p>
          </div>
          {sellerDetails.ninea && (
            <div>
              <label className="text-sm text-muted-foreground">NINEA</label>
              <p className="font-medium">{sellerDetails.ninea}</p>
            </div>
          )}
          <div className="col-span-2 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-secondary" />
              <Label className="text-sm font-medium">Nombre d'employés</Label>
            </div>
            {isEditing ? (
              <Input
                type="number"
                min="1"
                value={employeesCount}
                onChange={(e) => setEmployeesCount(e.target.value)}
                className="max-w-[150px]"
              />
            ) : (
              <p className="text-2xl font-bold text-secondary">
                {sellerDetails.employees_count || 1}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Impact local de votre entreprise
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessSection;
