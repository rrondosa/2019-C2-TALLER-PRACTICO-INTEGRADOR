import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable, Component, NgModule } from '@angular/core';
import 'rxjs/add/operator/map';

import { Publicacion } from "../../pages/models/publicacion.model";
import { Paso } from '../../pages/models/paso.model';
import { ComentarioCantidad } from '../../pages/models/ComentarioCantidad.model';


@Injectable()
export class PublicacionProvider {

  constructor(public http: HttpClient
  ) {

  }

  // TRAE TODAS LAS PUBLICACIONES
  obtenerTodasPublicaciones() {
    return this.http.get("https://todaviasirve.azurewebsites.net/api/Publicacion")
    /* return this.http.get("http://localhost:55081/Api/Publicacion") */
  }

  // TRAE UNA PUBLICACION POR ID
  obtenerPublicacion(id) {
    return this.http.get("https://todaviasirve.azurewebsites.net/api/Publicacion/" + id)
  }

  // BUSCADOR DE PUBLICACIONES
  buscarPublicacion(titulo: string) {
    return this.http.get("https://todaviasirve.azurewebsites.net/api/Publicacion/Buscar/" + titulo)
    /* return this.http.get("http://localhost:55081/api/Publicacion/Buscar/" + titulo) */
  }

  // BORRAR PUBLICACION POR ID
  borrarPublicacion(idPubli) {
    return this.http.delete("https://todaviasirve.azurewebsites.net/api/Publicacion/" + idPubli);
    /* return this.http.delete("http://localhost:55081/api/Publicacion/" + idPubli) */
  }

  // EDITAR PUBLICACION
  editarPublicacion(publi: Publicacion) {
    let pathURL = "http://todaviasirve.azurewebsites.net/Api/Publicacion/" + publi.id;
    /* let pathURL = "http://localhost:55081/Api/Publicacion/" + publi.id; */

    const headers = new HttpHeaders()
      .set('enctype', 'multipart/form-data;charset=UTF-8')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT')
      .set('Accept-Charset', 'utf-8')

    var formData = new FormData();
    formData.append("titulo", publi.titulo);
    formData.append("subtitulo", publi.subtitulo);
    formData.append("descripcion", publi.descripcion);
    formData.append("fechaSubida", publi.fechaSubida);
    formData.append("imagenPortada", publi.imagenPortada);

    return this.http.put(pathURL, formData, { headers: headers })
      .subscribe(res => res);
  }

  // SUBIR PUBLICACION
  subirPublicacion(publi: Publicacion) {
    //let pathURL = "http://localhost:55081/Api/Publicacion/PostPublicacion"; 
    let pathURL = "http://todaviasirve.azurewebsites.net/Api/Publicacion/PostUsuario";
    const headers = new HttpHeaders()
      .set('enctype', 'multipart/form-data;charset=UTF-8')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT')
      .set('Accept-Charset', 'utf-8')

    var formData = new FormData();
    formData.append("titulo", publi.titulo);
    formData.append("subtitulo", publi.subtitulo);
    formData.append("descripcion", publi.descripcion);
    formData.append("fechaSubida", publi.fechaSubida);
    formData.append("imagenPortada", publi.imagenPortada);
    formData.append("idUsuario", publi.idUsuario);

    return this.http.post(pathURL, formData, { headers: headers });
  }


  // SUBIR PASOS
  subirPaso(paso: Paso, idPublicacion) {
    let pathURL = "http://todaviasirve.azurewebsites.net/Api/Paso/";
    /* let pathURL = "http://localhost:55081/Api/Paso/"; */

    const headers = new HttpHeaders()
      .set('enctype', 'multipart/form-data;charset=UTF-8')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT')
      .set('Accept-Charset', 'utf-8')

    var formData = new FormData();
    formData.append("numero", paso.numero);
    formData.append("descripcion", paso.descripcion);
    formData.append("imagen", paso.imagen);
    formData.append("idPublicacion", idPublicacion);

    this.http.post(pathURL, formData, { headers: headers })
      .subscribe(res => {
        console.log("Subido: " + res);
      },
        /*         (error) => {
                  console.log(error);
                  alert("Se ha producido un error al subir el paso: " + error);
                } */
      );

  }


  //OBTENER LAS PUBLICACIONES DE UN USUARIO
  obtenerPublicacionesUsuario(id) {
    //return this.http.get("https://todaviasirve.azurewebsites.net/Api/Publicacion/PublicacionesUsuario/" + id)
    return this.http.get("https://todaviasirve.azurewebsites.net/Api/Publicacion/PublicacionesUsuario/" + id)
  }

