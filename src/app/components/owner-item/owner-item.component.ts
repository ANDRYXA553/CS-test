import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {OwnerFormComponent} from "../owner-form/owner-form.component";
import {OwnerEntity} from "../../interfaces/OwnerEntity";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-owner-item',
    templateUrl: './owner-item.component.html',
    styleUrls: ['./owner-item.component.sass']
})
export class OwnerItemComponent implements OnInit, OnDestroy {

    @Input()
    owner: OwnerEntity;
    @Output()
    getOwners = new EventEmitter()

    formOutputSub: Subscription;

    constructor(private ngbModal: NgbModal) {
    }

    ngOnInit(): void {
    }

    openedUserEditModal() {
        const editComponent = this.ngbModal.open(OwnerFormComponent, {centered: true, size: 'lg'});

        editComponent.componentInstance.owner = this.owner;
        this.formOutputSub = editComponent.componentInstance.formActivity.subscribe((value: any) => {
            this.getOwners.next()
        })
    }

    ngOnDestroy() {
        if (this.formOutputSub) {
            this.formOutputSub.unsubscribe();
        }
    }
}
