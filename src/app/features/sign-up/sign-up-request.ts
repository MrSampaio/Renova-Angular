import { UserRole } from "../../shared/models/user-role";

export interface signUpRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
}