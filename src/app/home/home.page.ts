import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Personaje } from '../personaje';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';


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

  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private socialSharing: SocialSharing
    ) {
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

  agregarPersonaje() {
    this.router.navigate(['/detalle/nuevo']);
  }
  
  compartir() {
    const options = {
      message: 'Este es mi mensaje para compartir',
      chooserTitle: 'Compartir con'
    };
    
    this.socialSharing.shareWithOptions(options)
      .then(() => {
        console.log('Mensaje compartido correctamente');
      }).catch((error) => {
        console.log('Error al compartir el mensaje: ', error);
      });
    
  }

}
