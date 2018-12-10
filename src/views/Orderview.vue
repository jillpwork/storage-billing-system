<template>
 <div class="container">
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-top: 1%;">
      <span class="header_title" style="text-shadow:2px 6px 14px #000000;font-size:3em; color:#110f69; font-weight:400; text-transform: uppercase;">Order Detail</span>
      <a class="logout100-form-btn" style="cursor: pointer;color: #dc3545;float:right;margin-top:3%;" @click="logoutButton"><i class="fa fa-power-off"></i>&nbsp;Log Out</a>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12" style="text-align: right;margin: 2% 0 0 0;">
      <a class="create_button" style="cursor: pointer;color: #fff;font-weight:600;float: left;" @click="createOrder">&#x2b; Create Order</a>
      <a class="create_button" style="cursor: pointer;color: #fff;float: right;" @click="newCategory">&#x2b; Add New Category</a>&nbsp;
    </div>
  </div>
  <div style="margin-top: 3%;">
   <div class="container">
    <div class="row">
     <div class="col-md-10 col-md-offset-1">
      <div class="panel panel-default panel-table" style="box-shadow: black 5px 9px 50px;">
       <div class="panel-heading">
        <div class="row">
         <div class="col col-xs-6 text-left">
          <downloadExcel class="btn btn-sm btn-primary btn-create" :data="json_data" :fields="json_fields" name="filename.xls" style="margin-right: 2%;margin-top:31px;background-color: rgb(55, 126, 32);border-color: rgb(55, 126, 32);font-weight: 900;"><i class="fa fa-arrow-circle-down"></i>&nbsp;&nbsp;Back Up Data</downloadExcel>
         </div>
         <div class="col col-xs-6 text-right">
          <button type="button" class="btn btn-sm btn-primary btn-create" @click='reset' style="margin-top: 31px;background-color: rgb(208, 77, 0);    border-color: rgb(208, 77, 0);font-weight: 900;"><i class="fa fa-undo"></i>&nbsp;&nbsp;Reset Filter</button>
         </div>
        </div>
        <div class="row">
          <div class="col col-xs-6">
            <pagination v-model="page" :records="items.length" :per-page="10" v-if="items.length>10"></pagination>
          </div>
        </div>
       </div>
       <div class="table-responsive">
        <table class="table table-striped table-bordered table-list">
         <thead>
          <tr style="color: rgb(17, 15, 105);font-weight: 800;">
           <th class="hidden-xs" style="padding-bottom: 64px;">ID</th>
           <th style="padding-bottom: 26px;">Product Name<br><input type="text" class="form-control" id="usr" v-model="search_name"></th>
           <th style="padding-bottom: 27px;">Category<br>
             <select class="form-control" style="padding: 0px 6px; height: 32px; margin-top: 6px;" v-model="search_cat" @change="getFilterItem">
               <option value=""></option>
               <option v-for="value in categories.category" :key="value" :value="value">{{value.charAt(0).toUpperCase() + value.substr(1)}}</option>
             </select>
           </th>
           <th style="padding-bottom: 64px;">Amount</th>
           <th>Order Date<br><input style="width: 91%;padding: 2px 6px;height: 25px;margin-top: 2px;" type="date" class="form-control" id="usr" v-model="from_date" @change="getFilterItem"><br><input style="width: 91%;margin-top: -16px;padding: 2px 6px;height: 25px;" type="date" class="form-control" id="usr" v-model="to_date" @change="getFilterItem"></th>
           <th style="padding-bottom: 64px;">Note</th>
           <th style="padding-bottom: 64px;text-align:center;" colspan="2">Actions</th>
          </tr>
         </thead>
         <tbody>
          <tr v-if="filterBy(filterBy(itemOrders, search_name, 'pro_name', 'comment'), search_cat, 'category').length <= 0">
            <td colspan="7">No Data Found</td>
          </tr>
          <tr v-for="(item, index) in limitBy(filterBy(filterBy(itemOrders, search_name, 'pro_name', 'comment'), search_cat , 'category'), 10, page * 10 - 10)" v-bind:key="index">
           <td class="hidden-xs">{{ index+1+page * 10 - 10 }}</td>
           <td>{{ item.pro_name }}</td>
           <td>{{ item.category }}</td>
           <td>{{ item.amount }}</td>
           <td>{{ item.order_date }}</td>
           <td>{{ item.comment }}</td>
           <td align="center">
            <a @click="openimage(item.file)" v-if="item.imageType == 'image/png' || item.imageType == 'image/gif' || item.imageType == 'image/jpeg' || item.imageType == 'image/jpg' || item.imageType == 'image/bmp'" data-toggle="modal" data-target="#myModal" style="font-size: 2.5em;color: #110e69;cursor: pointer;"><i class="fa fa-camera"></i></a>
            <a :href="item.file" v-else-if="item.imageType == 'application/pdf' || item.imageType == 'text/plain'" target="_blank" style="font-size: 2.5em;color: #110e69;cursor: pointer;"><i class="fa fa-arrow-circle-down"></i></a>
            <a :href="item.file" v-else-if="item.imageType == 'application/vnd.ms-excel' || item.imageType == 'image/tiff' || item.imageType == 'application/vnd.oasis.opendocument.text'" style="font-size: 2.5em;color: #110e69;cursor: pointer;"><i class="fa fa-arrow-circle-down"></i></a>
            <div class="modal fade" id="myModal" role="dialog" @click="modelClick($event)">
             <div class="modal-dialog" style="margin-top: 12%;">
               <div class="modal-content">
                <div class="modal-body">
                 <div class="loader" v-show="!isLoad" style="margin-top:18px;width: 64px;height: 64px;margin-left: 1%;border: 9px dotted #110f69;border-top: 9px dotted #110f69;border-right: 9px dotted #110f69;border-bottom: 9px dotted #110f69;"></div>
                 <img :src="imageurl" height="100%" width="100%" @load="loaded">
                </div>
                <div class="modal-footer">
                 <button type="button" class="btn btn-default" data-dismiss="modal" @click="closeModel">Close</button>
                </div>
               </div>
              </div>
            </div>
           </td>
           <td><a @click="deleteOrder(item.id, item.file, item.pro_name, item.category, item.amount, item.order_date)" style="font-size: 2.5em;color: #dc3545;cursor: pointer;"><i class="fa fa-trash"></i></a></td>
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
  name: 'Orderview',
  data () {
    return {
      showloder: true,
      itemOrders: [],
      items: [],
      imageurl: '',
      search_name: '',
      search_cat: '',
      from_date: '',
      to_date: '',
      page: 1,
      categories: '',
      isLoad: false,
      json_fields: {
        'Product Name': 'pro_name',
        'Category': 'category',
        'Amount': 'amount',
        'Order Date': 'order_date',
        'Note': 'comment',
        'Images': 'imagename'
      },
      json_data: [],
      json_meta: [
        [
          {
            'key': 'charset',
            'value': 'utf-8'
          }
        ]
      ]
    }
  },
  methods: {
    openimage: function (imgurl) {
      this.isLoad = false
      this.imageurl = imgurl
    },
    modelClick: function (event) {
      if (event.target.id === 'myModal') {
        this.isLoad = false
        this.imageurl = ''
      }
    },
    loaded: function (e) {
      this.isLoad = true
    },
    closeModel: function () {
      this.isLoad = false
      this.imageurl = ''
    },
    created () {
      this.openimage()
    },
    reset: function () {
      this.search_name = ''
      this.search_cat = ''
      this.from_date = ''
      this.to_date = ''
      this.itemOrders = this.items
    },
    createOrder: function () {
      this.$router.push({ name: 'billingForm' })
    },
    logoutButton: function () {
      var thisI = this
      firebase.auth().signOut().then(function () {
        thisI.$router.push({ name: 'login' })
        return false
        // Sign-out successful.
      })
    },
    deleteOrder: function (orderId, imagePath, proName, category, amount, orderDate) {
      var thisI = this
      this.showloder = true
      var db = firebase.firestore()
      var username
      firebase.auth().onAuthStateChanged(function (user) {
        username = user.email
      })
      var jobskillquery = db.collection('users').doc(orderId)
      jobskillquery.delete().then(function () {
        const ref = firebase.storage().refFromURL(imagePath)
        ref.getMetadata().then(function (metadata) {
          ref.delete().then(function () {
            var db = firebase.firestore()
            db.settings({
              timestampsInSnapshots: true
            })
            db.collection('billlogs').add({
              action: 'delete',
              category: category,
              amount: amount,
              order_date: orderDate,
              pro_name: proName,
              username: username,
              deleted_date: new Date()
            })
            thisI.showloder = false
            location.reload()
            console.log('File deleted successfully')
          }).catch(function (error) {
            thisI.showloder = false
            location.reload()
            console.log('File deleted successfully', error)
          })
        })
        console.log('Document successfully deleted!')
      })
    },
    allOrder: function () {
      var db = firebase.firestore()
      var thisI = this
      db.settings({
        timestampsInSnapshots: true
      })
      var docRef = db.collection('users').orderBy('startedAt', 'desc')
      docRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          thisI.showloder = false
          thisI.items.push(Object.assign(doc.data(), { 'id': doc.id }))
          // thisI.json_data.push(doc.data())
          const ref = firebase.storage().refFromURL(doc.data().file)
          ref.getMetadata().then(function (metadata) {
            // console.log(metadata.contentType)
            // thisI.items.push(Object.assign({ 'imageType': metadata.contentType }))
            thisI.json_data.push(Object.assign(doc.data(), { 'imagename': metadata.fullPath }))
          })
        })
        thisI.itemOrders = thisI.items
      }).catch(function (error) {
        console.log('Error getting document:', error)
      })

      var self = this
      firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
          self.$router.push({ name: 'login' })
        }
      })
    },
    newCategory: function () {
      window.open(this.$router.resolve({ name: 'addnewcategory' }).href, '_blank')
    },
    getFilterItem () {
      if (this.search_cat) {
        this.itemOrders = this.items.filter(m => m.category === this.search_cat)
      } else if (this.from_date && this.to_date) {
        this.itemOrders = this.itemOrders.filter(m => m.order_date >= this.from_date && m.order_date <= this.to_date)
      } else {
        this.itemOrders = this.items
      }
    }
  },
  mounted: function () {
    this.allOrder()
    var db = firebase.firestore()
    var thisI = this
    this.showloder = true
    db.settings({
      timestampsInSnapshots: true
    })
    var docRef = db.collection('category')
    docRef.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        thisI.categories = doc.data()
        thisI.showloder = false
      })
    }).catch(function (error) {
      console.log('Error getting document:', error)
    })
  }
}
</script>
<style type="text/css">
.create_button {
  background-color: rgb(17, 15, 105);
  border-radius: 5px;
  color: white;
  padding: .5em;
  text-decoration: none;
  font-weight: 600;
}
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
    z-index: 2;
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
input[type=date]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    display: none;
}
@media only screen and (max-width: 400px) {
    .header_title {
        font-size: 1.5em !important;
    }
}
</style>
