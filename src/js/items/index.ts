import Utility from '../Utility'
import Item from './Item'
import ParticleMiner from './ParticleMiner'


const ITEMS = [
    ParticleMiner
]

function randomItem() {
    return new ITEMS[Utility.randomize(ITEMS.length)]
}

function generateItems(number=1) {
    const items = []
    for (let i = 0; i < number; i++) {
        items.push(randomItem())
    }
    return items
}


export {
    generateItems
}