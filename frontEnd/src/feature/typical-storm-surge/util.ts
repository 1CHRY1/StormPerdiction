import * as mapbox from 'mapbox-gl'

const stormData199711 = {
  type: 'FeatureCollection',
  name: '温妮 (199711)',
  features: [
    {
      type: 'Feature',
      properties: {
        id: '0',
        time: '1997-08-05 00:00:00',
        strong: '热带低压',
        power: '4',
        speed: '7',
      },
      geometry: { type: 'Point', coordinates: [168.0, 5.6] },
    },
    {
      type: 'Feature',
      properties: {
        id: '1',
        time: '1997-08-05 06:00:00',
        strong: '热带低压',
        power: '4',
        speed: '7',
      },
      geometry: { type: 'Point', coordinates: [167.7, 5.7] },
    },
    {
      type: 'Feature',
      properties: {
        id: '2',
        time: '1997-08-05 12:00:00',
        strong: '热带低压',
        power: '4',
        speed: '7',
      },
      geometry: { type: 'Point', coordinates: [167.4, 5.8] },
    },
    {
      type: 'Feature',
      properties: {
        id: '3',
        time: '1997-08-05 18:00:00',
        strong: '热带低压',
        power: '4',
        speed: '7',
      },
      geometry: { type: 'Point', coordinates: [167.1, 5.9] },
    },
    {
      type: 'Feature',
      properties: {
        id: '4',
        time: '1997-08-06 00:00:00',
        strong: '热带低压',
        power: '5',
        speed: '10',
      },
      geometry: { type: 'Point', coordinates: [166.7, 6.1] },
    },
    {
      type: 'Feature',
      properties: {
        id: '5',
        time: '1997-08-06 06:00:00',
        strong: '热带低压',
        power: '5',
        speed: '10',
      },
      geometry: { type: 'Point', coordinates: [166.2, 6.3] },
    },
    {
      type: 'Feature',
      properties: {
        id: '6',
        time: '1997-08-06 12:00:00',
        strong: '热带低压',
        power: '5',
        speed: '10',
      },
      geometry: { type: 'Point', coordinates: [165.4, 6.5] },
    },
    {
      type: 'Feature',
      properties: {
        id: '7',
        time: '1997-08-06 18:00:00',
        strong: '热带低压',
        power: '5',
        speed: '10',
      },
      geometry: { type: 'Point', coordinates: [164.4, 6.8] },
    },
    {
      type: 'Feature',
      properties: {
        id: '8',
        time: '1997-08-07 00:00:00',
        strong: '热带低压',
        power: '5',
        speed: '10',
      },
      geometry: { type: 'Point', coordinates: [163.0, 7.2] },
    },
    {
      type: 'Feature',
      properties: {
        id: '9',
        time: '1997-08-07 06:00:00',
        strong: '热带低压',
        power: '5',
        speed: '10',
      },
      geometry: { type: 'Point', coordinates: [161.7, 7.8] },
    },
    {
      type: 'Feature',
      properties: {
        id: '10',
        time: '1997-08-07 12:00:00',
        strong: '热带低压',
        power: '5',
        speed: '10',
      },
      geometry: { type: 'Point', coordinates: [160.6, 8.7] },
    },
    {
      type: 'Feature',
      properties: {
        id: '11',
        time: '1997-08-07 18:00:00',
        strong: '热带低压',
        power: '5',
        speed: '10',
      },
      geometry: { type: 'Point', coordinates: [159.7, 9.5] },
    },
    {
      type: 'Feature',
      properties: {
        id: '12',
        time: '1997-08-08 00:00:00',
        strong: '热带低压',
        power: '6',
        speed: '12',
      },
      geometry: { type: 'Point', coordinates: [158.8, 10.3] },
    },
    {
      type: 'Feature',
      properties: {
        id: '13',
        time: '1997-08-08 06:00:00',
        strong: '热带低压',
        power: '6',
        speed: '12',
      },
      geometry: { type: 'Point', coordinates: [158.1, 11.3] },
    },
    {
      type: 'Feature',
      properties: {
        id: '14',
        time: '1997-08-08 12:00:00',
        strong: '热带低压',
        power: '7',
        speed: '15',
      },
      geometry: { type: 'Point', coordinates: [157.3, 12.2] },
    },
    {
      type: 'Feature',
      properties: {
        id: '15',
        time: '1997-08-08 18:00:00',
        strong: '热带低压',
        power: '7',
        speed: '15',
      },
      geometry: { type: 'Point', coordinates: [156.5, 13.0] },
    },
    {
      type: 'Feature',
      properties: {
        id: '16',
        time: '1997-08-09 00:00:00',
        strong: '热带低压',
        power: '7',
        speed: '15',
      },
      geometry: { type: 'Point', coordinates: [155.8, 13.7] },
    },
    {
      type: 'Feature',
      properties: {
        id: '17',
        time: '1997-08-09 06:00:00',
        strong: '热带低压',
        power: '7',
        speed: '17',
      },
      geometry: { type: 'Point', coordinates: [155.2, 14.4] },
    },
    {
      type: 'Feature',
      properties: {
        id: '18',
        time: '1997-08-09 12:00:00',
        strong: '热带风暴',
        power: '9',
        speed: '23',
      },
      geometry: { type: 'Point', coordinates: [154.6, 14.8] },
    },
    {
      type: 'Feature',
      properties: {
        id: '19',
        time: '1997-08-09 18:00:00',
        strong: '强热带风暴',
        power: '10',
        speed: '28',
      },
      geometry: { type: 'Point', coordinates: [154.1, 15.1] },
    },
    {
      type: 'Feature',
      properties: {
        id: '20',
        time: '1997-08-10 00:00:00',
        strong: '台风',
        power: '12',
        speed: '33',
      },
      geometry: { type: 'Point', coordinates: [153.6, 15.4] },
    },
    {
      type: 'Feature',
      properties: {
        id: '21',
        time: '1997-08-10 06:00:00',
        strong: '台风',
        power: '13',
        speed: '38',
      },
      geometry: { type: 'Point', coordinates: [152.8, 15.8] },
    },
    {
      type: 'Feature',
      properties: {
        id: '22',
        time: '1997-08-10 12:00:00',
        strong: '强台风',
        power: '14',
        speed: '43',
      },
      geometry: { type: 'Point', coordinates: [151.8, 16.0] },
    },
    {
      type: 'Feature',
      properties: {
        id: '23',
        time: '1997-08-10 18:00:00',
        strong: '强台风',
        power: '15',
        speed: '48',
      },
      geometry: { type: 'Point', coordinates: [150.8, 16.1] },
    },
    {
      type: 'Feature',
      properties: {
        id: '24',
        time: '1997-08-11 00:00:00',
        strong: '超强台风',
        power: '16',
        speed: '51',
      },
      geometry: { type: 'Point', coordinates: [150.1, 16.2] },
    },
    {
      type: 'Feature',
      properties: {
        id: '25',
        time: '1997-08-11 06:00:00',
        strong: '超强台风',
        power: '16',
        speed: '53',
      },
      geometry: { type: 'Point', coordinates: [149.4, 16.4] },
    },
    {
      type: 'Feature',
      properties: {
        id: '26',
        time: '1997-08-11 12:00:00',
        strong: '超强台风',
        power: '17',
        speed: '59',
      },
      geometry: { type: 'Point', coordinates: [148.7, 16.6] },
    },
    {
      type: 'Feature',
      properties: {
        id: '27',
        time: '1997-08-11 18:00:00',
        strong: '超强台风',
        power: '17',
        speed: '64',
      },
      geometry: { type: 'Point', coordinates: [148.0, 16.8] },
    },
    {
      type: 'Feature',
      properties: {
        id: '28',
        time: '1997-08-12 00:00:00',
        strong: '超强台风',
        power: '17',
        speed: '71',
      },
      geometry: { type: 'Point', coordinates: [147.1, 17.2] },
    },
    {
      type: 'Feature',
      properties: {
        id: '29',
        time: '1997-08-12 06:00:00',
        strong: '超强台风',
        power: '17',
        speed: '71',
      },
      geometry: { type: 'Point', coordinates: [146.0, 17.6] },
    },
    {
      type: 'Feature',
      properties: {
        id: '30',
        time: '1997-08-12 12:00:00',
        strong: '超强台风',
        power: '17',
        speed: '71',
      },
      geometry: { type: 'Point', coordinates: [144.9, 18.0] },
    },
    {
      type: 'Feature',
      properties: {
        id: '31',
        time: '1997-08-12 18:00:00',
        strong: '超强台风',
        power: '17',
        speed: '71',
      },
      geometry: { type: 'Point', coordinates: [143.9, 18.4] },
    },
    {
      type: 'Feature',
      properties: {
        id: '32',
        time: '1997-08-13 00:00:00',
        strong: '超强台风',
        power: '17',
        speed: '71',
      },
      geometry: { type: 'Point', coordinates: [143.1, 18.9] },
    },
    {
      type: 'Feature',
      properties: {
        id: '33',
        time: '1997-08-13 06:00:00',
        strong: '超强台风',
        power: '17',
        speed: '69',
      },
      geometry: { type: 'Point', coordinates: [142.2, 19.5] },
    },
    {
      type: 'Feature',
      properties: {
        id: '34',
        time: '1997-08-13 12:00:00',
        strong: '超强台风',
        power: '17',
        speed: '69',
      },
      geometry: { type: 'Point', coordinates: [141.3, 20.1] },
    },
    {
      type: 'Feature',
      properties: {
        id: '35',
        time: '1997-08-13 18:00:00',
        strong: '超强台风',
        power: '17',
        speed: '66',
      },
      geometry: { type: 'Point', coordinates: [140.3, 20.5] },
    },
    {
      type: 'Feature',
      properties: {
        id: '36',
        time: '1997-08-14 00:00:00',
        strong: '超强台风',
        power: '17',
        speed: '59',
      },
      geometry: { type: 'Point', coordinates: [139.5, 21.0] },
    },
    {
      type: 'Feature',
      properties: {
        id: '37',
        time: '1997-08-14 06:00:00',
        strong: '超强台风',
        power: '17',
        speed: '59',
      },
      geometry: { type: 'Point', coordinates: [138.7, 21.5] },
    },
    {
      type: 'Feature',
      properties: {
        id: '38',
        time: '1997-08-14 12:00:00',
        strong: '超强台风',
        power: '16',
        speed: '56',
      },
      geometry: { type: 'Point', coordinates: [137.7, 22.0] },
    },
    {
      type: 'Feature',
      properties: {
        id: '39',
        time: '1997-08-14 18:00:00',
        strong: '超强台风',
        power: '16',
        speed: '53',
      },
      geometry: { type: 'Point', coordinates: [136.7, 22.5] },
    },
    {
      type: 'Feature',
      properties: {
        id: '40',
        time: '1997-08-15 00:00:00',
        strong: '超强台风',
        power: '16',
        speed: '53',
      },
      geometry: { type: 'Point', coordinates: [135.7, 22.8] },
    },
    {
      type: 'Feature',
      properties: {
        id: '41',
        time: '1997-08-15 06:00:00',
        strong: '强台风',
        power: '15',
        speed: '48',
      },
      geometry: { type: 'Point', coordinates: [134.8, 23.0] },
    },
    {
      type: 'Feature',
      properties: {
        id: '42',
        time: '1997-08-15 12:00:00',
        strong: '强台风',
        power: '14',
        speed: '46',
      },
      geometry: { type: 'Point', coordinates: [134.0, 23.3] },
    },
    {
      type: 'Feature',
      properties: {
        id: '43',
        time: '1997-08-15 18:00:00',
        strong: '强台风',
        power: '14',
        speed: '46',
      },
      geometry: { type: 'Point', coordinates: [133.1, 23.6] },
    },
    {
      type: 'Feature',
      properties: {
        id: '44',
        time: '1997-08-16 00:00:00',
        strong: '强台风',
        power: '14',
        speed: '43',
      },
      geometry: { type: 'Point', coordinates: [132.1, 23.8] },
    },
    {
      type: 'Feature',
      properties: {
        id: '45',
        time: '1997-08-16 06:00:00',
        strong: '强台风',
        power: '14',
        speed: '43',
      },
      geometry: { type: 'Point', coordinates: [131.1, 24.0] },
    },
    {
      type: 'Feature',
      properties: {
        id: '46',
        time: '1997-08-16 12:00:00',
        strong: '台风',
        power: '13',
        speed: '41',
      },
      geometry: { type: 'Point', coordinates: [130.2, 24.1] },
    },
    {
      type: 'Feature',
      properties: {
        id: '47',
        time: '1997-08-16 18:00:00',
        strong: '台风',
        power: '13',
        speed: '41',
      },
      geometry: { type: 'Point', coordinates: [129.2, 24.3] },
    },
    {
      type: 'Feature',
      properties: {
        id: '48',
        time: '1997-08-17 00:00:00',
        strong: '台风',
        power: '13',
        speed: '38',
      },
      geometry: { type: 'Point', coordinates: [128.2, 24.7] },
    },
    {
      type: 'Feature',
      properties: {
        id: '49',
        time: '1997-08-17 06:00:00',
        strong: '台风',
        power: '13',
        speed: '38',
      },
      geometry: { type: 'Point', coordinates: [127.0, 25.1] },
    },
    {
      type: 'Feature',
      properties: {
        id: '50',
        time: '1997-08-17 12:00:00',
        strong: '台风',
        power: '13',
        speed: '38',
      },
      geometry: { type: 'Point', coordinates: [126.0, 25.4] },
    },
    {
      type: 'Feature',
      properties: {
        id: '51',
        time: '1997-08-17 18:00:00',
        strong: '台风',
        power: '13',
        speed: '38',
      },
      geometry: { type: 'Point', coordinates: [124.9, 25.9] },
    },
    {
      type: 'Feature',
      properties: {
        id: '52',
        time: '1997-08-18 00:00:00',
        strong: '台风',
        power: '13',
        speed: '38',
      },
      geometry: { type: 'Point', coordinates: [124.0, 26.6] },
    },
    {
      type: 'Feature',
      properties: {
        id: '53',
        time: '1997-08-18 06:00:00',
        strong: '台风',
        power: '13',
        speed: '38',
      },
      geometry: { type: 'Point', coordinates: [122.7, 27.4] },
    },
    {
      type: 'Feature',
      properties: {
        id: '54',
        time: '1997-08-18 12:00:00',
        strong: '台风',
        power: '13',
        speed: '38',
      },
      geometry: { type: 'Point', coordinates: [121.4, 28.2] },
    },
    {
      type: 'Feature',
      properties: {
        id: '55',
        time: '1997-08-18 18:00:00',
        strong: '台风',
        power: '12',
        speed: '33',
      },
      geometry: { type: 'Point', coordinates: [120.2, 29.1] },
    },
    {
      type: 'Feature',
      properties: {
        id: '56',
        time: '1997-08-19 00:00:00',
        strong: '强热带风暴',
        power: '10',
        speed: '28',
      },
      geometry: { type: 'Point', coordinates: [119.0, 30.1] },
    },
    {
      type: 'Feature',
      properties: {
        id: '57',
        time: '1997-08-19 06:00:00',
        strong: '热带风暴',
        power: '9',
        speed: '23',
      },
      geometry: { type: 'Point', coordinates: [118.3, 31.2] },
    },
    {
      type: 'Feature',
      properties: {
        id: '58',
        time: '1997-08-19 12:00:00',
        strong: '热带低压',
        power: '7',
        speed: '17',
      },
      geometry: { type: 'Point', coordinates: [117.8, 32.1] },
    },
    {
      type: 'Feature',
      properties: {
        id: '59',
        time: '1997-08-19 18:00:00',
        strong: '热带低压',
        power: '7',
        speed: '15',
      },
      geometry: { type: 'Point', coordinates: [117.8, 33.7] },
    },
    {
      type: 'Feature',
      properties: {
        id: '60',
        time: '1997-08-20 00:00:00',
        strong: '热带低压',
        power: '7',
        speed: '15',
      },
      geometry: { type: 'Point', coordinates: [117.8, 35.4] },
    },
    {
      type: 'Feature',
      properties: {
        id: '61',
        time: '1997-08-20 06:00:00',
        strong: '热带低压',
        power: '7',
        speed: '15',
      },
      geometry: { type: 'Point', coordinates: [118.4, 37.0] },
    },
    {
      type: 'Feature',
      properties: {
        id: '62',
        time: '1997-08-20 12:00:00',
        strong: '热带低压',
        power: '7',
        speed: '15',
      },
      geometry: { type: 'Point', coordinates: [119.4, 38.4] },
    },
    {
      type: 'Feature',
      properties: {
        id: '63',
        time: '1997-08-20 18:00:00',
        strong: '热带低压',
        power: '7',
        speed: '15',
      },
      geometry: { type: 'Point', coordinates: [120.9, 39.5] },
    },
    {
      type: 'Feature',
      properties: {
        id: '64',
        time: '1997-08-21 00:00:00',
        strong: '热带低压',
        power: '7',
        speed: '15',
      },
      geometry: { type: 'Point', coordinates: [122.5, 40.7] },
    },
    {
      type: 'Feature',
      properties: {
        id: '65',
        time: '1997-08-21 06:00:00',
        strong: '热带低压',
        power: '7',
        speed: '15',
      },
      geometry: { type: 'Point', coordinates: [124.6, 41.8] },
    },
    {
      type: 'Feature',
      properties: {
        id: '66',
        time: '1997-08-21 12:00:00',
        strong: '热带低压',
        power: '7',
        speed: '15',
      },
      geometry: { type: 'Point', coordinates: [126.7, 42.9] },
    },
    {
      type: 'Feature',
      properties: {
        id: '67',
        time: '1997-08-21 18:00:00',
        strong: '热带低压',
        power: '7',
        speed: '15',
      },
      geometry: { type: 'Point', coordinates: [128.8, 44.1] },
    },
    {
      type: 'Feature',
      properties: {
        id: '68',
        time: '1997-08-22 00:00:00',
        strong: '热带低压',
        power: '6',
        speed: '12',
      },
      geometry: { type: 'Point', coordinates: [130.7, 45.1] },
    },
    {
      type: 'Feature',
      properties: {
        id: '69',
        time: '1997-08-22 06:00:00',
        strong: '热带低压',
        power: '6',
        speed: '12',
      },
      geometry: { type: 'Point', coordinates: [131.8, 45.7] },
    },
    {
      type: 'Feature',
      properties: {
        id: '70',
        time: '1997-08-22 12:00:00',
        strong: '热带低压',
        power: '6',
        speed: '12',
      },
      geometry: { type: 'Point', coordinates: [133.1, 46.2] },
    },
    {
      type: 'Feature',
      properties: {
        id: '71',
        time: '1997-08-22 18:00:00',
        strong: '热带低压',
        power: '6',
        speed: '12',
      },
      geometry: { type: 'Point', coordinates: [134.3, 46.7] },
    },
    {
      type: 'Feature',
      properties: {
        id: '72',
        time: '1997-08-23 00:00:00',
        strong: '热带低压',
        power: '5',
        speed: '10',
      },
      geometry: { type: 'Point', coordinates: [135.5, 47.2] },
    },
  ],
}

