var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
var AuthService = /** @class */ (function () {
    function AuthService(AFauth, router, db) {
        this.AFauth = AFauth;
        this.router = router;
        this.db = db;
    }
    AuthService.prototype.login = function (email, password) {
        var _this = this;
        return new Promise(function (resolve, rejected) {
            _this.AFauth.auth.signInWithEmailAndPassword(email, password).then(function (user) {
                console.log(user);
                resolve(user);
            }).catch(function (err) { return rejected(err); });
        });
    };
    AuthService.prototype.logout = function () {
        var _this = this;
        this.AFauth.auth.signOut().then(function () {
            _this.router.navigate(['/login']);
        });
    };
    AuthService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [AngularFireAuth, Router, AngularFirestore])
    ], AuthService);
    return AuthService;
}());
export { AuthService };
//# sourceMappingURL=auth.service.js.map