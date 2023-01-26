import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Personaje } from '../personaje';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  personajeEditando: Personaje;
  arrayColeccionPersonajes: any = [{
    id: "",
    data: {} as Personaje
  }];
  idPersonajeSelec: string;

  constructor(private firestoreService: FirestoreService, private router: Router) {
    //Crear un personaje vacio al empezar
    this.personajeEditando = {} as Personaje;

    this.obtenerListaPersonajes();
  }

  clicBotonInsertar() {
    this.firestoreService.insertar("personajes", this.personajeEditando)
    .then(() => {
      console.log("Personaje creado correctamente");
      //Limpiar el contenido del personaje que se estaba editando
      this.personajeEditando = {} as Personaje;
    }, (error) => {
      console.error(error);
    });
  }

  obtenerListaPersonajes() {
    this.firestoreService.consultar("personajes").subscribe((resultadoConsultaPersonajes) => {
      this.arrayColeccionPersonajes = [];
      resultadoConsultaPersonajes.forEach((datosPersonaje: any) => {
        this.arrayColeccionPersonajes.push({
          id: datosPersonaje.payload.doc.id,
          data: datosPersonaje.payload.doc.data()
        })
      })
    }
    )
  }

  selecPersonaje(personajeSelec) {
    console.log("Personaje seleccionado: ");
    console.log(personajeSelec);
    this.idPersonajeSelec = personajeSelec.id;
    this.personajeEditando.nombre = personajeSelec.data.nombre;
    this.personajeEditando.banda = personajeSelec.data.banda;
    this.personajeEditando.recompensa = personajeSelec.data.recompensa;
    this.router.navigate(['/detalle', this.idPersonajeSelec]);
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("personajes", this.idPersonajeSelec).then(() => {
      //Actualizar lista completa
      this.obtenerListaPersonajes();
      // Limpiar datos de la pantalla
      this.personajeEditando = {} as Personaje
    })
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("personajes", this.idPersonajeSelec, this.personajeEditando).then(() => {
      // Actualizar la lista completa
      this.obtenerListaPersonajes();
      // Limpiar datos de pantalla
      this.personajeEditando = {} as Personaje;
    })
  }

}
