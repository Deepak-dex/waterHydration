import { waterTrack } from "./water.js"
import { medicineTrack } from "./medicine.js"
import { sleepTrack } from "./sleep.js"

export const waterNotification = ()=>{

    if(waterTrack.showNotify){
        console.log('water notify on')
        // interval time
        let interval = 5000

        let f = new Date()
        f.setHours(waterTrack.notifyFrom.slice(0, 2))
        f.setMinutes(waterTrack.notifyFrom.slice(3, 5))
        let fromTime = f.getTime()

        let t = new Date()
        t.setHours(waterTrack.notifyTo.slice(0, 2))
        t.setMinutes(waterTrack.notifyTo.slice(3, 5))
        let toTime = t.getTime()

        let nowTime = new Date().getTime()

        console.log(fromTime,nowTime,toTime)
        console.log((toTime-fromTime)/3)

        if(waterTrack.notifyType == 'every_hour'){
            // interval = waterTrack.interval * 3600000
        }else{
            interval = (toTime-fromTime)/waterTrack.interval
        }

        let isInRange = false
        if (fromTime <= nowTime && nowTime <= toTime){
            isInRange = true
        }else{
            isInRange = false
        }

        console.log('notify',isInRange)
        const timeValue = setInterval(() => {
            showWaterNotification()
            let msg = `Intake: ${waterTrack.intake} Glasses, Remaining: ${(waterTrack.goal - waterTrack.intake).toLocaleString('fullwide', {maximumFractionDigits:2})} Glasses`
            sendNotification(msg)
            if (!isInRange) {
                clearInterval(timeValue);
            }
        }, interval);

    }
}

function showWaterNotification(){
    console.log('showNotification')
    const notification = new Notification("Water Drink Reminder",{
        body:  `Intake: ${waterTrack.intake} Glass, Remaining: ${(waterTrack.goal - waterTrack.intake).toLocaleString('fullwide', {maximumFractionDigits:2})} Glass`,
        icon:"./assets/notify_logo.png",
    })    
}

var medTimer
export const medicineNotification = ()=>{
    console.log('med')
    medicineTrack.forEach((obj)=>{

        let date = new Date().toISOString().split('T')[0]
        let currentHr = String(new Date().getHours()).padStart(2,"0")
        let currentMin = String(new Date().getMinutes()).padStart(2,"0")

        let timeIsBeing936 = new Date(`${date}T${obj.time}:00Z`).getTime()    
        let currentTime = new Date(`${date}T${currentHr}:${currentMin}:00Z`).getTime()
        console.log('alarm time',timeIsBeing936,'current time',currentTime,currentHr,currentMin)
        let subtractMilliSecondsValue = timeIsBeing936 - currentTime;
        if (subtractMilliSecondsValue<0)
            subtractMilliSecondsValue += 86400000 
        console.log(subtractMilliSecondsValue)
        clearTimeout(medTimer);
        medTimer = setTimeout(()=>showMedNotification(obj), subtractMilliSecondsValue);

    })
}

function showMedNotification(obj){
    console.log('showMedNotification')
    const notification = new Notification("Medicine Reminder",{
        body:  `Take ${obj.medName}`,
        icon:"https://img.icons8.com/external-flatart-icons-solid-flatarticons/64/000000/external-medicine-coronavirus-covid19-flatart-icons-solid-flatarticons.png",
    })    
    let msg = `Take ${obj.medName}`
    sendNotification(msg)
}

export const sleepNotification = ()=>{
    if(sleepTrack.showNotify){
        console.log('sleepTrack')
        let date = new Date().toISOString().split('T')[0]
        let currentHr = String(new Date().getHours()).padStart(2,"0")
        let currentMin = String(new Date().getMinutes()).padStart(2,"0")

        let currentTime = new Date(`${date}T${currentHr}:${currentMin}:00Z`).getTime()

        let timeIsBeing936S = new Date(`${date}T${sleepTrack.notifySleep}:00Z`).getTime()    
        let subtractMilliSecondsValueS = timeIsBeing936S - currentTime;
        console.log('sleepNotify',subtractMilliSecondsValueS)
        if (subtractMilliSecondsValueS < 0)
            subtractMilliSecondsValueS += 86400000 
        setTimeout(showSleepNotification, subtractMilliSecondsValueS);

        let timeIsBeing936W = new Date(`${date}T${sleepTrack.notifyWake}:00Z`).getTime()    
        let subtractMilliSecondsValueW = timeIsBeing936W - currentTime;
        if (subtractMilliSecondsValueW < 0)
            subtractMilliSecondsValueW += 86400000 
        setTimeout(showWakeNotification, subtractMilliSecondsValueW);
    }
}

function showSleepNotification(){
    console.log('showsleepNotification')
    const notification = new Notification("Sleep Reminder",{
        body:  `Time to sleep`,
        icon:"https://img.icons8.com/ios-glyphs/30/000000/sleep.png",
    })    
    let msg = `Time to sleep`
    sendNotification(msg)
}

function showWakeNotification(){
    console.log('showwakeNotification')
    const notification = new Notification("Wake Reminder",{
        body:  `Time to wake up`,
        icon:"https://img.icons8.com/ios-glyphs/30/000000/sleep.png",
    })    
    let msg = `Time to Wake up`
    sendNotification(msg)
}

function sendNotification(msg){
    let data = {message: msg}
    console.log('k')
    let options = {
        method: 'POST',
        headers: {
          'x-access-token': localStorage.getItem("waterHydrationToken")
        },
        body: JSON.stringify(data)
    }
    console.log(JSON.stringify(data))
    fetch('http://127.0.0.1/sendmsg',options).then(res=>{
        res.json().then(r=>{
            console.log(r)
            if (r.message != 'True'){
                // alert("message send")
                console.log("message send")
            }
        }) 
    })
}