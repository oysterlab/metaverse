
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
const BODY_TEXTURE_PATH = path.join(ASSETS_PATH, 'bodyTexture3.png')

export default class Avatar {
  fbxLoader:FBXLoader = new FBXLoader()
  textureLoader:THREE.TextureLoader = new THREE.TextureLoader()
  
  mixer:THREE.AnimationMixer|null = null
  actions:THREE.AnimationAction[] = []
  object:THREE.Object3D = new THREE.Object3D()
  _scale:number = 0.7 + 0.3 * Math.random()

  initPosition:THREE.Vector3;

  constructor(bodyShape_, bodyMaterial_, animations_) {
    
    const x = 0;//(Math.random() - 0.5) * 3000
    const z = 0;//  (Math.random() - 0.5) * 800      
    this.initPosition = new THREE.Vector3(x, 0, z);

    const bodyShape:THREE.Object3D = bodyShape_.clone()
    // const bodyMaterial:THREE.THREE.MeshLambertMaterial = bodyMaterial_.clone()    
    bodyShape.children[0].material = bodyMaterial_

    this.object.add(bodyShape)
    this.object.scale.set(this._scale, this._scale, this._scale) 
    this.object.position.x = this.initPosition.x
    this.object.position.z = this.initPosition.z
    this.object.rotation.y = Math.PI * (Math.random() - 0.5)

    const mixer = new THREE.AnimationMixer(this.object)
    // this.actions = animations_.map((animation) =>{
    //   const action = mixer.clipAction(animation)
    //   action.name = animation.name
    //   return action
    // })


    
    this.mixer = mixer

    mixer.addEventListener('finished', () => {
      this.idle()
    })



  }

  async init() {
    this.actions = await Promise.all(
      ANIMATION_PATHS.map(async (animPath: string) => {
        const obj:THREE.Object3D = await this.fbxLoad(animPath)
        const action = this.mixer.clipAction(obj.animations[0])
        action.name = path.basename(animPath, '.fbx')
        return action
      })  
    )

    this.idle()    
  }

  async textureLoad(srcPath:string) {
    return await new Promise((resolve) => this.textureLoader.load(srcPath, (obj:any) => resolve(obj)))
  }

  async fbxLoad(srcPath:string) {
    return await new Promise((resolve) => this.fbxLoader.load(srcPath, (obj:any) => resolve(obj)))
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