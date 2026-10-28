import { Component, OnInit } from '@angular/core';

@Component({
  imports: [],
  selector: 'lib-vayzen-ui',
  styles: ``,
  template: `<p>Vayzen UI Core cargado</p>`,
})
export class VayzenUi implements OnInit {
  ngOnInit(): void {
    console.log("VAYZEN INSTALADO CORRECTAMENTE");
  }
}