  // eliminarPublicacion(idPublicacion, idUsuario) {
  //   console.log("por eliminar publicacion con este id : " + idPublicacion);
  //   return this.http.delete("http://localhost:55081/Api/Publicacion/PublicacionesUsuario/" + idUsuario)
  //   /* return this.http.get("http://localhost:55081/Api/Publicacion/DeletePublicacionUsuario/"+idPublicacion+"/"+idUsuario)  */
  // }

  obtenerComentarioPublicacion(idPublicacion, idUsuario) {
    console.log("buscar comentarios de esta publicacion " + idPublicacion);
    // return this.http.get<ComentarioCantidad>("https://todaviasirve.azurewebsites.net/Api/Publicacion/obtenerComentarioPublicacion/"+idPublicacion+"/"+idUsuario)    
    return this.http.get<ComentarioCantidad>("https://todaviasirve.azurewebsites.net/Api/Publicacion/obtenerComentarioPublicacion/" + idPublicacion + "/" + idUsuario)
  }

  seleccionarFavorito(idPublicacion, idUsuario) {
    console.log("Seleccionar comentarios idPublicacion : " + idPublicacion + "Usuario:" + idUsuario);
    // return this.http.get("https://todaviasirve.azurewebsites.net/Api/Publicacion/seleccionarFavorito/"+idPublicacion+"/"+idUsuario)         
    /* return this.http.get("http://localhost:55081/Api/Publicacion/seleccionarFavorito/"+idPublicacion+"/"+idUsuario)    */
    return this.http.get("https://todaviasirve.azurewebsites.net/Api/Publicacion/seleccionarFavorito/" + idPublicacion + "/" + idUsuario)
  }
  seleccionarLike(idPublicacion, idUsuario) {
    console.log("Seleccionar comentarios idPublicacion : " + idPublicacion + "Usuario:" + idUsuario);
    // return this.http.get("https://todaviasirve.azurewebsites.net/Api/Publicacion/seleccionarFavorito/"+idPublicacion+"/"+idUsuario)         
    /* return this.http.get("http://localhost:55081/Api/Publicacion/seleccionarLike/"+idPublicacion+"/"+idUsuario)    */
    return this.http.get("https://todaviasirve.azurewebsites.net/Api/Publicacion/seleccionarLike/" + idPublicacion + "/" + idUsuario)
  }
  eliminarFavorito(idPublicacion, idUsuario) {
    console.log("Seleccionar comentarios idPublicacion : " + idPublicacion + "Usuario:" + idUsuario);
    // return this.http.get("https://todaviasirve.azurewebsites.net/Api/Publicacion/seleccionarFavorito/"+idPublicacion+"/"+idUsuario)         
    /*  return this.http.delete("http://localhost:55081/Api/Publicacion/eliminarFavorito/"+idPublicacion+"/"+idUsuario)   */
    return this.http.delete("https://todaviasirve.azurewebsites.net/Api/Publicacion/eliminarFavorito/" + idPublicacion + "/" + idUsuario)
  }
  eliminarLike(idPublicacion, idUsuario) {
    console.log("eliminar like idPublicacion : " + idPublicacion + "Usuario:" + idUsuario);
    // return this.http.get("https://todaviasirve.azurewebsites.net/Api/Publicacion/seleccionarFavorito/"+idPublicacion+"/"+idUsuario)         
    /* return this.http.delete("http://localhost:55081/Api/Publicacion/eliminarLike/"+idPublicacion+"/"+idUsuario)    */
    return this.http.delete("https://todaviasirve.azurewebsites.net/Api/Publicacion/eliminarLike/" + idPublicacion + "/" + idUsuario)
  }

  obtenerFavoritos(idUsuario) {
    console.log("Seleccionar comentarios idPublicacion : ");
    // return this.http.get("https://todaviasirve.azurewebsites.net/Api/Publicacion/seleccionarFavorito/"+idPublicacion+"/"+idUsuario)         
    /* return this.http.get("http://localhost:55081/Api/Publicacion/ObtenerFavoritos/"+idUsuario)  */
    return this.http.get("https://todaviasirve.azurewebsites.net/Api/Publicacion/ObtenerFavoritos/" + idUsuario)
  }
  // obtenerTodasPublicaciones2() {
  //   //return this.http.get("https://todaviasirve.azurewebsites.net/api/Publicacion")
  //   return this.http.get("http://localhost:55081/api/Publicacion/")  
  // }

} // cierre clase