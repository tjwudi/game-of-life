import GameCellModel from "./GameCellModel"

type CellGrid = GameCellModel[][]

export default class GameMapModel {
    _columnCount: number
    _rowCount: number
    _cells: CellGrid

    _onCellsChangedHandler: (() => void) | null = null
    
    constructor(
        rowCount: number,
        columnCount: number,
    ) {
        this._rowCount = rowCount
        this._columnCount = columnCount
        this._cells = this._constructCells()
    }

    _constructCells(): CellGrid {
        const cells: CellGrid = []
        for (let rid = 0; rid < this._rowCount; rid ++) {
            const row: GameCellModel[] = []
            for (let cid = 0; cid < this._columnCount; cid ++) {
                row.push(new GameCellModel(rid, cid))
            }
            cells.push(row)
        }
        return cells
    }

    _notifyCellsChanged(): void {
        if (this._onCellsChangedHandler) {
            this._onCellsChangedHandler()
        }
    }

    _rid(unsafeRid: number): number {
        return (unsafeRid + this._rowCount) % this._rowCount
    }

    _cid(unsafeCid: number): number {
        return (unsafeCid + this._columnCount) % this._columnCount
    }

    _neighbors(
        rid: number,
        cid: number,
        excludeDiagonal: boolean = false
    ): GameCellModel[] {
        const neighbors = []
        for (let drow = -1; drow < 2; drow ++) {
            for (let dcol = -1; dcol < 2; dcol ++) {
                if (drow === 0 && dcol === 0) {
                    continue
                }

                if (excludeDiagonal && Math.abs(drow) + Math.abs(dcol) > 1) {
                    continue
                }

                const neighborRid = this._rid(drow + rid)
                const neighborCid = this._cid(dcol + cid)
                neighbors.push(this._cells[neighborRid][neighborCid])
            }
        }
        return neighbors
    }

    _neighborsAlive(rid: number, cid: number): number {
        const neighbors = this._neighbors(rid, cid)
        return neighbors
            .filter(neighbor => neighbor.isAlive())
            .length
    }

    onCellsChanged(handler: (() => void) | null) {
        this._onCellsChangedHandler = handler
    }

    toggleAt(rid: number, cid: number) {
        this._cells[rid][cid].toggleByUser()
        this._notifyCellsChanged()
    }

    isStarvingAt(rid: number, cid: number): boolean {
        return this._cells[rid][cid].isStarving()
    }

    isAliveAt(rid: number, cid: number): boolean {
        return this._cells[rid][cid].isAlive()
    }

    rowCount(): number {
        return this._rowCount
    }

    columnCount(): number {
        return this._columnCount
    }

    next() {
        for (let rid = 0; rid < this._rowCount; rid ++) {
            for (let cid = 0; cid < this._columnCount; cid ++) {
                const alive = this.isAliveAt(rid, cid)
                const starving = this.isStarvingAt(rid, cid)
                const neighborsAlive = this._neighborsAlive(rid, cid)

                if (alive && !starving) {
                    if (neighborsAlive < 2) {
                        // Consider moving
                        for (let neighbor of this._neighbors(rid, cid, true)) {
                            const neighborsAliveOfNeighbor = this._neighborsAlive(
                                neighbor.rid,
                                neighbor.cid
                            )

                            if (neighborsAliveOfNeighbor >= 3) {
                                console.log(`Moving (${rid}, ${cid}) to (${neighbor.rid}, ${neighbor.cid})`)
                                // Plan to move to this neighbor
                                neighbor.moveIn()
                                // FIXME: It is not really dying but rather just moving
                                this._cells[rid][cid].die() 
                                break
                            }
                        }

                        if (this._cells[rid][cid].isAlive()) {
                            this._cells[rid][cid].starve()
                        }
                    }
                    else if (neighborsAlive > 3) {
                        // Over population
                        this._cells[rid][cid].die()
                    }
                    else {
                        // Stays alive
                        this._cells[rid][cid].spawn()
                    }
                }
                else if (alive && starving) {
                    if (neighborsAlive < 2) {
                        this._cells[rid][cid].die()
                    }
                    else {
                        this._cells[rid][cid].replenish()
                    }
                }
                else if (neighborsAlive === 3) {
                    this._cells[rid][cid].spawn()
                }
            }
        }

        for (let rid = 0; rid < this._rowCount; rid ++) {
            for (let cid = 0; cid < this._columnCount; cid ++) {
                this._cells[rid][cid].commitMutations()
            }
        }

        this._notifyCellsChanged()
    }
}