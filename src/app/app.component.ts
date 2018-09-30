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
    public lines: Array<any> = [];

    @ViewChild("rootView") rootView;
    @ViewChild("textWidthCalculator") textWidthCalculator;

    public ngOnInit() {
        this.lines[0] = new Line({
            lineHeight: 0,
            hasCursor: true,
            cursorOffset: 0,
            text: "",
        });

        setTimeout( ()=> {
            this.rootView.nativeElement.focus();
        }, 500);
    }

    public onfocus(event: any) {
        this.rootViewText = "got focus";
    }

    public keypress(event: KeyboardEvent) {
        let target = event.currentTarget as any;

        let matches = [];
        var cssProp = window.getComputedStyle(target, null).getPropertyValue('font-size');
        matches = cssProp.match(/([\d.,]+)(\w+)/);

        this.lines[0].text += event.key;
        let length = this.lines[0].text.length;
        this.lines[0].cursorOffset = (matches[1]*length) + matches[2];

        this.lines[0].lineHeight = target.clientHeight+"px";
    }

    public calculateTextWidth(str: string) {
        this.textWidthCalculator.nativeElement.innerText = str;
        return this.textWidthCalculator.nativeElement.width;
    }
}

export class Line {
    public lineHeight= 0;
    public hasCursor= true;
    public cursorOffset= 0;
    public cursorCharOffset= 0;
    public text= "";

    constructor(input) {
        this.lineHeight = input.lineHeight;
        this.hasCursor = input.hasCursor;
        this.cursorOffset = input.cursorOffset;
        this.cursorCharOffset = input.cursorCharOffset;
        this.text = input.text;
    }
}
