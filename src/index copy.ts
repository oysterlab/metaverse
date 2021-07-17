document.body.style.margin = '0px'
document.body.style.padding = '0px'

import World from './World'
import Avatar from './Avatar'
import * as THREE from 'three'

(async () => {
  const avatar = new Avatar()
  await avatar.init()

  const world = new World(window.innerWidth, window.innerHeight)
  world.addAvatar(avatar)
  world.start()

  addEventListener("keydown", (ev: KeyboardEvent) => {
    if (ev.key == '1') {
      avatar.hello()
    } else if(ev.key == '2') {
      avatar.bow()
    } else if(ev.key == '3') {
      avatar.gesture()      
    } else if(ev.key == '4') {
      avatar.dancing()            
    }
    // const LEFT_RAD = -0.5 * Math.PI
    // const DOWN_RAD = 0 * Math.PI
    // const UP_RAD = 1 * Math.PI   
    // const RIGHT_RAD = 0.5 * Math.PI

    // if (ev.key == 'ArrowUp') {
    //   avatar.move(UP_RAD)      
    // } else if (ev.key == 'ArrowRight') {
    //   avatar.move(RIGHT_RAD)      
    // } else if (ev.key == 'ArrowDown') {
    //   avatar.move(DOWN_RAD)      
    // } else if (ev.key == 'ArrowLeft') {
    //   avatar.move(LEFT_RAD)
    // }
  })

  let prevMousePose:any = null
  let moveId:any = false
  addEventListener('mousedown', (ev:MouseEvent) => {
    prevMousePose = {
      x: ev.clientX,
      y: ev.clientY,      
    }
    avatar.walking()

    moveId = setInterval(() => {
      const deg = Math.atan2(avatar.object.rotation.y, avatar.object.rotation.x)
      const mx = -Math.cos(deg)
      const mz = -Math.sin(deg)

      const forward = new THREE.Vector3(0, 0, 1);
      forward.applyQuaternion(world.camera.quaternion);
      forward.normalize();
  
      const sideways = new THREE.Vector3(1, 0, 0);
      sideways.applyQuaternion(world.camera.quaternion);
      sideways.normalize();
  
      sideways.multiplyScalar(0.1);
      forward.multiplyScalar(0.1);
  
      avatar.object.position.add(forward);
      avatar.object.position.add(sideways);
      
      // avatar.move(0, mx, mz)
    }, 10)
  })

  addEventListener('mousemove', (ev:MouseEvent) => {
    if (prevMousePose) {
      const dx = ev.clientX - prevMousePose.x
      // const dy = ev.clientY - moveInit.y    

      let d = dx / 100

      const forward = new THREE.Vector3(0, 0, 1);
      forward.applyQuaternion(world.camera.quaternion);
      forward.normalize();
  
      const sideways = new THREE.Vector3(1, 0, 0);
      sideways.applyQuaternion(world.camera.quaternion);
      sideways.normalize();
  
      sideways.multiplyScalar(d);
      forward.multiplyScalar(d);
  
      avatar.object.position.add(forward);
      avatar.object.position.add(sideways);


      // avatar.move(d, 0, 0)
      prevMousePose = {
        x: ev.clientX,
        y: ev.clientY,      
      }
    }    
  })



  addEventListener('mouseup', (ev:MouseEvent) => {
    prevMousePose = null
    avatar.idle()

    if (moveId != false) {
      clearInterval(moveId)
    }
    moveId = false
  })  

  document.body.appendChild(world.domElement)
})()
