import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { Informatica } from '../informatica';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  informaticaEditando: Informatica;
  idArtSelec: string;

  arrayInformatica: any = [{
    id: "",
    data: {} as Informatica
   }];

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1.5,
    spaceBetween: 10,
    centeredSlides: true
  };

  constructor(private firestoreService: FirestoreService, private router: Router) { // Inject Router
    this.informaticaEditando = {} as Informatica;
    this.obtenerListaInformatica();
  }

  clicBotonInsertar() {
    // Convert price to string and append "€" if not already present
    let precioStr = this.informaticaEditando.precio.toString();
    if (!precioStr.endsWith('€')) {
      this.informaticaEditando.precio = parseFloat(precioStr);
    }

    this.firestoreService.insertar('Informatica', this.informaticaEditando).then(()=>{
        console.log('Artículo de informatica creada correctamente');
        this.informaticaEditando = {} as Informatica;
      },
      (error: any) => {
        console.error(error);
  });
}

obtenerListaInformatica(){
  this.firestoreService.consultar('Informatica').subscribe((resultadoConsultaInformatica) => {
    this.arrayInformatica = [];
    resultadoConsultaInformatica.forEach((datosInformatica: any) => {
      this.arrayInformatica.push({
        id: datosInformatica.payload.doc.id,
        data: datosInformatica.payload.doc.data()
      });
    })
  });
}

navigateToAdd() {
  this.router.navigate(['/detalle', 'new']);
}

selecTarea(artSelec) {
  console.log("Tarea seleccionada: ");
  console.log(artSelec);
  this.idArtSelec = artSelec.id;
  this.informaticaEditando.articulo = artSelec.data.articulo;
  this.informaticaEditando.descripcion = artSelec.data.descripcion;
  this.informaticaEditando.stock = artSelec.data.stock;
  this.informaticaEditando.precio = artSelec.data.precio;
  this.informaticaEditando.imagen = artSelec.data.imagen;
  this.router.navigate(['/detalle', this.idArtSelec]); // Navigate to detalle page
}

clicBotonBorrar() {
  this.firestoreService.borrar("Informatica", this.idArtSelec).then(() => {
    // Actualizar la lista completa
    this.obtenerListaInformatica();
    // Limpiar datos de pantalla
    this.informaticaEditando = {} as Informatica;
  });
}

clicBotonModificar() {
  this.firestoreService.actualizar("Informatica", this.idArtSelec, this.informaticaEditando).then(() => {
    // Actualizar la lista completa
    this.obtenerListaInformatica();
    // Limpiar datos de pantalla
    this.informaticaEditando = {} as Informatica;
  });
}
}
