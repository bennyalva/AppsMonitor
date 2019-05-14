import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatProgressSpinnerModule
} from '@angular/material';

export const MATERIAL_COMPONENTS = [
  MatToolbarModule,
  MatSidenavModule,
  MatButtonModule,
  MatListModule,
  MatIconModule,
  MatCardModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatProgressSpinnerModule
];

@NgModule({
  imports: MATERIAL_COMPONENTS,
  exports: MATERIAL_COMPONENTS
})
export class AppMaterialModule { }
