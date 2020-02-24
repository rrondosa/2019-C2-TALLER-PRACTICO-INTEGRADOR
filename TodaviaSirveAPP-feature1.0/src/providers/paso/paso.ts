import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paso } from '../../pages/models/paso.model';


@Injectable()
export class PasoProvider {

  constructor(public http: HttpClient) {

  }

  getPasosDePublicacion(idPublicacion: number) {
    return this.http.get("https://todaviasirve.azurewebsites.net/Api/Paso/Publicacion/" + idPublicacion)
    /* return this.http.get("http://localhost:55081/Api/Paso/Publicacion/" + idPublicacion) */
  }

  // BORRAR PASO
  borrarPaso(idPaso) {
    return this.http.delete("https://todaviasirve.azurewebsites.net/api/Paso/" + idPaso);
    /* return this.http.delete("http://localhost:55081/api/Paso/" + idPaso) */
  }


  // EDITAR PASO
  editarPaso(paso: Paso) {

    let pathURL = "http://todaviasirve.azurewebsites.net/Api/Paso/" + paso.id;
    /* let pathURL = "http://localhost:55081/Api/Paso/" + paso.id; */

    const headers = new HttpHeaders()
      .set('enctype', 'multipart/form-data;charset=UTF-8')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT')
      .set('Accept-Charset', 'utf-8')

    var formData = new FormData();
    formData.append("numero", paso.numero);
    formData.append("descripcion", paso.descripcion);
    formData.append("imagen", paso.imagen);

    return this.http.put(pathURL, formData, { headers: headers })
      .subscribe(res => res);

  }



}