const stormData200012 = {
  type: 'FeatureCollection',
  name: '派比安 (200012)',
  features: [
    {
      type: 'Feature',
      properties: {
        id: '0',
        time: '2000-08-24 00:00:00',
        strong: '热带低压',
        power: '6',
        speed: '12',
      },
      geometry: { type: 'Point', coordinates: [137.9, 7.8] },
    },
    {
      type: 'Feature',
      properties: {
        id: '1',
        time: '2000-08-24 06:00:00',
        strong: '热带低压',
        power: '5',
        speed: '10',
      },
      geometry: { type: 'Point', coordinates: [137.8, 8.9] },
    },
    {
      type: 'Feature',
      properties: {
        id: '2',
        time: '2000-08-24 12:00:00',
        strong: '热带低压',
        power: '5',
        speed: '10',
      },
      geometry: { type: 'Point', coordinates: [136.7, 9.6] },
    },
    {
      type: 'Feature',
      properties: {
        id: '3',
        time: '2000-08-24 18:00:00',
        strong: '热带低压',
        power: '6',
        speed: '12',
      },
      geometry: { type: 'Point', coordinates: [135.1, 10.6] },
    },
    {
      type: 'Feature',
      properties: {
        id: '4',
        time: '2000-08-25 00:00:00',
        strong: '热带低压',
        power: '6',
        speed: '12',
      },
      geometry: { type: 'Point', coordinates: [133.1, 11.6] },
    },
    {
      type: 'Feature',
      properties: {
        id: '5',
        time: '2000-08-25 06:00:00',
        strong: '热带低压',
        power: '6',
        speed: '12',
      },
      geometry: { type: 'Point', coordinates: [131.5, 12.4] },
    },
    {
      type: 'Feature',
      properties: {
        id: '6',
        time: '2000-08-25 12:00:00',
        strong: '热带低压',
        power: '6',
        speed: '12',
      },
      geometry: { type: 'Point', coordinates: [131.0, 13.1] },
    },
    {
      type: 'Feature',
      properties: {
        id: '7',
        time: '2000-08-25 18:00:00',
        strong: '热带低压',
        power: '6',
        speed: '12',
      },
      geometry: { type: 'Point', coordinates: [131.2, 14.0] },
    },
    {
      type: 'Feature',
      properties: {
        id: '8',
        time: '2000-08-26 00:00:00',
        strong: '热带低压',
        power: '6',
        speed: '12',
      },
      geometry: { type: 'Point', coordinates: [131.4, 14.8] },
    },
    {
      type: 'Feature',
      properties: {
        id: '9',
        time: '2000-08-26 06:00:00',
        strong: '热带低压',
        power: '7',
        speed: '15',
      },
      geometry: { type: 'Point', coordinates: [131.7, 16.3] },
    },
    {
      type: 'Feature',
      properties: {
        id: '10',
        time: '2000-08-26 12:00:00',
        strong: '热带低压',
        power: '7',
        speed: '15',
      },
      geometry: { type: 'Point', coordinates: [131.7, 18.1] },
    },
    {
      type: 'Feature',
      properties: {
        id: '11',
        time: '2000-08-26 18:00:00',
        strong: '热带低压',
        power: '7',
        speed: '17',
      },
      geometry: { type: 'Point', coordinates: [131.3, 19.8] },
    },
    {
      type: 'Feature',
      properties: {
        id: '12',
        time: '2000-08-27 00:00:00',
        strong: '热带低压',
        power: '7',
        speed: '17',
      },
      geometry: { type: 'Point', coordinates: [130.7, 21.1] },
    },
    {
      type: 'Feature',
      properties: {
        id: '13',
        time: '2000-08-27 06:00:00',
        strong: '热带低压',
        power: '7',
        speed: '17',
      },
      geometry: { type: 'Point', coordinates: [129.9, 21.9] },
    },
    {
      type: 'Feature',
      properties: {
        id: '14',
        time: '2000-08-27 12:00:00',
        strong: '热带低压',
        power: '7',
        speed: '17',
      },
      geometry: { type: 'Point', coordinates: [129.2, 22.3] },
    },
    {
      type: 'Feature',
      properties: {
        id: '15',
        time: '2000-08-27 18:00:00',
        strong: '热带低压',
        power: '7',
        speed: '17',
      },
      geometry: { type: 'Point', coordinates: [128.4, 22.6] },
    },
    {
      type: 'Feature',
      properties: {
        id: '16',
        time: '2000-08-28 00:00:00',
        strong: '热带低压',
        power: '7',
        speed: '17',
      },
      geometry: { type: 'Point', coordinates: [127.6, 22.9] },
    },
    {
      type: 'Feature',
      properties: {
        id: '17',
        time: '2000-08-28 06:00:00',
        strong: '热带低压',
        power: '7',
        speed: '17',
      },
      geometry: { type: 'Point', coordinates: [126.9, 23.2] },
    },
    {
      type: 'Feature',
      properties: {
        id: '18',
        time: '2000-08-28 12:00:00',
        strong: '热带低压',
        power: '7',
        speed: '17',
      },
      geometry: { type: 'Point', coordinates: [126.4, 23.3] },
    },
    {
      type: 'Feature',
      properties: {
        id: '19',
        time: '2000-08-28 18:00:00',
        strong: '热带风暴',
        power: '9',
        speed: '23',
      },
      geometry: { type: 'Point', coordinates: [125.9, 23.6] },
    },
    {
      type: 'Feature',
      properties: {
        id: '20',
        time: '2000-08-29 00:00:00',
        strong: '强热带风暴',
        power: '10',
        speed: '28',
      },
      geometry: { type: 'Point', coordinates: [125.5, 24.0] },
    },
    {
      type: 'Feature',
      properties: {
        id: '21',
        time: '2000-08-29 06:00:00',
        strong: '强热带风暴',
        power: '10',
        speed: '28',
      },
      geometry: { type: 'Point', coordinates: [125.1, 24.5] },
    },
    {
      type: 'Feature',
      properties: {
        id: '22',
        time: '2000-08-29 12:00:00',
        strong: '强热带风暴',
        power: '10',
        speed: '28',
      },
      geometry: { type: 'Point', coordinates: [124.5, 25.2] },
    },
    {
      type: 'Feature',
      properties: {
        id: '23',
        time: '2000-08-29 18:00:00',
        strong: '台风',
        power: '12',
        speed: '33',
      },
      geometry: { type: 'Point', coordinates: [124.1, 26.0] },
    },
    {
      type: 'Feature',
      properties: {
        id: '24',
        time: '2000-08-30 00:00:00',
        strong: '台风',
        power: '12',
        speed: '35',
      },
      geometry: { type: 'Point', coordinates: [123.7, 26.9] },
    },
    {
      type: 'Feature',
      properties: {
        id: '25',
        time: '2000-08-30 06:00:00',
        strong: '台风',
        power: '13',
        speed: '38',
      },
      geometry: { type: 'Point', coordinates: [123.3, 28.6] },
    },
    {
      type: 'Feature',
      properties: {
        id: '26',
        time: '2000-08-30 12:00:00',
        strong: '台风',
        power: '13',
        speed: '38',
      },
      geometry: { type: 'Point', coordinates: [123.3, 29.9] },
    },
    {
      type: 'Feature',
      properties: {
        id: '27',
        time: '2000-08-30 18:00:00',
        strong: '台风',
        power: '13',
        speed: '38',
      },
      geometry: { type: 'Point', coordinates: [123.4, 31.7] },
    },
    {
      type: 'Feature',
      properties: {
        id: '28',
        time: '2000-08-31 00:00:00',
        strong: '台风',
        power: '12',
        speed: '35',
      },
      geometry: { type: 'Point', coordinates: [123.8, 33.6] },
    },
    {
      type: 'Feature',
      properties: {
        id: '29',
        time: '2000-08-31 06:00:00',
        strong: '台风',
        power: '12',
        speed: '35',
      },
      geometry: { type: 'Point', coordinates: [124.0, 35.2] },
    },
    {
      type: 'Feature',
      properties: {
        id: '30',
        time: '2000-08-31 12:00:00',
        strong: '台风',
        power: '12',
        speed: '33',
      },
      geometry: { type: 'Point', coordinates: [125.1, 37.2] },
    },
    {
      type: 'Feature',
      properties: {
        id: '31',
        time: '2000-08-31 18:00:00',
        strong: '热带风暴',
        power: '9',
        speed: '23',
      },
      geometry: { type: 'Point', coordinates: [127.1, 39.6] },
    },
    {
      type: 'Feature',
      properties: {
        id: '32',
        time: '2000-09-01 00:00:00',
        strong: '热带风暴',
        power: '8',
        speed: '20',
      },
      geometry: { type: 'Point', coordinates: [129.0, 41.4] },
    },
    {
      type: 'Feature',
      properties: {
        id: '33',
        time: '2000-09-01 06:00:00',
        strong: '热带低压',
        power: '7',
        speed: '17',
      },
      geometry: { type: 'Point', coordinates: [131.7, 42.6] },
    },
    {
      type: 'Feature',
      properties: {
        id: '34',
        time: '2000-09-01 12:00:00',
        strong: '热带低压',
        power: '7',
        speed: '15',
      },
      geometry: { type: 'Point', coordinates: [134.9, 43.7] },
    },
  ],
}

