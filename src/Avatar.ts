
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
const path = require('path')


const ASSETS_PATH = '/assets'

const ANIMATION_PATHS = [
  'bow1.fbx', 'dancing1.fbx','gesture1.fbx','gesture2.fbx',
  'hello2.fbx','idle1.fbx', 'laughing1.fbx', 'laying_idle1.fbx',
  'walking1.fbx', 'hello1.fbx'
].map((p:string) => path.join(ASSETS_PATH, p))

const BASE_BODY_PATH = path.join(ASSETS_PATH, 'base.fbx')

export default class Avatar {
  loader:FBXLoader = new FBXLoader()
  mixer:THREE.AnimationMixer|null = null
  actions:THREE.AnimationAction[] = []
  object:THREE.Object3D = new THREE.Object3D()
  _scale:number = 0.7

  async init() {
    const bodyShape:THREE.Object3D = await this.load(BASE_BODY_PATH)     
    this.object.add(bodyShape)
    this.object.scale.set(this._scale, this._scale, this._scale) 
    const mixer = new THREE.AnimationMixer(this.object)
    this.actions = await  Promise.all(
      ANIMATION_PATHS.map(async (animPath: string) => {
        const obj:THREE.Object3D = await this.load(animPath)
        const action = mixer.clipAction(obj.animations[0])
        action.name = path.basename(animPath, '.fbx')
        return action
      })  
    )

    mixer.addEventListener('finished', () => {
      this.idle()
    })

    this.mixer = mixer

    this.idle()
  }

  load(srcPath:string) {
    return new Promise((resolve) => this.loader.load(srcPath, (obj:any) => resolve(obj)))
  }

  getActionByName(name:string):THREE.AnimationAction|null {
    if (this.actions.length == 0) return null
    const action = this.actions.find((action:THREE.AnimationAction) => action.name == name)
    return action ? action : null
  }

  idle() {
    this._animPlayByName('idle1')
  }

  walking() {
    this._animPlayByName('walking1')
  }

  hello() {
    this._animPlayByName('hello1', false)
  }

  dancing() {
    this._animPlayByName('dancing1', false)
  }

  gesture() {
    this._animPlayByName('gesture1', false)
  }  

  bow() {
    this._animPlayByName('bow1', false)
  }


  _animPlayByName(name:string, isLoop=true) {
    const action = this.getActionByName(name)

    if (action) {
      this.mixer.stopAllAction()

      if (!isLoop) {
        action.setLoop(THREE.LoopOnce)        
      }
      action.clampWhenFinished = isLoop
      action.time = 0
      action.play()
    }
  }

  animate(dt:number){
    if (!this.mixer) return
    this.mixer.update(dt)
    // this.object.rotateY(dt * 0.1)
  }

  move(y:number, mx:number, mz:number) {
    this.object.rotateY(y)
    this.object.translateX(mx)
    this.object.translateZ(mz)    
    // console.log(this.object.rotation)
    // this.object.rotation.set(y, 1, 1)
  }
}