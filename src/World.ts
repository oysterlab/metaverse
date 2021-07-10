import * as THREE from 'three'
import Avatar from './Avatar'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class World {
  _width:number
  _height:number
  _camera:THREE.PerspectiveCamera
  _scene:THREE.Scene = new THREE.Scene()
  _light:THREE.HemisphereLight
  _renderer:THREE.WebGLRenderer
  _clock:THREE.Clock = new THREE.Clock()
  _avatars:Avatar[] = []
  _orbitControls:OrbitControls

  constructor(width:number, height:number) {
    const camera = new THREE.PerspectiveCamera(45, width/height, 1, 5000)
    camera.position.set(45, 89, 986)
    
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    
    const light = new THREE.HemisphereLight(0xffffff, 0xababab)
    scene.add(light)

    const renderer = new THREE.WebGLRenderer({antialias:true})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)    

    // const orbitControls = new OrbitControls(camera, renderer.domElement)
    // orbitControls.update()

    this._renderer = renderer
    this._camera = camera
    this._scene = scene
    this._light = light
    this._width = width
    this._height = height
    // this._orbitControls = orbitControls
  }

  get dt() {
    return this._clock.getDelta()
  }

  get domElement() {
    return this._renderer.domElement
  }

  _animate() {
    requestAnimationFrame(() => this._animate())
    
    // this._orbitControls.update()
    this._avatars.forEach((avatar:Avatar) => avatar.animate(this.dt))
    this._renderer.render(this._scene, this._camera)
  }
  
  start() {
    requestAnimationFrame(() => this._animate())
  }

  addAvatar(avatar:Avatar) {
    if (this._avatars.find((a:Avatar) => a == avatar)) return
    this._avatars.push(avatar)
    this._scene.add(avatar.object)
  }
}