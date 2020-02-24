import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Usuario } from '../../pages/models/usuario.model';
import { Content } from 'ionic-angular';
import { convertFormatToKey } from 'ionic-angular/umd/util/datetime-util';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable()
export class UsuarioProvider {

  public estaElUsuarioLogueado;  // para saber si el usuario esta logueado
  public usuarioLogueado: Usuario;   // el usuario que se logueo
  public usuarioAux : Usuario
  private userSubject = new BehaviorSubject(this.usuarioAux);
  constructor(public http: HttpClient) {

    this.estaElUsuarioLogueado = false;  // la aplicacion empieza con ningun usuario logueado
  }

  obtenerTodosUsuarios(){
    return this.http.get("https://todaviasirve.azurewebsites.net/api/Usuario")
  }

  obtenerUsuario(id){
    return this.http.get("https://todaviasirve.azurewebsites.net/api/Usuario/" + id)
  }

  // aun no esta creado en el api
  buscarUsuario(dato: string){
    return this.http.get("https://todaviasirve.azurewebsites.net/api/Usuario/Buscar/" + dato)
  }

  
  // seteamos el usuario como logueado, añadiendolo al localStorage
  setearUsuarioLogueado(usuario: Usuario) {
    this.estaElUsuarioLogueado = true;
    this.usuarioLogueado = usuario;
    localStorage.setItem('currentUser', JSON.stringify(usuario));
    this.userSubject.next(this.usuarioLogueado);
  }

    // Lo demas componentes se ponen a la esucha de cambio
    // a través de esté método
    getUserObservable(): Observable<Usuario> {
      return this.userSubject.asObservable();
    }

     // Este método se usa para enviar los cambios a todos los componentes a la escucha
    //   private setUser(user: Usuario) {
    //     this.usuarioAux = user;
    //     // Refrescar user en los observables
    //     this.userSubject.next(this.usuarioAux);
    // }

  // obtenemos datos del usuario logueado, en localStorage
  obtenerUsuarioLogueado() {
  	return JSON.parse(localStorage.getItem('currentUser'));
  }


  // editar Usuario
  editarUsuario(id: Number, usuario: Usuario){

    let pathURL = "http://todaviasirve.azurewebsites.net/Api/Usuario/"+id;

    const headers = new HttpHeaders()
      .set('enctype', 'multipart/form-data;charset=UTF-8')
      .set('Accept-Charset', 'utf-8')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT')

      var formData = new FormData();
      formData.append("username", usuario.username);
      formData.append("pass", usuario.pass);
      formData.append("nombre", usuario.nombre);
      formData.append("apellido", usuario.apellido);
      formData.append("email", usuario.email);
      formData.append("imagen", usuario.imagen);
    

    this.http.put( pathURL, formData , { headers: headers } )
      .subscribe(res => { },
        (err) => { alert("failed"); }
      );

    console.log(usuario);

  }

}
