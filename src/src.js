const DIRECTIONS = {
    north: { x: 0, y: -1 },
    south: { x: 0, y: 1 },
    east: { x: 1, y: 0 },
    west: { x: -1, y: 0 },
    northwest: { x: -1, y: -1 },
    northeast: { x: 1, y: -1 },
    southeast: { x: 1, y: 1 },
    southwest: { x: -1, y: 1 }
}


class Utility {
    static contains(obj, property) {
        return Object.keys(obj).indexOf(String(property)) !== -1
    }
}


class MapGenerator {

    constructor(col, row) {
        console.log('generating map')

        const grid = this.init(col, row)
        const seededGrid = this.seed(grid)
        this.seededGrid = seededGrid
        
        this.grow()


    }

    init(col, row) {
        // create array of size col, row
        // populate with value '.'
        this._col = col
        this._row = row
        const grid = []
        for (let i = 0; i < row; i++) {
            grid[i] = []
            for (let j = 0; j < col; j++) {
                grid[i].push('.')
            }
        }
        return grid
    }

    seed(grid) {

        const landscapeElements = ['t', 'M', '*']
        const numberOfElementSeeds = this.getNumberOfElementSeeds()

        const randomElements = []
        for (let i = 0; i < numberOfElementSeeds; i++) {
            const randomElementIndex = this.randomize(landscapeElements.length);
            const randomElement = landscapeElements[randomElementIndex];
            randomElements.push(randomElement)
        }

        const seeds = this.generateSeedLocations(randomElements)

        seeds.map((seedLocation, index) => 
            grid[seedLocation.x][seedLocation.y] = randomElements[index])

        this._seeds = seeds
        this._randomElements = randomElements

        return grid
    }

    getNumberOfElementSeeds() {
        //  return 1 // test setting
        return ((this._col * this._row) / (this._col + this._row))  // sparse initial seeding
    }

    randomize(mult) {
        return Math.floor(Math.random() * mult)
    }

    generateSeedLocations(randomElements) {  // create array of objects
        const seeds = randomElements.map(el => {
            return { 
                element: el,
                x: this.randomize(this._row - 1),   
                y: this.randomize(this._col - 1)
            }
        })
        console.log('seeds: ', seeds)
        return seeds
    }


    grow() {

        // loop until entire map is filled:
        // let mapPopulated = false;   
        // while (!mapPopulated) {}

        const allSeeds = this.getNextGenSeeds() // returns array of OBJECTS now
        const goodSeeds = []
        allSeeds.forEach((seed) => {
            const checkedSeed = this.checkSeed(seed)
            if (checkedSeed !== undefined) { 
                goodSeeds.push(checkedSeed) 
            }
        })

        console.log('goodSeeds: ', goodSeeds)

        // now build the map
        for (let goodSeed of goodSeeds) {
            const x = goodSeed.x
            const y = goodSeed.y
            
            // occasional bug ... 
            this.seededGrid[x][y] = goodSeed.element

        } 
    }

    checkSeed(seed) {
        
        if ((seed.y < this._col && seed.y >= 0) &&   // new bugs in checkSeed?
            (seed.x < this._row && seed.x >= 0)) {
            return seed

        } else {
            console.log('rejected seed: ', seed)

        }
    }


    getNextGenSeeds() {
        const nextGenSeeds = []

        this._seeds.forEach((location) => {   
                            
            for (let direction in DIRECTIONS) {  // for each direction
                let directionValues = DIRECTIONS[direction]
        
                const nextGenSeed = {}
                for (let key in directionValues) {  // for each key in each direction
                    nextGenSeed.element = location.element
                    if (key === 'x') {
                    nextGenSeed.x = location.x + directionValues[key]  // move from seeded location to new location
                    } else if (key === 'y') {
                    nextGenSeed.y = location.y + directionValues[key]  // currently only works for seed element 0
                    }

                }
                nextGenSeeds.push(nextGenSeed)
            }
        })

        console.log('nextGenSeeds: ', nextGenSeeds)

        return nextGenSeeds
    }





