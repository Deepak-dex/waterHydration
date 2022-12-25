var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("btn");

var loginBtn = document.querySelector('.button-box>button')
var registerBtn = document.querySelector('.button-box>button:last-child')
loginBtn.style.color = 'white'

registerBtn.addEventListener('click',function registerSection(){
    x.style.left = "-400px";
    y.style.left = "50px";
    z.style.left = "110px";
    loginBtn.style.color = 'black'
    registerBtn.style.color = 'white'
})
loginBtn.addEventListener('click',function loginSection(){
    x.style.left = "50px";
    y.style.left = "450px";
    z.style.left = "0";
    loginBtn.style.color = 'white'
    registerBtn.style.color = 'black'
})

// auth section


document.querySelector('#register>button').addEventListener('click',(e)=>{
    e.preventDefault()
    let email = document.getElementById('reg_email').value
    let password = document.getElementById('reg_pass').value
    let confirmPassword = document.getElementById('reg_pass2').value
    let phoneno = document.getElementById('phoneno').value
    
    console.log(email,password,confirmPassword,phoneno)

    let data = {email:email,password:password,phoneno:phoneno}

    if(password == confirmPassword){    
        let options = {
            method: 'POST',
            contentType:'application/json',
            headers:{
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                "Access-Control-Allow-Origin": "http://127.0.0.1:80/register",
                "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8;application/json'

            },
            body: JSON.stringify(data)
    }
    fetch('http://127.0.0.1/register',options).then(res=>{
        res.json().then(r=>{
            console.log(r)
            alert(r.message)
        }) 
    })
    }

})


document.querySelector('#login>button').addEventListener('click',(e)=>{
    e.preventDefault()
    let email = document.getElementById('log_email').value
    let password = document.getElementById('log_pass').value
    console.log(email,password)

    let data = {email:email,password:password}
    
    let options = {
        method: 'POST',
        contentType:'application/json',
        headers:{
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Access-Control-Allow-Origin": "http://127.0.0.1:80/register",
            "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
            'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8;application/json'
            },
        body: JSON.stringify(data)
    }
    fetch('http://127.0.0.1/login',options).then(res=>{
        res.json().then(r=>{
            console.log(r)
            localStorage.setItem("waterHydrationToken",r.token)
            window.location.replace('http://127.0.0.1:5500/home.html')
        })
    }).catch(e=>console.log(e))
    
})
