import { UserRole } from "../../shared/interfaces/user-role";

export interface signUpRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
}