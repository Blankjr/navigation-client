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
      id: '6',
      name: 'Professor Asal',
      type: 'person',
      room: '04.3.009',
      aliases: ['professor isolde asal', 'frau asal', 'professorin asal']
    },
    {
      id: '7',
      name: 'Professor Becker-Schweitzer',
      type: 'person',
      room: '05.E.057',
      aliases: ['professor jörg becker schweitzer', 'becker schweitzer', 'professor becker']
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
      id: '10',
      name: 'Professor Dederichs',
      type: 'person',
      room: '04.3.007',
      aliases: ['professor stefanie dederichs', 'professorin dederichs', 'frau dederichs']
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
      id: '14',
      name: 'Professor Leckschat',
      type: 'person',
      room: '05.E.059',
      aliases: ['professor dieter leckschat', 'herr leckschat', 'leckschat']
    },
    {
      id: '15',
      name: 'Professor Marmann',
      type: 'person',
      room: '04.3.003',
      aliases: ['professor michael marmann', 'herr marmann', 'marmann']
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
      name: 'Professor Schwab-Trapp',
      type: 'person',
      room: '04.2.005',
      aliases: ['professor gabriele schwab trapp', 'professorin schwab trapp', 'frau schwab trapp']
    },
    {
      id: '19',
      name: 'Professor Steffens',
      type: 'person',
      room: '05.E.061',
      aliases: ['professor jochen steffens', 'herr steffens', 'steffens']
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
    }
  ];