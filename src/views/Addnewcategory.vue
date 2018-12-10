<template>
<div class="container">
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-top: 1%;">
      <span class="cat_title" style="text-shadow:2px 6px 14px #000000;font-size:3em; color:#110f69; font-weight:400; text-transform: uppercase;">Category</span>
      <a class="logout100-form-btn" style="cursor: pointer;color: #dc3545;float:right;margin-top:3%;" @click="logoutButton"><i class="fa fa-power-off"></i>&nbsp;Log Out</a>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12" style="text-align: right;margin: 2% 0 1% 0;">
      <a class="create_button" style="cursor: pointer;color: #fff;font-weight:600;float: left;" @click="createOrder">&#x2b; Create Order</a>
      <a class="create_button" style="cursor: pointer;color: #fff;float: right;" @click="orderView">&#128065; Order View</a>&nbsp;
    </div>
  </div>
  <div style="margin-top: 3%;">
   <div class="container">
    <div class="row">
     <div class="col-md-10 col-md-offset-1">
      <div class="panel panel-default panel-table" style="box-shadow: black 5px 9px 50px;">
       <div class="panel-heading">
        <div class="row">
         <pagination v-model="page" :records="categories.category.length" :per-page="10" v-if="categories.category.length>10"></pagination>
         <div class="col col-xs-6 text-right">
          <button type="button" data-toggle="modal" data-target="#myModal" @click="addCategory" class="btn btn-sm btn-primary btn-create" style="margin-top: 30px;background-color:#110e69;font-weight: 900;">&#10010; Add New Category</button>
         </div>
         <div class="container">
          <div class="modal fade" id="myModal" role="dialog">
             <div class="modal-dialog" style="margin-top: 12%;">
               <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title" style="font-size: 1.5em;color: rgb(17, 15, 105);font-weight: 600;">Add New Category</h4>
                </div>
                <div v-if="category_alert" class="alert alert-danger" role="alert">{{category_alert}}</div>
                <div class="modal-body" style="text-align: left;">
                  <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12"><p>Category Name :<input type="text" class="form-control" id="usr" v-model="catName"></p></div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12"><p>Re-enter Category Name :<input type="text" onpaste="return false;" v-model="catRename" class="form-control" id="usr"></p></div>
                  </div>
                </div>
                <div class="modal-footer" style="text-align:center;display: block;">
                 <button type="button" data-dismiss="modal" style="color: #f0e6e2;padding: 4px 0px;background-color: rgb(17, 14, 105);font-weight: 600;width: 21%;" class="btn btn-primary btn-create">Close</button>
                 <button type="button" @click="saveCategory" class="btn btn-sm btn-primary btn-create" style="background-color:#110e69;font-weight: 900;width: 21%;">Save</button>
                </div>
               </div>
              </div>
            </div>
         </div>
        </div>
       </div>
       <div class="table-responsive">
        <table class="table table-striped table-bordered table-list">
         <thead>
          <tr style="color: rgb(17, 15, 105);font-weight: 800;">
           <th>ID</th>
           <th style="text-align:center;">Category Name</th>
           <th style="text-align:center;">Actions</th>
          </tr>
         </thead>
         <tbody>
          <tr v-if="datafound"><td colspan="7">Please wait...</td></tr>
          <tr v-if="datafounderror"><td colspan="7">No Data Found</td></tr>
          <tr v-for="(value, index) in limitBy(categories.category, 10, page * 10 - 10)" :key="index" :value="value">
           <td>{{ index+1+page * 10 - 10 }}</td>
           <td>{{ value.charAt(0).toUpperCase() + value.substr(1) }}</td>
           <td>
            <div v-if='value !== "home" && value !== "work"'>
             <a @click="deleteCategory(value)" v-if='value !== "home" && value !== "work"' style="font-size: 2.5em;color: #dc3545;cursor: pointer;"><i class="fa fa-trash"></i></a>
            </div>
            <div v-else>
             <a style="font-size: 2.5em;color: rgb(175, 175, 175);cursor: not-allowed;"><i class="fa fa-trash"></i></a>
            </div>
            </td>
          </tr>
         </tbody>
        </table>
       </div>
      </div>
     </div>
    </div>
   </div>
 </div>
 <div id="overlay" v-if="showloder"><div class="loader"></div></div>
