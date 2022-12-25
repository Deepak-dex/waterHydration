import { renderCal } from "./rerender.js"

export var recommendedGoal = {
    calories: 1500,
    water:9,
}

export const calWieghtGoal = (user)=>{
    let male = (66.5 + (13.8 * user.weight) + (5 * user.height) / (6.8 * user.age) ) * user.activity
    let female = (655.1 + (9.6 * user.weight) + (1.9 * user.height) / (4.7 * user.age) ) * user.activity

    if (user.gender == 'male'){
        recommendedGoal.calories =  parseInt(male - (user.goal * 1000))
    }else{
        recommendedGoal.calories =   parseInt(female - (user.goal * 1000))
    }

    saveobj()
    renderCal()

}

export const calWaterGoal = (user)=>{
    recommendedGoal.water =   (user.weight / 30) + (user.activity * 0.5) 
}

const saveobj = ()=>{
    localStorage.setItem("waterHydrationRecommend",JSON.stringify(recommendedGoal))
}

if(localStorage.getItem("waterHydrationRecommend") == null){
    saveobj()
}else{
    recommendedGoal = JSON.parse(localStorage.getItem("waterHydrationRecommend"))
}

// Harris-Benedict Formula is used for calculating calorie required.
// for men = 66.5 + 13.8 x (body weight in kilograms) + 5 x (body height in cm) divided by 6.8 x age

// for women =655.1 + 9.6 x (body weight in kilograms) + 1.9 x (body height in cm) divided by 4.7 x age

// low physical activity = x 1.2. 
// average physical activity = x 1.3
// heavy physical activities = x1.4

// 1000 cal/day = 1 kg/week

// for water
// weight/30 = liter of water/day
// 1hr exercise = 0.7 litre