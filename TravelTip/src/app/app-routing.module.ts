import { NgModule } from '@angular/core';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';
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
  { path: 'mapa-prueba', loadChildren: './pages/mapa-prueba/mapa-prueba.module#MapaPruebaPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'map-lista', loadChildren: './pages/map-lista/map-lista.module#MapListaPageModule' },
  { path: 'lista-actividades', loadChildren: './pages/admin/lista-actividades/lista-actividades.module#ListaActividadesPageModule' },
  { path: 'maps', loadChildren: './pages/noUser/maps/maps.module#MapsPageModule' },
  // { path: 'map-favoritos', loadChildren: './peges/map-favoritos/map-favoritos.module#MapFavoritosPageModule' },
  { path: 'map-favoritos', loadChildren: './pages/map-favoritos/map-favoritos.module#MapFavoritosPageModule' },
  { path: 'tips', loadChildren: './pages/tips/tips.module#TipsPageModule' },
  // { path: 'tab1', loadChildren: './tab1/tab1.module#Tab1PageModule' },
  // { path: 'tab2', loadChildren: './tab2/tab2.module#Tab2PageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy : PreloadAllModules})],
  exports: [RouterModule]
})

export class AppRoutingModule {}
