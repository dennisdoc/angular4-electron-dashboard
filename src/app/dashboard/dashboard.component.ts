import { Transacoes } from './model/transacoes.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartReadyEvent, ChartErrorEvent } from "ng2-google-charts";
import { DatePipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers:[DatePipe],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  started=false;
  transacoes:Transacoes={aceitas:0,recusadas:0};
  live=true;
  @ViewChild('pieChart') pieChart;
  dataTable=[
      [this.getRandomTime(), 'Indice 1','Indice 2'],
      [this.getRandomTime(),     11,Math.round(Math.random()*10)],
      [this.getRandomTime(),      2,Math.round(Math.random()*10)],
      [this.getRandomTime(),  2,Math.round(Math.random()*10)],
      [this.getRandomTime(), 2,Math.round(Math.random()*10)],
      [this.getRandomTime(),    7,Math.round(Math.random()*10)]
  ];

  pieChartData =  {
    chartType: 'LineChart',
    dataTable: this.dataTable,
    options: {
      'title': 'Tasks',
      animation:{
        duration: 500,
        easing: 'out',
      }
    },
  };

  ticks =0;
  resetTick=0;

  constructor(private datePipe: DatePipe) { }
  
  getRandomTime(){
    return this.datePipe.transform(new Date(),'mediumTime');
  }

  public ready(event: ChartReadyEvent) {

    //force a redraw
    // this.pieChart.redraw();
    if(!this.started){
      this.started=true;
      this.iterateDataGoogleChart(this.pieChart,this.pieChartData);
    }
  }

  public error(event: ChartErrorEvent) {
    console.error(event);
  }

  public toggleAtualizacao(){
    this.live=!this.live;
    if(this.live){
      this.iterateDataGoogleChart(this.pieChart,this.pieChartData);
    }
  }

  iterateDataGoogleChart(chart,chartData){
    if(!this.live) return ;
    var max=12;
    var maxRecusada=3;
    var maxValues=12;
    this.resetTick=this.resetTick+this.ticks;
    this.ticks=0;
    
    
    var newData = [
      [this.getRandomTime(),     Math.round(Math.random()*max),     Math.round(Math.random()*maxRecusada)],
      [this.getRandomTime(),      Math.round(Math.random()*max),     Math.round(Math.random()*maxRecusada)],
      [this.getRandomTime(),  Math.round(Math.random()*max),    Math.round(Math.random()*maxRecusada)],
      [this.getRandomTime(), Math.round(Math.random()*max),     Math.round(Math.random()*maxRecusada)]
    ];
    this.dataTable=this.dataTable.concat(newData);

    let googleChartWrapper = chart.wrapper;

    let dataTable = googleChartWrapper.getDataTable();
    // determine the number of rows and columns.
    var numRows = Math.round(Math.random()*newData.length);
    var numCols = newData[0].length;
    
    for(var i=0;i<numRows;i++){
      dataTable.addRow(newData[i]); 
    }
      
    
    if(maxValues<dataTable.getNumberOfRows()){
      dataTable.removeRows(0,numRows);
      for(var i=1;i<numRows+1;i++){
        if(this.dataTable.length>1){
          this.dataTable.splice(1,1);
        }
      }
    }
    this.transacoes.aceitas=0;
     this.transacoes.recusadas=0;
    for(var i=i;i<this.dataTable.length;i++){
      this.transacoes.aceitas= this.transacoes.aceitas+Number(this.dataTable[i][1]);
      this.transacoes.recusadas=this.transacoes.recusadas+Number(this.dataTable[1][2]);
    }
            
    // redraw the chart.
    chart.redraw();
    let self=this;
    setTimeout(function(){
      self.iterateDataGoogleChart(chart,chartData);
    },3000);
  }

  startAnimationForLineChart(chart){
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 100,
              dur: durations,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };
  startAnimationForBarChart(chart){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 0;
      durations2 = 10;
      chart.on('draw', function(data) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };
  ngOnInit() {
      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */
      
    let timer = Observable.timer(2000,1000);
    timer.subscribe(t=>this.ticks = t - this.resetTick-1);

      const dataDailySalesChart: any = {
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          series: [
              [12, 17, 7, 17, 23, 18, 38]
          ]
      };

     const optionsDailySalesChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
      }

      var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

      this.startAnimationForLineChart(dailySalesChart);


      /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

      const dataCompletedTasksChart: any = {
          labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
          series: [
              [230, 750, 450, 300, 280, 240, 200, 190]
          ]
      };

     const optionsCompletedTasksChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
      }

      var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

      // start animation for the Completed Tasks Chart - Line Chart
      this.startAnimationForLineChart(completedTasksChart);



      /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

      var dataEmailsSubscriptionChart = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
          [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

        ]
      };
      var optionsEmailsSubscriptionChart = {
          axisX: {
              showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
      };
      var responsiveOptions: any[] = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      var emailsSubscriptionChart = new Chartist.Bar('#emailsSubscriptionChart', dataEmailsSubscriptionChart, optionsEmailsSubscriptionChart, responsiveOptions);

      //start animation for the Emails Subscription Chart
      this.startAnimationForBarChart(emailsSubscriptionChart);
      this.iterateData(dataDailySalesChart,dailySalesChart,optionsDailySalesChart,40);
      this.iterateData(dataEmailsSubscriptionChart,emailsSubscriptionChart,optionsEmailsSubscriptionChart,800);
      this.iterateData(dataCompletedTasksChart,completedTasksChart,optionsCompletedTasksChart,800);
  }

  iterateData(dataChart,chart,options,total:number){
    let self=this;
    setTimeout(
        function(){
          dataChart.labels.push(dataChart.labels[0]);
          dataChart.labels.shift();
          dataChart.series[0].push(Math.random()*total);
          dataChart.series[0].shift();
          chart.update(dataChart, options);
          self.iterateData(dataChart,chart,options,total);
        },2000
      )
  }

}
