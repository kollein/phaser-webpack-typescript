// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
import 'firebase/database';
import { Observable } from 'rxjs';

export default class Config {
  // Set the configuration for your app
  // TODO: Replace with your project's config object
  config = {
    apiKey: 'AIzaSyBH28NfLxBibAZOUCD3h65KbCP7YsLVQ0I',
    authDomain: 'repick-e617b.firebaseapp.com',
    databaseURL: 'https://repick-e617b.firebaseio.com',
    projectId: 'repick-e617b',
    storageBucket: 'repick-e617b.appspot.com',
    messagingSenderId: '182562652427',
    appId: '1:182562652427:web:efc8f1565e6f39c27ca20e'
  };
  db: firebase.database.Database;
  count = 0;
  userBase: object;

  constructor() {
    firebase.initializeApp(this.config);
    // Get a reference to the database service
    this.db = firebase.database();
  }

  getUserbase(options) {
    const timestamp = this.getTimestamp();
    this.userBase = Object.assign({
      status: 'inactive',
      name: 'Robot',
      blood: 100,
      created: timestamp,
      lastUpdated: timestamp,
      props: {
        x: 150,
        y: 100,
        direction: 'right',
      }
    }, options);
    return this.userBase;
  }

  initData() {
    const timestamp = this.getTimestamp();
    this.db.ref('/').set({
      players: {
        1: {
          status: 'inactive',
          name: 'Vinh',
          blood: 100,
          created: timestamp,
          lastUpdated: timestamp,
          props: {
            x: 50,
            y: 100,
          }
        },
        2: {
          status: 'inactive',
          name: 'Vinh 2',
          blood: 100,
          created: timestamp,
          lastUpdated: timestamp,
          props: {
            x: 50,
            y: 100,
          }
        },
        3: {
          status: 'active',
          name: 'Vinh 3',
          blood: 100,
          created: timestamp,
          lastUpdated: timestamp,
          props: {
            x: 50,
            y: 100,
          }
        },
      },
      weapons: {
        booms: {
          xyz1: { owned: 1, level: 3 },
          xyz2: { owned: 1, level: 1 }
        }
      },
      created: timestamp,
    });
  }

  getTimestamp() {
    return new Date().getTime();
  }
}
