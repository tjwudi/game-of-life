import { useEffect, useState } from "react";
import { COUNT_COLUMNS, COUNT_ROWS } from "./Constants";
import GameMapModel from "./GameMapModel";

const defaultGameMap = new GameMapModel(COUNT_ROWS, COUNT_COLUMNS)

export default function useGameMapModel(): GameMapModel {
    const [proxiedGameMap, setProxiedGameMap] = useState(defaultGameMap)

    useEffect(() => {
        defaultGameMap.onCellsChanged(() => {
            setProxiedGameMap(new Proxy(defaultGameMap, {}))
        })

        return () => defaultGameMap.onCellsChanged(null)
    }, [])

    return proxiedGameMap
}