<template>
    <div class="container">

        <div class="login">
            <h1>Login</h1>
            <div class="mdui-textfield">
                <i class="mdui-icon material-icons">account_circle</i>
                <label class="mdui-textfield-label" for="user">用户名</label>
                <input  class="mdui-textfield-input" v-model="user" id="user" type="text">
            </div>
            <div class="mdui-textfield">
                <i class="mdui-icon material-icons">lock</i>
                <label class="mdui-textfield-label" for="pwd">密码</label>
                <input class="mdui-textfield-input" v-model="pwd" id="pwd" type="password">
            </div>
            <div>
                <button class="mdui-ripple mdui-color-theme-900" @click="login">登录</button>
            </div>
        </div>
    </div>
</template>

<script>
    import md5 from 'js-md5'
    import {login} from "../network/login";

    export default {
        name: "Login",
        data() {
            return {
                user: '',
                pwd: ''
            }
        },
        methods: {
            login() {
                if(this.user.trim == undefined || this.pwd.trim == undefined)
                {
                    this.$alert('账号密码不能为空')
                }else {
                    let param = {
                        user: this.user,
                        pwd: md5(this.pwd).toUpperCase()
                    }
                    login(param).then(res => {
                        if(res.statusText == 'OK'){
                            this.$router.push('/home')
                        }else {
                            this.$alert(res.data.errorMsg)
                        }
                    })
                }

            }
        },
        created() {
            document.title = '登录页'
        }
    }
</script>

<style scoped>
    html {
        margin: 0;
        padding: 0;
    }

    .container {
        height: 100vh;
        background-image: url("../assets/1920.jpg");
        overflow: hidden;
        background-position: center;
    }
    .login {
        position: relative;
        width: 20%;
        height: 80%;
        padding: 0 5% 0 5%;
        margin: 0 auto;
        background-color: rgb(232, 240, 254);
    }

    .container h1 {
        color: #fff;
        text-shadow:0 0 10px;
        letter-spacing: 1px;
        text-align: center;
        padding-top: 8%;
    }

    .login button {
        display: block;
        width: 60%;
        margin: 12% auto 0;
        border-radius: 25px;
    }

</style>