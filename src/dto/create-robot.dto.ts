export class CreateRobotDto {
  serialNumber: string;
  password: string;
  type: Type;
  interfaceName?: string;
  version?: string;
  manufacturer?: string;
  jobId?: string;
  status?: string;  
  isStucked?: boolean;
  connection?: Connection;
  factsheet?: any;
  state?: any;
}

interface Connection {
  headerId: number,
  timestamp: string,
  version: string,
  manufacturer: string,
  serialNumber: string,
  connectionState: 'ONLINE' | 'OFFLINE' | 'CONNECTIONBROKEN'
}

interface Type {
  name: string,
}