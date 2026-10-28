import { __decorate } from "tslib";
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
let App = class App {
    title = signal('vayzen-docs');
};
App = __decorate([
    Component({
        imports: [RouterOutlet],
        selector: 'app-root',
        styleUrl: './app.css',
        templateUrl: './app.html',
    })
], App);
export { App };
