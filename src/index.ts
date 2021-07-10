document.body.style.margin = '0px'
document.body.style.padding = '0px'

import World from './World'
import Avatar from './Avatar'

(async () => {
  const avatar = new Avatar()
  await avatar.init()

  const world = new World(window.innerWidth, window.innerHeight)
  world.addAvatar(avatar)
  world.start()

  document.body.appendChild(world.domElement)
})()
