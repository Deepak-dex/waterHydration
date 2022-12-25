import { sleepNotification } from "./notification.js"

export var sleepTrack = {
    sleepingTime: "10:00",
    weeklySleep: [0,0,0,0,0,0,0],
    notifySleep: '22:00',
    notifyWake: '08:00',
    showNotify: false,
}

export const sleepProgress = ()=>{

    document.getElementsByClassName('modal')[0].innerHTML =`
    <div class="sleep_wrapper">
                <div>
                    <canvas id="sleepLine"></canvas>
                </div>
                <div class="daily_sleep_container">
                    <p>Daily Schedule</p>
                    <div>
                        <input type="text" id="sleep_at" style="display: none;" value="${sleepTrack.notifySleep}">
                        <input type="text" id="wake_at" style="display: none;" value="${sleepTrack.notifyWake}">
                        <p>
                            Did you Sleep at 
                            <span
                            onclick="Timepicker.showPicker({
                                onSubmit: (time)=>{
                                let event = new Event('change');
                                let inpt = document.getElementById('sleep_at')
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
                                ${sleepTrack.notifySleep}
                            </span>
                            ?
                        </p>
                        <p>
                            Did you wake at 
                            <span
                            onclick="Timepicker.showPicker({
                                onSubmit: (time)=>{
                                let event = new Event('change');
                                let inpt = document.getElementById('wake_at')
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
                                ${sleepTrack.notifyWake}
                            </span>
                            ?
                        </p>
                    </div>
                    <span id="add_sleep_chart">YES</span>
                </div>
                <div class="sleep_reminder_wrapper">
                    <div>
                        <p>Reminders</p>
                        <div class="button-switch">
                            <input type="checkbox" id="switch-orange" class="switch" />
                            <label for="switch-orange" class="lbl-off">Off</label>
                            <label for="switch-orange" class="lbl-on">On</label>
                        </div>
                    </div>
                    <div class="sleep_reminder_container">
                        <div class="sleep_reminder">
                            <input type="text" id="reminder_sleep_at" style="display: none;" value="${sleepTrack.notifySleep}">
                            <p>Sleep time</p> 
                            <span
                            onclick="Timepicker.showPicker({
                                onSubmit: (time)=>{
                                let event = new Event('change');
                                let inpt = document.getElementById('reminder_sleep_at')
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
                            >${sleepTrack.notifySleep}</span>
                        </div>
                        <div class="sleep_reminder" id="reminder_wake_at">
                            <input type="text" id="reminder_wake_at"  style="display: none;" value="${sleepTrack.notifyWake}">
                            <p>Wake time</p>
                            <span
                            onclick="Timepicker.showPicker({
                                onSubmit: (time)=>{
                                let event = new Event('change');
                                let inpt = document.getElementById('reminder_wake_at')
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
                            >${sleepTrack.notifyWake}</span>
                        </div>
                    </div>
                </div>
            </div>
    `
    // line chart 
    let lineChart = document.getElementById('sleepLine').getContext('2d')

    var ChartLine = new Chart(lineChart,{
        type: 'bar',
        data: {
            labels: ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [{
                label: 'Weekly Sleep',
                data: sleepTrack.weeklySleep,
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

    document.getElementById('switch-orange').checked = sleepTrack.showNotify

    document.getElementById('switch-orange').addEventListener('change',(e)=>{
        sleepTrack.showNotify = e.currentTarget.checked
        saveobj()
        if(Notification.permission != "granted")
                Notification.requestPermission()

        if(e.currentTarget.checked){
            sleepNotification()    
        }
    })

    // handle time change
    document.getElementById('sleep_at').addEventListener('change',(e)=>{
        document.querySelector('.daily_sleep_container>div>p>span').innerText = e.currentTarget.value
    })

    document.getElementById('wake_at').addEventListener('change',(e)=>{
        document.querySelector('.daily_sleep_container>div>p:last-child>span').innerText = e.currentTarget.value
    })

    // handle reminder time change
    document.getElementById('reminder_sleep_at').addEventListener('change',(e)=>{
        document.querySelector('.sleep_reminder>span').innerText = e.currentTarget.value
        sleepTrack.notifySleep = e.currentTarget.value
        saveobj()
        sleepNotification()
    })
    
    document.getElementById('reminder_wake_at').addEventListener('change',(e)=>{
        document.querySelector('.sleep_reminder:last-child>span').innerText = e.currentTarget.value
        sleepTrack.notifyWake = e.currentTarget.value
        saveobj()
        sleepNotification()
    })

    // add data to chart
    document.getElementById('add_sleep_chart').addEventListener('click',()=>{
        let date = new Date()
        let sleepHrs = parseInt(document.getElementById('sleep_at').value.slice(0, 2)) - parseInt(document.getElementById('wake_at').value.slice(0, 2))
        let sleepMin = parseInt(document.getElementById('sleep_at').value.slice(3, 5)) - parseInt(document.getElementById('wake_at').value.slice(3, 5))
        console.log((sleepHrs + (sleepMin / 100)).toFixed(2))
        sleepTrack.weeklySleep[date.getDay()] = Math.abs(parseInt((sleepHrs + (sleepMin / 100)).toFixed(2)))
        saveobj()
        ChartLine.data.datasets[0].data = sleepTrack.weeklySleep
        ChartLine.update()
    })
}

const saveobj = ()=>{
    localStorage.setItem("waterHydrationSleep",JSON.stringify(sleepTrack))
}

if(localStorage.getItem("waterHydrationSleep") == null){
    saveobj()
}else{
    sleepTrack = JSON.parse(localStorage.getItem("waterHydrationSleep"))
}