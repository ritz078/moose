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
  public selectedTorrentId: string;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    if (isBrowser) {
      const socket = io.connect(`${window.location.protocol}//${window.location.host}?session_name=${cookie.get('session_name')}`)

      socket.on('connect', () => {
        cookie.set('socket_id', socket.id);
      })

      socket.on('message', (x) => {
        console.log(x);
      })

      const magnetURI = window.localStorage.getItem('magnetURI');
      if (magnetURI) {
        this.startProcessing(magnetURI);
      }
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
    this.apiService.deleteTempFiles(this.selectedTorrentId)
      .subscribe(msg => console.log(msg));
    this.selectedTorrentId = null;
  }

  isSupported(mime: string) {
    return document.createElement('video').canPlayType(mime) || mime === 'video/x-matroska'
  }

  public startStream(torrentId: string, fileId: number, fileName: string) {
    this.showModal = true;
    this.videoUrl = `/download/${torrentId}/${fileId}/${fileName}`;
    this.selectedTorrentId = torrentId;
  }
}
