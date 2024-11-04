import { AfterViewInit, Component, HostListener } from '@angular/core';
import { interval, take, timeout } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements AfterViewInit {
  pageWidth: number = window.innerWidth;
  consoleText: string = '/home/jusentari';
  typeSpeed: number = 50;
  cursorSpeed: number = 600;
  animLock: boolean = false;
  // lmao
  // 
  barIds:number[] = [4,3,2,1];
  selectedBar:number = 5;
  colors: string[] = ["#648fff", "#785ef0", "#dc267f", "#fe6100", "#ffb000", "#222", "#eee"];
  chosenId: number = 0;
  // animation settings
  tabExpandSpeed: number = 400;
  ribbonDelay: number = 800;
  ribbonExpandSpeed: number = 400;
  ribbonContractSpeed: number = 400;
  tabContractDelay: number = 400;
  tabContractSpeed: number = 800;
  nextTabDelay: number = 400;
  constructor() { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateWindowSize();
  }
  updateWindowSize(){
    this.pageWidth = window.innerWidth;
  }

  ngOnInit(): void {
    const observable = interval(this.cursorSpeed);
    // TODO: start this subscription on type finish, as to not have it flash quickly after ending the typing
    const subscription = observable.subscribe(x => {
      if(!this.animLock){
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

  ngAfterViewInit(): void {
    //(document.getElementById('spline')! as unknown as SVGAnimationElement).beginElement();
    //(document.getElementById('spline2')! as unknown as SVGAnimationElement).beginElement();
    const tabids: number[] = [1, 2, 3, 4];
    tabids.forEach(tabId => {
      (document.getElementById('tab' + tabId)! as unknown as SVGPolygonElement).addEventListener('mouseover', (event) => {
        console.log('hovered');
        if(tabId != this.chosenId)
          this.beginAnimation('expand' + tabId);
      });
      (document.getElementById('tab' + tabId)! as unknown as SVGPolygonElement).addEventListener('mouseout', (event) => {
        console.log('unhovered');
        if(tabId != this.chosenId){
          this.beginAnimation('contract' + tabId);
        }
      });
      (document.getElementById('tab' + tabId)! as unknown as SVGPolygonElement).addEventListener('click', (event) => {
        this.startAnim(tabId);
        console.log('click');
        let nextTabDelay = 0;
        if(this.chosenId != 0){
          this.beginAnimation('ribboncontract');
          const oldChosenId = this.chosenId;
          setTimeout(() => this.beginAnimation('contract' + oldChosenId), this.tabContractDelay);
          nextTabDelay = this.nextTabDelay;
        }
        setTimeout(() => {
          this.chosenId = tabId;
        }, this.ribbonContractSpeed);
        setTimeout(() => {
          this.beginAnimation('fullExpand' + tabId);
          setTimeout(() => this.beginAnimation('ribbonexpand'), this.ribbonDelay);
        }, nextTabDelay);
      });
      (document.getElementById('contract' + tabId)! as unknown as SVGAnimationElement).addEventListener('animationend', () => {
        console.log('Animation ended');
      });
    });
  }

  startAnim(id: number): void {
    if(this.animLock){
      return;
    }
    this.animLock = true;
    let i = 0;
    const strings = this.getIntermediateStrings(this.consoleText, '/home/jusentari/' + id + 'test');
    const observable = interval(this.typeSpeed);
    const subscription = observable.pipe(take(strings.length)).subscribe(x => {
      this.consoleText = strings[i] + '|';
      i++;
    });
    setTimeout(() => {
      /*
      for (let i = 1; i <= 4; i++) {
        var elementName = null;
        if(i >= id && i < this.selectedBar)
          elementName = "barRight";
        if(i >= this.selectedBar && i < id)
          elementName = "barLeft";  
        console.log(elementName);
        if(elementName){
          (document.getElementById(elementName + i)! as unknown as SVGAnimationElement).beginElement();
        }
      }*/
      this.selectedBar = id;
      this.animLock = false;
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
