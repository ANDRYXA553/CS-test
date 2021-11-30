import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import Messages from "../interfaces/messages";

const initialSubject = {
    errorMessage: false,
    successMessage: false,
    textOfMessage: ''
}

@Injectable({
    providedIn: 'root'
})

export class MessagesService {

    private messageItem = new BehaviorSubject<Messages>(initialSubject);
    currentMessage = this.messageItem.asObservable();

    constructor() {
    }

    setMessage(messages: Messages) {

        this.messageItem.next(messages);

        setTimeout(() => {
            this.messageItem.next(initialSubject);
        }, 1500);
    }


}
