<template>
  <v-app>
      <EmployeeNavbar/>
    <div>

      <v-content>

        <v-container>
          <v-layout row wrap>
            <v-flex lg5>
                <v-card>
                <v-card-title><h4>Lead Report</h4></v-card-title>
                <v-divider></v-divider>
                <v-list dense class="pukulist">             

                    <v-list-tile>
                    <v-list-tile-content>Total Leads:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{this.total_leads}}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                    <v-list-tile-content>My Leads:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{this.my_leads}}</v-list-tile-content>
                    </v-list-tile>             
                
                </v-list>

                </v-card>
            </v-flex>
            <!--
            <v-flex lg7>                
                <v-flex style="margin:auto;">
                    <div class="pie_chart mt-4" :style="{'margin':'auto','background':pieChart}">
                    </div>
                    <div class="mt-4 pie_chart_list d-flex" style="text-align:center;">
                        <span>Sales: 40 </span>
                        <span>Expense: 50 </span>
                    </div>
                </v-flex>    
            </v-flex>
            -->

        </v-layout>
      </v-container>

    </v-content>
  </div>
</v-app>

</template>

<script>
import EmployeeNavbar from '@/components/employee/Navbar'
import db from '@/firebase/init'
import firebase from 'firebase'
import moment from 'moment'
export default {
  name:'ViewCounselorLeads',
  components: {
    EmployeeNavbar
  },
  data(){
      return{
        counselorId:null,  
        total_leads:null,
        my_leads:null,
    }
  },
  methods:{
        
  },
  computed:{
         pieChart(){
         
          return 'conic-gradient(#1976d2 '+50+'%,#bbdefb '+40+'%)';
        }    
  },
  created(){

        // Current Counselor
        var user = firebase.auth().currentUser;
        if (user) {
            this.counselorId = user.uid
            //this.email = user.email
            this.userLoggedin = true;                
        } else {
            this.userLoggedin = false;            
        }       

        // My Leads
        db.collection('leads').where("counselorID", "==", this.counselorId)
        .get()
        .then(snapshot => {
            this.my_leads = snapshot.size;
        })

        // Total Leads
        db.collection('leads')
        .get()
        .then(snapshot => {
            this.total_leads = snapshot.size;
        })

  }


}
</script>

<style>
tbody a{
  font-size: 13px;
  color:black;
  text-decoration: underline;
}

.pie_chart{
    width:300px;
    height:300px;
    border-radius:50%; 
    border:1px solid #DADADA;   
    position:relative;
  }
  .pie_chart_list span{
    position:relative;
  }
  .pie_chart_list span:before{
    content:'';
    position:absolute;
    top:5px;
    margin-left:-15px;
    height:10px;
    width:10px;
    border-radius: 1px;
  }
  .pie_chart_list span:nth-child(1):before{
     background: #1976d2;
  }
  .pie_chart_list span:nth-child(2):before{
    background: #ffe0b2;
    border:1px solid #ffe0b2;
  }
  
</style>
