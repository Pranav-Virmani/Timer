import { Component, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-timer-tool',
  template: `<div [ngClass]="{'timer-active': timerState === 'active', 'timer-paused': timerState === 'paused'}">
  <h2>Timer Tool</h2>
  <div>{{ timer }}</div>
  <button *ngIf="!isStartButtonDisabled" (click)="startTimer()">Start</button>
  <button *ngIf="timerInterval && timerState === 'active'" (click)="pauseTimer()">Pause</button>
  <button *ngIf="timerInterval && timerState === 'paused'" (click)="resumeTimer()">Resume</button>
  <button (click)="resetTimer()">Reset</button>
</div>`,
  styleUrls: ['./timer-tool.component.scss']
})
export class TimerToolComponent implements OnDestroy {
  timer: string = '05:00';
  timerInterval !: Subscription;
  timerState: string = '';
  isStartButtonDisabled: boolean = false;
  remainingTime: number = 300; // 5 minutes in seconds

  startTimer() {
    this.isStartButtonDisabled = true;
    this.timerState = 'active';

    this.timerInterval = interval(1000).subscribe(() => {
      const minutes = Math.floor(this.remainingTime / 60);
      const seconds = this.remainingTime % 60;

      this.timer = `${this.padNumber(minutes)}:${this.padNumber(seconds)}`;

      if (this.remainingTime === 0) {
        this.timerInterval.unsubscribe();
        this.isStartButtonDisabled = false;
        this.timerState = '';
      } else {
        this.remainingTime--;
      }
    });
  }

  pauseTimer() {
    this.timerInterval.unsubscribe();
    this.timerState = 'paused';
  }

  resumeTimer() {
    // this.isStartButtonDisabled = true;
    // this.timerState = 'active';
    this.startTimer();
  }

  resetTimer() {
    this.timerInterval.unsubscribe();
    this.timer = '05:00';
    this.timerState = '';
    this.isStartButtonDisabled = false;
    this.remainingTime = 300; // Reset remaining time
  }

  private padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      this.timerInterval.unsubscribe();
    }
  }
}
