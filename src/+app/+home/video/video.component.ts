import {
  Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, Input,
  ElementRef, ViewChild
} from '@angular/core';
import { isBrowser } from 'angular2-universal';

let plyr;
if (isBrowser) {
  plyr = require('plyr');
}

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'plyr',
  template: `
<div class="none" [ngClass]="{block: showVideo}" >
    <video [src]="src" controls autoplay poster="assets/poster.jpg" #videoElement></video>
</div>
`,
  styles: [`
  @import url('https://cdn.plyr.io/2.0.11/plyr.css');

  .block {
    display: flex !important;
    justify-content: center;
  }
  
  .none{
    display: none;
  }
`]
})
export class VideoComponent implements OnInit {
  @ViewChild('videoElement') videoElement: ElementRef;

  @Input() src: string;

  private showVideo = false;

  constructor() {
  }

  ngOnInit() {
    const instance = plyr.setup(this.videoElement.nativeElement, {});
    instance[0].on('loadeddata', () => (this.showVideo = true))

    instance[0].on('destroyed', () => (this.showVideo = false))
  }
}
