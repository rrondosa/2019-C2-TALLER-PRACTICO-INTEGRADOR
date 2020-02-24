import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { YtProvider } from "../../providers/yt/yt";
import { PasoProvider } from '../../providers/paso/paso';
import { UsuarioProvider } from "../../providers/usuario/usuario";
import { PublicacionProvider } from "../../providers/publicacion/publicacion";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ComenUsu } from '../models/comenUsu.model';
import { ComentarioCantidad } from '../models/ComentarioCantidad.model';


@IonicPage()
@Component({
  selector: 'page-detalle',
  templateUrl: 'detalle.html',
})
export class DetallePage {

  publicacion;
  imagenURL: string = "https://todaviasirve.azurewebsites.net/Content/Images/";
  videosEncontrados: any;
  signupform: FormGroup;
  valor: string = null;
  usuario;
  comentarioCantidad
  cantidad 
  listadoComentarios
  valor2: ComentarioCantidad
  pasos
  loading: any;
  realizoComentario: boolean = false
  cargarColor : string = null;
  esFavorito : boolean = false;
  respuesta;
  comentario;
  cantLike
  meGusta : boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public ytProvider: YtProvider,
    public pasoProvider: PasoProvider,
    public http: HttpClient,
    public usuarioProv : UsuarioProvider,
    public publicacionProvider : PublicacionProvider,
    public loadingCtrl: LoadingController

  ) {
    this.publicacion = navParams.get("publi");
    this.usuario = this.usuarioProv.obtenerUsuarioLogueado();
    this.pasoProvider.getPasosDePublicacion(this.publicacion.id)
      .subscribe(res => this.pasos = res)
  
    this.publicacionProvider.obtenerComentarioPublicacion(this.publicacion.id,this.usuario.id)
      .subscribe(res => {
        this.valor2 = res
        this.listadoComentarios = res.comentarioUsuarios
        this.cantidad = this.valor2.cantidad
        this.esFavorito = this.valor2.favorito
        this.cantLike = this.valor2.cantLike
        this.meGusta = this.valor2.meGusta
        console.log(this.cantidad);
        console.log(this.esFavorito);
        console.log(this.listadoComentarios);
      });
     


    //this.comentarioCantidad = this.listadoComentarios.cantidad;
    //this.listadoComentarios = this.listadoComentarios.comentarioUsuarios;
  
    // API PARA TRAER LOS VIDEOS DE YOUTUBE
    this.ytProvider.obtenerVideos(this.publicacion.titulo).subscribe(res => this.videosEncontrados = res['items']);
  }

  ionViewDidLoad() {
    this.signupform = new FormGroup({
      comentario: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(150)])
    });
    console.log(this.cargarColor);
  }

  cargarFavorito(){
    if(!this.esFavorito){
      console.log("va a setear");
        this.publicacionProvider.seleccionarFavorito(this.publicacion.id,this.usuario.id).subscribe(
          res => {
              this.respuesta = res;
              console.log(this.respuesta);
          });
        this.esFavorito = true;
    }else{
      console.log("va a quitar el favorito");
      this.esFavorito = false;
      this.publicacionProvider.eliminarFavorito(this.publicacion.id,this.usuario.id).subscribe(
       res => {
            var resultado = res;
            console.log(resultado);
       });
    }
  }

  cargarLike(){
    if(!this.meGusta){
      console.log("Da like");
      this.cantLike = this.cantLike + 1;
      console.log(this.cantLike);
        this.publicacionProvider.seleccionarLike(this.publicacion.id,this.usuario.id).subscribe(
          res => {
              this.respuesta = res;
              console.log(this.respuesta);
          });
        this.meGusta = true;
    }else{
      console.log("va a quitar el like");
      this.meGusta = false;
      this.cantLike = this.cantLike - 1 ; 
      console.log(this.cantLike);
      this.publicacionProvider.eliminarLike(this.publicacion.id,this.usuario.id).subscribe(
       res => {
            var resultado = res;
            console.log(resultado);
       });
    }
  }

  cargarPublicacion(){
    if(this.valor == null){
       this.valor = "Cargado";
       console.log(this.valor);
    // this.publicacionProvider.obtenerComentarioPublicacion(this.publicacion.id)
    // .subscribe(res => this.listadoComentarios = res);
    console.log(this.listadoComentarios);
    }else if (this.realizoComentario) {
      this.publicacionProvider.obtenerComentarioPublicacion(this.publicacion.id,this.usuario.id)
      .subscribe(res => {
        this.valor2 = res
        this.listadoComentarios = res.comentarioUsuarios
        this.cantidad = this.valor2.cantidad
        console.log(this.cantidad);
        console.log(this.listadoComentarios); 
      });
      this.signupform.reset();
      this.realizoComentario = false
    }
    else{
      this.valor = null
    }

  }

  submitComentario(){
    this.loading = this.loadingCtrl.create({ content: " espere por favor..." });
    this.loading.present();
     /* let pathURL = "http://localhost:55081/Api/Publicacion/subirComentario" */
    let pathURL = "https://todaviasirve.azurewebsites.net/Api/Publicacion/subirComentario"

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('enctype', 'multipart/form-data;charset=UTF-16');
    headers.append('Accept-Charset', 'utf-8');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');

    var formData = new FormData();
    formData.append("comentario", this.comentario);
    formData.append("idUsuario", this.usuario.id);
    formData.append("idPublicacion", this.publicacion.id);

    this.http.post( pathURL, formData, { headers: headers } )
      .subscribe(res => {
        this.loading.dismiss();
        this.realizoComentario = true
        this.cargarPublicacion();
        //  alert("success " + res); 
        },
        (err) => {
          this.loading.dismiss();
           alert("failed"); }

      );

      
      console.log(formData);
    console.log("Comentario" + this.comentario + " IdPublicacion: " + this.publicacion.id + " IdUsuario: " + this.usuario.id);
  }
} // cierre DetallePage
