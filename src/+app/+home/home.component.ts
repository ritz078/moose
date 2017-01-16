import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ApiService } from '../shared/api.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'home',
  styleUrls: [ './home.component.css' ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  @ViewChild('urlInput') urlInputRef: ElementRef;

  private torrentDetails;
  constructor(
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
    this.torrentDetails = JSON.parse(localStorage.getItem('torrentDetails'))
  }

  public startStream (torrentId: string) {
    const torrentDetails$ = this.apiService.getTorrentsList(torrentId);
    torrentDetails$.subscribe(details => {
      this.urlInputRef.nativeElement.value = '';
      this.torrentDetails = details;
      localStorage.setItem('torrentDetails', JSON.stringify(details))
    })
  }
}
