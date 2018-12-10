<template>
  <div>
    <div class="limiter" align="left">
    <div class="container-login100">
      <div class="wrap-login100">
        <div class="login100-form validate-form">
          <span class="login100-form-title p-b-26">
            Welcome
          </span>
          <span class="login100-form-title p-b-48">
            <i class="zmdi zmdi-font"></i>
          </span>
          <div v-if="login_alert" class="alert alert-danger" role="alert">{{login_alert}}</div>
          <div class="wrap-input100" data-validate = "Valid email is: a@b.c">
            <input class="input100 has-val" @keyup.enter="loginButton" type="text" name="email" v-model="email">
            <span class="focus-input100" data-placeholder="Username" v-if="username"></span>
          </div>

          <div class="wrap-input100" data-validate="Enter password">
            <span class="btn-show-pass">
              <!-- <i class="zmdi zmdi-eye"></i> -->
            </span>
            <input class="input100 has-val" @keyup.enter="loginButton" type="password" name="pass" id="pass" v-model='password'>
            <span class="focus-input100" data-placeholder="Password" v-if="pass"></span>
          </div>
          <div class="container-login100-form-btn">
            <div class="wrap-login100-form-btn">
              <div class="login100-form-bgbtn"></div>
              <button class="login100-form-btn" @click="loginButton">
                <span class="login" v-if="loginlable">Login</span>
              </button>
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
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      showloder: false,
      loginlable: true,
      username: true,
      pass: true,
      login_alert: ''
    }
  },
  methods: {
    loginButton: function () {
      this.showloder = true
      this.loginlable = false
      var thisI = this
      if (navigator.onLine) {
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            thisI.$router.push({ name: 'billingForm' })
            return false
          }
        })
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(function (error) {
          var errorCode = error.code
          var errorMessage = error.message
          if (errorCode || errorMessage) {
            thisI.login_alert = 'Invalid email and password.'
            // alert('Invalid email and password.')
            thisI.showloder = false
            thisI.loginlable = true
            return false
          }
        })
      } else {
        this.login_alert = 'please check your network connection.'
        // alert('please check your network connection.')
        this.showloder = false
        this.loginlable = true
      }
    }
  },
  mounted: function () {
    var self = this
    this.login_alert = ''
    if (navigator.onLine) {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          self.$router.push({ name: 'billingForm' })
          return false
        } else {
          self.$router.push({ name: 'login' })
        }
      })
    } else {
      alert('please check your network connection.')
    }
  }
}
</script>

<style>
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
.focus-input100 {

    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
  }
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
