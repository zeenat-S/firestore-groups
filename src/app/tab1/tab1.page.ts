import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Group } from '../models/group';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  addGroup = false;
  currentUserEmail: string = "";
  currentUserId: any;
  groups: any[]=[];
  group!: Group;
  members: any[]=[];

  groupForm= new FormGroup({
    groupName: new FormControl('', Validators.required),
    members: new FormControl('', Validators.required)
  })

  constructor(private auth: AuthService, private firestore: AngularFirestore) {
    this.getCurrentUserEmail();
    this.getAllGroups()
  }

  handleNewGroup() {
    this.addGroup = true;
  }

  onCancel() {
    this.addGroup = false;
  }

  logOut() {
    this.auth.logout();
  }

  getCurrentUserEmail() {
    this.auth.getCurrentUserEmail().then(name => {
      this.currentUserEmail = name;
    });
  }

  getAllGroups() {
    this.auth.getCurrentUserEmail().then(async name => {
      // console.log('inside getCurrentUSerDocId : ' + name)
      const query = await this.firestore.collection('users', ref => ref.where('userEmail', '==', name)).get().toPromise();
      if (query?.empty) {
        console.log('No document found with email ' + name);
        return;
      }
      const document = query?.docs[0];
      const docId = document?.id;
      console.log( "inside promise func "+docId);
      this.firestore.collection('users').doc(docId).collection("groups").valueChanges().subscribe(group => {
        this.groups = group;
        console.log("Groups: " + group)
      })
    });
  }

  async addGroups(){
    const groupName = this.groupForm.value.groupName;
    this.group = {
      id: String(this.groups.length++),
      groupName: groupName,
      members: this.members
    }
    this.auth.getCurrentUserEmail().then(async name => {
      // console.log('inside getCurrentUSerDocId : ' + name)
      const query = await this.firestore.collection('users', ref => ref.where('userEmail', '==', name)).get().toPromise();
      if (query?.empty) {
        console.log('No document found with email ' + name);
        return;
      }
      const document = query?.docs[0];
      const docId = document?.id;
      this.firestore.collection('users').doc(docId).collection("groups").add(this.group)
      console.log("Group created: "+ this.group.groupName)
    });
  }

  async addMembers() {
    console.log(this.members)
    const email = this.groupForm.value.members;
    const query = await this.firestore.collection('users', ref => ref.where('userEmail', '==', email)).get().toPromise();
    if (query?.empty) {
      console.log('This email does not exist: ' + email);
      return;
    } 
    const document = query?.docs[0];
    const user = document?.data() as User;
    const name = user.userName
    // console.log(user)
    this.members.push({email: email, name: name});
    console.log("member added: "+email+" "+ name);
  }
}
