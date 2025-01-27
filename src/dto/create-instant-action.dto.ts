export class CreateInstantActionDto {
    headerId: number;
    timestamp: string;
    version: string;
    manufacturer: string;
    serialNumber: string;
    actions: Action[];
  }
  
  interface Action {
    actionType: string;
    actionId: string;
    actionDescription?: string;
    blockingType: BlockingType;
    actionParameters?: ActionParameter[];
  }
  
  interface ActionParameter {
    key: string;
    value: string | number | boolean | any[] | object;
  }
  
  enum BlockingType {
    NONE = 'NONE',
    SOFT = 'SOFT',
    HARD = 'HARD'
  }