import { Subject } from 'rxjs';

export default class MessageService {

  subject = new Subject<any>();

  constructor() { }

  sendMessage(content: object) {
    this.subject.next(content);
  }
}
