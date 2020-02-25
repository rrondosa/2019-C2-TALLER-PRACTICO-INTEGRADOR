
export interface TipoAct{
    hospedaje?: string;
    actividad?: string;
    transporte?: string;
}
export interface Actividad{
    id?:string;
    position	?:string;
    name		?:string;
    imagen		?:string;
    rating		?:string;
    place_id	?:string;
    price_level	?:string;
    pos_origen	?:string;
    photo		?:string;
    direccion	?:string;
    web			?:string;
    tel			?:string;
    drive		?:string;
    distanciaM	?:string;
    uid_creador ?:string;
    estado ?:string;
    tipo?:TipoAct;
    precio?:number;
}