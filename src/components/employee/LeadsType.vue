<template>
  <v-app>
     <EmployeeNavbar/>
    <div>
      <v-content>

        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search Leads"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>

               <v-data-table
          :headers="headers"
          :items="leads"
          :search="search"         
          row
          wrap
          class="elevation-1"
        >
          <template slot="items" slot-scope="props"> 
            <td class="text-xs-left" v-if="props.item.leadRecordUpdateForAdmin == true" @click="updateLeadRecords(props.item.id)">
                <router-link :to="{ name: 'ViewEmployeeLeads', params: {id:props.item.id} }">
                  <p style="color:green">Check Pending Updates</p>
                </router-link>
            </td>  
            <td class="text-xs-left" v-else>
                <router-link :to="{ name: 'ViewEmployeeLeads', params: {id:props.item.id} }">
                No Updates
                </router-link>
            </td>  
            <td class="text-xs-left">
              <router-link :to="{ name: 'ViewEmployeeLeads', params: {id:props.item.id} }">
                #{{ props.item.timestamp }}
              </router-link>
            </td>
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.email }}</td>
            <td class="text-xs-left">{{ props.item.employeeName }}</td>
            <td class="text-xs-left" v-if="props.item.status">
              {{ props.item.status.text }}
            </td>
            <td class="text-xs-left" v-else>
              New 
            </td>           
            
            <td class="text-xs-left">{{ props.item.created_at }}</td>

            <v-btn  fab dark small color="cyan" :to="{name: 'EditEmployeeLeads', params: {id:props.item.id}}">
               <v-icon dark>edit</v-icon>
            </v-btn>
            <v-btn fab dark small color="pink" @click="removeLead(props.item.id)">
               <v-icon dark>remove</v-icon>
            </v-btn>                 
          </template>
        </v-data-table>

    

        <!-- Add Expense Button  -->
        <v-btn :to="{name: 'AddEmployeeLeads'}"
          fab
          bottom
          right
          color="indigo"
          dark
          fixed
        >
          <v-icon>add</v-icon>
        </v-btn>

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
  name:'CounselorLeadsType',
  components: {
     EmployeeNavbar
  },
  data(){
      return{
        currency:'',
        search: '',
        rowsPerPageItems: [8, 16, 24],
        pagination: {
        rowsPerPage: 8
        },
        employeeId:null,
        total_contacted_leads:'',
        total_qualified_leads:'',
        total_working_leads:'',
        total_proposal_sent_leads:'',
        leads:[],
        allstatus: [      
          { id: 2, text: "New" },
          { id: 3, text: "Interested" },
          { id: 4, text: "Pending" },
          { id: 5, text: "Dead Case" },
          { id: 6, text: "No Answer" },
          { id: 7, text: "Call Later" },
          { id: 8, text: "Deferred" },
          { id: 9, text: "Applied" },
          { id: 10, text: "Enrolled" },
          { id: 11, text: "Other" },
        ],
        headers: [
         { text: 'ID', value: 'timestamp', sortable: !1 },
         { text: 'Name', value: 'name', sortable: !1 },
         { text: 'Email', value: 'email', sortable: !1 },
         { text: 'Status', value: 'status', sortable: !1 },
         { text: 'Status Update', value: 'status', sortable: !1 },
         { text: 'Created At', value: 'created_at', sortable: !1 },
         { text: 'Edited At', value: 'edited_at', sortable: !1 },     
       ]

      }
  },
  methods:{
      changeStatus(id,updatedStatus){
        var db = firebase.firestore(); 
        let statusRef = db.collection('leads').doc(id);
          statusRef.update({            
            status:updatedStatus,
            edited_date:moment().format('DD-MM-YYYY'),
            edited_month:moment().format('MM-YYYY'),               
            created_year:moment().format('YYYY'),               
        })
      }
  },
  created(){

      // Current Employee
      var user = firebase.auth().currentUser;
      if (user) {
          this.employeeId = user.uid
          //this.email = user.email
          this.userLoggedin = true;                
      } else {
          this.userLoggedin = false;            
      }      


      // Show All Leads
      let ref = db.collection('leads').where("status.text", "==", this.$route.params.type).orderBy('timestamp', 'desc').where("employeeId", "==", this.employeeId)

      ref.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if(change.type == 'added'){
            let doc = change.doc
            this.leads.push({
              id:doc.id,
              name:doc.data().name,
              email:doc.data().email,
              phone:doc.data().phone,
              website:doc.data().website,
              country:doc.data().country,
              city:doc.data().city,
              company:doc.data().company,
              designation:doc.data().designation,
              source:doc.data().source,
              status:doc.data().status,
              created_at:doc.data().created_date,
              edited_at:doc.data().edited_date,
              //timestamp:moment(doc.data().timestamp).fromNow('lll')
              timestamp:doc.data().timestamp,
            })
          }
        })
      })

      

    },
    computed: {
     
    }
}
</script>

<style>
td{
  text-align: center;
}
</style>
