// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
import 'firebase/database';
import { Observable } from 'rxjs';

export default class RealtimeService {
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

  constructor() {
    firebase.initializeApp(this.config);
    // Get a reference to the database service
    this.db = firebase.database();
  }

  onUser(userId): Observable<any> {
    return new Observable(subscriber => {
      const user = firebase.database().ref(`user${userId}`);
      user.on('value', (snapshot) => {
        console.log('snapshot:', snapshot);
        // if (this.count <= 10) { }
        subscriber.next(snapshot.val());
        this.count++;
        console.log('count', this.count);
      });
    });
  }

  updateUser(userId, newVal) {
    firebase.database().ref(`user${userId}`).set(newVal);
  }
}
