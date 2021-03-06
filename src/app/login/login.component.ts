import {Component, NgModule, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../core/services/user.service';
import {Router} from '@angular/router';
import {Logger} from '../core/services/logger';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule} from '@angular/material';
import {CoreModule} from '../core/core.module';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isSubmitting = false;
  loginForm: FormGroup;
  errorMessage = null;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
  }

  ngOnInit() {
      this.buildLoginForm();
  }

  private buildLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required, Validators.email
      ]),
      password: new FormControl('', Validators.required),
    });
  }

  submitForm() {
    Logger.info(LoginComponent.name, 'submitForm', this.loginForm.value);

    this.isSubmitting = true;
    this.errorMessage = null;

    if (this.loginForm.valid) {
      this.userService
        .attemptAuth(this.loginForm.value)
        .subscribe(
          data => {
            Logger.error(LoginComponent.name, 'submitForm', data);
            this.userService.populate();
          },
          err => {
            Logger.error(LoginComponent.name, 'submitForm', err);
            this.errorMessage = 'Your email and password are incorrect';
            this.isSubmitting = false;
          },
          () => {
            Logger.error(LoginComponent.name, 'submitForm', 'complete');
            this.isSubmitting = false;
          }
        );
    } else {
      this.isSubmitting = false;
      this.errorMessage = 'Please enter your email and password';
    }
  }
}

@NgModule({
  imports: [
    CoreModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    FlexLayoutModule
  ],
  exports: [LoginComponent],
  declarations: [LoginComponent],
})
export class LoginModule {
}

