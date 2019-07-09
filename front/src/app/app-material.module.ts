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
  MatProgressSpinnerModule,
  MatTableModule,
  MatTooltipModule,
  MatSelectModule,
  MatPaginatorModule,
  MatDialogModule,
  MatInputModule,
  MatDatepickerModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatTreeModule,
  MatBadgeModule,
  MatRippleModule
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
  MatProgressSpinnerModule,
  MatTableModule,
  MatTooltipModule,
  MatSelectModule,
  MatPaginatorModule,
  MatDialogModule,
  MatInputModule,
  MatDatepickerModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatTreeModule,
  MatBadgeModule,
  MatRippleModule
];

@NgModule({
  imports: MATERIAL_COMPONENTS,
  exports: MATERIAL_COMPONENTS
})
export class AppMaterialModule { }
