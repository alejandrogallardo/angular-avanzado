import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})

export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {

    // this.regresaObservable().pipe(
    //   retry() esto solo fue un ejemplo
    // )
    this.subscription = this.regresaObservable()
    .subscribe( 
      numero => console.log('Sub: ', numero ),
      error => console.error('Error en el obs: ', error ),
      ( ) => console.log( 'OBS termino!' )
    );

  }

  ngOnInit() {
  }

  // OnDestroy para des-susbcribirse
  ngOnDestroy(){
    console.log('La pagina se va a cerrar');
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable( (observer: Subscriber<any>) => {
      
      let contador = 0;

      let intervalo = setInterval( () => {
        //contador += 1;

        contador++;

        const salida = {
          valor: contador
        };

        observer.next( salida );

        // if (contador === 3) {
        //   clearInterval( intervalo );
        //   observer.complete();
        // }

        // if ( contador === 2 ) {
        //   // clearInterval( intervalo )
        //   observer.error('Auxilio!')
        // }

      }, 1000 );
    }).pipe(
      map( resp => {
        return resp.valor; // se especifica el return para que no regrese indefinido
      }),
      // filter recibe dos argumentos valor, index
      filter( ( valor, index ) => {
        // console.log('Filter: ', valor, index);

        if ( (valor % 2) === 1 ) {
          // impar
          return true;
        } else {
          // par
          return false;
        }
        // return true; // filter retorna un boolean
      })
    );
  }
}
