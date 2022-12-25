
export var weightTrack = {
    weightData:[],
    weightDate:[]
}

export const  weightProgress = ()=>{
    document.getElementsByClassName('modal')[0].innerHTML=`
    <div class="weight_wrapper">
    <div>
        <canvas id="weightLine" style="overflow-x:scroll"></canvas>
    </div>
    <div class="weight_container">
        <p>What is your weight Today?</p>
        <div>
            <input type="number" id="weight_inpt">
            <span>Kg</span>
        </div>
    </div>
</div>
    `
    let lineChart = document.getElementById('weightLine').getContext('2d')

    var ChartLine = new Chart(lineChart,{
        type: 'line',
        data: {
            labels: weightTrack.weightDate,
            datasets: [{
                label: 'Weight',
                data: weightTrack.weightData,
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

    document.getElementById('weight_inpt').addEventListener('change',(e)=>{
        weightTrack.weightData.push(e.target.value)
        weightTrack.weightDate.push(new Date().toLocaleDateString('en-us', { day:"numeric", month:"short"}))
        saveobj()
        ChartLine.data.datasets[0].data = weightTrack.weightData
        ChartLine.data.labels = weightTrack.weightDate
        ChartLine.update()
    })    
}

const saveobj = ()=>{
    localStorage.setItem("waterHydrationWeight",JSON.stringify(weightTrack))
}

if(localStorage.getItem("waterHydrationWeight") == null){
    saveobj()
}else{
    weightTrack = JSON.parse(localStorage.getItem("waterHydrationWeight"))
}