export class CreateMapDto {
  mapId: string;
  isActive: boolean;
  robotTypes: string[];
  rosMsg: {
    header: {
      seq: number;
      stamp: {
        secs: number;
        nsecs: number;
      };
      frameId: string;
    };
    info: {
      map_load_time: {
        secs: number;
        nsecs: number;
      };
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
    data: number[];
  };
  zones: {
    zoneId: string;
    zoneType: string;
    areas: {
      x: number;
      y: number;
      z: number;
    }[];
  }[];
  imageData: string;
}

