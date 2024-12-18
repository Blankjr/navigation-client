export interface ImageItem {
    url: string;
    id?: string;
    description?: string;
  }
  
  export interface LineDirection {
    direction: string;
    gridSquare: string;
  }
  
  export interface GuideData {
    waypoints: ImageItem[];
    route: Array<{ waypointId: string }>;
    lineDirections?: LineDirection[];
  }