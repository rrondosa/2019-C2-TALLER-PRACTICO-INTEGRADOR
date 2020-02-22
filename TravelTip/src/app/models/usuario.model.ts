export interface Roles{
    user?: boolean;
    admin?: boolean;
}
export interface Usuario{
    uid?: string;
    nombre?: string;
    apellido?: string;
    email?: string;
    username?: string;
    imagen?: string;
    roles: Roles;
}