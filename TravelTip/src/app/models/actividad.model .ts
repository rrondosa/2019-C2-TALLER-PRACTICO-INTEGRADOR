import { ILatLng } from "@ionic-native/google-maps";

export interface TipoAct{
    hospedaje?: string;
    actividad?: string;
    transporte?: string;
    gastronomia?: string;
}
export interface Actividad{
    id?:string;
    position	?:ILatLng;
    name		?:string;
    imagen		?:string;
    rating		?:string;
    place_id	?:string;
    price_level	?:string;
    pos_origen	?:ILatLng;
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