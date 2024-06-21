function findPath(startX, startY, endX, endY) {
    const openSet = [];
    const closedSet = [];
    const cameFrom = {};
    const gScore = {};
    const fScore = {};

    function heuristic(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    function getLowestFScoreNode() {
        let lowestNode = null;
        let lowestFScore = Infinity;
        for (const node of openSet) {
            const [x, y] = node;
            if (fScore[`${x},${y}`] < lowestFScore) {
                lowestFScore = fScore[`${x},${y}`];
                lowestNode = node;
            }
        }
        return lowestNode;
    }

    function reconstructPath(cameFrom, current) {
        const totalPath = [current];
        while (cameFrom[`${current[0]},${current[1]}`]) {
            current = cameFrom[`${current[0]},${current[1]}`];
            totalPath.unshift(current);
        }
        return totalPath;
    }

    openSet.push([startX, startY]);
    gScore[`${startX},${startY}`] = 0;
    fScore[`${startX},${startY}`] = heuristic(startX, startY, endX, endY);

    while (openSet.length > 0) {
        const current = getLowestFScoreNode();
        if (current[0] === endX && current[1] === endY) {
            return reconstructPath(cameFrom, current);
        }

        openSet.splice(openSet.indexOf(current), 1);
        closedSet.push(current);

        const [x, y] = current;
        const neighbors = [
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1]
        ];

        for (const neighbor of neighbors) {
            const [nx, ny] = neighbor;
            if (nx < 0 || ny < 0 || nx >= 16 || ny >= 16 || closedSet.some(n => n[0] === nx && n[1] === ny)) {
                continue;
            }

            const tentativeGScore = gScore[`${x},${y}`] + 1;

            if (!openSet.some(n => n[0] === nx && n[1] === ny)) {
                openSet.push(neighbor);
            } else if (tentativeGScore >= gScore[`${nx},${ny}`]) {
                continue;
            }

            cameFrom[`${nx},${ny}`] = current;
            gScore[`${nx},${ny}`] = tentativeGScore;
            fScore[`${nx},${ny}`] = gScore[`${nx},${ny}`] + heuristic(nx, ny, endX, endY);
        }
    }

    return [];
}
