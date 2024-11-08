import { AfterViewInit, Component, HostListener } from '@angular/core';
import { interval, take, timeout } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements AfterViewInit {
  pageWidth: number = window.innerWidth;
  pageHeight: number = window.innerHeight;
  // lmao
  // tabs
  tabNames: string[] = ['social', 'music', 'games', 'code'];
  tabShortNames: string[] = ['soc', 'mus', 'gme', 'cde'];
  barIds:number[] = [3,2,1,0];
  colors: string[] = ["#648fff", "#785ef0", "#dc267f", "#fe6100", "#ffb000", "#222", "#eee"];
  chosenId: number = -1;
  // tab settings
  tabPercentageSize = this.pageWidth >= 768 ? 12 : 27.5;
  fontSize = this.pageWidth >= 768 ? '40px' : '20px';
  _tabSize: number = 150;
  get tabSize(){
    return this.pageWidth * (this.tabPercentageSize / 100.0);
  }
  getPolygon(){
    const thirdOfTabSize = this.tabSize*0.33333333333;
    return `0,100 ${thirdOfTabSize},0 ${thirdOfTabSize*4},0 ${this.tabSize},100 `
  }
  getSkew(){
    const thirdOfTabSize = this.tabSize*0.33333333333;
    return Math.atan(thirdOfTabSize/100) * -180/Math.PI;
  }
  // animation settings
  tabExpandSpeed: number = 400;
  ribbonDelay: number = 800;
  ribbonExpandSpeed: number = 400;
  ribbonContractSpeed: number = 400;
  tabContractDelay: number = 400;
  tabContractSpeed: number = 800;
  nextTabDelay: number = 400;
  // terminal settings
  consoleText: string = '/home/jusentari';
  typeSpeed: number = 50;
  cursorSpeed: number = 600;

  consoleTyping: boolean = false;
  constructor() { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateWindowSize();
  }
  updateWindowSize(){
    this.pageWidth = window.innerWidth;
    this.pageHeight = window.innerHeight;
    this.tabPercentageSize = this.pageWidth >= 768 ? 12 : 20;
    this.fontSize = this.pageWidth >= 768 ? '40px' : '20px';
  }

  ngOnInit(): void {
    const observable = interval(this.cursorSpeed);
    // TODO: start this subscription on type finish, as to not have it flash quickly after ending the typing
    const subscription = observable.subscribe(x => {
      if(!this.consoleTyping){
        if(this.consoleText.includes('|'))
          this.consoleText = this.consoleText.substring(0, this.consoleText.length - 1);
        else
          this.consoleText += '|';
      }
    });
  }

  beginAnimation(animationId: string){
    (document.getElementById(animationId)! as unknown as SVGAnimationElement).beginElement();
  }

  beginAnimations(animationClass: string){
    const elements = document.getElementsByClassName(animationClass);
    for(let i = 0; i < elements.length; i++){
      console.log(elements.item(i));
      const element = elements.item(i);
      (element! as unknown as SVGAnimationElement).beginElement();
    }
  }

  ngAfterViewInit(): void {
    //(document.getElementById('spline')! as unknown as SVGAnimationElement).beginElement();
    //(document.getElementById('spline2')! as unknown as SVGAnimationElement).beginElement();
    this.barIds.forEach(tabId => {
      (document.getElementById('tab' + tabId)! as unknown as SVGPolygonElement).addEventListener('mouseover', (event) => {
        console.log('hovered');
        if(tabId != this.chosenId && this.pageWidth >= 768)
          this.beginAnimations('expand' + tabId);
      });
      (document.getElementById('tab' + tabId)! as unknown as SVGPolygonElement).addEventListener('mouseout', (event) => {
        console.log('unhovered');
        if(tabId != this.chosenId && this.pageWidth >= 768){
          this.beginAnimations('contract' + tabId);
        }
      });
      (document.getElementById('tab' + tabId)! as unknown as SVGPolygonElement).addEventListener('click', (event) => {
        this.barIds = this.barIds.sort((a, b) => a === tabId ? 9999 : b - a);
        this.startAnim(tabId);
        console.log('click');
        let nextTabDelay = 0;
        if(this.chosenId != -1){
          this.beginAnimations('ribboncontract');
          const oldChosenId = this.chosenId;
          setTimeout(() => this.beginAnimations('contract' + oldChosenId), this.tabContractDelay);
          nextTabDelay = this.nextTabDelay;
        }
        setTimeout(() => {
          this.chosenId = tabId;
        }, this.ribbonContractSpeed);
        setTimeout(() => {
          this.beginAnimations('fullExpand' + tabId);
          setTimeout(() => this.beginAnimations('ribbonexpand'), this.ribbonDelay);
        }, nextTabDelay);
      });
      (document.getElementById('ribbon')! as unknown as SVGRectElement).addEventListener('click', (event) => {
        this.startAnim(tabId);
        console.log('click');
        const oldChosenId = this.chosenId;
        this.beginAnimations('contract' + oldChosenId);
        this.beginAnimations('ribboncontract');
        setTimeout(() => {
          this.barIds = this.barIds.sort((a, b) => b - a);
          this.chosenId = -1;
        }, this.tabContractSpeed);
      });
    });
  }

  startAnim(id: number): void {
    if(this.consoleTyping){
      return;
    }
    this.consoleTyping = true;
    let i = 0;
    const strings = this.getIntermediateStrings(this.consoleText, '/home/jusentari/' + this.tabShortNames[id]);
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
