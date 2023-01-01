import { medicineNotification } from "./notification.js"

export var medicineTrack = [
    
]

export const alarmDetail = ()=>{


    document.getElementsByClassName('modal')[0].innerHTML =`
        <div class="medicine_wrapper">
        <p>Set Medicine Reminders</p>
        <div class="medicine_reminder_list">
        
        </div>
        <img src="https://img.icons8.com/ios-glyphs/90/000000/macos-maximize.png" id="medicine_add" alt="">
    </div>
    `

    medicineTrack.forEach((med)=>{
        document.getElementsByClassName('medicine_reminder_list')[0].innerHTML +=`
        <div class="medicine_reminder">
            <div>
                <span>${med.time}</span>
                 <p>${med.days.join(' ')}</p>
            </div>
            ${!med.taken && med.time.split(":")[0] < new Date().getHours()?
            `<div class="medicine_alert">medicine not taken!</div>`:""
            }
            <span>
                ${med.medName}
            </span> 
            ${med.taken ?
            `<img src="https://img.icons8.com/material-outlined/24/null/checked--v1.png" class="medicine_taken"/>`:
            `<img src="https://img.icons8.com/material-outlined/24/null/checked--v1.png" class="medicine_to_take"/>`
             }
        </div>
        `
    })

    document.getElementById('medicine_add').addEventListener('click',()=>{
        medicineTrack.push({
            id: "0",
            time: "00:00",
            medName: "",
            dis: "",
            days:[""],
            taken: false
        })
        alarmDetail()
    })

    handleAlarms()
    handleTakeMed()
} 

const handleTakeMed = ()=>{
    Array.from(document.getElementsByClassName('medicine_to_take')).forEach((el)=>{
        el.addEventListener('click',(e)=>{
            if (e.target == e.currentTarget){
                medicineTrack.forEach((obj)=>{
                    if (obj.medName === e.target.parentNode.querySelectorAll('span')[1].innerText)
                        obj.taken = true
                })
                saveobj()
                alarmDetail()
            }
        })
    })
}

const handleAlarms = ()=>{
    Array.from(document.getElementsByClassName('medicine_reminder')).forEach((el)=>{
    
        el.addEventListener('click',(e)=>{
            if (e.target == e.currentTarget){

                let alramData = medicineTrack.filter((med)=>{
                    if (med.medName == el.querySelector('.medicine_reminder>span').innerText){
                    return med
                }
            })
            console.log(alramData)
            

            el.innerHTML =`
            <div>
                <input type="text" id="alarm_id" style="display: none;" value="${alramData[0].id}">
                <input type="text" id="time_inpt" style="display: none;" value="${alramData[0]?.time}">
                <span id="time"
                onclick="Timepicker.showPicker({
                onSubmit: (time)=>{
                let event = new Event('change');
                let inpt = document.getElementById('time_inpt')
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
                ${alramData[0].time}
                </span>
                <div class="week_days">
                    <input id="mon" type="checkbox" value="Mon" name="days">
                    <label for="mon" class="day_btn">Mon</label>
                    <input id="tue" type="checkbox" value="Tue" name="days">
                    <label for="tue" class="day_btn">Tue</label>
                    <input id="wed" type="checkbox" value="Wed" name="days">
                    <label for="wed" class="day_btn">Wed</label>
                    <input id="thu" type="checkbox" value="Thu" name="days">
                    <label for="thu" class="day_btn">Thu</label>
                    <input id="fri" type="checkbox" value="Fri" name="days">
                    <label for="fri" class="day_btn">Fri</label>
                    <input id="sat" type="checkbox" value="Sat" name="days">
                    <label for="sat" class="day_btn">Sat</label>
                    <input id="sun" type="checkbox" value="Sun" name="days">
                    <label for="sun" class="day_btn">Sun</label>
                </div>
                <div class="medicine_info">
                    <input type="text" id="medicine_name_inp" placeholder="Medicine Name" value="${alramData[0]?.medName}">
                    <textarea name="discription"  id="discription_inpt" cols="10" rows="3" placeholder="Reminder label">${alramData[0].dis}</textarea>
                </div>
                <div class="alram_btn_container">
                    <span id="save_alarm_tbn">Save</span>
                    <span id="del_alarm_tbn">Delete</span>
                </div>
            </div>
            `
                alramData[0].days.forEach((day)=>{          
                    if( day != '')
                    document.getElementById(day.toLowerCase()).checked = true
                })

                document.getElementById('time_inpt').addEventListener('change',(e)=>{
                    document.getElementById('time').innerText = e.currentTarget.value
                })

                document.getElementById('save_alarm_tbn').addEventListener('click',()=>{
                    
                    let id = document.getElementById('alarm_id').value
                    let time = document.getElementById('time_inpt').value
                    let medName = document.getElementById('medicine_name_inp').value
                    let dis = document.getElementById('discription_inpt').value
                    let daysInpt = document.querySelectorAll(`input[type="checkbox"][name="days"]:checked`)
                    let days = []
                    daysInpt.forEach((day)=>days.push(day.value))

                    // console.log(time)

                    let alarm = {
                            id: Date.now(),
                            medName: medName,
                            time: time,
                            dis:dis,
                            days:days,    
                            taken: false
                    }
    
                        for(let i=0; i<medicineTrack.length;i++){
                            if(medicineTrack[i].id == id)
                                medicineTrack[i] = alarm
                        }
                        saveobj()
                        medicineNotification()
                    alarmDetail()
                })

                document.getElementById('del_alarm_tbn').addEventListener('click',()=>{
                    let id = document.getElementById('alarm_id').value
                    let newmedicineTrack = medicineTrack.filter((obj)=>{
                        if(obj.id != id)
                            return obj
                    })
                    medicineTrack = newmedicineTrack
                    saveobj()
                    alarmDetail()
                })


            }
        })
    })
}

const saveobj = ()=>{
    console.log('sabeObj')
    medicineTrack
    localStorage.setItem("waterHydrationMedicine",JSON.stringify(medicineTrack))
}

if(localStorage.getItem("waterHydrationMedicine") == null){
    saveobj()
}else{
    medicineTrack = JSON.parse(localStorage.getItem("waterHydrationMedicine"))
}
