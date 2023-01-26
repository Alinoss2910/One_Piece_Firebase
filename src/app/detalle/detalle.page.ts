import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Personaje } from '../personaje';
import { HomePage } from '../home/home.page'


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  id: string = "";
  document: any = [{
    id: "",
    data: {} as Personaje
  }];
  idConsultar = this.activatedRoute.snapshot.paramMap.get('id');
  homePage: HomePage;

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.firestoreService.consultarPorId("personajes", this.idConsultar).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        // Como ejemplo, mostrar el título de la tarea en consola
        console.log(this.document.data.nombre);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Personaje;
      } 
    });
  }

  clicBotonBorrar() {
    this.homePage.clicBotonBorrar();
  }

  clicBotonModificar() {
    this.homePage.clicBotonModificar();
  }

}
