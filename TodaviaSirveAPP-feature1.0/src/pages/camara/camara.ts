import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Select, ActionSheetController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoadingController } from 'ionic-angular';
import { DetallePage } from '../detalle/detalle';
import { PublicacionProvider } from '../../providers/publicacion/publicacion';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { storage, initializeApp, apps } from 'firebase';
import { FIREBASE_CONFIG } from "../../app/firebase.config";


@IonicPage()
@Component({
  selector: 'page-camara',
  templateUrl: 'camara.html',
})
export class CamaraPage {

  @ViewChild(Select) select: Select;

  image: string = null;
  loading
  encontrado
  encontrado1
  acaUrl
  variables = "botella revista carton frasco diario vaso caja planta";

  publicaciones;
  publicacionAux: any = null;
  prefixURL: string = "https://todaviasirve.azurewebsites.net/Content/Images/";
  titulo: any;

  mostrar = false


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private http: HttpClient,
    public loadingCtrl: LoadingController,
    public toast: ToastController,
    public publicacionService: PublicacionProvider,
    public actionsheetCtrl: ActionSheetController
  ) {
    if (!apps.length) {
      initializeApp(FIREBASE_CONFIG);
    }
    //  initializeApp(FIREBASE_CONFIG);
  }

  ionViewDidLoad() {
  }


  buscarPublicacion(item) {
    this.presentLoading();
    this.mostrar = false;
    
    this.publicaciones = this.publicacionService.buscarPublicacion(item);

    this.publicaciones.subscribe(res => {
      if (res["0"] == null) {
        console.log("no se encontro nada");
        this.mostrar = true;
      }
      this.loading.dismiss();
    })

  }

  irADetalle(publi) {
    this.navCtrl.push(DetallePage, { publi });
  }


  //  DESDE LA CAMARA DEL CELULAR ----------------

  async getPictureCam() {
    const options: CameraOptions = {
      quality: 60,
      targetHeight: 600,
      targetWidth: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      //saveToPhotoAlbum: true
    }

    try {

      const resultado = await this.camera.getPicture(options);
      //this.image  =  'data:image/jpeg;base64,' + resultado;
      const imagen = `data:image/jpeg;base64,${resultado}`;
      const pictures = storage().ref('pictures/miFoto');
      this.image = imagen;
      pictures.putString(imagen, 'data_url');
      // const task1 =  pictures.putString(imagen, 'data_url').then(res => {
      //   //this.acaUrl  = res.downloadURL;
      //   //this.mostrarToast ("deberia url"+this.acaUrl,7000);
      //   // otroalgo.downloadURL();
      // });
      //pictures.putString(imagen, 'data_url');
      pictures.getDownloadURL().then(res => {
        this.acaUrl = res;
        this.subirApiJson(res);
      })

    } catch (error) {
      this.mostrarToast("Dato" + error.message, 3000);
    }
  }

  subirApiJson(res) {
    this.presentLoading();

    let pathURL = "https://brazilsouth.api.cognitive.microsoft.com/vision/v1.0/analyze?language=es&visualFeatures=tags"
    let apiKey = "a84d243e248d4e67aee85fce8cace729";

    const headers = new HttpHeaders()
      .set('Ocp-Apim-Subscription-Key', apiKey)
      .set('Content-Type', 'application/json;charset=UTF-8')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT')

    var jsonString = JSON.stringify({ url: res });
    this.http.post(pathURL, jsonString, { headers: headers })
      .subscribe(res => {
        this.encontrado1 = res['tags']
        // Solo trae 3 resultados de nombres menores a 12 caracteres(1 palabra) o mas resultados
        //   si la palabra aun no esta en la lista y es una palabra clave/filtro(relacionado al reciclado)
        var listado = new Array();
        var cantidad = 0;
        for (let item of this.encontrado1) {
          if (cantidad < 3) {
            if (item.name.length < 12) {
              listado.push(item.name);
              cantidad++;
            }
          } else if (this.variables.includes(item.name)) {
            listado.push(item.name);
          }
        }
        //this.encontrado = listado;
        this.loading.dismiss();
        this.openMenu(listado);
      }, (err) => {
        this.loading.dismiss();
        this.mostrarToast(err.status + " error code: " + err.code, 4000);
      });

  }


  //Funcion para mostrar mensaje de error recibe mensaje de error y la duración de el mensaje
  mostrarToast(mensaje: string, duracion: number) {
    this.toast.create({
      message: mensaje,
      duration: duracion
    }).present();
  }


  // DESDE ARCHIVO ----------------------
  getPicture(event) {
    this.publicaciones = null;
    this.image = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.image = event.target.result;
    }
    if (this.image) {
      reader.readAsDataURL(event.target.files[0]);
      this.subirAAPI();
    }

  }


  subirAAPI() {

    this.presentLoading();

    let pathURL = "https://brazilsouth.api.cognitive.microsoft.com/vision/v1.0/analyze?language=es&visualFeatures=tags"
    let apiKey = "a84d243e248d4e67aee85fce8cace729";

    const headers = new HttpHeaders()
      .set('Ocp-Apim-Subscription-Key', apiKey)
      .set('enctype', 'multipart/form-data;charset=UTF-8')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT')

    var formData = new FormData();
    formData.append("image", this.image);

    this.http.post(pathURL, formData, { headers: headers })
      .subscribe(res => {
        this.loading.dismiss();
        /*    this.encontrado = res['tags']; */

        /*    setTimeout(() => {
             this.select.open();
           }, 150);
    */
        this.encontrado1 = res['tags']
        // Solo trae 3 resultados de nombres menores a 12 caracteres(1 palabra) o mas resultados
        //   si la palabra aun no esta en la lista y es una palabra clave/filtro(relacionado al reciclado)
        var listado = new Array();
        var cantidad = 0;
        for (let item of this.encontrado1) {
          if (cantidad < 3) {
            if (item.name.length < 12) {
              listado.push(item.name);
              cantidad++;
            }
          } else if (this.variables.includes(item.name)) {
            listado.push(item.name);
          }
        }
        this.encontrado = listado;
        this.openMenu(listado); // ABRE MENU 
        // if(listado.length <= 4){
        //   this.encontrado = listado;
        // } 
      });

  };


  createButtons(listado) {
    let buttons = [];
    for (let index in listado) {
      let button = {
        text: listado[index],
        handler: () => {
          this.buscarPublicacion(listado[index]);

          return true;
        }

      }

      buttons.push(button);
    }
    return buttons;
  }


  openMenu(listButtons) {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Resultados',
      cssClass: 'action-sheets-basic-page',
      buttons: this.createButtons(listButtons)

    });
    actionSheet.present();
  }


  // LOADING...
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: "espere por favor...",
    });
    this.loading.present();
  }


} // cierre clase
