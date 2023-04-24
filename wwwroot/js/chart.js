// 準備畫圖的資料
const chartLabel = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
var voteData = [];
var chartData = 
{
    type: 'bar',
    data: {
        labels: chartLabel,
        datasets: [{
            label: '# of Votes',
            data: voteData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
}

// 一開始的畫圖
var ctx = document.getElementById("VoteChart").getContext('2d'); 
var myChart;
myChart = new Chart(ctx, chartData);

// 設定連線
var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();


// 當連線開始，要取得現在的票數
    connection.start().then(function () {
        connection.invoke("VoteToCaller").catch(function (err) {
                return console.error(err.toString());
            });
    })
    .catch(function (err) {
        return console.error(err.toString());
    });


// 連線上時，要第一次畫圖
connection.on("ReceiveVoteCount", function(VoteCount){
    console.log(VoteCount);
    chartData.data.datasets[0].data = VoteCount;
    myChart.update();
});

// 加票數
function Votselect(voteTo){
    var vote = chartLabel.indexOf(voteTo);
    console.log(vote);
    connection.invoke("VoteAdd", vote).catch(function (err) {
        return console.error(err.toString());
    });
};

// 重設票數
function VoteReset(){
    connection.invoke("Reset").catch(function (err) {
        return console.error(err.toString());
});
};
