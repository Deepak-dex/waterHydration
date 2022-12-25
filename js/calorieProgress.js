import { calorieTrack } from "./calorie.js"


export const showCalorieProgress = ()=>{
    let nutrientQuantity = {
        "fat":50,
        "carbs":187,
        "protien":75,
        "fiber":30
    }

    document.getElementsByClassName('modal')[0].innerHTML = `
    <div class="calorie_progress_chart_daily">
        <div>
            <canvas id="calorieLine" ></canvas>
        </div>
        <div class="calorie_progress_nutrients">
            <div class="nutrient_status">
                <div>
                    <img src="https://img.icons8.com/ios-filled/100/000000/protein.png"/>
                    <p>Protien</p>
                </div>
                <div class="nutrient_status_progress">
                    <span></span>
                    <div></div>
                </div>
            </div>
            <div class="nutrient_status">
                <div>
                    <img src="https://img.icons8.com/ios-glyphs/90/000000/cheese.png"/>
                    <p>Fat</p>
                </div>
                <div class="nutrient_status_progress">
                    <span></span>
                    <div></div>
                </div>
            </div>
            <div class="nutrient_status">
                <div>
                    <img src="https://img.icons8.com/ios-filled/100/000000/carbohydrates.png"/>
                    <p>Carbs</p>
                </div>
                <div class="nutrient_status_progress">
                    <span></span>
                    <div></div>
                </div>
            </div>
            <div class="nutrient_status">
                <div>
                    <img src="https://img.icons8.com/ios-glyphs/90/000000/fiber.png"/>
                    <p>Fiber</p>
                </div>
                <div class="nutrient_status_progress">
                    <span></span>
                    <div></div>
                </div>
            </div>
        </div>
    </div>
    `
    Array.from(document.getElementsByClassName('nutrient_status')).forEach((el)=>{
        let nutrientName =  el.querySelector('div>p').innerText.toLowerCase()
        let nutrientNameTotal = "total_" + nutrientName
        let nutreintPercentage = parseInt((calorieTrack[nutrientNameTotal] / nutrientQuantity[nutrientName]) * 100)

        el.querySelector('.nutrient_status_progress>span').innerText = `${parseInt(calorieTrack[nutrientNameTotal])} / ${nutrientQuantity[nutrientName]}g`
        el.querySelector('.nutrient_status_progress>div').style.width = `${nutreintPercentage}%`
    })

    // calorie line chart
    let claorieLineChart = document.getElementById('calorieLine').getContext('2d')

    let lineChart = new Chart(claorieLineChart,{
        type: 'line',
        data:{
            labels: [
                'Breakfast',
                'Morning Snack',
                'Lunch',
                'Evnening Snack',
                'Dinner'
            ],
            datasets:[{ 
                data: [
                    calorieTrack.breakfast.calorie, 
                    calorieTrack.morning_snack.calorie,
                    calorieTrack.lunch.calorie,
                    calorieTrack.evnening_snack.calorie, 
                    calorieTrack.dinner.calorie
                ],
                backgroundColor: [            
                    'antiquewhite'
                ],
            borderColor: "#ff7e14cf",
            borderWidth: 1,    
            pointBackgroundColor: 'white',
            pointHoverBackgroundColor: "#ff7e14cf",
            hoverOffset: 4,
            fill: true, 
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: false 
            },
            scales: {
                y: {
                ticks: {
                    font: {
                        size: 8,
                        family:'vazir'
                    }
                }
                },
                x: {
                ticks: {
                    font: {
                        size: 8,
                        family:'Segoe UI'
                    },
                }
                }
            },
        }
    })
} 