const grid = document.getElementById('grid');
const emoticon = document.getElementById('emoticon');
const timeDisplay = document.getElementById('time');
let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;
let moving = false;
let selectedCell = null;

// Record the creation time of the program
const creationTime = new Date();
timeDisplay.textContent = `Program Created At: ${creationTime.toLocaleString()}`;

// Create the grid cells
for (let i = 0; i < 16 * 16; i++) {
    const cell = document.createElement('div');
    cell.addEventListener('mouseenter', () => {
        if (cell !== selectedCell) {
            cell.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        }
    });
    cell.addEventListener('mouseleave', () => {
        if (cell !== selectedCell) {
            cell.style.backgroundColor = '#ddd';
        }
    });
    cell.addEventListener('click', () => {
        const x = i % 16;
        const y = Math.floor(i / 16);
        if (selectedCell) {
            selectedCell.classList.remove('selected');
            selectedCell.style.backgroundColor = '#ddd';
        }
        selectedCell = cell;
        selectedCell.classList.add('selected');
        targetX = x;
        targetY = y;
        if (!moving) {
            moveEmoticon();
        }
    });
    grid.appendChild(cell);
}

function moveEmoticon() {
    moving = true;
    const path = findPath(currentX, currentY, targetX, targetY);
    let index = 0;

    function moveStep() {
        if (index < path.length) {
            const [nextX, nextY] = path[index];
            currentX = nextX;
            currentY = nextY;
            emoticon.style.transform = `translate(${currentX * 32}px, ${currentY * 32}px)`;
            index++;
            requestAnimationFrame(moveStep);
        } else {
            moving = false;
        }
    }

    moveStep();
}

// Initialize the emoticon position
emoticon.style.transform = `translate(${currentX * 32}px, ${currentY * 32}px)`;
