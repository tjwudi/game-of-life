import { useCallback, useEffect, useRef } from "react";
import { CANVAS_CELL_LENGTH, CANVAS_HEIGHT, CANVAS_WIDTH } from "../Constants";
import GameCanvasTranslator from "./GameCanvasTranslator";
import { GameMapModel } from "../game";

type Props = { gameMap: GameMapModel }

export default function GameCanvas({ gameMap }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas == null) {
            return
        }

        const context = canvas.getContext("2d")
        if (context == null) {
            throw new Error("Failed to acquire context")
        }

        context.clearRect(0, 0, canvas.width, canvas.height)

        // Vertical lines
        let x = 0
        while (x <= CANVAS_WIDTH) {
            context.moveTo(x, 0)
            context.lineTo(x, CANVAS_HEIGHT)
            context.stroke()
            x += CANVAS_CELL_LENGTH
        }

        // Horizontal lines
        let y = 0
        while (y <= CANVAS_HEIGHT) {
            context.moveTo(0, y)
            context.lineTo(CANVAS_WIDTH, y)
            context.stroke()
            y += CANVAS_CELL_LENGTH
        }

        // Alive cells
        for (let rid = 0; rid < gameMap.rowCount(); rid ++) {
            for (let cid = 0; cid < gameMap.columnCount(); cid ++) {
                if (gameMap.isAliveAt(rid, cid)) {
                    const {x, y} = GameCanvasTranslator.m2c(rid, cid)

                    if (gameMap.isStarvingAt(rid, cid)) {
                        context.fillStyle = "red"
                    } else {
                        context.fillStyle = "green"
                    }
                    context.fillRect(x + 1, y + 1, CANVAS_CELL_LENGTH - 2, CANVAS_CELL_LENGTH - 1)
                }
            }
        }
    }, [canvasRef, gameMap]);

    const onClick = useCallback((event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const canvas = canvasRef.current;
        if (canvas == null) {
            return;
        }

        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const {rid, cid} = GameCanvasTranslator.c2m(x, y)
        
        gameMap.toggleAt(rid, cid)
    }, [gameMap])

    return <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT}
        onClick={e => onClick(e)} />;
}