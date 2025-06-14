import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ObservationForm } from "@/components/ObservationForm";
import { ObservationCard } from "@/components/ObservationCard";
import { AppSidebar } from "@/components/AppSidebar";

export interface CustomField {
  id: string;
  type: 'number' | 'table' | 'text';
  label: string;
  value: string | number | string[][];
}

export interface Observation {
  id: string;
  date: string;
  problem: string;
  solution: string;
  outcome: string;
  tags: string[];
  researcher: string;
  customFields: CustomField[];
}

const Index = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Load observations from localStorage on component mount
  useEffect(() => {
    const savedObservations = localStorage.getItem("physics-observations");
    if (savedObservations) {
      setObservations(JSON.parse(savedObservations));
    }
  }, []);

  // Save observations to localStorage whenever observations change
  useEffect(() => {
    localStorage.setItem("physics-observations", JSON.stringify(observations));
  }, [observations]);

  const addObservation = (observation: Omit<Observation, "id">) => {
    const newObservation = {
      ...observation,
      id: Date.now().toString(),
    };
    setObservations(prev => [newObservation, ...prev]);
    setShowForm(false);
  };

  const deleteObservation = (id: string) => {
    setObservations(prev => prev.filter(obs => obs.id !== id));
  };

  const filteredObservations = observations.filter(obs => {
    const matchesSearch = 
      obs.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.solution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.outcome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.researcher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.customFields.some(field => 
        field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(field.value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesDate = selectedDate ? obs.date === selectedDate : true;
    
    return matchesSearch && matchesDate;
  });

  const todayObservations = observations.filter(obs => 
    obs.date === new Date().toISOString().split('T')[0]
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <AppSidebar 
          onNewEntry={() => setShowForm(true)}
          totalObservations={observations.length}
          todayObservations={todayObservations.length}
        />
        
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search observations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40 border-gray-200"
              />
              {(searchTerm || selectedDate) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDate("");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear
                </Button>
              )}
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Research Observations</h1>
                <p className="text-gray-600">
                  {filteredObservations.length} observations
                  {searchTerm && ` matching "${searchTerm}"`}
                  {selectedDate && ` from ${selectedDate}`}
                </p>
              </div>

              {filteredObservations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {observations.length === 0 ? "No observations yet" : "No matching observations"}
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    {observations.length === 0 
                      ? "Start documenting your research journey by creating your first observation."
                      : "Try adjusting your search terms or date filter."
                    }
                  </p>
                  {observations.length === 0 && (
                    <Button
                      onClick={() => setShowForm(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create first observation
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredObservations.map((observation) => (
                    <ObservationCard
                      key={observation.id}
                      observation={observation}
                      onDelete={deleteObservation}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </SidebarInset>

        {showForm && (
          <ObservationForm
            onSubmit={addObservation}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default Index;
