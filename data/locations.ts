export interface Location {
  id: string;
  name: string;
  type: 'person' | 'room' | 'facility';
  room?: string;
  aliases: string[];
}

export const locations: Location[] = [
  // Facilities and Special Rooms
  {
    id: '1',
    name: 'PC Pool',
    type: 'facility',
    room: '04.2.028',
    aliases: ['pc raum', 'computerraum', 'pc labor']
  },
  {
    id: '2',
    name: 'Serverraum',
    type: 'facility',
    aliases: ['server raum', 'server']
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
    aliases: ['fs', 'fachschaftsraum']
  },
  {
    id: '6',
    name: 'Audimax',
    type: 'room',
    aliases: ['audi', 'großer hörsaal']
  },
  {
    id: '7',
    name: 'Labor Interaktive Systeme',
    type: 'room',
    aliases: ['interaktive systeme', 'interaktionslabor', 'labor is']
  },
  {
    id: '8',
    name: 'Labor Mixed Reality',
    type: 'room',
    aliases: ['mixed reality', 'vr labor', 'ar labor', 'mr labor']
  },
  {
    id: '9',
    name: 'Labor Computergrafik',
    type: 'room',
    aliases: ['computergrafiklabor', 'cg labor', 'grafiklabor']
  },
  {
    id: '10',
    name: 'Labor IT Sicherheit',
    type: 'room',
    aliases: ['it security', 'security labor', 'it sec']
  },
  {
    id: '11',
    name: 'Labor Multimedia Kommunikation',
    type: 'room',
    aliases: ['multimedia labor', 'mmk labor', 'multimedia']
  },
  {
    id: '12',
    name: 'Labor Webtechnologie',
    type: 'room',
    aliases: ['weblabor', 'web labor', 'webtech']
  },
  {
    id: '13',
    name: 'Seminarraum',
    type: 'room',
    aliases: ['seminar', 'seminar raum']
  },
  {
    id: '14',
    name: 'Labor Digitaltechnik',
    type: 'room',
    aliases: ['digitallabor', 'digital labor']
  },
  {
    id: '15',
    name: 'Labor Datenbanken',
    type: 'room',
    aliases: ['datenbanklabor', 'db labor', 'dblabor']
  },
  {
    id: '16',
    name: 'Labor AV Produktion',
    type: 'room',
    aliases: ['av labor', 'audio video labor', 'av labor']
  },
  {
    id: '17',
    name: 'Sitzungsraum',
    type: 'room',
    aliases: ['sitzungszimmer', 'besprechungsraum']
  },
  {
    id: '18',
    name: 'Labor Mediengestaltung',
    type: 'room',
    aliases: ['medienlabor', 'gestaltungslabor', 'mediengestaltungslabor']
  },
  {
    id: '19',
    name: 'Lehrbeauftragte',
    type: 'room',
    aliases: ['dozenten', 'lehrbeauftragtenraum']
  },

  // Persons
  {
    id: '20',
    name: 'Professor Bonse',
    type: 'person',
    room: '04.2.006',
    aliases: ['professor thomas bonse', 'herr bonse', 'frau bonse', 'bonse', 'professor bonse']
  },
  {
    id: '21',
    name: 'Professor Dahm',
    type: 'person',
    room: '04.2.010',
    aliases: ['professor markus dahm', 'herr dahm', 'frau dahm', 'dahm', 'professor dahm', 'dam']
  },
  {
    id: '22',
    name: 'Professor Herder',
    type: 'person',
    room: '04.2.009',
    aliases: ['professor jens herder', 'herr herder', 'frau herder', 'herder', 'professor herder', 'härder']
  },
  {
    id: '23',
    name: 'Professor Huber',
    type: 'person',
    room: '04.2.009',
    aliases: ['professor florian huber', 'herr huber', 'frau huber', 'huber', 'professor huber']
  },
  {
    id: '24',
    name: 'Professor Huldtgren',
    type: 'person',
    room: '04.2.005',
    aliases: [
      'professor alina huldtgren',
      'professorin huldtgren',
      'frau huldtgren',
      'herr huldtgren',
      'huldtgren',
      'hultgren',
      'professor huldtgren'
    ]
  },
  {
    id: '25',
    name: 'Professor Mostafawy',
    type: 'person',
    room: '04.2.006',
    aliases: [
      'professor sina mostafawy',
      'herr mostafawy',
      'frau mostafawy',
      'mostafawy',
      'mostafawi',
      'professor mostafawy'
    ]
  },
  {
    id: '26',
    name: 'Professor Rakow',
    type: 'person',
    room: '04.2.039',
    aliases: [
      'professor thomas rakow',
      'herr rakow',
      'frau rakow',
      'rakow',
      'rackov',
      'rakov',
      'professor rakow'
    ]
  },
  {
    id: '27',
    name: 'Professor Schwab Trapp',
    type: 'person',
    room: '04.2.005',
    aliases: [
      'professor gabriele schwab trapp',
      'professorin schwab trapp',
      'frau schwab trapp',
      'herr schwab trapp',
      'schwab trapp',
      'schwabtrapp',
      'professor schwab trapp'
    ]
  },
  {
    id: '28',
    name: 'Professor Wojciechowski',
    type: 'person',
    room: '04.2.010',
    aliases: [
      'professor manfred wojciechowski',
      'herr wojciechowski',
      'frau wojciechowski',
      'wojo',
      'wolle',
      'professor wojo',
      'wojciechowski',
      'wojiechowski',
      'wotschikowski',
      'wotschkowski',
      'woschkowski',
      'professor wotschikowski',
      'professor wotschkowski',
      'voichiechovski',
      'wojciechovski'
    ]
  }
];