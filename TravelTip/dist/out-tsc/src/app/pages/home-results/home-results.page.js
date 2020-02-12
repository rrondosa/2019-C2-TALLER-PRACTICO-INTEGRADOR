var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Component } from '@angular/core';
import { NavController, AlertController, MenuController, ToastController, PopoverController, ModalController } from '@ionic/angular';
// Modals
import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';
import { ImagePage } from './../modal/image/image.page';
// Call notifications test by Popover and Custom Component.
import { NotificationsComponent } from './../../components/notifications/notifications.component';
// geolocation
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
var HomeResultsPage = /** @class */ (function () {
    function HomeResultsPage(navCtrl, menuCtrl, popoverCtrl, alertCtrl, modalCtrl, toastCtrl, plataform, geolocation, nativeGeocoder) {
        this.navCtrl = navCtrl;
        this.menuCtrl = menuCtrl;
        this.popoverCtrl = popoverCtrl;
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this.toastCtrl = toastCtrl;
        this.plataform = plataform;
        this.geolocation = geolocation;
        this.nativeGeocoder = nativeGeocoder;
        this.latitude = "";
        this.longitude = "";
        this.timestamp = "";
        this.searchKey = '';
        this.yourLocation = '123 Test Street';
        this.themeCover = 'assets/img/ionic4-Start-Theme-cover.jpg';
        //Geocoder configuration
        this.geoencoderOptions = {
            useLocale: true,
            maxResults: 5
        };
    }
    //Get current coordinates of device
    HomeResultsPage.prototype.getGeolocation = function () {
        var _this = this;
        this.geolocation.getCurrentPosition().then(function (resp) {
            _this.geoLatitude = resp.coords.latitude;
            _this.geoLongitude = resp.coords.longitude;
            _this.geoAccuracy = resp.coords.accuracy;
            _this.getGeoencoder(_this.geoLatitude, _this.geoLongitude);
        }).catch(function (error) {
            alert('Error getting location' + JSON.stringify(error));
        });
    };
    //geocoder method to fetch address from coordinates passed as arguments
    HomeResultsPage.prototype.getGeoencoder = function (latitude, longitude) {
        var _this = this;
        this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
            .then(function (result) {
            _this.geoAddress = _this.generateAddress(result[0]);
        })
            .catch(function (error) {
            alert('Error getting location' + JSON.stringify(error));
        });
    };
    //Return Comma saperated address
    HomeResultsPage.prototype.generateAddress = function (addressObj) {
        var obj = [];
        var address = "";
        for (var key in addressObj) {
            obj.push(addressObj[key]);
        }
        obj.reverse();
        for (var val in obj) {
            if (obj[val].length)
                address += obj[val] + ', ';
        }
        return address.slice(0, -2);
    };
    //Start location update watch
    HomeResultsPage.prototype.watchLocation = function () {
        var _this = this;
        this.isWatching = true;
        this.watchLocationUpdates = this.geolocation.watchPosition();
        this.watchLocationUpdates.subscribe(function (resp) {
            _this.geoLatitude = resp.coords.latitude;
            _this.geoLongitude = resp.coords.longitude;
            _this.getGeoencoder(_this.geoLatitude, _this.geoLongitude);
        });
    };
    //Stop location update watch
    HomeResultsPage.prototype.stopLocationWatch = function () {
        this.isWatching = false;
        this.watchLocationUpdates.unsubscribe();
    };
    HomeResultsPage.prototype.loadMap = function () {
        var _this = this;
        this.geolocation.getCurrentPosition().then(function (resp) {
            var latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            _this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
            _this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            _this.map.addListener('tilesloaded', function () {
                console.log('accuracy', _this.map);
                _this.getAddressFromCoords(_this.map.center.lat(), _this.map.center.lng());
            });
        }).catch(function (error) {
            console.log('Error getting location', error);
        });
    };
    HomeResultsPage.prototype.getAddressFromCoords = function (lattitude, longitude) {
        var _this = this;
        console.log("getAddressFromCoords " + lattitude + " " + longitude);
        var options = {
            useLocale: true,
            maxResults: 5
        };
        this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
            .then(function (result) {
            _this.yourLocation = "";
            var responseAddress = [];
            for (var _i = 0, _a = Object.entries(result[0]); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (value.length > 0)
                    responseAddress.push(value);
            }
            responseAddress.reverse();
            for (var _c = 0, responseAddress_1 = responseAddress; _c < responseAddress_1.length; _c++) {
                var value = responseAddress_1[_c];
                _this.yourLocation += value + ", ";
            }
            _this.yourLocation = _this.yourLocation.slice(0, -2);
        })
            .catch(function (error) {
            _this.yourLocation = "Address Not Available!";
        });
    };
    // GetLocation() {
    //       var ref = this;
    //       let watch = this.geolocation.watchPosition();
    //       watch.subscribe((position)=>{
    //         var gps= new google.maps.LatLng( position.coords.latitude, position.coords.longitude);
    //         if(ref.marker == null){
    //           ref.marker = new google.maps.Marker({
    //             position:gps,
    //             map:ref.map,
    //             title:'mi position'
    //           })
    //         }else{
    //           ref.marker.setPosition(gps);
    //         }
    //         ref.map.panTo(gps);
    //         ref.latitude = position.coords.latitude.toString();
    //         ref.longitude = position.coords.longitude.toString();
    //         ref.timestamp = (new Date(position.timestamp)).toString();
    //       })
    // }
    HomeResultsPage.prototype.ionViewWillEnter = function () {
        this.menuCtrl.enable(true);
    };
    HomeResultsPage.prototype.settings = function () {
        this.navCtrl.navigateForward('settings');
    };
    HomeResultsPage.prototype.alertLocation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var changeLocation;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            header: 'Change Location',
                            message: 'Type your Address.',
                            inputs: [
                                {
                                    name: 'location',
                                    placeholder: 'Enter your new Location',
                                    type: 'text'
                                },
                            ],
                            buttons: [
                                {
                                    text: 'Cancel',
                                    handler: function (data) {
                                        console.log('Cancel clicked');
                                    }
                                },
                                {
                                    text: 'Change',
                                    handler: function (data) { return __awaiter(_this, void 0, void 0, function () {
                                        var toast;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.log('Change clicked', data);
                                                    this.yourLocation = data.location;
                                                    return [4 /*yield*/, this.toastCtrl.create({
                                                            message: 'Location was change successfully',
                                                            duration: 3000,
                                                            position: 'top',
                                                            closeButtonText: 'OK',
                                                            showCloseButton: true
                                                        })];
                                                case 1:
                                                    toast = _a.sent();
                                                    toast.present();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }
                                }
                            ]
                        })];
                    case 1:
                        changeLocation = _a.sent();
                        changeLocation.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    HomeResultsPage.prototype.searchFilter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalCtrl.create({
                            component: SearchFilterPage
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HomeResultsPage.prototype.presentImage = function (image) {
        return __awaiter(this, void 0, void 0, function () {
            var modal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalCtrl.create({
                            component: ImagePage,
                            componentProps: { value: image }
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HomeResultsPage.prototype.notifications = function (ev) {
        return __awaiter(this, void 0, void 0, function () {
            var popover;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.popoverCtrl.create({
                            component: NotificationsComponent,
                            event: ev,
                            animated: true,
                            showBackdrop: true
                        })];
                    case 1:
                        popover = _a.sent();
                        return [4 /*yield*/, popover.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HomeResultsPage = __decorate([
        Component({
            selector: 'app-home-results',
            templateUrl: './home-results.page.html',
            styleUrls: ['./home-results.page.scss']
        }),
        __metadata("design:paramtypes", [NavController,
            MenuController,
            PopoverController,
            AlertController,
            ModalController,
            ToastController,
            Platform,
            Geolocation,
            NativeGeocoder])
    ], HomeResultsPage);
    return HomeResultsPage;
}());
export { HomeResultsPage };
//# sourceMappingURL=home-results.page.js.map