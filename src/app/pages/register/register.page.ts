import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  register(){
    const email = String(this.registerForm.value.email);
    const displayName = String(this.registerForm.value.name);
    const password = String(this.registerForm.value.password);
    this.auth.register(email, password, displayName).then(()=>{
      this.router.navigate(['/login']);
    });
  }

}
