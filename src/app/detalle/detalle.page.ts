import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { AlertController, ToastController } from '@ionic/angular'; // Import ToastController
import { FirestoreService } from '../firestore.service'; // Import FirestoreService
import { Informatica } from '../informatica'; // Import Informatica

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false
})
export class DetallePage implements OnInit {

  id: string;
  document: { id: string, data: Informatica };
  isNew: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController, // Inject AlertController
    private toastController: ToastController, // Inject ToastController
    private firestoreService: FirestoreService
  ) {
    this.document = { id: '', data: {} as Informatica };
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id'); // Get the ID from the route
    this.isNew = this.id === 'new';
    if (!this.isNew) {
      this.obtenerArticulo();
    }
  }

  obtenerArticulo() {
    this.firestoreService.consultarPorId('Informatica', this.id).subscribe((resultado) => {
      this.document.id = resultado.payload.id;
      this.document.data = resultado.payload.data() as Informatica;
    });
  }

  clicBotonGuardar() {
    // Append "€" to the price field if not already present
    if (!this.document.data.precio.endsWith('€')) {
      this.document.data.precio += '€';
    }

    if (this.isNew) {
      this.firestoreService.insertar("Informatica", this.document.data).then(() => {
        console.log('Artículo creado correctamente');
        this.router.navigate(['/home']); // Navigate back to home page
      });
    } else {
      this.firestoreService.actualizar("Informatica", this.document.id, this.document.data).then(() => {
        console.log('Artículo modificado correctamente');
        this.router.navigate(['/home']); // Navigate back to home page
      });
    }
  }

  async clicBotonBorrar() {
    const alert = await this.alertController.create({
      header: 'Confirmar borrado',
      message: '¿Estás seguro de que deseas borrar este artículo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Borrado cancelado');
          }
        },
        {
          text: 'Borrar',
          handler: async () => {
            await this.firestoreService.borrar("Informatica", this.document.id);
            console.log('Artículo borrado correctamente');
            const toast = await this.toastController.create({
              message: 'Artículo borrado correctamente',
              duration: 2000
            });
            await toast.present();
            this.router.navigate(['/home']); // Navigate back to home page
          }
        }
      ]
    });

    await alert.present();
  }

  clicBotonCancelar() {
    this.router.navigate(['/home']); // Navigate back to home page
  }
}
