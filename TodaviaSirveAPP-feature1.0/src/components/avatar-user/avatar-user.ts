import { Component } from '@angular/core';
import { Usuario } from '../../pages/models/usuario.model';

import { UsuarioProvider } from "../../providers/usuario/usuario";
import { Events } from 'ionic-angular';

@Component({
  selector: 'avatar-user',
  templateUrl: 'avatar-user.html'
})
export class AvatarUserComponent {

  usuarioLog: Usuario = null;
  imagesURL: string = "https://todaviasirve.azurewebsites.net/Content/Images/";

  constructor(
    public usuarioProvider : UsuarioProvider,
    public events: Events
  ) {

    this.usuarioLog = this.usuarioProvider.obtenerUsuarioLogueado();

  }

}
