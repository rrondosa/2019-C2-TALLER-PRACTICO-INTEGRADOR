import { ComenUsu } from "./comenUsu.model";

export interface ComentarioCantidad{
    comentarioUsuarios :  ComenUsu[]
    cantidad
    favorito : boolean
    cantLike
    meGusta : boolean
}