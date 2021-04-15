import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { FileItem } from '../models/file-item';

@Injectable({
  providedIn: 'root',
})
export class CargaImagenesService {
  private CARPETA_IMAGENES = 'img';

  constructor(private db: AngularFirestore) {}

  cargarImagenesFirebase(imagenes: FileItem[]): void {
    const storage = firebase.storage();
    const storageRef = storage.ref();

    for (const item of imagenes) {
      item.estaSubiendo = true;
      if (item.progreso >= 100) {
        continue;
      }
      const uploadTask: firebase.storage.UploadTask = storageRef
        .child(`${this.CARPETA_IMAGENES}/${item.nombreArchivo}`)
        .put(item.archivo);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) =>
          (item.progreso =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        (error) => console.error('Error subiendo', error),
        () => {
          console.log('imagen cargada');
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            item.url = downloadURL;
            item.estaSubiendo = false;
            this.saveImage({
              nombre: item.nombreArchivo,
              url: item.url
            });
          });
        }
      );
    }
  }

  private saveImage(imagen: { nombre: string; url: string }): void {
    this.db.collection(`${this.CARPETA_IMAGENES}`).add(imagen);
  }
}
