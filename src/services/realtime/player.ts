import { Observable, Subscriber } from 'rxjs';
import Config from './config';

export default class Player extends Config {

  constructor() {
    super();
  }

  onAllPlayers(): Observable<any> {
    return new Observable(subscriber => {
      const allPlayersRef = this.db.ref(`players/`);
      allPlayersRef.on('value', (snapshot) => {
        subscriber.next(snapshot.val());
        this.count++;
        console.log('count', this.count);
      });
    });
  }

  onPlayer(playerId): Observable<any> {
    return new Observable(subscriber => {
      const playerRef = this.db.ref(`players/${playerId}`);
      playerRef.on('value', (snapshot) => {
        subscriber.next(snapshot.val());
        this.count++;
        console.log('count', this.count);
      });
    });
  }

  addPlayer(keyVal): Observable<any> {
    return new Observable(subscriber => {
      const ref = this.db.ref(`players/`);
      const newRef = ref.push();
      const playerId = newRef.key;
      newRef.set(keyVal);
      subscriber.next(playerId);
      subscriber.complete();
    });
  }

  updatePlayer(playerId, keyVal): Observable<any> {
    return new Observable(subscriber => {
      const timestamp = this.getTimestamp();
      const ref = this.db.ref(`players/${playerId}`);
      const mixed = Object.assign({ lastUpdated: timestamp }, keyVal);
      ref.update(mixed);
      subscriber.next(playerId);
      subscriber.complete();
    });
  }

  updatePlayerAttr(playerId, keyVal) {
    const timestamp = this.getTimestamp();
    const ref = this.db.ref(`players/${playerId}`);
    const mixed = Object.assign({ lastUpdated: timestamp }, keyVal);
    // console.log('updatePlayerAttr', mixed);
    ref.update(mixed);
  }

  getInactivePlayerId(): Observable<any> {
    return new Observable(subscriber => {
      this.db.ref('/players/').orderByChild('status').equalTo('inactive').limitToFirst(1)
        .once('value').then((snapshot) => {
          const snapshotVal = snapshot.val();
          let playerId = null;
          if (snapshotVal) {
            playerId = Object.keys(snapshotVal)[0];
          }
          subscriber.next(playerId);
          subscriber.complete();
        });
    });
  }

  getPlayerById(playerId): Observable<any> {
    return new Observable(subscriber => {
      this.db.ref(`/players/${playerId}/`)
        .once('value').then((snapshot) => {
          const snapshotVal = snapshot.val();
          subscriber.next(snapshotVal);
          subscriber.complete();
        });
    });
  }

  getAllPlayers(): Observable<any> {
    return new Observable(subscriber => {
      this.db.ref(`/players/`)
        .once('value').then((snapshot) => {
          const snapshotVal = snapshot.val();
          subscriber.next(snapshotVal);
          subscriber.complete();
        });
    });
  }
}
