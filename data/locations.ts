export interface Location {
  id: string;
  name: string;
  type: 'person' | 'room' | 'facility';
  room?: string;
  aliases: string[];
}

export const locations = [
  {
    id: '1',
    name: 'Lernraum',
    type: 'room',
    aliases: ['lernzimmer', 'lernbereich']
  },
  {
    id: '2',
    name: 'Fachschaft',
    type: 'room',
    aliases: ['fs', 'fachschaftsraum']
  },
  {
    id: '3',
    name: 'Toilette',
    type: 'facility',
    aliases: ['wc', 'klo']
  },
  {
    id: '4',
    name: 'Audimax',
    type: 'room',
    aliases: ['audi', 'großer hörsaal']
  },
  {
    id: '5',
    name: 'PC Pool',
    type: 'facility',
    aliases: ['pc raum', 'computerraum', 'pc labor']
  },
  {
    id: '8',
    name: 'Professor Bonse',
    type: 'person',
    room: '04.2.006',
    aliases: ['professor thomas bonse', 'herr bonse', 'bonse']
  },
  {
    id: '9',
    name: 'Professor Dahm',
    type: 'person',
    room: '04.2.010',
    aliases: ['professor markus dahm', 'herr dahm', 'dahm']
  },
  {
    id: '11',
    name: 'Professor Herder',
    type: 'person',
    room: '04.2.009',
    aliases: ['professor jens herder', 'herr herder', 'herder']
  },
  {
    id: '12',
    name: 'Professor Huber',
    type: 'person',
    room: '04.2.009',
    aliases: ['professor florian huber', 'herr huber', 'huber']
  },
  {
    id: '13',
    name: 'Professor Huldtgren',
    type: 'person',
    room: '04.2.005',
    aliases: ['professor alina huldtgren', 'professorin huldtgren', 'frau huldtgren']
  },
  {
    id: '16',
    name: 'Professor Mostafawy',
    type: 'person',
    room: '04.2.006',
    aliases: ['professor sina mostafawy', 'herr mostafawy', 'mostafawy']
  },
  {
    id: '17',
    name: 'Professor Rakow',
    type: 'person',
    room: '04.2.039',
    aliases: ['professor thomas rakow', 'herr rakow', 'rakow']
  },
  {
    id: '18',
    name: 'Professor Schwab Trapp',
    type: 'person',
    room: '04.2.005',
    aliases: ['professor gabriele schwab trapp', 'professorin schwab trapp', 'frau schwab trapp']
  },
  {
    id: '20',
    name: 'Professor Wojciechowski',
    type: 'person',
    room: '04.2.010',
    aliases: [
      'professor manfred wojciechowski',
      'herr wojciechowski',
      'wojo',
      'wolle',
      'professor wojo',
      'wojciechowski',
      'wojiechowski',
      'wotschikowski',
      'wotschkowski',
      'woschkowski',
      'professor wotschikowski',
      'professor wotschkowski'
    ]
  },
  {
    id: '21',
    name: 'Labor Interaktive Systeme',
    type: 'room',
    aliases: ['interaktive systeme', 'interaktionslabor', 'labor is']
  },
  {
    id: '22',
    name: 'Labor Mixed Reality',
    type: 'room',
    aliases: ['mixed reality', 'vr labor', 'ar labor', 'mr labor']
  },
  {
    id: '23',
    name: 'Labor Computergrafik',
    type: 'room',
    aliases: ['computergrafiklabor', 'cg labor', 'grafiklabor']
  },
  {
    id: '24',
    name: 'Labor IT Sicherheit',
    type: 'room',
    aliases: ['it security', 'security labor', 'it sec']
  },
  {
    id: '25',
    name: 'Labor Multimedia Kommunikation',
    type: 'room',
    aliases: ['multimedia labor', 'mmk labor', 'multimedia']
  },
  {
    id: '26',
    name: 'Labor Webtechnologie',
    type: 'room',
    aliases: ['weblabor', 'web labor', 'webtech']
  },
  {
    id: '27',
    name: 'Seminarraum',
    type: 'room',
    aliases: ['seminar', 'seminar raum']
  },
  {
    id: '28',
    name: 'Labor Digitaltechnik',
    type: 'room',
    aliases: ['digitallabor', 'digital labor']
  },
  {
    id: '29',
    name: 'Labor Datenbanken',
    type: 'room',
    aliases: ['datenbanklabor', 'db labor', 'dblabor']
  },
  {
    id: '30',
    name: 'Labor AV Produktion',
    type: 'room',
    aliases: ['av labor', 'audio video labor', 'av labor']
  },
  {
    id: '31',
    name: 'Sitzungsraum',
    type: 'room',
    aliases: ['sitzungszimmer', 'besprechungsraum']
  },
  {
    id: '32',
    name: 'Labor Mediengestaltung',
    type: 'room',
    aliases: ['medienlabor', 'gestaltungslabor', 'mediengestaltungslabor']
  },
  {
    id: '33',
    name: 'Lehrbeauftragte',
    type: 'room',
    aliases: ['dozenten', 'lehrbeauftragtenraum']
  },
  {
    id: '34',
    name: 'Serverraum',
    type: 'facility',
    aliases: ['server raum', 'server']
  }
];