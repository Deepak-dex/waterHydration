import {calorieModal,calorieTrack} from './calorie.js'
import {showCalorieProgress} from './calorieProgress.js'
import {waterTrack,add_glass,remove_glass,waterProgress} from './water.js'
import {medicineTrack,alarmDetail} from './medicine.js'
import {sleepTrack,sleepProgress} from './sleep.js'
import {weightTrack,weightProgress} from './weight.js'
import {profileTrack,renderProfile,updateHomePageUser} from './profile.js'
import {recommendedGoal} from './recommend.js'
import {renderCal} from './rerender.js'
import {waterNotification,sleepNotification,medicineNotification} from './notification.js'


// Calorie sec ------------------------------------------->

// cal box
let calorieAddBtn = document.getElementsByClassName('add_rounded_icon')[0]

calorieAddBtn.addEventListener('click',()=>{
    let calorieState = document.getElementsByClassName('nutrition_detail')[0]
    let calorieDetailBtn = document.getElementsByClassName('nutrition_detail_progressBtn_container')[0]
    if (calorieState.style.height == '') {
        calorieState.style.height = '10em'
        calorieAddBtn.style = 'transform: rotate(45deg)'
        calorieDetailBtn.style.opacity = '0' 
    }else{
        calorieState.style.height = ''
        calorieAddBtn.style = 'transform: rotate(0deg)'
        calorieDetailBtn.style.opacity = '1'
    }
})

renderCal()

// cal progress
document.getElementsByClassName('nutrition_detail_progressBtn_container')[0].addEventListener('click',()=>{
    modal.style.height = '100vh'
    showCalorieProgress()
})

// modal
let modal = document.getElementsByClassName('modal_bg')[0]

modal.addEventListener('click',(e)=>{if(e.target == e.currentTarget) 
    modal.style.height = '0px'})


// meal
Array.from(document.getElementsByClassName('meal')).forEach(element => {
    element.addEventListener('click',(e)=>{
        modal.style.height = '100vh'
        calorieModal(e)
    })  
});


// water --------------------------->

// water chart 
let waterPieChart = document.getElementById('waterPie').getContext('2d')

let pieChart = new Chart(waterPieChart,{
    type: 'pie',
    data:{
        datasets:[{
            data: [waterTrack.intake, Math.max(0,waterTrack.goal - waterTrack.intake) ],
            backgroundColor:['#ff7200', '#80808047']
    }]
},
options: {
    plugins: {
        tooltip: {enabled: false}
    },
    maintainAspectRatio: false,
}
})

// add and remove btn

document.getElementById('add_glass').addEventListener('click',()=>{
    add_glass()
    updateGlass()
})

document.getElementById('remove_glass').addEventListener('click',()=>{
    remove_glass()
    updateGlass()
})

const updateGlass = ()=>{
    // pieChart Update
    let intake = waterTrack.intake
    let goal = Math.max(0,(waterTrack.goal - intake))
    pieChart.data.datasets[0].data = [intake, goal]
    pieChart.update()
    if(waterTrack.intake == 0)
        document.querySelector('.activity_container>p').innerHTML = `Drink ${waterTrack.goal} glass <br/> <span>of water</span>`
    else
        document.querySelector('.activity_container>p').innerHTML = `${waterTrack.intake} of ${waterTrack.goal}<br/><span>Glasses</span>`
}

// progress of water

document.getElementById('glass_icon').addEventListener('click',()=>{
    modal.style.height = '100vh'
    waterProgress()
})

// Medicine -------------------------------->
document.getElementById('medicine').addEventListener('click',()=>{
    modal.style.height = '100vh'
    alarmDetail()
})

// sleep ----------------------------------->
document.getElementById('sleep').addEventListener('click',()=>{
    modal.style.height = '100vh'
    sleepProgress()
})

// weight ----------------------------------->
document.getElementById('weight').addEventListener('click',()=>{
    modal.style.height = '100vh'
    weightProgress()
})

// profile --------------------------------->
document.getElementById('profile').addEventListener('click',()=>{
    modal.style.height = '100vh'
    renderProfile()    
})
updateHomePageUser()

// notification -------------------------->
waterNotification()
sleepNotification()
medicineNotification() 

// logout------------------------------->
document.getElementById('logout').addEventListener('click',  ()=>{
    console.log('logout')
    localStorage.removeItem("waterHydrationToken")
    window.location.replace("http://127.0.0.1:5500/auth.html");
})

// Checking current user

if(localStorage.getItem("waterHydrationToken") == null){
    console.log('l')
    window.location.replace("http://127.0.0.1:5500/auth.html");
}
if(localStorage.getItem("waterHydrationToken") != null){
    console.log(localStorage.getItem("waterHydrationToken"))
    let options = {
        method: 'GET',
        headers: {
          'x-access-token': localStorage.getItem("waterHydrationToken")
        },
        // body: JSON.stringify(data)
    }
    fetch('http://127.0.0.1/isverified',options).then(res=>{
        res.json().then(r=>{
            console.log(r)
            if (r.message != 'True'){
                window.location.replace("http://127.0.0.1:5500/auth.html");
            }
        }) 
    })

}

// fetch data--------------------->

const getUserData = ()=>{
    let options = {
        method: 'GET',
        headers: {
          'x-access-token': localStorage.getItem("waterHydrationToken")
        }
    }
    fetch('http://127.0.0.1/getuser',options).then(res=>{
        res.json().then(r=>{
            console.log(r)
            if(localStorage.getItem("waterHydrationProfile") != null){
                let obj = JSON.parse(localStorage.getItem("waterHydrationProfile"))
                console.log('data')
                if(r.name.lenght > 1){
                    obj.fname = r.name.split(" ")
                    obj.lname = r.name.split(" ")
                }
                obj.phone = r.phone

                localStorage.setItem("waterHydrationProfile",JSON.stringify(obj))

            }
        }) 
    })
}

getUserData()
