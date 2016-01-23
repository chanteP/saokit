import trigger from './dragTrigger'
import menu from './menu'

trigger().then((pos) => {
    console.log('show')
    menu.show(pos);
});