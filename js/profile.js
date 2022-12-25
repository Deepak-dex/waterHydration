import { calWieghtGoal, calWaterGoal } from "./recommend.js"

export let profileTrack = {
    fname: "",
    lname: "",
    gender:"male",
    phone:"",
    age:25,
    height:175,
    weight:60,
    goal:1,
    activity: 1,
} 

export const renderProfile= ()=>{

    document.getElementsByClassName('modal')[0].innerHTML =`
            <div class="profile_wrapper">
                <div class="profile_name">
                    <input type="text" id="first_name" placeholder="First name" value="${profileTrack.fname}">
                    <input type="text" id="last_name" placeholder="Last name" value="${profileTrack.lname}">
                </div>
                <div class="profile_gender">
                    <input type="radio" name="gender" id="male_check" value="male" checked>
                    <label for="male_check" class="gender_label">Male</label>
                    <input type="radio" name="gender" id="female_check" value="female">
                    <label for="female_check" class="gender_label">Female</label>
                </div>
                <div class="profile_info">
                    <input type="number"  placeholder="Phone Number" id="phone_no" value="${profileTrack.phone}">
                    <input type="number" placeholder="Age" id="age" value="${profileTrack.age}">
                    <input type="number" placeholder="Height" id="height" value="${profileTrack.height}">
                    <input type="number"  placeholder="Weight" id="weight_inpt" value="${profileTrack.weight}">
                    <select name="activity_level" id="activity_level">
                        <option value="1">Basal Metabolic Rate (BMR)</option>
                        <option value="1.2" selected="">Sedentary: little or no exercise</option>
                        <option value="1.375">Light: exercise 1-3 times/week</option>
                        <option value="1.465">Moderate: exercise 4-5 times/week</option>
                        <option value="1.55">Active: daily exercise or intense exercise 3-4 times/week</option>
                        <option value="1.725">Very Active: intense exercise 6-7 times/week</option>
                        <option value="1.9">Extra Active: very intense exercise daily, or physical job</option>
                    </select>
                    <select name="weight_goal" id="weight_goal">
                        <option value="0">Maintain your weight</option>
                        <option value="0.25">0.25 Kg per week</option>
                        <option value="0.50">0.50 Kg per week</option>
                        <option value="0.75">0.75 Kg per week</option>
                        <option value="1">1.00 Kg per week</option>
                    </select>
                </div>
                <span id="profile_save_btn">Save</span>
            </div>
    `

    document.querySelector(`input[name='gender'][value='${profileTrack.gender}']`).checked = true
    document.getElementById(`activity_level`).value = profileTrack.activity
    document.getElementById(`weight_goal`).value = profileTrack.goal

    document.getElementById("profile_save_btn").addEventListener('click',()=>{
        let fname = document.getElementById("first_name").value
        let lname = document.getElementById("last_name").value
        let gender = document.querySelector("input[name='gender']:checked").value
        let phone = document.getElementById("phone_no").value
        let age = document.getElementById("age").value
        let height = document.getElementById("height").value
        let weight = document.getElementById("weight_inpt").value
        let activity = document.getElementById("activity_level").value
        let goal = document.getElementById("weight_goal").value

        console.log(document.getElementById("weight"))

        let profileObj = {
            fname: fname,
            lname: lname,
            gender: gender,
            phone: phone,
            age: age,
            height: height,
            weight: weight,
            activity:activity,
            goal: goal, 
        }
        console.log(profileObj)

        profileTrack = profileObj
        saveobj()
        updateHomePageUser()
        calWieghtGoal(profileTrack)
        calWaterGoal(profileTrack)
    })

}

export const updateHomePageUser = ()=>{
    
    if(profileTrack.fname.length <1)
        document.querySelector('.greeting>h1').innerText = `Hi User`
    else
        document.querySelector('.greeting>h1').innerText = `Hi ${profileTrack.fname} ${profileTrack.lname}`

    if (profileTrack.goal == 0)
        document.querySelector('.greeting>p').innerText = `To Maintain you need to`
    else
        document.querySelector('.greeting>p').innerText = `To Losse ${profileTrack.goal}kg in a weeks you need to`
}

const saveobj = ()=>{
    localStorage.setItem("waterHydrationProfile",JSON.stringify(profileTrack))
}

if(localStorage.getItem("waterHydrationProfile") == null){
    saveobj()
}else{
    profileTrack = JSON.parse(localStorage.getItem("waterHydrationProfile"))
}