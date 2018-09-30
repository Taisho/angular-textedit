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
	public lines: Array<Line> = [];
    public currLine: Line;

	@ViewChild("rootView") rootView;
	@ViewChild("textWidthCalculator") textWidthCalculator;

	public ngOnInit() {
		this.lines[0] = new Line({
			lineHeight: 0,
			hasCursor: true,
			cursorOffset: 0,
			text: "",
		});
        this.currLine = this.lines[0];

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

		if(event.key.length == 1) {
			this.currLine.text += event.key;
			let length = this.currLine.text.length;

            //TODO Cache cursor height
            let dimens = this.calculateTextWidth(this.currLine.text);
			this.currLine.cursorOffset = dimens[0];
			this.currLine.lineHeight = dimens[1]+"px";
		}
		else {
			switch(event.key) {
                case 'Enter':
                    this.currLine.hasCursor = false;
                    this.currLine = new Line({hasCursor: true});
                    this.lines.push(this.currLine);
                    break;

			}
		}
	}

	public mouseClick(event: MouseEvent) {
		let target = event.currentTarget as HTMLElement;
		let elc = this.elementCoords(target);
		let x = event.clientX - elc.x;
		let y = event.clientY - elc.y;

		let portion = "";
		let i=0;
		let pxOffset = "0";
		for(; ; i++) {
			let innerText = target.innerText;
			portion = innerText.substr(0, i+1);
			let width = this.calculateTextWidth(portion);
			pxOffset = width+"px";
			if(width[0] > x) {
				break;
			}

			if(i > innerText.length) {
				break;
			}
		}

		let line = eval('this.lines['+target.dataset.num+']');
        this.setCurrentLine(line,pxOffset,i);
	}

    public setCurrentLine(line: Line, pxOffset: string, i:number) {
        this.currLine.hasCursor = false;
        this.currLine = line;

		line.hasCursor = true;
		line.cursorOffset = pxOffset;
		line.cursorCharOffset = i;
    }

	public calculateTextWidth(str: string) {
		this.textWidthCalculator.nativeElement.innerText = str;
        let dimens = [
            this.textWidthCalculator.nativeElement.clientWidth,
            this.textWidthCalculator.nativeElement.clientHeight,
        ];

		return dimens;
	}

	public elementCoords ( node: any ) {
		//let node = <any>event.target;
		if (node.getBoundingClientRect) {
			const rect = node.getBoundingClientRect();
			const sx = -(window.scrollX ? window.scrollX : window.pageXOffset);
			const sy = -(window.scrollY ? window.scrollY : window.pageYOffset);

			return {
				x: rect.left - sx,
				y: rect.top - sy,
				width: rect.width,
				height: rect.height,
			}
		}
	}


}

export class Line {
	public lineHeight: string = "0";
	public hasCursor = true;
	public cursorOffset: string = "0";
	public cursorCharOffset = 0;
	public text = "";

	constructor(input:any = {}) {
		this.lineHeight = input.lineHeight || 0;
		this.hasCursor = input.hasCursor || false;
		this.cursorOffset = input.cursorOffset || 0;
		this.cursorCharOffset = input.cursorCharOffset || 0;
		this.text = input.text || "";
	}
}
