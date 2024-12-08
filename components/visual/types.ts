export interface ImageItem {
    url: string;
    id?: string;
    description?: string;
    // Add any other properties that your waypoints might have
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