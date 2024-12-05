export class CreateRobotDto {
  serialNumber: string;
  url?: string;
  jobId?: string;
  status?: string;
  connectionState?: string;
  mqttClient?: string;
  robotType: string; // Required robot type ID
}