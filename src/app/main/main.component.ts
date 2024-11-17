import { AfterViewInit, Component, EventEmitter, HostListener, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { interval, take, timeout } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements AfterViewInit {
  pageWidth: number = window.innerWidth;
  pageHeight: number = window.innerHeight;
  @Input() tabRatio: number = .1;
  @Input() tabPercentageSize: number = this.pageWidth >= 768 ? 12 : 27.5;
  @Input() tabHeight: number = 100;
  @Output() tabHeightChange = new EventEmitter<number>();
  @Output() tabRatioChange = new EventEmitter<number>();
  @Output() tabPercentageSizeChange = new EventEmitter<number>();
  animLock: boolean = false;
  // lmao
  ribbonPercentage: number = .05;
  // tabs
  tabNames: string[] = ['social', 'music', 'games', 'code'];
  tabShortNames: string[] = ['soc', 'mus', 'gme', 'cde'];
  barIds:number[] = [3,2,1,0];
  colors: string[] = ["#648fff", "#785ef0", "#dc267f", "#fe6100", "#ffb000", "#222", "#eee"];
  chosenId: number = -1;
  // tab settings
  fontSize = this.pageWidth >= 768 ? '40px' : '20px';
  _tabSize: number = 150;
  get tabSize(){
    return this.pageWidth * (this.tabPercentageSize / 100.0);
  }
  getPolygon(){
    const thirdOfTabSize = this.tabSize*this.tabRatio;
    return `0,${this.tabHeight} ${thirdOfTabSize},0 ${thirdOfTabSize*((1/this.tabRatio)+1)},0 ${this.tabSize},${this.tabHeight} `
  }
  getSkew(){
    const thirdOfTabSize = this.tabSize*this.tabRatio;
    return Math.atan(thirdOfTabSize/this.tabHeight) * -180/Math.PI;
  }
  // animation settings
  tabExpandSpeed: number = 800;
  ribbonDelay: number = 800;
  ribbonExpandSpeed: number = 400;
  ribbonContractSpeed: number = 400;
  tabContractDelay: number = 400;
  tabContractSpeed: number = 800;
  nextTabDelay: number = 400;
  // terminal settings
  consoleText: string = '> cd /home/jusentari';
  typeSpeed: number = 50;
  cursorSpeed: number = 600;

  consoleTyping: boolean = false;
  // gonna try doing this even though it aint the most efficient
  isAnimPlaying: Record<string, boolean> = {}
  constructor() { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateWindowSize();
  }
  updateWindowSize(){
    this.pageWidth = window.innerWidth;
    this.pageHeight = window.innerHeight;
    this.tabPercentageSize = this.pageWidth >= 768 ? 12 : 20;
    this.fontSize = this.pageWidth >= 1250 ? '40px' : (this.pageWidth >= 1050 ? '30px' : this.pageWidth >= 768 ? '25px' : '20px');
    if((this.pageWidth < 768 && this.tabPercentageSize == 12) || (this.pageWidth >= 768 && this.tabPercentageSize == 20)){
      setTimeout(() => this.ngAfterViewInit(), 1000);
    }
  }

  ngOnInit(): void {
    const observable = interval(this.cursorSpeed);
    // TODO: start this subscription on type finish, as to not have it flash quickly after ending the typing
    const subscription = observable.subscribe(x => {
      if(!this.consoleTyping){
        if(this.consoleText.includes('|'))
          this.consoleText = this.consoleText.substring(0, this.consoleText.length - 1);
      }
    });
  }

  userType(e: any): void {
    if(e.key === "Enter"){
      //parse input and go to page based on what user typed
      const dirs = this.consoleText.split('/');
      const file = dirs[dirs.length - 1];
      console.log(file);
      const page = this.tabShortNames.indexOf(file);
      if(file === 'jusentari' || file === ''){
        this.chosenId = -1;
      }
      if(page > -1){
        console.log(page);
        this.openTabAnim(page);
        this.chosenId = page;
      }
    }
  }

  beginAnimation(animationId: string){
    (document.getElementById(animationId)! as unknown as SVGAnimationElement).beginElement();
  }

  beginAnimations(animationClass: string){
    const elements = document.getElementsByClassName(animationClass);
    for(let i = 0; i < elements.length; i++){
      const element = elements.item(i);
      (element! as unknown as SVGAnimationElement).beginElement();
    }
    this.isAnimPlaying[animationClass] = true;
  }

  openTabAnim(tabId: number){
    if(this.animLock || tabId === this.chosenId){
          return;
        }
        this.animLock = true;
        if(this.pageWidth < 768){
          this.barIds = this.barIds.sort((a, b) => a === tabId ? 9999 : b - a);
        } else {
          this.barIds = this.barIds.sort((a, b) => b - a);
        }
        this.startAnim(tabId);
        let nextTabDelay = 0;
        if(this.chosenId != -1){
          this.beginAnimations('ribboncontract');
          const oldChosenId = this.chosenId;
          setTimeout(() => {
            this.barIds.filter(bId => bId != tabId).forEach(barId => {
              this.beginAnimations('fullContract' + barId);
            });
          }, this.tabContractDelay);
          nextTabDelay = this.nextTabDelay;
        }
        setTimeout(() => {
          this.chosenId = tabId;
        }, this.ribbonContractSpeed);
        setTimeout(() => {
          this.beginAnimations('fullExpand' + tabId);
          setTimeout(() => {
            this.beginAnimations('ribbonexpand');
            this.animLock = false;
          }, this.ribbonDelay);
        }, nextTabDelay);
  }

  // TODO: Hook these anims up again when user goes from mobile to pc and vice versa
  ngAfterViewInit(): void {
    this.barIds.forEach(tabId => {
      (document.getElementById('expand' + tabId)! as unknown as SVGAnimateElement).addEventListener('endEvent', (event) => {
        this.isAnimPlaying['expand' + tabId] = false;
      });
      (document.getElementById('fullContract' + tabId)! as unknown as SVGAnimateElement).addEventListener('endEvent', (event) => {
        this.isAnimPlaying['fullContract' + tabId] = false;
      });
      (document.getElementById('fullExpand' + tabId)! as unknown as SVGAnimateElement).addEventListener('endEvent', (event) => {
        this.isAnimPlaying['fullExpand' + tabId] = false;
        console.log(event);
      });
      (document.getElementById('tab' + tabId)! as unknown as SVGPolygonElement).addEventListener('mouseover', (event) => {
        if(tabId != this.chosenId && this.pageWidth >= 768)
          this.beginAnimations('expand' + tabId);
      });
      (document.getElementById('tab' + tabId)! as unknown as SVGPolygonElement).addEventListener('mouseout', (event) => {
        if(tabId != this.chosenId && this.pageWidth >= 768 && !this.isAnimPlaying['fullExpand' + tabId] && !this.isAnimPlaying['fullContract' + tabId]){
          this.beginAnimations('contract' + tabId);
        }
      });
      (document.getElementById('tab' + tabId)! as unknown as SVGPolygonElement).addEventListener('click', (event) => {
       this.openTabAnim(tabId);
      });
      (document.getElementById('ribbon')! as unknown as SVGRectElement).addEventListener('click', (event) => {
        if(this.pageWidth < 768){
          this.startAnim(tabId);
          const oldChosenId = this.chosenId;
          this.beginAnimations('contract' + oldChosenId);
          this.beginAnimations('ribboncontract');
          setTimeout(() => {
            this.barIds = this.barIds.sort((a, b) => b - a);
            this.chosenId = -1;
          }, this.tabContractSpeed);
        }
      });
    });
  }

  startAnim(id: number): void {
    if(this.consoleTyping){
      return;
    }
    this.consoleTyping = true;
    let i = 0;
    const strings = this.getIntermediateStrings(this.consoleText, '> cd /home/jusentari/' + this.tabShortNames[id]);
    const observable = interval(this.typeSpeed);
    const subscription = observable.pipe(take(strings.length)).subscribe(x => {
      this.consoleText = strings[i] + '|';
      i++;
    });
    setTimeout(() => {
      this.consoleTyping = false;
    }, this.typeSpeed * strings.length)
  }

  private getIntermediateStrings(oldText: string, newText: string): string[] {
    var length = Math.max(oldText.length, newText.length);
    var index = -1;
    let mismatchFound = false
    while (!mismatchFound){
      index++;
      mismatchFound = oldText.charAt(index).localeCompare(newText.charAt(index)) !== 0 || index > length;
    }
    const numberToErase = oldText.length - index;
    const numberToAdd = newText.length - index;
    const returnVal = [];
    for (let i = 1; i <= numberToErase; i++) {
      returnVal.push(oldText.substring(0, oldText.length - i));
    }
    for (let i = numberToAdd; i >= 0; i--) {
      returnVal.push(newText.substring(0, newText.length - i));
    }
    return returnVal;
  }

  public getPolygonById(id: number){
    return "-5000,0 " + 100 * id + ",0 " + 100 * (id - 1) + ",100 -5000,100 -5000,0 100,0";
  }
}
