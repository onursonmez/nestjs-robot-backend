export class CreateMapDto {
    mapId: string;
    isActive: boolean;
    robotTypes: string[];
    header: {
      frameId: string;
    };
    info: {
      resolution: number;
      width: number;
      height: number;
      origin: {
        position: {
          x: number;
          y: number;
          z: number;
        };
        orientation: {
          x: number;
          y: number;
          z: number;
          w: number;
        };
      };
    };
    zones: {
      zoneId: string;
      zoneType: string; // Assuming "FORBIDDEN" is a string type, you might want to use a union type if there are more zone types.
      areas: {
        x: number;
        y: number;
        z: number;
      }[];
    }[];
    data: number[]; // Assuming int8 refers to an array of numbers
    imageData: string; // Assuming binary.Base64 is a string
  }

