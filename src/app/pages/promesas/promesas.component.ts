import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [],
})
export class PromesasComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // const promesa = new Promise((resolve, reject) => {
    //   if (false) {
    //     resolve('Hola mundo');
    //   } else {
    //     reject('Algo salio mal');
    //   }
    // });
    // promesa
    //   .then((mensaje) => {
    //     console.log('Termine', mensaje);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // console.log('Fin');
    this.getUsuarios().then((users) => {
      // console.log(users);
    });
  }
  getUsuarios() {
    return new Promise((resolve, reject) => {
      fetch('https://reqres.in/api/users')
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          resolve(result.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
