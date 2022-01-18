type BinaryGrid = boolean[][]

export default class GameMapModel {
    _columnCount: number
    _rowCount: number
    _cells: BinaryGrid

    _onCellsChangedHandler: (() => void) | null = null
    
    constructor(
        rowCount: number,
        columnCount: number,
    ) {
        this._rowCount = rowCount
        this._columnCount = columnCount
        this._cells = this._constructCells()
    }

    _constructCells(): BinaryGrid {
        const cells: BinaryGrid = []
        for (let rid = 0; rid < this._rowCount; rid ++) {
            cells.push(
                Array(this._columnCount).fill(false)
            )
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

    _neighborsAlive(rid: number, cid: number): number {
        let result = 0
        for (let drow = -1; drow < 2; drow ++) {
            for (let dcol = -1; dcol < 2; dcol ++) {
                if (drow === 0 && dcol === 0) {
                    continue
                }

                const neighborRid = this._rid(drow + rid)
                const neighborCid = this._cid(dcol + cid)
                if (this.isAliveAt(neighborRid, neighborCid)) {
                    result += 1
                }
            }
        }
        return result
    }

    onCellsChanged(handler: (() => void) | null) {
        this._onCellsChangedHandler = handler
    }

    toggleAt(rid: number, cid: number) {
        this._cells[rid][cid] = !this._cells[rid][cid]
        this._notifyCellsChanged()
    }

    isAliveAt(rid: number, cid: number): boolean {
        return this._cells[rid][cid];
    }

    rowCount(): number {
        return this._rowCount
    }

    columnCount(): number {
        return this._columnCount
    }

    next() {
        const newCells = this._constructCells()

        for (let rid = 0; rid < this._rowCount; rid ++) {
            for (let cid = 0; cid < this._columnCount; cid ++) {
                const alive = this.isAliveAt(rid, cid)
                const neighborsAlive = this._neighborsAlive(rid, cid)

                if (alive) {
                    if (neighborsAlive < 2) {
                        // Under population
                        newCells[rid][cid] = false
                    }
                    else if (neighborsAlive > 3) {
                        // Over population
                        newCells[rid][cid] = false
                    }
                    else {
                        // Stays alive
                        newCells[rid][cid] = true
                    }
                }
                else if (neighborsAlive === 3) {
                    newCells[rid][cid] = true
                }
            }
        }

        this._cells = newCells
        this._notifyCellsChanged()
    }
}