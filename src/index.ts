document.body.style.margin = '0px'
document.body.style.padding = '0px'
document.body.style.background = '#000000'

import Video from './Video'
import World from './World'
import Avatar from './Avatar'

(async () => {
  const avatars:Avatar[] = []
  
  for (let i = 0; i < 6; i++) {
    const avatar = new Avatar()
    await avatar.init()
    avatars.push(avatar)
  }

  const world = new World(window.innerWidth, window.innerHeight)
  
  avatars.forEach((avatar) => world.addAvatar(avatar))

  world.start()

  const video = new Video()
  document.body.appendChild(video.domElement)
  document.body.appendChild(world.domElement)
})()
