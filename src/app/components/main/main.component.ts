import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {OwnerFormComponent} from "../owner-form/owner-form.component";
import {Observable, Subscription} from "rxjs";
import {MessagesService} from "../../sevices/messages.service";
import {OwnerService} from "../../sevices/owner.service";
import {OwnerEntity} from "../../interfaces/OwnerEntity";
import {map} from "rxjs/operators";


@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit, OnDestroy {

    showMessage$: Observable<Boolean> = this.messageService.currentMessage.pipe(map(value => value.successMessage));
    errorMessage$: Observable<Boolean> = this.messageService.currentMessage.pipe(map(value => value.errorMessage));
    textOfMessage$: Observable<string> = this.messageService.currentMessage.pipe(map(value => value.textOfMessage));
    owners: OwnerEntity[] = []

    getOwnersSub: Subscription;
    formOutputSub: Subscription;

    constructor(private ngbModal: NgbModal,
                private messageService: MessagesService,
                private ownerService: OwnerService
    ) {
    }

    ngOnInit(): void {
        this.getOwners()
    }

    getOwners() {
        this.getOwnersSub = this.ownerService.getOwners().subscribe(value => {
            this.owners = value
        });
    }

    openModal() {
        const userForm = this.ngbModal.open(OwnerFormComponent, {centered: true, size: 'lg'});

        this.formOutputSub = userForm.componentInstance.formActivity.subscribe((value: any) => {
            this.getOwners();
        })

    }

    ngOnDestroy() {
        if (this.getOwnersSub) {
            this.getOwnersSub.unsubscribe();
        }
        if (this.formOutputSub) {
            this.formOutputSub.unsubscribe();
        }
    }

}
