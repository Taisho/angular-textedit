import { Component, ElementRef,
         ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


    public title = 'TextEdit';
    public rootViewText = "";
    public lines: Array<string> = [];

    @ViewChild("rootView") rootView;

    public ngOnInit() {
        this.lines[0] = "";

        setTimeout( ()=> {
            this.rootView.nativeElement.focus();
        }, 500);
    }

    public onfocus(event: any) {
        this.rootViewText = "got focus";
    }

    public keypress(event: KeyboardEvent) {
        this.lines[0] += event.key;
    }
}
