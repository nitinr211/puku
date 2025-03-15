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
                    <h1>Create Employee Account</h1>

                    <form @submit.prevent="createNewEmployee">

                      <v-layout row>
                        <v-flex xs12>
                          <v-text-field
                            v-model="formData.name"
                            name="name"
                            label="Employee Name"
                            type="text"
                            required></v-text-field>
                        </v-flex>
                      </v-layout>

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
                          <v-text-field
                            v-model="formData.confirm_password"
                            name="confirm_password"
                            label="Confirm Password"
                            type="password"
                            required></v-text-field>
                        </v-flex>
                      </v-layout>

                      <v-layout row>
                        <v-flex xs12>
                          <v-text-field
                            v-model="formData.security_pin"
                            name="pin"
                            label="Security PIN"
                            type="text"
                            required></v-text-field>
                        </v-flex>
                      </v-layout>

                      <v-layout row>
                        <v-flex xs12>
                          <v-btn block color="primary" dark type="submit">Create Account</v-btn>
                        </v-flex>
                      </v-layout>
                        Already have account ? <router-link to="/employee">Sign In</router-link>
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
  import moment from 'moment'     
  export default {
  data(){
    return{          
      formData:{            
            name:'',
            email:'',
            password:'',           
            confirm_password:'',
            security_pin:'',           
      },  
      feedback:null          
    }
  },
  methods:{    
      createNewEmployee(){
        if(this.security_pin == this.formData.security_pin){
                        // If password matched
            if(this.formData.password == this.formData.confirm_password){
                firebase.auth().createUserWithEmailAndPassword(this.formData.email,this.formData.password)
                .then((user) => {
                    db.collection("employee").doc(user.user.uid).set({
                        id:user.user.uid,
                        name:this.formData.name,
                        created_date:moment().format('DD-MM-YYYY'),
                        timestamp:Date.now()
                    })                  
                })
                .then((user)=>{
                    // Make this user as an admin
                    const addEmployeeRole = functions.httpsCallable('addEmployeeRole')
                    addEmployeeRole({email:this.formData.email})
                    .then(result => {
                        console.log(result);                          
                    })
                })
                .then((user)=>{
                    this.$router.replace('/employee-setup-success')
                })
                .catch((e)=>{
                    this.feedback = e.message;
                })

                }else{
                this.feedback = "Confirm password not matched";
                }
        }
        else{
           this.feedback = "Security PIN not matched";
        }
      },         
    },
    created(){
      // Security PIN
      db.collection("settings").doc('config').onSnapshot(doc =>{
        this.security_pin = doc.data().security_pin
      })
    }      
  }
</script>
  
<style scoped>


.sign-in{
  margin-top:10%;
  color:#1976d2 !important;
}
.feedback-error{
  color: red;
  text-align: center;
}
</style>
