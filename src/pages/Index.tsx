
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
  title: string;
  problem: string;
  solution: string;
  outcome: string;
  researcher: string;
  customFields: CustomField[];
}

const Index = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingObservation, setEditingObservation] = useState<Observation | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const savedObservations = localStorage.getItem("physics-observations");
    if (savedObservations) {
      const parsedObservations = JSON.parse(savedObservations);
      // Migrate old observations that don't have a title field
      const migratedObservations = parsedObservations.map((obs: any) => ({
        ...obs,
        title: obs.title || "Untitled Observation" // Add default title if missing
      }));
      setObservations(migratedObservations);
    }
  }, []);

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

  const updateObservation = (updatedObservation: Observation) => {
    setObservations(prev => 
      prev.map(obs => obs.id === updatedObservation.id ? updatedObservation : obs)
    );
    setShowForm(false);
    setEditingObservation(undefined);
  };

  const deleteObservation = (id: string) => {
    setObservations(prev => prev.filter(obs => obs.id !== id));
  };

  const handleEditObservation = (observation: Observation) => {
    setEditingObservation(observation);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingObservation(undefined);
  };

  const filteredObservations = observations.filter(obs => {
    const matchesSearch = 
      (obs.title && obs.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
      <div className="min-h-screen flex w-full bg-white dark:bg-gray-900">
        <AppSidebar 
          onNewEntry={() => setShowForm(true)}
          totalObservations={observations.length}
          todayObservations={todayObservations.length}
        />
        
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search observations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
                />
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              {(searchTerm || selectedDate) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDate("");
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Welcome Back :)</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredObservations.length} observations
                  {searchTerm && ` matching "${searchTerm}"`}
                  {selectedDate && ` from ${selectedDate}`}
                </p>
              </div>

              {filteredObservations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {observations.length === 0 ? "No observations yet" : "No matching observations"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
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
                      onEdit={handleEditObservation}
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
            onUpdate={updateObservation}
            onClose={handleCloseForm}
            editingObservation={editingObservation}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default Index;
