import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [],
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  public titulo: string = '';
  public tituloSubs$: Subscription;
  constructor(private _router: Router) {
    this.tituloSubs$ = this.getArgumentoRuta().subscribe(({ titulo }) => {
      this.titulo = titulo;
      document.title = titulo;
    });
  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  ngOnInit(): void {}

  getArgumentoRuta(): Observable<any> {
    return this._router.events.pipe(
      filter((event) => event instanceof ActivationEnd),
      filter((event: any) => event.snapshot.firstChild === null),
      map((event: any) => event.snapshot.data)
    );
  }
}
