
export default class Video {
  domElement:HTMLElement

  constructor() {
    this.domElement = document.createElement('div')
    this._styleInit()
  }

  _styleInit() {
    const { domElement } = this
    domElement.style.width = '60%'
    domElement.style.height = '60%'
    domElement.style.position = 'absolute'
    domElement.style.top = '10%' 
    domElement.style.left = '10%'  
    domElement.style.background = '#ababab'
  }
}