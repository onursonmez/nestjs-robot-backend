import { Load } from "src/schemas/load.schema";

export class CreateJobTemplateDto {
  name: string;
  graphId: string;
  trackCarrierPosition: boolean;
  serialNumber?: string;
  robotTypes?: string[];
  startAt?: string;
  endAt?: string;

  targets: {
    targetId: string;
    isArea: boolean;
    filterByLoadId: boolean;
    load: Load;
    nodeActionType: string;
  }[];

  tasks?: {
    startNodeId: string;
    endNodeId: string;
    nodeActionType: string;
    taskStatus: CreateJobTemplateDto['status'];
    startAt: string;
    endAt: string;
  }[];

  visitedNodes?: {
    nodeId: string;
    visitedAt: string;
  }[];

  priority: number = 0;
  status: 
    | "WAITING_FOR_PART_ARRIVAL"
    | "SCHEDULED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELED"
    | "DELETED"
    | "PAUSED";
}
