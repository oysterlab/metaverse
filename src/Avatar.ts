
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
    const { loader } = this

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

    this.walking()

    this.mixer = mixer
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

  _animPlayByName(name:string) {
    const idleAction = this.getActionByName(name)
    console.log(idleAction)
    if (idleAction) {
      idleAction.time = 0
      idleAction.play() 
    }
  }

  animate(dt:number){
    if (!this.mixer) return
    this.mixer.update(dt)
    // this.object.rotateY(dt * 0.1)
  }


}