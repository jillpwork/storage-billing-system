<template>
<div class="container">
 <!-- <div class="header-w3l"> -->
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-top: 1%;">
      <span class="header_title" style="margin-left: 6%;text-shadow:2px 6px 14px #000000;font-size:3em; letter-spacing:6px; color:#110f69; font-weight:400; text-transform: uppercase;">New Bill</span>
      <a class="logout100-form-btn" style="cursor: pointer;color: #dc3545;float:right;margin-top:3%;" @click="logoutButton"><i class="fa fa-power-off"></i>&nbsp;Log Out</a>
    </div>
  </div>
  <div class="row" style="text-align:right;">
    <div class="col-lg-12 col-md-12 col-sm-12" style="margin: 2% 0 1% 0;">
      <a class="create_button" style="margin-right: 1%;cursor: pointer;color: #fff;" @click="orderView">&#128065; Order View</a>&nbsp;
      <a class="create_button" style="cursor: pointer;color: #fff;" @click="newCategory">&#x2b; Add New Category</a>&nbsp;
    </div>
  </div>
  <!-- <div style="float: right;margin: -32px 47px 42px 0px;">
   <a class="create_button" style="cursor: pointer;color: #fff;margin-left: 30px" @click="orderView">&#128065; Order View</a>
   <a class="create_button" style="cursor: pointer;color: #fff;margin-left: 30px" @click="newCategory">&#x2b; Add New Category</a>
   <a class="logout100-form-btn" style="cursor: pointer;color: #110f69;text-decoration: underline;margin-left: 30px;" @click="logoutButton">Logout</a>
  </div> -->
 <!-- </div> -->
 <div class="main-agileits" style="box-shadow: 5px 9px 50px #000000;border: 1px solid;">
  <!-- <div class="v_logo">&nbsp</div> -->
  <div id="snackbar" v-if="snackbar" v-bind:style="{ background: activeColor }">{{ message }}</div>
  <!-- <h2 class="sub-head">Order Billing Form</h2> -->
  <div class="sub-main" style="margin-top: 23px;">
   <div style="line-height: 172%;">
    <input style="width:67%;margin: 1% 0% 0% 15%;" class="form-control" name="name" id="name" v-model="productname"  placeholder="Enter Product Name"/>
    <span v-if='productname_alert' style="color:red;float: left;align-items: center;margin-left: 15%;">* {{productname_alert}}</span>
    <br>
    <input style="width:67%;margin: 0px 0px 0% 15%;" class="form-control" name="amount" id="amount" v-model="amount" placeholder="Enter Amount" @keypress="keymonitor"/>
    <span v-if='amount_alert' style="color:red;float: left;align-items: center;margin-left: 15%;">* {{amount_alert}}</span>
    <br>
    <div>
     <textarea placeholder="Add Note" style="border: 1px solid rgb(0, 0, 45);color: rgb(4, 4, 4);width: 66%;margin: 0px 0px 0% -3%;" rows="4" cols="39" v-model="note" name="comment" id="comment" form="usrform"></textarea>
     <span v-if='comment_alert' style="color:red;float: left;align-items: center;margin-left: 15%;">* {{comment_alert}}</span>
    </div>
    <br>
    <div style="margin-top: 4px;">
     <span style="font-weight: 600;color: #fffffe;margin-right: 48%;color: rgb(9, 0, 43);">Select category :</span>
     <select style="width: 67%;padding: 0px 9px;margin: 0% 0px 0% 15%;" class="form-control" id="category_option" v-model="category">
      <option v-for="value in categories.category" :key="value" :value="value">{{value.charAt(0).toUpperCase() + value.substr(1)}}</option>
     </select>
     <span v-if='category_alert' style="color:red;float: left;align-items: center;margin-left: 15%;">* {{category_alert}}</span>
    </div>
    <br>
    <span style="font-weight: 600;color: rgb(20, 9, 57);margin-right: 53%;">Order Date :</span>
    <input style="border: 1px solid rgba(0, 0, 45, 1);" type="date" class="form-control" name="order_date" id="order_date"  placeholder="Enter Order Date" v-model="date"/>
    <span v-if='orderdate_alert' style="color:red;float: left;align-items: center;margin-left: 15%;">* {{orderdate_alert}}</span>
    <br>
    <span style="font-weight: 600;color: rgb(20, 9, 57);margin-right: 52%;">Select image :</span>
    <input style="padding: 3px 11px;color: black;width: 66%;margin: 0% 0px 0px 15%;" type="file" class="form-control" name="file" id="file" @change="filename" accept="image/x-png,image/gif,image/jpeg,image/jpg,image/tiff,image/bmp,application/pdf,.xls,.txt,.odt" placeholder="add image"/>
    <span v-if='image_alert' style="color:red;float: left;align-items: center;margin-left: 15%;">* {{image_alert}}</span>
    <br>
    <div class="form-group" style="margin-left: 27%;">
     <button class="registration" style="margin: 0 0 0 32px;" @click="registrationButton" :disabled="regbutton == true">
      <span class="registration_lable" v-if="reglable">Submit</span>
     </button>
    </div>
   </div>
  </div>
 </div>
 <div id="overlay" v-if="showloder"><div class="loader"></div></div>
