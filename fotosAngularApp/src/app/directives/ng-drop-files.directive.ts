import { FileItem } from '../models/file-item';
import {
  Directive,
  EventEmitter,
  ElementRef,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appNgDropFiles]',
})
export class NgDropFilesDirective {
  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any): void {
    this.mouseSobre.emit(true);
    this._prevenirDetener(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any): void {
    this.mouseSobre.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any): void {
    this.mouseSobre.emit(false);

    const transferencia = this._getTransferencia(event);

    if (!transferencia){
      return;
    }

    this._extraerArchivos(transferencia.files);
    this._prevenirDetener(event);
    this.mouseSobre.emit(false);
  }

  private _getTransferencia(event: any): any{
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _extraerArchivos(archivosList: FileList): void{
    // tslint:disable-next-line: forin
    for (const propiedad in Object.getOwnPropertyNames(archivosList)){
      const temporal = archivosList[propiedad];

      if (this._archivoPuedeSerCargado(temporal)){
        const newArchivo = new FileItem(temporal);
        this.archivos.push(newArchivo);
      }
    }
  }

  // Validaciones
  private _archivoPuedeSerCargado(archivo: File): boolean{
    if (!this._archivoDropeado(archivo.name) && this._isImagen(archivo.type)){
      return true;
    }
    return false;
  }

  private _prevenirDetener(event: any): void{
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoDropeado(nombre: string): boolean{
    for (const archivo of this.archivos){
      if (archivo.nombreArchivo === nombre){
        console.log('existe');
        return true;
      }
    }
    return false;
  }

  private _isImagen(tipoArchivo: string): boolean{
    return (tipoArchivo === '' || tipoArchivo === undefined) ? false : tipoArchivo.startsWith('image');
  }

}
