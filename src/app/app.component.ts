import { Component } from '@angular/core';
import { timer, Subject } from "rxjs";
import { buffer, filter, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'timer';
  private time: number = 0;
  public timerDisplay: TimeDisplay;
  private isPaused: boolean = true;
  private isWaiting: boolean = false;
  private click = new Subject();
  private click$ = this.click.asObservable();

  public waitClicked(): void {
    this.click.next(1);
  }

  public startStop(): void {
    if (this.isWaiting) {
      this.isPaused = false;
      this.isWaiting = false;
    } else {
      this.time = 0;
      this.timerDisplay = null;
      this.isPaused = !this.isPaused;
    }
  }

  public reset(): void {
    this.time = 0;
    this.isPaused = false;
  }

  private wait(): void {
    if (this.time > 0) {
      this.isPaused = !this.isPaused;
      this.isWaiting = !this.isWaiting;
    }
  }

  private getDisplayTimer(time: number) {
    const hours = '0' + Math.floor(time / 3600);
    const minutes = '0' + Math.floor(time % 3600 / 60);
    const seconds = '0' + Math.floor(time % 3600 % 60);

    return {
      hours: { digit1: hours.slice(-2, -1), digit2: hours.slice(-1) },
      minutes: { digit1: minutes.slice(-2, -1), digit2: minutes.slice(-1) },
      seconds: { digit1: seconds.slice(-2, -1), digit2: seconds.slice(-1) },
    };
  }

  ngOnInit() {
    this.click$.pipe(buffer(this.click$.pipe(debounceTime(300))),
      filter(clickArray => clickArray.length === 2))
      .subscribe((res) => {
        this.wait()
        console.log('+++++++++')
      });

    timer(0, 1000).pipe(
      filter(() => !this.isPaused)
    ).subscribe(ec => {
      this.timerDisplay = this.getDisplayTimer(this.time);
      this.time++;
    });
  }
}

interface TimeDisplay {
  hours: PlaceHolder;
  minutes: PlaceHolder;
  seconds: PlaceHolder;
}

interface PlaceHolder {
  digit1: string;
  digit2: string;
}