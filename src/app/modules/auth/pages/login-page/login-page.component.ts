import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: false,
})
export class LoginPageComponent implements OnInit {
  errorSession: boolean = false;
  formLogin: UntypedFormGroup = new UntypedFormGroup({});
  passwordFieldType: string = 'password';

  constructor(
    private readonly authService: AuthService,
    private readonly cookie: CookieService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.formLogin = new UntypedFormGroup({
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
      ]),
    });
  }

  sendLogin(): void {
    if (!this.formLogin.valid) return;

    const { email, password } = this.formLogin.value;
    this.authService.sendCredentials(email, password).subscribe(
      (response) => {
        const { tokenSession, usuarioDB } = response;
        this.cookie.set('token', tokenSession, 4, '/');
        localStorage.setItem('USERNAME', usuarioDB.name);
        localStorage.setItem('USERID', usuarioDB._id);
        this.router.navigate(['/', 'tracks']);
      },
      (error) => {
        this.errorSession = true;
        console.error('Authentication failed:', error);
      }
    );
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
