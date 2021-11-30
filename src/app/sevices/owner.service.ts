import {Injectable} from '@angular/core';
import {ICarOwnersService} from "../interfaces/ICarOwnersService";
import {Observable, throwError} from "rxjs";
import {OwnerEntity} from "../interfaces/OwnerEntity";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, retry} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class OwnerService implements ICarOwnersService {
    private ownersUrl = 'api/owners'

    constructor(private http: HttpClient) {
    }

    getOwners(): Observable<OwnerEntity[]> {
        return this.http.get<OwnerEntity[]>(this.ownersUrl).pipe(
            retry(2),
            catchError((err: HttpErrorResponse) => {
                console.log(err)
                return throwError(err)
            })
        )
    }

    getOwnerById(id: number): Observable<OwnerEntity> {
        const url = `${this.ownersUrl}/${id}`
        return this.http.get<OwnerEntity>(url)
    }

    createOwner(owner: any,
    ): Observable<OwnerEntity> {
        const ownerElement = {...owner}
        return this.http.post<OwnerEntity>(this.ownersUrl, ownerElement)
    }

    editOwner(owner: OwnerEntity): Observable<OwnerEntity> {
        const ownerElement = {...owner}
        return this.http.put<OwnerEntity>(this.ownersUrl, ownerElement)
    }

    deleteOwner(id: number): Observable<OwnerEntity[]> {
        const url = `${this.ownersUrl}/${id}`
        return this.http.delete<OwnerEntity[]>(url)
    }


}