export const getStormData = (stormType: '199711' | '200012'): IStormData => {
  let stormData = stormType === '199711' ? stormData199711 : stormData200012
  const result: IStormData = {
    name: stormData.name,
    dataList: [],
  }

  for (const feature of stormData['features']) {
    const coord = feature.geometry.coordinates as [number, number]
    const properties = feature.properties
    const temp = {
      id: properties.id,
      time: properties.time,
      strong: properties.strong,
      power: Number(properties.power),
      speed: Number(properties.speed),
      lng: coord[0],
      lat: coord[1],
    }
    result.dataList.push(temp)
  }

  return result
}

export const formatDate = (inputDate: string): string => {
  const date = new Date(inputDate)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hour = ('0' + date.getHours()).slice(-2)

  const formattedDate = month + '月' + day + '日 ' + hour + '时'
  return formattedDate
}

export const generateStormTableData = (data: IStormData): IStormTableRow[] => {
  const result: IStormTableRow[] = data.dataList.map((value) => ({
    id: value.id,
    time: formatDate(value.time),
    powerAndStrong: `${value.power} (${value.strong})`,
    speed: value.speed,
  }))

  return result
}

export const decimalToDMS = (decimal: number): string => {
  var degrees = Math.floor(decimal)
  var minutes = Math.floor((decimal - degrees) * 60)
  return degrees + '° ' + minutes + "'"
}

