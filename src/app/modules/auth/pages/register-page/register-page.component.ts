import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  standalone: false,
})
export class RegisterPageComponent implements OnInit {
  formRegister: UntypedFormGroup = new UntypedFormGroup({});
  errorMessage: string | null = null;
  submitting = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.formRegister = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  sendRegister(): void {
    if (this.formRegister.invalid || this.submitting) return;

    const { name, email, password } = this.formRegister.value;
    this.submitting = true;
    this.errorMessage = null;

    this.authService.register(name, email, password).subscribe({
      next: () => this.router.navigate(['/', 'auth', 'login']),
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.error?.msg ?? 'No se pudo crear el usuario';
      },
    });
  }
}
