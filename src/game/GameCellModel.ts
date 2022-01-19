enum CellModeType {
    EMPTY = "EMPTY",
    HEALTHY = "HEALTHY",
    STARVING = "STARVING"
}

type CellMode = {
    type: CellModeType.EMPTY
} | {
    type: CellModeType.HEALTHY
} | {
    type: CellModeType.STARVING
}

enum CellMutationType {
    MOVING_IN = 'MOVING_IN',
    SPAWN = 'SPAWN',
    DIE = 'DIE',
    STARVE = 'STARVE',
    REPLENISH = 'REPLENISH'
}

type CellMutation = {
    type: CellMutationType.MOVING_IN
} | {
    type: CellMutationType.SPAWN
} | {
    type: CellMutationType.DIE
} | {
    type: CellMutationType.STARVE
} | {
    type: CellMutationType.REPLENISH
}

export default class GameCellModel {
    rid: number
    cid: number

    _cellMode: CellMode 
    _pendingMutations: CellMutation[]

    constructor(rid: number, cid: number) {
        this.rid = rid
        this.cid = cid

        this._cellMode = {
            type: CellModeType.EMPTY
        }
        this._pendingMutations = []
    }

    spawn() {
        this._addMutation({
            type: CellMutationType.SPAWN
        })
    }

    _spawn() {
        this._cellMode = {
            type: CellModeType.HEALTHY
        }
    }

    replenish() {
        this._addMutation({
            type: CellMutationType.REPLENISH
        })
    }

    _replenish() {
        this._cellMode = {
            type: CellModeType.HEALTHY
        }
    }

    die() {
        this._addMutation({
            type: CellMutationType.DIE
        })
    }

    _die() {
        this._cellMode = {
            type: CellModeType.EMPTY
        }
    }

    starve() {
        this._addMutation({
            type: CellMutationType.STARVE
        })
    }

    _starve() {
        this._cellMode = {
            type: CellModeType.STARVING
        }
    }

    moveIn() {
        this._addMutation({ 
            type: CellMutationType.MOVING_IN
        })
    }

    isAlive() {
        return this._cellMode.type !== CellModeType.EMPTY
    }

    isStarving() {
        return this._cellMode.type === CellModeType.STARVING
    }

    _addMutation(mutation: CellMutation) {
        this._pendingMutations.push(mutation)
    }

    _findPendingMutationsByType(type: CellMutationType): CellMutation[] {
        return this._pendingMutations
            .filter(m => m.type === type)
    }

    commitMutations() {
        if (this._findPendingMutationsByType(CellMutationType.DIE).length > 0) 
        {
            this._die()
        }
        else if (this._findPendingMutationsByType(CellMutationType.REPLENISH).length > 0)
        {
            this._replenish()
        }
        else if (this._findPendingMutationsByType(CellMutationType.STARVE).length > 0)
        {
            this._starve()
        }
        else if (this._findPendingMutationsByType(CellMutationType.MOVING_IN).length === 1) 
        {
            this._starve()
        }
        else if (this._findPendingMutationsByType(CellMutationType.SPAWN).length > 0) {
            this._spawn()
        }
        
        this._pendingMutations = []
    }

    toggleByUser() {
        if (this.isAlive()) {
            this._die()
        } else {
            this._spawn()
        }
    }
} 