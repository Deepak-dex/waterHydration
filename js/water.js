import { recommendedGoal } from "./recommend.js"
import { waterNotification } from "./notification.js"

export var waterTrack = {
    intake:0,
    goal: recommendedGoal.water,
    weeklyIntake: [0,0,0,0,0,0,0],
    notifyFrom: '09:30',
    notifyTo: '10:00',
    notifyType: 'every_hour',
    interval: 1,
    showNotify: false
}

export const add_glass = ()=>{
    waterTrack.intake += 1
    updateChart()
}

export const remove_glass = ()=>{
    if(waterTrack.intake > 0) 
        waterTrack.intake -= 1
        updateChart()
}

const updateChart = ()=>{
    let date = new Date()
    waterTrack.weeklyIntake[date.getDay()] = waterTrack.intake
    saveobj()
}


export const waterProgress = ()=>{

    document.getElementsByClassName('modal')[0].innerHTML =`
    <div class="water_progress_container">
    <canvas id="waterLine"></canvas>
    <div class="goal_container">
        <p>Edit Goal</p>
        <div>
            <p>Set Water Goal (Glasses)</p>
            <input id="goal_inpt" value="${waterTrack.goal}" type="number">
        </div>
    </div>
</div>
<div class="reminder_wrapper">
    <div class="reminder_header">
        <p> Drink Water Reminder </p>
        <div class="button-switch">
            <input type="checkbox" id="switch-orange" class="switch" />
            <label for="switch-orange" class="lbl-off">Off</label>
            <label for="switch-orange" class="lbl-on">On</label>
        </div>
    </div>
    <div class="reminder_time">
        <input type="text" id="from_time" style="display:none">
        <input type="text" id="to_time" style="display:none">
        From 
        <span
            onclick="Timepicker.showPicker({
                onSubmit: (time)=>{
                    let event = new Event('change');
                    let inpt = document.getElementById('from_time')
                    inpt.value = time.formatted()
                    inpt.dispatchEvent(event);
                },
                headerBackground: '#424242',
                headerColor: '#e0e0e0',
                headerSelected: '#ff7200',
                wrapperBackground: '#424242',
                footerBackground: '#424242',
                submitColor: '#ff7200',
                cancelColor: '#ff7200',
                clockBackground: '#424242',
                clockItemColor: '#ff7200',
                clockItemInnerColor: '#ff7200',
                handColor: '#ff7200'
            })"
        >
            ${waterTrack.notifyFrom}
        </span> to 
        <span
            onclick="Timepicker.showPicker({
                onSubmit: (time)=>{
                    let event = new Event('change');
                    let inpt = document.getElementById('to_time')
                    inpt.value = time.formatted()
                    inpt.dispatchEvent(event);
                },
                headerBackground: '#424242',
                headerColor: '#e0e0e0',
                headerSelected: '#ff7200',
                wrapperBackground: '#424242',
                footerBackground: '#424242',
                submitColor: '#ff7200',
                cancelColor: '#ff7200',
                clockBackground: '#424242',
                clockItemColor: '#ff7200',
                clockItemInnerColor: '#ff7200',
                handColor: '#ff7200'
            })"
        >
            ${waterTrack.notifyTo}
        </span>
    </div>
    <div class="reminder_interval_container">
        <div class="reminder_interval">
            <div>
                <input name="reminder_type" id="every_hour" type="radio" value="every_hour" checked >
                <label for="every_hour">Remind me every</label>
            </div>
            <span>
                <input type="number" id="every_hour_inpt" value="${waterTrack.interval}" min="1">
                <label for="every_hour_inpt">Hour</label>
            </span>
        </div>
        <div class="reminder_interval">
            <div>
                <input name="reminder_type" id="every_time" type="radio" value="every_time">
                <label for="every_time">Remind me </label>
            </div>
            <span>
                <input type="number" id="every_time_inpt" value="${waterTrack.interval}" min="1"> 
                <label for="every_time_inpt">Times</label>
            </span>
        </div>
    </div>

</div>
    `
    document.querySelector(`input[name='reminder_type'][value='${waterTrack.notifyType}']`).checked = true
    document.getElementById('switch-orange').checked = waterTrack.showNotify

    // line chart 
    let lineChart = document.getElementById('waterLine').getContext('2d')

    var ChartLine = new Chart(lineChart,{
        type: 'line',
        data: {
            labels: ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [{
                label: 'Water Intake',
                data: waterTrack.weeklyIntake,
                borderColor: '#ff7200',
                backgroundColor: 'antiquewhite',
                borderWidth: 1,
                fill: true, 
            }]
        },
        options: {
            legend:{
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    })


    // update goal
    document.getElementById('goal_inpt').addEventListener('change',(e)=>{
        waterTrack.goal = e.currentTarget.value
        saveobj()
    })

    // intervalType
    console.log(document.querySelector(`input[type="radio"][name="reminder_type"]:checked`).value)

    // interval value
    document.getElementById('every_hour_inpt').addEventListener('change',(e)=>{
        waterTrack.interval = e.currentTarget.value
    })
    document.getElementById('every_time_inpt').addEventListener('change',(e)=>{
        waterTrack.interval = e.currentTarget.value
    })

    // time
    document.getElementById('from_time').addEventListener('change',(e)=>{
        waterTrack.notifyFrom = e.currentTarget.value
        saveobj()
        document.querySelector('.reminder_time>span').innerText = e.currentTarget.value
        console.log(e.currentTarget.value)
    })

    document.getElementById('to_time').addEventListener('change',(e)=>{
        waterTrack.notifyTo = e.currentTarget.value
        saveobj()
        document.querySelector('.reminder_time>span:last-child').innerText = e.currentTarget.value
        console.log(e.currentTarget.value)
    })

    // checkbox
    document.getElementById('switch-orange').addEventListener('change',(e)=>{
        waterTrack.showNotify = e.currentTarget.checked
        saveobj()
        if(Notification.permission != "granted")
                Notification.requestPermission()

        if(e.currentTarget.checked){
            waterNotification()    
        }
    })

}

const saveobj = ()=>{
    localStorage.setItem("waterHydrationWater",JSON.stringify(waterTrack))
}

if(localStorage.getItem("waterHydrationWater") == null){
    saveobj()
}else{
    waterTrack = JSON.parse(localStorage.getItem("waterHydrationWater"))
}
