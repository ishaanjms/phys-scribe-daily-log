
import { Observation } from "@/pages/Index";
import { ObservationCard } from "@/components/ObservationCard";

interface ObservationsListProps {
  observations: Observation[];
  onEdit: (obs: Observation) => void;
  onDelete: (id: string) => void;
}

export function ObservationsList({
  observations,
  onEdit,
  onDelete
}: ObservationsListProps) {
  return (
    <div className="space-y-4">
      {observations.map((observation) => (
        <ObservationCard
          key={observation.id}
          observation={observation}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