export const generateGeoJSONByCoord = (coord: [number, number]) => {
  const result = {
    type: 'Feature',
    name: '',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: coord,
    },
  }

  return result
}

export const addStormLayer = async (
  map: mapbox.Map,
  type: '199711' | '200012',
) => {
  map.addSource('storm-point', {
    type: 'geojson',
    data: `/geojson/${type}-point.geojson`,
    attribution: 'name',
  })
  map.addSource('storm-line', {
    type: 'geojson',
    data: `/geojson/${type}-line.geojson`,
    attribution: 'name',
  })
  map.addLayer({
    id: 'storm-line',
    source: 'storm-line',
    type: 'line',
    paint: {
      'line-color': '#2563eb',
      'line-width': 1.5,
    },
  })
  map.addLayer({
    id: 'storm-point',
    source: 'storm-point',
    type: 'circle',
    paint: {
      'circle-stroke-color': '#71717a',
      'circle-stroke-width': 1,
      'circle-radius': [
        'case',
        ['<=', ['to-number', ['get', 'power']], 8],
        4,
        ['+', ['*', ['to-number', ['get', 'power']], 0.2], 2.5],
      ],
      'circle-color': [
        'case',
        ['<=', ['to-number', ['get', 'power']], 8],
        '#4ef04e',
        ['<=', ['to-number', ['get', 'power']], 9],
        '#5281e6',
        ['<=', ['to-number', ['get', 'power']], 11],
        '#e7e827',
        ['<=', ['to-number', ['get', 'power']], 13],
        '#e49c26',
        ['<=', ['to-number', ['get', 'power']], 15],
        '#e276de',
        '#cd0000',
      ],
    },
  })
}
export const updateStormLayer = async (
  map: mapbox.Map,
  type: '199711' | '200012',
) => {
  const point = map.getSource('storm-point') as mapbox.GeoJSONSource
  point.setData(`/geojson/${type}-point.geojson`)
  const line = map.getSource('storm-line') as mapbox.GeoJSONSource
  line.setData(`/geojson/${type}-line.geojson`)
}

export const addTyphoonSymbol = async (
  map: mapbox.Map,
  coord: [number, number],
) => {
  map.addSource('typhoon', {
    type: 'geojson',
    data: generateGeoJSONByCoord(coord) as any,
  })

  const image = await new Promise((resolve) => {
    map.loadImage('/png/typhoon.png', (_, image) => {
      resolve(image)
    })
  })
  map.addImage('typhoon-icon', image as any)
  map.addLayer({
    id: 'typhoon',
    source: 'typhoon',
    type: 'symbol',
    layout: {
      'icon-image': 'typhoon-icon',
    },
  })
}

export const updateTyphoonSymbol = (
  map: mapbox.Map,
  coord: [number, number],
) => {
  const source = map.getSource('typhoon') as mapbox.GeoJSONSource
  source.setData(generateGeoJSONByCoord(coord) as any)
}