</div>
</template>
<script>
import firebase from 'firebase'
// import router from '../router'
export default {
  name: 'Billing',
  data () {
    return {
      showloder: false,
      reglable: true,
      productname: '',
      amount: '',
      note: '',
      category: 'home',
      date: '',
      file: '',
      message: '',
      snackbar: false,
      url: '',
      regbutton: false,
      categories: '',
      activeColor: '#f54d4d',
      productname_alert: '',
      amount_alert: '',
      comment_alert: '',
      category_alert: '',
      orderdate_alert: '',
      image_alert: ''
    }
  },
  methods: {
    registrationButton: function () {
      this.regbutton = true
      this.showloder = true
      this.reglable = false
      this.productname_alert = ''
      this.amount_alert = ''
      this.comment_alert = ''
      this.category_alert = ''
      this.orderdate_alert = ''
      this.image_alert = ''
      var self = this
      if (document.getElementById('file').files.length !== 0 && this.productname !== '' && this.amount !== '' && this.note !== '' && this.category !== '' && this.date !== '' && this.file !== '') {
        if (this.file.type === 'application/vnd.ms-excel' || this.file.type === 'text/plain' || this.file.type === 'image/png' || this.file.type === 'image/gif' || this.file.type === 'image/jpeg' || this.file.type === 'image/jpg' || this.file.type === 'image/tiff' || this.file.type === 'image/bmp' || this.file.type === 'application/pdf' || this.file.type === 'application/vnd.ms-excel' || this.file.type === 'application/vnd.oasis.opendocument.text') {
          const ref = firebase.storage().ref()
          const name = (+new Date()) + '-' + this.file.name
          const metadata = {
            contentType: this.file.type
          }
          const task = ref.child(name).put(this.file, metadata)
          task
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then((url) => {
              self.url = url
              if (url !== '') {
                var file1 = self.url
                var db = firebase.firestore()
                db.settings({
                  timestampsInSnapshots: true
                })
                db.collection('users').add({
                  pro_name: self.productname,
                  category: self.category,
                  amount: self.amount,
                  order_date: self.date,
                  comment: self.note,
                  file: file1,
                  imageType: this.file.type,
                  startedAt: new Date()
                })
                  .then(function (docRef) {
                    self.productname = ''
                    self.category = ''
                    self.amount = ''
                    self.date = ''
                    self.note = ''
                    self.file = ''
                    self.url = ''
                    self.showloder = false
                    self.reglable = true
                    self.input = ''
                    var fileLoader = document.getElementById('file')
                    fileLoader.value = null
                    self.snackbar = true
                    self.message = 'Order added successfully.'
                    self.activeColor = 'green'
                    setTimeout(function () { self.snackbar = false }, 2000)
                    self.regbutton = false
                  })
              }
            })
        } else {
          this.snackbar = true
          this.message = 'File format is not valid'
          this.activeColor = '#f54d4d'
          setTimeout(function () { self.snackbar = false }, 2000)
          this.showloder = false
          self.regbutton = false
          this.reglable = true
          return false
        }
      } else {
        this.snackbar = true
        if (this.productname === '') { this.productname_alert = 'This field is required' }
        if (this.amount === '') { this.amount_alert = 'This field is required' }
        if (this.note === '') { this.comment_alert = 'This field is required' }
        if (this.category === '') { this.category_alert = 'This field is required' }
        if (this.date === '') { this.orderdate_alert = 'This field is required' }
        if (this.file === '') { this.image_alert = 'This field is required' }
        this.message = 'Please fill all field.'
        this.activeColor = '#f54d4d'
        setTimeout(function () { self.snackbar = false }, 2000)
        this.showloder = false
        self.regbutton = false
        this.reglable = true
        return false
      }
    },
    filename: function (event) {
      var files = event.target.files[0]
      this.file = files
    },
    logoutButton: function () {
      var thisI = this
      firebase.auth().signOut().then(function () {
        thisI.$router.push({ name: 'login' })
        return false
      })
    },
    keymonitor: function (event) {
      this.amount = this.amount.replace(/[^0-9.]/g, '')
      if ((event.which !== 46 || this.amount.indexOf('.') !== -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault()
      }
    },
    orderView: function () {
      window.open(this.$router.resolve({ name: 'orderview' }).href, '_blank')
    },
    newCategory: function () {
      window.open(this.$router.resolve({ name: 'addnewcategory' }).href, '_blank')
    }
  },
  mounted: function () {
    var self = this
    this.showloder = true
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        self.$router.push({ name: 'billingForm' })
        var db = firebase.firestore()
        db.settings({
          timestampsInSnapshots: true
        })
        var docRef = db.collection('category')
        docRef.get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            self.categories = doc.data()
            self.showloder = false
          })
        }).catch(function (error) {
          console.log('Error getting document:', error)
        })
        return false
      } else {
        self.showloder = false
        self.$router.push({ name: 'login' })
      }
    })
  }
}
</script>
<style type="text/css">
.registration{
 color: #fff7f7;background: #444444;
}
.registration{
  border: none;
  width: 152px;
  height: 40px;
  margin-top: 29px;
  cursor: pointer;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: #110f69;
  font-size: 13px;
  color: #fff;
  text-transform: uppercase;
  font-family: "Muli-SemiBold";
  border-radius: 20px;
  overflow: hidden;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  position: relative;
  -webkit-transition-property: color;
  transition-property: color;
  -webkit-transition-duration: 0.5s;
  transition-duration: 0.5s;
}
.registration:hover {
 background: #bcb3ee;
 color: #110f69;
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
#order_date{
  font-size: 1.1em;
  margin: 0px 0px 0px 83px;
  color: black;
  padding: 5px 10px;
  border: none;
  border-radius: 2px;
  width: 66%;
  font-family: 'Lato', sans-serif;
}
  /*toaster*/
#snackbar {
 min-width: 383px;
 margin-left: -187px;
 background-color: #f54d4d;
 color: #fff;
 text-align: center;
 border-radius: 2px;
 padding: 16px;
 position: fixed;
 z-index: 1;
 left: 49%;
 margin-top: 5%;
 /* bottom: 30px; */
 font-size: 17px;
 bottom:100px;
}

#snackbar {
 visibility: visible;
 -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
 animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 100px; opacity: 1;}
}

@keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 100px; opacity: 1;}
}

@-webkit-keyframes fadeout {
    from {bottom: 100px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
    from {bottom: 100px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
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
