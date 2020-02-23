export interface Roles{
    user?: boolean;
    admin?: boolean;
}
export interface Usuario{
    id?:string;
    uid?: string;
    nombre?: string;
    apellido?: string;
    email?: string;
    username?: string;
    photoUrl?:string;
    roles?: Roles;
    tipoCliente?:number,
    direccion?:string;
   
}