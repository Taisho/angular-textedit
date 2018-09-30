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

		this.lines[0].cursorOffset = this.calculateTextWidth(this.lines[0].text)+"px";

		this.lines[0].lineHeight = target.clientHeight+"px";
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
			if(width > x) {
				break;
			}

			if(i > innerText.length) {
				break;
			}
		}

		let line = eval('this.lines['+target.dataset.num+']');
		line.hasCursor = true;
		line.cursorOffset = pxOffset;
		line.cursorCharOffset = i;
				
	}

	public calculateTextWidth(str: string) {
		this.textWidthCalculator.nativeElement.innerText = str;
		return this.textWidthCalculator.nativeElement.clientWidth;
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
