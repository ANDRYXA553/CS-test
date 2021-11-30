import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {MessagesService} from "../../sevices/messages.service";
import {OwnerEntity} from "../../interfaces/OwnerEntity";
import {OwnerService} from "../../sevices/owner.service";
import {CarEntity} from "../../interfaces/CarEntity";
import {map} from "rxjs/operators";

@Component({
    selector: 'app-owner-form',
    templateUrl: './owner-form.component.html',
    styleUrls: ['./owner-form.component.sass', '../main/main.component.sass']
})


export class OwnerFormComponent implements OnInit, OnDestroy {
    @Output() formActivity = new EventEmitter()
    @Input() owner: OwnerEntity;

    carsNumbers: Observable<string[]>
    isFormSubmited = false;
    createForm: FormGroup;
    carsNumbersSub: Subscription;
    createOwnerSub: Subscription;
    updateOwnerSub: Subscription;
    deleteOwnerSub: Subscription;


    constructor(
        private activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private messagesService: MessagesService,
        private ownerService: OwnerService
    ) {
        this.createFormFunc();

    }

    ngOnInit(): void {
        this.getCarNumbers();
        this.setUserFromState();
    }

    setUserFromState() {
        if (this.owner) {

            this.createForm.patchValue({
                firstName: this.owner.firstName,
                secondName: this.owner.secondName,
                patronymic: this.owner.patronymic,
            });

            this.owner.cars.forEach(car => {
                this.addCar(car)
            });

            this.cars.setValue([...this.owner.cars])
        }
    }

    getCarNumbers() {
        this.carsNumbers = this.ownerService.getOwners().pipe(
            map(value => {
                let carsNumbers: string[] = [];

                value.forEach(owner => {
                    owner.cars.forEach(car => {
                        carsNumbers.push(car.carNumber)
                    })
                })

                return carsNumbers
            })
        )
    }


    createFormFunc() {
        this.createForm = this.fb.group({
                firstName: ['', Validators.compose([Validators.required])],
                secondName: ['', Validators.compose([Validators.required])],
                patronymic: ['', Validators.compose([Validators.required])],
                cars: this.fb.array([])
            }
        );
    }

    addCar(car: CarEntity | undefined = undefined) {
        const regex = /^[A-Z]{2}[0-9]{4}[A-Z]{2}$/m;

        this.cars.push(this.fb.group({
            carNumber: ['', Validators.compose([Validators.required, Validators.pattern(regex)])
            ],
            producer: ['', Validators.required],
            model: ['', Validators.required],
            year: ['', Validators.compose([Validators.required, Validators.min(1990), Validators.max(this.currentYear)])]
        }, {validators: [this.checkUniqueCarNumber(car ? car : undefined)]}))

    }

    deleteCar(index: number) {
        this.cars.removeAt(index);
    }

    closeModal(): void {
        this.activeModal.close();
    }

    submitForm(): void {
        this.isFormSubmited = true;
        if (this.createForm.valid) {
            let owner = this.createForm.value as OwnerEntity;
            owner.id = Date.now();

            this.createOwnerSub = this.ownerService.createOwner(owner).subscribe(response => console.log(response))
            this.formActivity.next();
            this.closeModal();
            this.messagesService.setMessage({
                errorMessage: false,
                successMessage: true,
                textOfMessage: 'User create successful.'
            });
        }
    }


    checkUniqueCarNumber(car: CarEntity | undefined) {

        return (group: FormGroup) => {
            let control = group.controls.carNumber;

            this.carsNumbersSub = this.carsNumbers.subscribe((value) => {
                const regex = /^[A-Z]{2}[0-9]{4}[A-Z]{2}$/m;

                if (!(control.value)) {
                    return control.setErrors({required: true});
                }
                if (!regex.test(control.value)) {
                    return control.setErrors({pattern: true});
                }
                if (value.includes(control.value)) {

                    if (car?.carNumber === control.value) {
                        return null
                    }
                    return control.setErrors({carNumberNotUniq: true});

                } else {
                    return control.setErrors(null);
                }
            })


        }
    }

    checkCarValidity(control: string, index: number, errorType = '') {
        let controlName = this.cars.controls[index] as FormGroup
        for (const controlKey in controlName.controls) {

            if (control === controlKey && errorType === 'require') {
                return (controlName.controls[control].errors?.required && controlName.controls[control].touched);
            }
            if (control === controlKey && errorType === 'min-max') {
                return (controlName.controls.year.errors?.min || controlName.controls.year.errors?.max) && controlName.controls[control].touched
            }
            if (control === controlKey && errorType === 'pattern') {
                return controlName.controls.carNumber.errors?.pattern && controlName.controls[control].touched
            }
            if (control === controlKey && errorType === 'uniq') {
                return controlName.controls.carNumber.errors?.carNumberNotUniq && controlName.controls[control].touched
            }


            if (control === controlKey) {
                return (controlName.controls[control].errors && controlName.controls[control].touched);
            }

        }
        return null
    }

    checkValidity(control: string, errorType = '') {


        for (const controlKey in this.createForm.controls) {

            if (control === controlKey && errorType === 'require') {
                return (this.createForm.controls[control].errors?.required && this.createForm.controls[control].touched);
            }


            if (control === controlKey && errorType === 'uniq') {
                return this.createForm.controls.userName.errors?.carNumberNotUniq && this.createForm.controls[control].touched;
            }

            if (control === controlKey) {
                return (this.createForm.controls[control].errors && this.createForm.controls[control].touched);
            }
        }
    }

    deleteUser() {
        if (this.owner) {

            this.deleteOwnerSub = this.ownerService.deleteOwner(this.owner.id).subscribe(response => console.log(response))
            this.formActivity.next()
            this.activeModal.close();
            this.messagesService.setMessage({
                errorMessage: false,
                successMessage: true,
                textOfMessage: 'User delete successful'
            });
        }
    }

    updateUser() {
        this.isFormSubmited = true

        if (this.createForm.valid) {
            let owner = {...this.owner, ...this.createForm.value};

            this.updateOwnerSub = this.ownerService.editOwner(owner).subscribe(response => console.log(response))
            this.formActivity.next()
            this.activeModal.close();
            this.messagesService.setMessage({
                errorMessage: false,
                successMessage: true,
                textOfMessage: 'User update successful'
            });

        }
    }

    get cars() {
        return this.createForm.get('cars') as FormArray;
    }

    get currentYear() {
        return new Date().getFullYear()
    }

    get formValid() {
        return this.createForm.valid
    }

    ngOnDestroy() {
        if (this.carsNumbersSub) {
            this.carsNumbersSub.unsubscribe();
        }
        if (this.createOwnerSub) {
            this.createOwnerSub.unsubscribe();
        }
        if (this.deleteOwnerSub) {
            this.deleteOwnerSub.unsubscribe();
        }
        if (this.updateOwnerSub) {
            this.updateOwnerSub.unsubscribe();
        }
    }
}
