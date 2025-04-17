import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Download, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import IndicatorTable from "@/components/indicators/IndicatorTable";
import IndicatorForm from "@/components/indicators/IndicatorForm";

export default function Indicators() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewIndicatorFormOpen, setIsNewIndicatorFormOpen] = useState(false);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/indicators"],
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Erreur lors du chargement des indicateurs</p>
      </div>
    );
  }
  
  // Filter indicators based on active tab and search query
  const filteredIndicators = data.filter((indicator: any) => {
    const matchesTab = activeTab === "all" || indicator.type === activeTab;
    const matchesSearch = searchQuery === "" || 
      indicator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      indicator.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Indicateurs ACI</h1>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Input 
              type="text"
              placeholder="Rechercher un indicateur..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsNewIndicatorFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Indicateur
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="core">Indicateurs socles</TabsTrigger>
          <TabsTrigger value="optional">Indicateurs optionnels</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <IndicatorTable indicators={filteredIndicators} />
        </TabsContent>
      </Tabs>
      
      {/* Formulaire pour créer un nouvel indicateur */}
      <IndicatorForm
        isOpen={isNewIndicatorFormOpen}
        onClose={() => setIsNewIndicatorFormOpen(false)}
      />
    </div>
  );
}
