import {Observable} from "rxjs";
import {OwnerEntity} from "./OwnerEntity";
import {CarEntity} from "./CarEntity";

export interface ICarOwnersService {
    getOwners(): Observable<OwnerEntity[]>;
    getOwnerById(aId: number): Observable<OwnerEntity>;
    createOwner(
        owner:OwnerEntity,
        aCars: CarEntity[]
    ): Observable<OwnerEntity>;
    editOwner(aOwner: OwnerEntity): Observable<OwnerEntity>;
    deleteOwner(aOwnerId: number): Observable<OwnerEntity[]>;
}