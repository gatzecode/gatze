import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    TranslocoModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class SignIn implements OnInit {
  @ViewChild('signInNgForm') signInNgForm!: NgForm;

  appName: string = 'JsVerse';

  alert: { type: any; message: string } = {
    type: 'success',
    message: '',
  };
  signInForm!: UntypedFormGroup;
  showAlert: boolean = false;

  constructor(private _formBuilder: UntypedFormBuilder, private router: Router) {}

  ngOnInit(): void {
    // Create the form
    this.signInForm = this._formBuilder.group({
      email: ['hughes.brian@company.com', [Validators.required, Validators.email]],
      password: ['admin', Validators.required],
      rememberMe: [''],
    });
  }

  signIn(): void {
    // Return if the form is invalid
    if (this.signInForm.invalid) {
      return;
    }

    // Disable the form
    this.signInForm.disable();

    // Hide the alert
    this.showAlert = false;

    // Sign in
    // TODO: Implementar lógica de autenticación aquí
    console.log('Sign in:', this.signInForm.value);

    // Simular una llamada API
    setTimeout(() => {
      // Re-enable the form
      this.signInForm.enable();

      // Reset the form
      this.signInNgForm.resetForm();

      // Show the alert
      this.alert = {
        type: 'success',
        message: 'Sign in successful!',
      };
      this.showAlert = true;

      this.router.navigate(['/dashboard']);
    }, 2000);
  }
}
