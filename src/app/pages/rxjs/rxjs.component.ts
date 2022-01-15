import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';
@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [],
})
export class RxjsComponent implements OnInit, OnDestroy {
  // public inverSub: Subscription;
  constructor() {
    // this.retornaObservable()
    //   .pipe(retry(3))
    //   .subscribe(
    //     (valor) => console.log(valor),
    //     (error) => console.warn(error),
    //     () => console.info('termino')
    //   );
    // this.inverSub = this.retornaIntervalo().subscribe(console.log);
  }
  ngOnDestroy(): void {
    // this.inverSub.unsubscribe();
  }

  ngOnInit(): void {}
  retornaIntervalo(): Observable<number> {
    return interval(100).pipe(
      // take(10),
      map((valor) => valor + 1),
      filter((valor) => valor % 2 === 0)
    );
  }
  retornaObservable(): Observable<number> {
    let i = -1;
    const obs$ = new Observable<number>((observer) => {
      const intervalo = setInterval(() => {
        i++;
        observer.next(i);
        if (i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }
        if (i === 2) {
          observer.error('i llego a al valor 2');
        }
      }, 1000);
    });
    return obs$;
  }
}
