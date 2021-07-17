import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
const path = require('path')

THREE.Cache.enabled = true
const ASSETS_PATH = '/assets'

const ANIMATION_PATHS = [
  'bow1.fbx', 'dancing1.fbx','gesture1.fbx','gesture2.fbx',
  'hello2.fbx','idle1.fbx', 'laughing1.fbx', 'laying_idle1.fbx',
  'walking1.fbx', 'hello1.fbx'
].map((p:string) => path.join(ASSETS_PATH, p))

const BASE_BODY_PATH = path.join(ASSETS_PATH, 'base.fbx')
const BODY_TEXTURE_PATH = path.join(ASSETS_PATH, 'bodyTexture3.png')

const fbxLoader:FBXLoader = new FBXLoader()
const textureLoader:THREE.TextureLoader = new THREE.TextureLoader()

export default class Avatar {
  mixer:THREE.AnimationMixer|null = null
  actions:THREE.AnimationAction[] = []
  object:THREE.Object3D = new THREE.Object3D()
  _scale:number = 0.7 + 0.3 * Math.random()

  async init() {

    const bodyShape:THREE.Object3D = await this.fbxLoad(BASE_BODY_PATH)     
    const bodyTexture:THREE.Object3D = await this.textureLoad(BODY_TEXTURE_PATH)         
    bodyTexture.wrapS = THREE.ClampToEdgeWrapping;
    bodyTexture.wrapT = THREE.ClampToEdgeWrapping;    
    const bodyMaterial = new THREE.MeshLambertMaterial({map: bodyTexture, needsUpdate: true})
    bodyShape.children[0].material = bodyMaterial

    this.object.add(bodyShape)
    
    this.object.scale.set(this._scale, this._scale, this._scale) 
    this.object.position.x = (Math.random() - 0.5) * 2 * 800
    this.object.position.z = 1300 + Math.random() * 300
    this.object.rotation.y = (Math.PI) + (Math.random() - 0.5) * (Math.PI) * 0.6
  
    const mixer = new THREE.AnimationMixer(this.object)
    this.actions = await  Promise.all(
      ANIMATION_PATHS.map(async (animPath: string) => {
        const obj:THREE.Object3D = await this.fbxLoad(animPath)
        const action = mixer.clipAction(obj.animations[0])
        action.name = path.basename(animPath, '.fbx')
        return action
      })  
    )


    this.mixer = mixer
    this.idle()

    mixer.addEventListener('finished', () => {
      this.randomMotionPlay()
    })

  }

  randomMotionPlay() {
    const motionFuncs = [() => this.hello(), () => this.dancing(), () => this.gesture(), () => this.bow()]
    const idx = parseInt((Math.random() * motionFuncs.length) + '')
    motionFuncs[idx]()
  } 

  fbxLoad(srcPath:string) {
    return new Promise((resolve) => fbxLoader.load(srcPath, (obj:any) => resolve(obj)))
  }

  textureLoad(srcPath:string) {
    return new Promise((resolve) => textureLoader.load(srcPath, (obj:any) => resolve(obj)))
  }

  getActionByName(name:string):THREE.AnimationAction|null {
    if (this.actions.length == 0) return null
    const action = this.actions.find((action:THREE.AnimationAction) => action.name == name)
    return action ? action : null
  }

  idle() {
    this._animPlayByName('idle1', false)
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


}