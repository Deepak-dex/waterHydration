import { recommendedGoal } from "./recommend.js"
export const renderCal = ()=>{
    document.querySelector('.nutrition_container>p').innerText = `Eat upto ${recommendedGoal.calories} cal`
    Array.from(document.querySelectorAll('.meal>div>span')).forEach((el)=>{
        el.innerText = `0 of ${parseInt(recommendedGoal.calories/5)}`
    })
}
