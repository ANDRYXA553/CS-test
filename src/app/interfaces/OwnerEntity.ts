import {CarEntity} from "./CarEntity";

export interface OwnerEntity {
    id: number;
    firstName: string;
    secondName: string;
    patronymic: string;
    cars: CarEntity[]
}