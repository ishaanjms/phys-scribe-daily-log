
import { useState, useEffect } from "react";
import { Calendar, BookOpen, Plus, Search, FileText, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ObservationForm } from "@/components/ObservationForm";
import { ObservationCard } from "@/components/ObservationCard";
import { StatsCard } from "@/components/StatsCard";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Eureka Notebook</h1>
                <p className="text-sm text-slate-600">Daily Observations & Insights</p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Observations"
            value={observations.length}
            icon={FileText}
            color="blue"
          />
          <StatsCard
            title="Today's Entries"
            value={todayObservations.length}
            icon={Calendar}
            color="green"
          />
          <StatsCard
            title="Active Research"
            value={new Set(observations.map(obs => obs.researcher)).size}
            icon={Beaker}
            color="purple"
          />
        </div>

        {/* Search and Filter */}
        <Card className="mb-8 border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search observations, problems, solutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="sm:w-48">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {(searchTerm || selectedDate) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDate("");
                  }}
                  className="border-slate-300 hover:bg-slate-50"
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Observations List */}
        <div className="space-y-6">
          {filteredObservations.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">
                  {observations.length === 0 ? "No observations yet" : "No matching observations"}
                </h3>
                <p className="text-slate-500 mb-6">
                  {observations.length === 0 
                    ? "Start documenting your research journey by adding your first observation."
                    : "Try adjusting your search terms or date filter."
                  }
                </p>
                {observations.length === 0 && (
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Observation
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                  Research Observations ({filteredObservations.length})
                </h2>
                <Badge variant="secondary" className="bg-slate-200 text-slate-700">
                  {searchTerm && `Filtered by: "${searchTerm}"`}
                  {selectedDate && `Date: ${selectedDate}`}
                </Badge>
              </div>
              
              <div className="grid gap-6">
                {filteredObservations.map((observation) => (
                  <ObservationCard
                    key={observation.id}
                    observation={observation}
                    onDelete={deleteObservation}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Observation Form Modal */}
      {showForm && (
        <ObservationForm
          onSubmit={addObservation}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Index;
