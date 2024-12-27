export class CreateGraphDto {
    graphId: string;
    mapId: string;
    isActive: boolean;
    nodes?: Node[];
    edges?: Edge[];
  }
  
  interface Node {
    nodeId: string;
    released: boolean;
    stationType: string;
    serialNumber: string;
    nodePosition: NodePosition;
    nodeActions: NodeAction[];
  }
  
  interface NodePosition {
    x: number;
    y: number;
    allowedDeviationXY: number;
    allowedDeviationTheta: number;
    mapId: string;
  }
  
  interface NodeAction {
    robotType: string;
    actions: Action[];
  }
  
  interface Action {
    actionId: string;
    actionType: string;
    actionDescription: string;
    actionParameters: ActionParameter[];
    resultDescription: string;
    blockingType: "SOFT" | "HARD" | "NONE";
  }
  
  interface ActionParameter {
    key: string;
    value: number;
  }
  
  interface Edge {
    edgeId: string;
    startNodeId: string;
    endNodeId: string;
    released: boolean;
    isDirected: boolean;
    trajectory: Trajectory;
    length: number;
    edgeActions: EdgeAction[];
  }
  
  interface Trajectory {
    knotVector: number[];
    controlPoints: ControlPoint[];
  }
  
  interface ControlPoint {
    x: number;
    y: number;
  }
  
  interface EdgeAction {
    robotType: string;
    actions: Action[];
  }