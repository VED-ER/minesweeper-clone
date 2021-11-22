const board = document.querySelector(".board")
const mineCounter = document.querySelector(".mine-counter")
const subText = document.querySelector(".subtext")

const boradSize = 10
const numberOfMines = 10
const tiles = []
const minesPositions = []
let minecout = numberOfMines
let counter = 0
let gameOver = false
mineCounter.textContent = numberOfMines
createBoard(boradSize, numberOfMines)

function createBoard(boradSize, numberOfMines) {
	for (let x = 0; x < boradSize; x++) {
		for (let y = 0; y < boradSize; y++) {
			const tileElement = document.createElement("div")
			tileElement.dataset.status = "hidden"
			board.appendChild(tileElement)
			tiles.push({
				tileElement: tileElement,
				tileX: x,
				tileY: y,
				tileStatus: "hidden",
				isMine: false,
			})
		}
	}
	board.style.setProperty("--size", boradSize)
	generateMines(numberOfMines)
	addMinesToTiles()
}

function generateMines(numberOfMines) {
	while (minesPositions.length < numberOfMines) {
		const mineX = Math.floor(Math.random() * 10)
		const mineY = Math.floor(Math.random() * 10)
		const mineObj = { minePosX: mineX, minePosY: mineY }
		if (!minesPositions.includes(mineObj)) {
			minesPositions.push(mineObj)
		}
	}
}

function addMinesToTiles() {
	minesPositions.forEach((minePos) => {
		tiles.forEach((tile) => {
			if (minePos.minePosX === tile.tileX && minePos.minePosY === tile.tileY) {
				tile.isMine = true
			}
		})
	})
}

tiles.forEach((tile) => {
	tile.tileElement.addEventListener("click", () => {
		openTile(tile)
		checkWin()
	})
})

function openTile(tile) {
	if (gameOver === false) {
		if (tile) {
			if (tile.tileStatus === "hidden" && tile.isMine === false) {
				tile.tileStatus = "number"
				tile.tileElement.dataset.status = "number"
				const adjancentTiles = nearbyTiles(tile)
				const mines = adjancentTiles.filter((t) => {
					if (t) {
						if (t.isMine) {
							return t
						}
					}
				})
				if (mines.length === 0) {
					adjancentTiles.forEach((t) => openTile(t))
				} else {
					tile.tileElement.textContent = mines.length
				}
			}
			if (tile.isMine) {
				tiles.forEach((t) => {
					if (t.isMine) {
						t.tileElement.dataset.status = "mine"
					}
				})
				subText.textContent = "You lose"
				gameOver = true
			}
		}
	}
}

function checkWin() {
	counter = 0
	tiles.forEach((t) => {
		if (t.tileStatus === "number") {
			counter++
		}
	})
	if (counter === tiles.length - numberOfMines) {
		subText.textContent = "You won"
		gameOver = true
	}
}

function nearbyTiles(tile) {
	const tilePosX = tile.tileX
	const tilePosY = tile.tileY

	const nearTiles = []
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			const tilee = tiles.filter((t) => {
				if (t.tileX === tilePosX + i && t.tileY === tilePosY + j) {
					return t
				}
			})
			if (tilee) nearTiles.push(tilee[0])
		}
	}
	return nearTiles
}

tiles.forEach((tile) => {
	tile.tileElement.addEventListener("contextmenu", (e) => {
		e.preventDefault()
		markTile(tile)
	})
})

function markTile(tile) {
	if (tile.tileStatus === "marked" && gameOver === false) {
		tile.tileElement.dataset.status = "hidden"
		tile.tileStatus = "hidden"
		minecout++
		mineCounter.textContent = minecout
	} else if (tile.tileStatus !== "number" && gameOver === false) {
		tile.tileElement.dataset.status = "marked"
		tile.tileStatus = "marked"
		minecout--
		mineCounter.textContent = minecout
	}
}
