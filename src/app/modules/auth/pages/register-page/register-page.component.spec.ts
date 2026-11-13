import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { RegisterPageComponent } from './register-page.component';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterPageComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('el formulario es inválido si faltan campos', () => {
    expect(component.formRegister.invalid).toBeTrue();
  });

  it('el formulario es válido con datos correctos', () => {
    component.formRegister.setValue({ name: 'Ana', email: 'ana@test.com', password: '123456' });
    expect(component.formRegister.valid).toBeTrue();
  });

  it('el botón dice "Crear usuario"', () => {
    const btn = fixture.debugElement.query(By.css('.form-action button'));
    expect(btn.nativeElement.innerText).toEqual('Crear usuario');
  });
});
