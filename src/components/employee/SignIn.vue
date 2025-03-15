<template>
  <v-app>
    <!-- Sign In area -->
    <div class="sign-in">
      <v-container>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>

              <v-card>
                <v-card-text>
                  <v-container>
                    <h1>Employee Login</h1>

                    <form @submit.prevent="signIn">

                      <v-layout row>
                        <v-flex xs12>
                          <v-text-field
                            v-model="formData.email"
                            name="email"
                            label="Email"
                            type="email"
                            required></v-text-field>
                        </v-flex>
                      </v-layout>

                      <v-layout row>
                        <v-flex xs12>
                          <v-text-field
                            v-model="formData.password"
                            name="password"
                            label="Password"
                            type="password"
                            required></v-text-field>
                        </v-flex>
                      </v-layout>

                      <v-layout row>
                        <v-flex xs12>
                          <v-btn block color="primary" dark type="submit">Sign In</v-btn>
                        </v-flex>
                      </v-layout>
                        Don't have any account yet ? <router-link to="/create-employee-account">Create Account</router-link>
                        <p class="feedback-error">{{feedback}}</p>

                    </form>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
      </v-container>
    </div>
  </v-app>
</template>


<script>
import db from '@/firebase/init'
import firebase from 'firebase'
const functions = firebase.functions()
export default {
    name:'Setup',
    data () {
      return {        
        errorMessage:null,
        feedback:'',
        formData:{
            email:'',
            password:'',
            currency:'',
            tax:0,
        }
      }
    },
    methods: {      
        signIn(){
          firebase.auth().signInWithEmailAndPassword(this.formData.email,this.formData.password)
          //.then((user)=>{
            //this.$router.replace('/dashboard');                               
          // })
          .then((user)=>{
            
            // Check user is admin
            firebase.auth().onAuthStateChanged(user =>{
              if(user){
                //this.$router.replace('/counselor-dashboard');       

                user.getIdTokenResult().then(idTokenResult => {
                  if(idTokenResult.claims.employee == true){
                      this.$router.replace('/employee-dashboard');         
                  }else{
                    firebase.auth().signOut()
                    .then((user)=>{
                      this.$router.replace('/employee-signin')
                      this.feedback = "Wrong username or password";
                    }); 
                  }
                  console.log(idTokenResult.claims.counselor);            
                })
              
              }
            })          
        })
        .catch((e)=>{
              this.feedback = "Wrong Email or Password"
              //alert(e.message)
        })
      }
    },
    created(){
        
    }
}
</script>

<style>
.setup{
  margin-top:10%;
  color:#1976d2 !important;
}

.sign-in{
  margin-top:10%;
  color:#1976d2 !important;
}
.feedback-error{
  color: red;
  text-align: center;
}
</style>
