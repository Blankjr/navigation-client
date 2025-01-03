export enum SignColor {
  RED = 'RED',
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  BLACK = 'BLACK'
}export interface RoomSignage {
  visualSign: string;    // Visual text/symbol on the sign
  tactileSign: string;   // Tactile representation
  signColor: SignColor;     // Color of the sign
}
export interface Location {
  id: string;
  name: string;
  type: 'person' | 'room' | 'facility';
  room?: string;
  aliases: string[];
  signage?: RoomSignage; 
}

const tactileBaseText = 'Rechts neben der tür befindet sich ein 3D Schild mit den Buchstaben'

export const findSignageByRoom = (room: string, locations: Location[]): Location['signage'] | undefined => {
  // Normalize the room number by removing leading zeros after dots
  const normalizeRoom = (r: string) => {
    return r.replace(/\.0+/g, '.');
  };
  
  const normalizedSearchRoom = normalizeRoom(room);
  
  // Find all locations with matching room number
  const matchingLocations = locations.filter(location => 
    location.room && normalizeRoom(location.room) === normalizedSearchRoom
  );

  // Return the signage from the first location that has it
  return matchingLocations.find(loc => loc.signage)?.signage;
};

export const locations: Location[] = [
  {
    id: '1',
    name: 'PC Pool',
    type: 'facility',
    room: '04.2.028',
    aliases: ['pc raum', 'computerraum', 'pc labor'],
    signage: {
      visualSign: 'PC',
      tactileSign: `${tactileBaseText} P und C auf der Höhe 150cm.`,
      signColor: SignColor.RED
    }
  },
  {
    id: '3',
    name: 'Toilette',
    type: 'facility',
    aliases: ['wc', 'klo']
  },
  {
    id: '4',
    name: 'Lernraum',
    type: 'room',
    aliases: ['lernzimmer', 'lernbereich']
  },
  {
    id: '5',
    name: 'Fachschaft',
    type: 'room',
    aliases: ['fs', 'fachschaftsraum'],
    signage: {
      visualSign: 'FR',
      tactileSign: `${tactileBaseText} F und R auf der Höhe 150cm.`,
      signColor: SignColor.BLUE
    }
  },
  {
    id: '6',
    name: 'Labor Interaktive Systeme',
    type: 'room',
    aliases: ['interaktive systeme', 'interaktionslabor', 'labor is']
  },
  {
    id: '7',
    name: 'Labor Mixed Reality',
    type: 'room',
    aliases: ['mixed reality', 'vr labor', 'ar labor', 'mr labor']
  },
  {
    id: '8',
    name: 'Labor Computergrafik',
    type: 'room',
    aliases: ['computergrafiklabor', 'cg labor', 'grafiklabor']
  },
  {
    id: '9',
    name: 'Labor IT Sicherheit',
    type: 'room',
    aliases: ['it security', 'security labor', 'it sec']
  },
  {
    id: '10',
    name: 'Labor Multimedia Kommunikation',
    type: 'room',
    aliases: ['multimedia labor', 'mmk labor', 'multimedia']
  },
  {
    id: '11',
    name: 'Labor Webtechnologie',
    type: 'room',
    aliases: ['weblabor', 'web labor', 'webtech']
  },
  {
    id: '12',
    name: 'Seminarraum',
    type: 'room',
    room: '04.2.017',
    aliases: ['seminar', 'seminar raum']
  },
  {
    id: '13',
    name: 'Labor Digitaltechnik',
    type: 'room',
    aliases: ['digitallabor', 'digital labor']
  },
  {
    id: '14',
    name: 'Labor Datenbanken',
    type: 'room',
    aliases: ['datenbanklabor', 'db labor', 'dblabor']
  },
  {
    id: '15',
    name: 'Labor AV Produktion',
    type: 'room',
    aliases: ['av labor', 'audio video labor', 'av labor']
  },
  {
    id: '16',
    name: 'Sitzungsraum',
    type: 'room',
    room: '04.2.025',
    aliases: ['sitzungszimmer', 'besprechungsraum', 'sitzung']
  },
  {
    id: '19',
    name: 'Labor Mediengestaltung',
    type: 'room',
    aliases: ['medienlabor', 'gestaltungslabor', 'mediengestaltungslabor']
  },
  {
    id: '20',
    name: 'Lehrbeauftragte',
    type: 'room',
    aliases: ['dozenten', 'lehrbeauftragtenraum']
  },
  {
    id: '21',
    name: 'Wissenschaftlicher Mitarbeiter',
    type: 'room',
    room: '04.2.002',
    aliases: ['wissenschaftlicher mitarbeiter']
  },
  {
    id: '22',
    name: 'Professor Huldtgren',
    type: 'person',
    room: '04.2.005',
    aliases: ['professor alina huldtgren', 'professorin huldtgren', 'frau huldtgren', 'herr huldtgren', 'huldtgren', 'hultgren', 'professor huldtgren']
  },
  {
    id: '23',
    name: 'Professor Schwab Trapp',
    type: 'person',
    room: '04.2.005',
    aliases: ['professor gabriele schwab trapp', 'professorin schwab trapp', 'frau schwab trapp', 'herr schwab trapp', 'schwab trapp', 'schwabtrapp', 'professor schwab trapp']
  },
  {
    id: '24',
    name: 'Professor Bonse',
    type: 'person',
    room: '04.2.006',
    aliases: ['professor thomas bonse', 'herr bonse', 'frau bonse', 'bonse', 'professor bonse']
  },
  {
    id: '25',
    name: 'Professor Mostafawy',
    type: 'person',
    room: '04.2.006',
    aliases: ['professor sina mostafawy', 'herr mostafawy', 'frau mostafawy', 'mostafawy', 'mostafawi', 'professor mostafawy']
  },
  {
    id: '26',
    name: 'Professor Herder',
    type: 'person',
    room: '04.2.009',
    aliases: ['professor jens herder', 'herr herder', 'frau herder', 'herder', 'professor herder', 'härder']
  },
  {
    id: '27',
    name: 'Professor Huber',
    type: 'person',
    room: '04.2.009',
    aliases: ['professor florian huber', 'herr huber', 'frau huber', 'huber', 'professor huber']
  },
  {
    id: '28',
    name: 'Professor Dahm',
    type: 'person',
    room: '04.2.010',
    aliases: ['professor markus dahm', 'herr dahm', 'frau dahm', 'dahm', 'professor dahm', 'dam'],
    signage: {
      visualSign: "W/D",
      tactileSign: `${tactileBaseText} W und D auf der Höhe 150cm.`,
      signColor: SignColor.RED
    }
  },
  {
    id: '29',
    name: 'Professor Wojciechowski',
    type: 'person',
    room: '04.2.010',
    aliases: ['professor manfred wojciechowski', 'herr wojciechowski', 'frau wojciechowski', 'wojo', 'wolle', 'professor wojo', 'wojciechowski', 'wojiechowski', 'wotschikowski', 'wotschkowski', 'woschkowski', 'professor wotschikowski', 'professor wotschkowski', 'voichiechovski', 'wojciechovski'],
    signage: {
      visualSign: "W/D",
      tactileSign: `${tactileBaseText} W und D auf der Höhe 150cm.`,
      signColor: SignColor.RED
    }
  },
  {
    id: '30',
    name: 'Professor Rakow',
    type: 'person',
    room: '04.2.039',
    aliases: ['professor thomas rakow', 'herr rakow', 'frau rakow', 'rakow', 'rackov', 'rakov', 'professor rakow']
  },
  {
    id: '31',
    name: 'Professor Franz',
    type: 'person',
    room: '04.2.040',
    aliases: ['professor franz', 'herr franz', 'frau franz', 'franz']
}
];