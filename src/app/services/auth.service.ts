import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, setPersistence, browserSessionPersistence, Auth } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { map } from 'rxjs';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private app = initializeApp(environment.firebase);
  private auth: Auth = getAuth(this.app)

  constructor(private af: AngularFireAuth, private router: Router, private firestore: AngularFirestore) {
    setPersistence(this.auth, browserSessionPersistence).then(
      () => {
        console.log("persistence successful")
      }
    ).catch((error) => {
      console.log('Error setting persistence:', error)
    });
  }

  login(email: string, password: string) {
    return this.af.signInWithEmailAndPassword(email, password).then(
      () => {
        console.log("login successful");
        this.router.navigate(['/tabs/tab1']);
      }
    ).catch((error) => {
      console.log("An error occurred.");
    })
  }

  register(email: string, password: string, displayName: string) {
    return this.af.createUserWithEmailAndPassword(email, password).then((credentials) => {
      const user = credentials.user;
      this.firestore.collection('users').add({
        userName: displayName,
        userEmail: email
      }).then(() => console.log(displayName + "successfully added to firestore"))
      return user?.updateProfile({ displayName: displayName })
    })
      .catch(
        (error: any) => {
          console.log("Sign Up failed: " + error);
        }
      );
  }

  logout() {
    return this.af.signOut().then(
      () => {
        console.log("logged out")
        this.router.navigate(['/login'])
      }
    )
  }

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      getAuth(this.app).onAuthStateChanged((user) => {
        if (user) {
          resolve(user.displayName);
        } else {
          reject('No user logged in')
        }
      })
    })
  }

  getCurrentUserID() {
    return new Promise<any>((resolve, reject) => {
      getAuth(this.app).onAuthStateChanged((user) => {
        if (user) {
          resolve(user.uid);
        } else {
          reject('No user logged in')
        }
      })
    })
  }

  getCurrentUserEmail() {
    return new Promise<any>((resolve, reject) => {
      getAuth(this.app).onAuthStateChanged((user) => {
        if (user) {
          resolve(user.email);
        } else {
          reject('No user logged in')
          this.logout()
        }
      })
    })
  }

}



