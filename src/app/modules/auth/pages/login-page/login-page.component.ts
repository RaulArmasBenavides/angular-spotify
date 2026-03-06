import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css'],
    standalone: false
})
export class LoginPageComponent implements OnInit {
  errorSession: boolean = false;
  formLogin: UntypedFormGroup = new UntypedFormGroup({});
  passwordFieldType: string = 'password';
  constructor(
    private readonly authService: AuthService,
    private readonly cookie: CookieService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.formLogin = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
      ]),
    });
  }

  sendLogin(): void {
    const { email, password } = this.formLogin.value;
    this.authService
      .sendCredentials(email, password)
      //TODO: 200 <400
      .subscribe(
        (responseOk) => {
          //TODO: Cuando el usuario credenciales Correctas ✔✔
          console.log('Session iniciada correcta', responseOk);
          const { tokenSession, data, usuarioDB } = responseOk;
          this.cookie.set('token', tokenSession, 4, '/'); //TODO:📌📌📌📌
          localStorage.setItem('USERNAME', usuarioDB.name);
          localStorage.setItem('USERID', usuarioDB._id);
          this.router.navigate(['/', 'tracks']);
        },
        (err) => {
          //TODO error 400>=
          this.errorSession = true;
          console.error('⚠⚠⚠⚠Ocurrio error con tu email o password');
        }
      );
  }

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
