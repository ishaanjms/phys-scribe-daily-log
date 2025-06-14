import { useState, useEffect } from "react";
import { Search, Plus, Rocket, Dog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ObservationForm } from "@/components/ObservationForm";
import { ObservationCard } from "@/components/ObservationCard";
import { AppSidebar } from "@/components/AppSidebar";
import { ObservationHeader } from "@/components/ObservationHeader";
import { EmptyState } from "@/components/EmptyState";
import { ObservationsList } from "@/components/ObservationsList";
import { Select } from "@/components/ui/select";
import { format } from "date-fns"; // import date-fns format

export interface CustomField {
  id: string;
  type: 'number' | 'table' | 'text';
  label: string;
  value: string | number | string[][];
}

export interface Observation {
  id: string;
  date: string;
  time: string; // <--- Added this line
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
  const [sortKey, setSortKey] = useState<"date" | "researcher">("date");

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

  // Sort observations based on sortKey
  const sortedObservations = [...observations].sort((a, b) => {
    if (sortKey === "date") {
      return b.date.localeCompare(a.date) || b.time.localeCompare(a.time);
    }
    if (sortKey === "researcher") {
      return a.researcher.localeCompare(b.researcher);
    }
    return 0;
  });

  const filteredObservations = sortedObservations.filter(obs => {
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

  // Format today's date as "14 June, 2025"
  const todayDisplay = format(new Date(), "d MMMM, yyyy");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white dark:bg-gray-900">
        <AppSidebar 
          onNewEntry={() => setShowForm(true)}
          totalObservations={observations.length}
          todayObservations={todayObservations.length}
          sortKey={sortKey}
          setSortKey={setSortKey}
        />
        
        <SidebarInset className="flex-1">
          <ObservationHeader
            searchTerm={searchTerm}
            selectedDate={selectedDate}
            onSearchTerm={setSearchTerm}
            onDate={setSelectedDate}
            onClear={() => {
              setSearchTerm("");
              setSelectedDate("");
            }}
            onNew={() => setShowForm(true)}
          />

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto w-full">
              <div className="mb-8 w-full text-left">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Welcome Back :)
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {todayDisplay}
                </p>
              </div>

              {filteredObservations.length === 0 ? (
                <EmptyState
                  observationsCount={observations.length}
                  onCreate={() => setShowForm(true)}
                  onClear={() => {
                    setSearchTerm("");
                    setSelectedDate("");
                  }}
                  searchActive={Boolean(searchTerm || selectedDate)}
                />
              ) : (
                <ObservationsList
                  observations={filteredObservations}
                  onEdit={handleEditObservation}
                  onDelete={deleteObservation}
                />
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
