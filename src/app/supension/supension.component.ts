import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexMarkers,
  ApexAnnotations,
  ApexStroke,
  NgApexchartsModule
} from "ng-apexcharts";
import { NgxGaugeModule } from 'ngx-gauge';
import { data } from "./series-data";
import { ActivatedRoute } from '@angular/router';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  annotations: ApexAnnotations;
  colors: any;
  toolbar: any;
};

@Component({
  selector: 'app-supension',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, NgxGaugeModule],
  templateUrl: './supension.component.html',
  styleUrl: './supension.component.css',
  // Add Font Awesome CDN in the component head
  encapsulation: ViewEncapsulation.None
})
export class SupensionComponent implements OnInit {

  engineCode: string = '';
  currentDate: Date = new Date();
  
  

  constructor(private route: ActivatedRoute) {
    this.initChart();
    this.simulateGaugeUpdates();
  }
  
  ngOnInit() {
    // Get the engineCode from route parameters
    this.route.paramMap.subscribe(params => {
      this.engineCode = params.get('engineCode') || '';
      console.log('Engine Code:', this.engineCode);
      // Here you would typically load engine-specific data
    });
  }
  
  @ViewChild("chart", { static: false }) chart!: ChartComponent;
  public chartOptions: ChartOptions | undefined;
  public activeOptionButton = "all";
  
  // Current Gauge Properties
  currentValue = 36;
  currentMin = 0;
  currentMax = 100;
  currentThresholdConfig = {
    '0': {color: '#2e86de'},
    '70': {color: '#f9ca24'},
    '90': {color: '#eb4d4b'}
  };
  
  // Voltage Gauge Properties
  voltageValue = -315;
  voltageMin = -500;
  voltageMax = 0;
  voltageThresholdConfig = {
    '-500': {color: '#eb4d4b'},
    '-400': {color: '#f9ca24'},
    '-200': {color: '#2e86de'}
  };
  public updateOptionsData: Record<string, { xaxis: { min: number | undefined; max: number | undefined } }> = {
    "1m": {
      xaxis: {
        min: new Date("01 Apr 2025").getTime(),
        max: new Date("30 Apr 2025").getTime()
      }
    },
    "6m": {
      xaxis: {
        min: new Date("01 Jan 2025").getTime(),
        max: new Date("30 May 2025").getTime()
      }
    },
    "1y": {
      xaxis: {
        min: new Date("01 Jan 2025").getTime(),
        max: new Date("30 May 2025").getTime()
      }
    },
    "YTD": {
      xaxis: {
        min: new Date("01 Jan 2025").getTime(),
        max: new Date("07 May 2025").getTime()
      }
    },
    all: {
      xaxis: {
        min: new Date("01 Jan 2025").getTime(),
        max: new Date("30 May 2025").getTime()
      }
    }
  };

  motorImage = 'green.png';

  
  toggleMotorImage() {
    this.motorImage = this.motorImage === 'green.png' ? 'red.jpg' : 'green.png';
    // Update current date when toggling to simulate real-time updates
    this.currentDate = new Date();
  }

  // Constructor is now merged with the one above
  
  // Method to simulate dynamic gauge updates
  simulateGaugeUpdates() {
    setInterval(() => {
      // Update current value with random fluctuations
      this.currentValue = Math.max(0, Math.min(100, this.currentValue + (Math.random() - 0.5) * 10));
      
      // Update voltage value with random fluctuations
      this.voltageValue = Math.max(-500, Math.min(0, this.voltageValue + (Math.random() - 0.5) * 20));
    }, 2000); // Update every 2 seconds
  }

  initChart(): void {
    this.chartOptions = {
      series: [
        {
          data: data
        }
      ],
      chart: {
        type: "area",
        height: 350
      },
      annotations: {
        yaxis: [
          {
            y: 40,
            borderColor: "#999",
            label: {
              text: "Support",
              style: {
                color: "#fff",
                background: "#00E396"
              }
            }
          }
        ],
        xaxis: [
          {
            x: new Date("15 Mar 2025").getTime(),
            borderColor: "#999",
            label: {
              text: "Rally",
              style: {
                color: "#fff",
                background: "#775DD0"
              }
            }
          }
        ]
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: "datetime",
        min: new Date("01 Jan 2025").getTime(),
        max: new Date("30 May 2025").getTime(),
        tickAmount: 6
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy"
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      },
      // Add missing required properties
      title: {
        text: "Suspension Chart"
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            return val.toFixed(0);
          }
        }
      },
      stroke: {
        curve: "smooth"
      },
      colors: ["#008FFB"],
      toolbar: {
        show: true
      }
    };
  }

  public updateOptions(option: '1m' | '6m' | '1y' | 'YTD' | 'all'): void {
    this.activeOptionButton = option;
    if (this.chart) {
      this.chart.updateOptions(this.updateOptionsData[option], false, true, true);
    }
  }

}
