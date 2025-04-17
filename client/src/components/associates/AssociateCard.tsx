import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { UserCircle, MoreVertical } from "lucide-react";
import { type Associate, type Mission, type Indicator } from "@shared/schema";

interface AssociateCardProps {
  associate: Associate;
  missions: Mission[];
  indicators: Indicator[];
}

export default function AssociateCard({ associate, missions, indicators }: AssociateCardProps) {
  // Helper to get profession display name
  const getProfessionName = (profession: string) => {
    switch (profession) {
      case "doctor": return "Médecin généraliste";
      case "pharmacist": return "Pharmacien";
      case "nurse": return "Infirmier(e)";
      case "physiotherapist": return "Kinésithérapeute";
      default: return "Autre professionnel";
    }
  };
  
  // Calculate mission completion
  const totalMissions = missions.length;
  const completedMissions = missions.filter(m => m.status === "validated").length;
  const completionPercentage = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;
  
  // Calculate total compensation
  const totalCompensation = missions.reduce((sum, mission) => sum + mission.compensation, 0);
  
  // Get top 3 missions to display
  const topMissions = missions.slice(0, 3).map(mission => {
    const indicator = indicators.find(i => i.id === mission.indicatorId);
    return {
      ...mission,
      indicatorName: indicator ? indicator.name : "Unknown",
      status: mission.status
    };
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated": return "bg-green-600";
      case "in_progress": return "bg-amber-500";
      case "not_validated": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };
  
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
              <UserCircle size={32} />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-800">Dr. {associate.firstName} {associate.lastName}</h3>
              <p className="text-sm text-gray-600">{getProfessionName(associate.profession)}</p>
            </div>
          </div>
          <div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Missions complétées</span>
            <span className="font-medium">{completedMissions}/{totalMissions}</span>
          </div>
          <Progress value={completionPercentage} className="h-2 bg-gray-200" />
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Missions assignées</h4>
          <div className="space-y-2">
            {topMissions.map((mission) => (
              <div key={mission.id} className="flex items-center">
                <span className={`h-2 w-2 rounded-full ${getStatusColor(mission.status)} mr-2`}></span>
                <span className="text-sm text-gray-600">{mission.indicatorName}</span>
              </div>
            ))}
            {missions.length > 3 && (
              <div className="text-sm text-gray-500 italic">
                + {missions.length - 3} autres missions
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">Rémunération totale</p>
              <p className="text-xl font-bold text-gray-900">{totalCompensation.toLocaleString('fr-FR')} €</p>
            </div>
            <Button variant="outline" size="sm">
              Détails
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
