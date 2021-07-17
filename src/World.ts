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
  _plane:HTMLElement

  constructor(width:number, height:number) {
    const camera = new THREE.PerspectiveCamera(55, width/height, 1, 8000)
    camera.position.set(0, 650, 2500)
    
    const scene = new THREE.Scene()


    const light = new THREE.HemisphereLight(0xffffff, 0xababab)
    scene.add(light)

    const renderer = new THREE.WebGLRenderer({antialias:true, alpha: true})
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.background = 'transparent'

    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.update()

    const plane = document.createElement('div')
    
    this._plane = plane
    this._renderer = renderer
    this._camera = camera
    this._scene = scene
    this._light = light
    this._width = width
    this._height = height
    this._orbitControls = orbitControls
  }

  get camera() {
    return this._camera
  }

  get dt() {
    return this._clock.getDelta()
  }

  get domElement() {
    return this._renderer.domElement
  }

  _animate() {
    // this._orbitControls.update()
    this._avatars.forEach((avatar:Avatar) => avatar.animate(0.015))
    this._renderer.render(this._scene, this._camera)
    requestAnimationFrame(() => this._animate())
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