import {
  Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, ViewChild, ElementRef,
} from '@angular/core';

import { ApiService } from '../shared/api.service';
import { isBrowser } from 'angular2-universal';
import * as cookie from 'js-cookie';

let plyr, io;
if(isBrowser) {
  plyr = require('plyr');
  io = require('socket.io-client')
}

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  @ViewChild('urlInput') urlInputRef: ElementRef;
  @ViewChild('videoRef') videoRef: ElementRef;

  private torrentDetails;
  public showModal = false;
  public videoUrl: string;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    if (isBrowser) {
      const magnetURI = window.localStorage.getItem('magnetURI');
      if (magnetURI) {
        this.startProcessing(magnetURI);
      }

      const socket = io.connect(`ws://${window.location.host}?session_name=${cookie.get('session_name')}`)

      socket.on('open', () => {
        console.log('connection made')
      })
    }
  }

  public startProcessing(torrentId: string) {
    const torrentDetails$ = this.apiService.getTorrentsList(torrentId);
    torrentDetails$.subscribe(details => {
      this.urlInputRef.nativeElement.value = '';
      this.torrentDetails = details;
      if (isBrowser) {
        window.localStorage.setItem('magnetURI', details.magnetURI)
      }
    })
  }

  public closeModal() {
    this.showModal = false;
  }

  isSupported(mime: string) {
    return document.createElement('video').canPlayType(mime) || mime === 'video/x-matroska'
  }

  public startStream(torrentId: string, fileId: number, fileName: string) {
    this.showModal = true;
    this.videoUrl = `/download/${torrentId}/${fileId}/${fileName}`;
  }
}
