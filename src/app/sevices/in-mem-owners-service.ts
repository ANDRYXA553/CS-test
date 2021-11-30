import {Injectable} from '@angular/core';
import {InMemoryDbService} from "angular-in-memory-web-api";
import {OwnerEntity} from "../interfaces/OwnerEntity";

@Injectable({
    providedIn: 'root'
})
export class InMemOwnersService implements InMemoryDbService {

    constructor() {

    }

    createDb() {
        let owners: OwnerEntity[] = [
            {
                id: 11, firstName: 'John', secondName: 'Wilson', patronymic: 'Henric',
                cars: [{
                    carNumber: 'AX1111HP',
                    producer: 'BMW',
                    model: 'M5',
                    year: '2013'
                }]
            },
            {id: 22, firstName: 'Petr', secondName: 'Neyr', patronymic: 'Philip', cars: []},
            {id: 33, firstName: 'Kali', secondName: 'Windstorm', patronymic: 'Max', cars: []},
        ];

        return {owners};
    }

    genId(owners: OwnerEntity[]): number {
        return owners.length > 0 ? Math.max(...owners.map(owner => owner.id)) + 1 : 11;
    }

}
