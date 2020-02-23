import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from "../../servicios/auth.service";
import { Usuario } from '../../models/usuario.model';
import { UserService } from "../../servicios/user.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage  } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
 
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private authservice :AuthService,
    private userService : UserService,
    private firebaseStorage:AngularFireStorage,
    private firebase : AngularFireAuth
  ) { 
    this.authservice.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        console.log("auth",auth);
        
        this.userService.getOneUser(this.userUid).subscribe(book => {
          this.userAct = book;
          this.userAct.photoUrl = auth.photoURL;
          console.log("book",book);
        
        });
        
        this.authservice.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        })
      }
    })
    console.log("userUid",this.userUid);
    console.log("userAct",this.userAct);
    
    if(this.userUid){
      this.userService.getOneUser(this.userUid).subscribe(book => {
        this.userAct = book;
      });
      console.log("user act:",this.userAct);
      
    } else console.log("NO SE LOGUEO");
  }
  
  public isAdmin: any = null;
  public userUid: string = null;

  private userAct : Usuario = {};  
  signupform: FormGroup;
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  alertCtrl: AlertController;

  async ngOnInit() { 

    // this.urlImage = this.userAct.photoUrl ? this.userAct.photoUrl :"assets/img/avatar.png";
    // console.log(this.userAct.photoUrl );
    
  }

  onFileChanged(e) {
    console.log("click",e);
    
    // this.userAct.photoUrl = event.target.files[0];
    // let reader = new FileReader();
    // reader.onload = (event: any) => {
    //   this.img = event.target.result;
    // }
    // if (this.userAct.photoUrl){
    //   reader.readAsDataURL(event.target.files[0]);
    // }
    // let nombreArchivo="";
    // let datos;


    // this.firebaseStorage.upload(nombreArchivo, datos);



    //ok sdsdsd
    console.log('subir', e.target.files[0]);
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    console.log('arch',e.target.files[0]);
    const filePath = `uploads/profile_${id}`;
    const ref = this.firebaseStorage.ref(filePath);
    const task = this.firebaseStorage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();


console.log("ref",ref.getDownloadURL());

debugger;
    let user = this.firebase.auth.currentUser;
    let v;
    this.urlImage.subscribe(result=> v=result);
    user.updateProfile({
      photoURL: v
    }).then(function() {
      // Update successful.
    }).catch(function(error) {
      // An error happened.
    });
  }
  

  async sendData() {
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });

    loader.present();
    loader.onWillDismiss().then(async l => {
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        cssClass: 'bg-profile',
        message: 'Your Data was Edited!',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
      this.navCtrl.navigateForward('/home-results');
    });
  }

  getCurrentUser() {
    this.authservice.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        this.authservice.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        })
      }
    })
  }

}
