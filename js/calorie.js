import { recommendedGoal } from "./recommend.js"

var mealType = ""

export var calorieTrack = {
    "breakfast":{
        "calorie":"0",
    },
    "morning_snack":{
        "calorie":"0",
    },
    "lunch":{
        "calorie":"0",
    },
    "evnening_snack":{
        "calorie":"0",
    },
    "dinner":{
        "calorie":"0",
    },
    "total_calorie":"0",
    "total_fat":0,
    "total_carbs":0,
    "total_protien":0,
    "total_fiber":0
}

var nutrients = {
    "fat":0,
    "carbs":0,
    "protien":0,
    "fiber":0
}


const addCal = (food_name)=>{
    fetch(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        {
            method:'POST',
            headers: {
            "x-app-id": "de0e9e0d",
            "x-app-key": "427a0f45ead9655e2cba911cccbfacce",
            "Content-Type":"application/json"
        },
        body: JSON.stringify({"query":food_name}),
        }).then((response)=>{
            response.json().then((res)=>{
                let calInpt = document.getElementById('cal')
                
                if (calInpt.value == ''){
                    calInpt.value = parseInt(res.foods[0]?.nf_calories)
                }else{
                    calInpt.value = parseInt(calInpt.value) + parseInt(res.foods[0]?.nf_calories)
                }

                nutrients.fat = nutrients.fat + parseFloat(res.foods[0]?.nf_total_fat)
                nutrients.carbs = nutrients.carbs + parseFloat(res.foods[0]?.nf_total_carbohydrate)
                nutrients.protien = nutrients.protien + parseFloat(res.foods[0]?.nf_protein)
                nutrients.fiber = nutrients.fiber + parseFloat(res.foods[0]?.nf_dietary_fiber)

            })
    })
}

export const calorieModal = (element)=>{

    let mealElement = element.currentTarget
    let mealTypeText = mealElement.querySelector('span').innerText
    mealType = mealElement.querySelector('span').innerText.toLowerCase().replace(/ /g,"_")

    document.getElementsByClassName('modal')[0  ].innerHTML = `
    <div class="calorie_container">
        <h3>Add your meal</h3>
        <div class="calorie_form">
            <input type="text" id="food" placeholder="Search your food..."/>
            <div>
                <input type="number" id="cal"/><span  style="margin-left:-23px; color: grey;">cal</span>
            </div>
        </div>
        <div class="meal_list"> 
        <!-- meal_item -->
        </div>
        <span id="track">Track ${mealTypeText}</span>
    </div>`

    
    document.getElementById('track').addEventListener('click',()=>{
        calorieTrack[mealType].calorie = document.getElementById('cal').value   
        calorieTrack.total_calorie = parseInt(calorieTrack.total_calorie) + parseInt(calorieTrack[mealType].calorie)

        calorieTrack.total_fat = calorieTrack.total_fat + nutrients.fat
        calorieTrack.total_carbs = calorieTrack.total_fat + nutrients.carbs
        calorieTrack.total_protien = calorieTrack.total_fat + nutrients.protien
        calorieTrack.total_fiber = calorieTrack.total_fat + nutrients.fiber

        saveobj()
        document.getElementsByClassName('modal_bg')[0].style.height = '0px'

        mealElement.querySelector('.meal_cal>span').innerText = calorieTrack[mealType].calorie + ` of ${parseInt(recommendedGoal.calories/5)} Cal`

        document.querySelector('.nutrition_container>p').innerText = calorieTrack.total_calorie + ` of ${recommendedGoal.calories} cal`

        // pieChart Update
        pieChart.data.datasets[0].data = [calorieTrack.total_calorie, parseInt(recommendedGoal.calories - calorieTrack.total_calorie)]
        pieChart.update()

    })

    handleInpt()
    
}

const handleInpt = ()=>{

    document.getElementById('food').addEventListener('keyup',(event)=>{
        if (event.keyCode === 13){
        fetch(`https://trackapi.nutritionix.com/v2/search/instant?query=${event.target.value}`,{
            headers: {
                "x-app-id": "de0e9e0d",
                "x-app-key": "427a0f45ead9655e2cba911cccbfacce",
            }
        })
        .then((response)=>{
            response.json().then((res)=>{
                res = res.common
                console.log(res)
                let list = document.getElementsByClassName('meal_list')[0]
                list.innerHTML=""
                res.forEach((r,index)=>{
                    list.innerHTML += 
                    `<div class="meal_item">
                    <img src="${r.photo?.thumb}" alt="">
                    <div class="meal_name">
                    <span>${r.food_name}</span>
                    <span class="meal_dis">quantity:${r.serving_qty}; serving unit: <b> ${r.serving_unit}<b></span>
                    </div>
                    </div>`
                })
                Array.from(document.getElementsByClassName('meal_item'))
                .forEach((el,index)=>{
                    el.addEventListener('click',()=>{
                        addCal(res[index].food_name)
                    })
                })
            })
        })
    }
})
}


// calorie Pie chart
let claoriePieChart = document.getElementById('caloriePie').getContext('2d')

let pieChart = new Chart(claoriePieChart,{
    type: 'pie',
    data:{
        datasets:[{
            data: [calorieTrack.total_calorie, parseInt(recommendedGoal.calories - calorieTrack.total_calorie)],
            // data: [34,56],
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

const saveobj = ()=>{
    localStorage.setItem("waterHydrationCalorie",JSON.stringify(calorieTrack))
}

if(localStorage.getItem("waterHydrationCalorie") == null){
    saveobj()
}else{
    calorieTrack = JSON.parse(localStorage.getItem("waterHydrationCalorie"))
}
