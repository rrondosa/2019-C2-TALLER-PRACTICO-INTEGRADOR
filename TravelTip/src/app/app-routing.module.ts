import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "./guards/auth.guard";
import { NoLoginGuard } from "./guards/no-login.guard";

const routes: Routes = [
  { path: '', loadChildren: './pages/login/login.module#LoginPageModule', canActivate : [NoLoginGuard]  },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule', canActivate : [NoLoginGuard]   },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' },
  { path: 'edit-profile', loadChildren: './pages/edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'home-results', loadChildren: './pages/home-results/home-results.module#HomeResultsPageModule', canActivate:[AuthGuard] },
  { path: 'map-restaurante', loadChildren: './pages/map-restaurante/map-restaurante.module#MapRestaurantePageModule' },
  { path: 'map-hotel', loadChildren: './pages/map-hotel/map-hotel.module#MapHotelPageModule' },
  { path: 'map-actividad', loadChildren: './pages/map-actividad/map-actividad.module#MapActividadPageModule' },
  { path: 'map-transporte', loadChildren: './pages/map-transporte/map-transporte.module#MapTransportePageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
