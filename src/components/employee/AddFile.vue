<template>
  <v-app>
    <EmployeeNavbar/>
    <v-content>
      <v-flex lg6>  
      <form @submit.prevent="addFile">
        <v-card>
          <v-container grid-list-sm class="pa-4 add_item_category_vue">
            <v-layout row wrap>
              <v-flex xs12 align-center justify-space-between>
                <v-layout align-center>
                  <v-text-field
                    placeholder="File Name"
                    required
                    v-model="file_name"
                  ></v-text-field>
                </v-layout>
              </v-flex>

              <v-flex xs12 align-center justify-space-between>  
                <v-layout align-center>                                   
                  <input type="file" @change="uploadFile"/>                   
                </v-layout>
               
                <v-progress-linear
                  :active="loading"
                  :indeterminate="loading"                   
                  color="primary"
                ></v-progress-linear>
              </v-flex>             
          
              <v-flex xs12>
                <v-btn type="submit" color="primary" block dark>Add File</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </form>
      </v-flex>
    </v-content>
  </v-app>
</template>

<script>
  import EmployeeNavbar from '@/components/employee/Navbar'
  import db from '@/firebase/init'
  import firebase from "firebase";
  import moment from 'moment'
  export default {
    name:'AddFile',
    components:{
      EmployeeNavbar
    },
    data(){
      return{
        dialog:null,
        file_name:null,
        employeeId:null,
        employeeName:null,
        image:null,       
        timestamp:null,
        loading: null,
        feedback:null,
        interval: {}, // progress bar
        value: 0, // progress bar
      }
    },
    watch: {
      loading (val) {
        if (!val) return
        setTimeout(() => (this.loading = false), 4000)
      },
    }, 
    methods:{
      addFile(){
        var db = firebase.firestore();
        if(this.file_name){
        let ref = db.collection('lead-files');
          ref.add({
            id:this.$route.params.id,  
            file_name:this.file_name,
            image:this.image,            
            employeeId:this.employeeId,
            addBy:this.account.name,           
            adding_date:moment().format('DD-MM-YYYY'),
            created_month:moment().format('MM-YYYY'),
            timestamp:Date.now()
          })
          this.file_name=null
          this.category_icon=null
        }
        this.$router.push({ name: 'ViewEmployeeLeads'})
      },       
      uploadFile(e){
        if(e.target.files[0]){
          
            let file = e.target.files[0];
      
            var storageRef = firebase.storage().ref('files/'+ Math.random() + '_'  + file.name);
      
            let uploadTask  = storageRef.put(file);
      
            uploadTask.on('state_changed', (snapshot) => {
              
            }, (error) => {
              // Handle unsuccessful uploads
            }, () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                this.image=downloadURL;
                console.log(downloadURL);                
              });
            }); 
            this.loading = true            
        }
      }  
    },
    created(){
        // Current User
        var user = firebase.auth().currentUser;
        if (user) {
            this.employeeId = user.uid
            //this.email = user.email
            this.userLoggedin = true;                
        } else {
            this.userLoggedin = false;            
        }
        
        // Employee Profile Information        
        db.collection("employee").doc(this.employeeId).onSnapshot(doc =>{
          this.account = doc.data()          
        })   
    }
  }
</script>

<style>
.primary--text {
    color: #345B2C !important;
    caret-color: #345B2C !important;
}
</style>
