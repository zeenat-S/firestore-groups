import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

 

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  constructor(private auth: AuthService) { 
    
  }

  ngOnInit() {
  }

  login(){
    const email = String(this.loginForm.value.email)
    const password = String(this.loginForm.value.password);
    this.auth.login(email, password).then(()=>{
      this.auth.getCurrentUserEmail().then((user)=>{
        console.log(user+ " logged in.");
      })
    })
  }
}