</div>
</template>
<script>
import firebase from 'firebase'
export default {
  name: 'Category',
  data () {
    return {
      categories: {
        category: []
      },
      catArray: '',
      showloder: true,
      catRename: '',
      catName: '',
      category_alert: '',
      datafound: true,
      datafounderror: false,
      page: 1
    }
  },
  methods: {
    addCategory: function () {
      // alert('sds')
      this.catRename = ''
      this.catName = ''
      this.category_alert = ''
    },
    saveCategory: function () {
      var username
      firebase.auth().onAuthStateChanged(function (user) {
        username = user.email
      })
      var db = firebase.firestore()
      var thisI = this
      this.showloder = true
      db.settings({
        timestampsInSnapshots: true
      })
      if (this.catRename === this.catName && this.catName !== '' && this.catRename !== '') {
        this.catArray = this.catName
        var docRef = db.collection('category')
        docRef.doc('categoryId').update({
          'category': firebase.firestore.FieldValue.arrayUnion(thisI.catArray)
        }).then(function () {
          db.collection('categoryCreatedlog').add({
            action: 'create',
            categoryName: thisI.catArray,
            createdDate: new Date(),
            username: username
          })
          thisI.showloder = false
          location.reload(true)
          console.log('Document successfully updated!')
        })
      } else {
        this.showloder = false
        this.category_alert = 'Please enter same category name.'
        // alert('Please enter same category name.')
      }
    },
    deleteCategory: function (catName) {
      var username
      firebase.auth().onAuthStateChanged(function (user) {
        username = user.email
      })
      var db = firebase.firestore()
      var thisI = this
      this.showloder = true
      db.settings({
        timestampsInSnapshots: true
      })
      var docRef = db.collection('category')
      if (catName !== 'home' && catName !== 'work') {
        docRef.doc('categoryId').update({
          'category': firebase.firestore.FieldValue.arrayRemove(catName)
        }).then(function () {
          db.collection('categoryDeletelog').add({
            action: 'delete',
            categoryName: catName,
            deletedDate: new Date(),
            username: username
          })
          location.reload(true)
          console.log('Document successfully updated!')
        })
      } else {
        thisI.showloder = false
        alert('Sorry, Its default category.')
      }
    },
    createOrder: function () {
      this.$router.push({ name: 'billingForm' })
    },
    logoutButton: function () {
      var thisI = this
      firebase.auth().signOut().then(function () {
        thisI.$router.push({ name: 'login' })
        return false
      })
    },
    orderView: function () {
      window.open(this.$router.resolve({ name: 'orderview' }).href, '_blank')
    }
  },
  mounted: function () {
    var db = firebase.firestore()
    var thisI = this
    db.settings({
      timestampsInSnapshots: true
    })
    var docRef = db.collection('category')
    docRef.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        thisI.categories = doc.data()
        thisI.showloder = false
        thisI.datafound = false
      })
    }).catch(function (error) {
      console.log('Error getting document:', error)
      thisI.datafounderror = true
    })
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) {
        thisI.$router.push({ name: 'login' })
      }
    })
  }
}
</script>
<style type="text/css">
.pagination {
  margin: 17px 0;
}
.VuePagination__count {
  margin: -18px 0 10px;
}
.loader {
  margin-top: 23%;
  margin-left: 46%;
  border: 9px dotted rgb(255, 255, 255);
  border-radius: 95%;
  border-top: 9px dotted rgb(255, 255, 255);
  border-right: 9px dotted rgb(255, 255, 255);
  border-bottom: 9px dotted rgb(255, 255, 255);
  width: 90px;
  height: 91px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}
#overlay {
    position: fixed;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 1060;
}
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.panel-table .panel-body{
  padding:0;
}

.panel-table .panel-body .table-bordered{
  border-style: none;
  margin:0;
}

.panel-table .panel-body .table-bordered > thead > tr > th:first-of-type {
    text-align:center;
    width: 100px;
}

.panel-table .panel-body .table-bordered > thead > tr > th:last-of-type,
.panel-table .panel-body .table-bordered > tbody > tr > td:last-of-type {
  border-right: 0px;
}

.panel-table .panel-body .table-bordered > thead > tr > th:first-of-type,
.panel-table .panel-body .table-bordered > tbody > tr > td:first-of-type {
  border-left: 0px;
}

.panel-table .panel-body .table-bordered > tbody > tr:first-of-type > td{
  border-bottom: 0px;
}

.panel-table .panel-body .table-bordered > thead > tr:first-of-type > th{
  border-top: 0px;
}

.panel-table .panel-footer .pagination{
  margin:0;
}
.panel-table .panel-footer .col{
 line-height: 34px;
 height: 34px;
}

.panel-table .panel-heading .col h3{
 line-height: 30px;
 height: 30px;
}

.panel-table .panel-body .table-bordered > tbody > tr > td{
  line-height: 34px;
}
.form-control {
  margin-top: 6px;
  color: #797979;
}
@media only screen and (max-width: 320px) {
    .cat_title {
        font-size: 1.5em !important;
    }
}
</style>
