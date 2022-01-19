import { CANVAS_CELL_LENGTH } from "../Constants"

export default class GameCanvasTranslator {
    static m2c(rid: number, cid: number): { x: number, y: number } {
        return {
            x: cid * CANVAS_CELL_LENGTH,
            y: rid * CANVAS_CELL_LENGTH
        }
    }

    static c2m(x: number, y: number): { rid: number, cid: number } {
        return {
            rid: Math.floor(y / CANVAS_CELL_LENGTH),
            cid: Math.floor(x / CANVAS_CELL_LENGTH)
        }
    }
}