    probability(percentage) {
        this.randomize(100) + 1 // random number out of 100

        // const probability = Math.floor(Math.random() * 3);  // likelihood of growing from seed
        //         if (probability === 0) { // 50% chance
        //             console.log('probability check ' + j);
        //             array2d[x + xIncrement][y + yIncrement] = growSource;  // assign neighboring location seed
        //             xSeeded.push(x + xIncrement); // adding the new seed location
        //             ySeeded.push(y + yIncrement);
        //         }
        //     }
        // }

    }

}









class Map {

    constructor(col, row) {

        this.generatedMap = new MapGenerator(30, 10)
        console.log('map instantiated')


        this.setInitialCharacterCoordinates()

        this.render()



    }

    setInitialCharacterCoordinates() {

        const initialCoordinates = [9, 9]
        const x = initialCoordinates[0]
        const y = initialCoordinates[1]
        const characterLocation = this.generatedMap.seededGrid[y][x]

        console.log(`character coordinates: ${initialCoordinates}`)
        console.log(`character location: ${characterLocation}`)
        
        this.coordinates = initialCoordinates
    }

    updateCharacterCoordinates(move) {
        const newCoordinates = [this.coordinates[0] + move.x, this.coordinates[1] + move.y]
        console.log(`character coordinates: ${newCoordinates}`)
 
        const x = newCoordinates[0]
        const y = newCoordinates[1]
        const characterLocation = this.generatedMap.seededGrid[y][x]
        console.log(`character location: ${characterLocation}`)

        this.coordinates = newCoordinates

    }

    moveDudeNorth() {
        console.log('north')
        this.updateCharacterCoordinates(DIRECTIONS.north)
    }

    moveDudeSouth() {
        console.log('south')
        this.updateCharacterCoordinates(DIRECTIONS.south)
    }
    moveDudeWest() {
        console.log('west')
        this.updateCharacterCoordinates(DIRECTIONS.west)
    }
    moveDudeEast() {
        console.log('east')
        this.updateCharacterCoordinates(DIRECTIONS.east)
    }

    render() {
        const grid = this.generatedMap.seededGrid
        // convert 2D array map into browser-displayable strings

        const condensedMap = [];
        for (let i = 0; i < grid.length; i++) {
            condensedMap.push(grid[i].join(''));
        }


        const renderedMap = condensedMap.join('<br />');
        const el = document.getElementById('map');

        el.innerHTML = renderedMap;
    }

    draw() {
        this.render()
    }

}


class Game {
    constructor() {
        this.initGame()
        this.startGame()
    }

    initGame() {
        this.spaces = [];
        this.gameOver = false;
        this.map = new Map(30, 10)
        this.input = this.initUserInput()
    }

    initUserInput() {
        return new UserInput({
            '38': this.map.moveDudeNorth.bind(this.map),
            '37': this.map.moveDudeWest.bind(this.map),
            '39': this.map.moveDudeEast.bind(this.map),
            '40': this.map.moveDudeSouth.bind(this.map),
        })
    }

    startGame() {
        console.log('start!')
    }

    gameIsOver() {
        return this.gameOver
    }

    explore() {
        console.log(`exploring the ${this.kind} zone!`)
    }

    draw() {
        this.map.draw()
    }
}


class UserInput {
    constructor(keyActionMap) {
        this.keyActionMap = keyActionMap

        document.onkeydown = this.tryActionForEvent.bind(this)
    }

    tryActionForEvent(event) {
        if (!Utility.contains(this.keyActionMap, event.keyCode)) {
            console.log(`not a valid keycode: ${event.keyCode}`)
        } else {
            this.keyActionMap[event.keyCode]()
        }
    }
}

window.game = new Game();




//     giveOptionForAction() {
        // if (window.prompt('Exit?', 'Sure') === 'Sure') {
            // this.gameOver = true
        // }

        // actions could have constraints, such as
        //     -only can take one action of this type at a time
        //     - action requires cooldown
        //     - action requires prep
        //     - action costs resources


        // ask player for action
        // process action
        // calculate stats
    // }