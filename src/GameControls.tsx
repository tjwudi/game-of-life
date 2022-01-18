import { useCallback } from "react";
import GameMapModel from "./GameMapModel";

type Props = { gameMap: GameMapModel }

export default function GameControls({ gameMap }: Props) {
    const clickNext = useCallback(() => {
        gameMap.next()
    }, [gameMap])

    return <div>
        <button onClick={clickNext}>Next</button>
    </div>
}