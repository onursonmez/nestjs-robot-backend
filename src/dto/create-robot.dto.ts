export class CreateRobotDto {
  serialNumber: string;
  interface_name: string;
  version: string;
  manufacturer: string;
  jobId?: string;
  status?: string;
  connectionState?: string;
  mqttClient: string;
  robotType: string;
  factsheet?: any;
  state: any;
  isStucked?: boolean;
  instantActions?: any;
}