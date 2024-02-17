// Game State Variables
let isPlaying = false;
let spectate = false;

// Spinning Animation
let idleRotationSpeed = 0.002; 
let idleAnimation = true;

// Sensitivity
const screenSensitivityDivisor = 10000;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const cubeSize = 0.6;
const borderCubeSize = 0.61;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a parent object to hold all the cubes
const cubesParent = new THREE.Object3D();
scene.add(cubesParent);

// Create a black wireframe material
const borderCubeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, wireframeLinewidth: 234340 });

// Create a cube geometry
const borderCubeGeometry = new THREE.BoxGeometry(borderCubeSize, borderCubeSize, borderCubeSize);

// Create cube geometry
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize); // Adjusted size for spacing

// Apply material to the cubes
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

// Create and add 3x3x3 grid of cubes
for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial.clone()); // Cloning material for each cube
            cube.position.set(x * 1.2, y * 1.2, z * 1.2); // Adjusted spacing
            cubesParent.add(cube);
            const borderCube = new THREE.Mesh(borderCubeGeometry, borderCubeMaterial.clone()); // Cloning material for each cube
            borderCube.position.set(x * 1.2, y * 1.2, z * 1.2); // Adjusted spacing
            cubesParent.add(borderCube);
        }
    }
}

// Variable to keep track of the current player
let currentPlayer = 'red';

// Function to toggle cube color and check for winning condition
function toggleCubeColor(cube) {
    if (cube.material.color.getHex() === 0xffffff) {
        cube.material.color.set(currentPlayer === 'red' ? 0xff0000 : 0x00ff00);
        if (checkWinCondition(cube)) {
            let popupMessageText;
            if(currentPlayer === 'red') {
                popupMessageText = 'You Win!';
                document.getElementById('winMessageModalLabel').innerText = "Congratulations!";
            } else {
                popupMessageText = 'You Lose :<';
                document.getElementById('winMessageModalLabel').innerText = "Better Luck Next Time :3";
            }
            
            document.getElementById('winMessageText').innerText = popupMessageText;
            $('#winMessageModal').modal('show');
            isPlaying = false;
            start_idle();
        } else {
            currentPlayer = currentPlayer === 'red' ? 'green' : 'red'; // Switch player
            // Update available empty cubes list
            emptyCubes = cubesParent.children.filter(cube => cube.material.color.getHex() === 0xffffff);
            if (currentPlayer === 'green') {
                aiMakeMove(); // AI makes a move if it's its turn
            }
        }
    }
}

// Function to check for winning condition
function checkWinCondition(cube) {
    const directions = [
        [[1, 0, 0], [-1, 0, 0]], // X-axis
        [[0, 1, 0], [0, -1, 0]], // Y-axis
        [[0, 0, 1], [0, 0, -1]], // Z-axis
        [[1, 1, 1], [-1, -1, -1]], // Main diagonal 1 (xyz)
        [[1, 1, -1], [-1, -1, 1]], // Main diagonal 2 (xzy)
        [[1, -1, 1], [-1, 1, -1]], // Main diagonal 3 (yzx)
        [[1, 1, 0], [-1, -1, 0]], // Face diagonal 1 (xy plane, top-left to bottom-right)
        [[1, -1, 0], [-1, 1, 0]], // Face diagonal 2 (xy plane, top-right to bottom-left)
        [[1, 0, 1], [-1, 0, -1]], // Face diagonal 3 (xz plane, top-left to bottom-right)
        [[1, 0, -1], [-1, 0, 1]], // Face diagonal 4 (xz plane, top-right to bottom-left)
        [[0, 1, 1], [0, -1, -1]], // Face diagonal 5 (yz plane, top-left to bottom-right)
        [[0, 1, -1], [0, -1, 1]], // Face diagonal 6 (yz plane, top-right to bottom-left)
        [[1, 1, 0], [-1, -1, 0]], // Space diagonal 1 (through the center, top-left to bottom-right)
        [[1, -1, 0], [-1, 1, 0]], // Space diagonal 2 (through the center, top-right to bottom-left)
        [[1, 0, 1], [-1, 0, -1]], // Space diagonal 3 (through the center, top to bottom)
        [[1, 0, -1], [-1, 0, 1]], // Space diagonal 4 (through the center, bottom to top)
        [[1, -1, -1], [-1, 1, 1]], // Diagonal from top-right corner to bottom-left corner
        [[1, -1, 1], [-1, 1, -1]], // Diagonal from top-left corner to bottom-right corner
    ];

    const colorToCheck = currentPlayer === 'red' ? 0xff0000 : 0x00ff00;
    const [x, y, z] = cube.position.toArray().map(Math.round);

    for (const direction of directions) {
        let count = 1;
        for (const d of direction) {
            for (let i = 1; i <= 2; i++) {
                const [dx, dy, dz] = d.map(coord => coord * i);
                const neighbor = cubesParent.children.find(c => {
                    const cubePos = c.position.toArray().map(Math.round);
                    return cubePos[0] === Math.round(x + dx) && cubePos[1] === Math.round(y + dy) && cubePos[2] === Math.round(z + dz);
                });
                if (neighbor && neighbor.material.color.getHex() === colorToCheck) {
                    count++;
                } else {
                    break;
                }
            }
        }
        if (count >= 3) {
            return true;
        }
    }
    return false;
}


// Function to reset the game
function resetGame() {
    isPlaying = true;
    cubesParent.children.forEach(cube => {
        // Reset cube color to white
        if(!cube.material.wireframe){
            cube.material.color.set(0xffffff);
        }
    });
    
    currentPlayer = 'red'; // Reset currentPlayer to 'red'
}

// Function for AI player to make a move
function aiMakeMove() {
    const emptyCubes = cubesParent.children.filter(cube => cube.material.color.getHex() === 0xffffff); // Find all empty cubes
    if (emptyCubes.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCubes.length); // Choose a random index
        toggleCubeColor(emptyCubes[randomIndex]); // Make a move
    }
}

document.addEventListener('click', (event) => {
    if(!(idleRotationSpeed>0) && isPlaying){
        if (currentPlayer === 'red') { // Only allow human player to make moves when it's their turn
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            // Filter out wireframes from intersected objects
            const intersects = raycaster.intersectObjects(cubesParent.children.filter(cube => cube.material.color.getHex() !== 0x000000), true);

            if (intersects.length > 0) {
                const selectedCube = intersects[0].object;
                toggleCubeColor(selectedCube);
            }
        }
    }
});

// Event listener for mouse move to rotate the cube
let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

document.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;
    const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
    };
    cubesParent.rotation.y += deltaMove.x * 0.01; // Rotate the parent object
    cubesParent.rotation.x += deltaMove.y * 0.01;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.getElementById("winMessageModal").addEventListener('blur', function (event) {
    start_idle();
}, true);

document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove, { passive: false });
document.addEventListener('touchend', handleTouchEnd);

function handleTouchStart(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        isDragging = true;
        previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    }
}

function handleTouchMove(event) {
    if (!isDragging || event.touches.length !== 1) return;
    const deltaMove = {
        x: event.touches[0].clientX - previousMousePosition.x,
        y: event.touches[0].clientY - previousMousePosition.y
    };
    const sensitivityScale = calculateSensitivityScale();
    rotateCube(deltaMove.x * sensitivityScale, deltaMove.y * sensitivityScale);
    previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
}

function handleTouchEnd() {
    isDragging = false;
}

function rotateCube(deltaX, deltaY) {
    cubesParent.rotation.y += deltaX * 0.01; // Rotate around y-axis
    cubesParent.rotation.x += deltaY * 0.01; // Rotate around x-axis
}

function calculateSensitivityScale() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const diagonalScreenSize = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight);
    return diagonalScreenSize / screenSensitivityDivisor; // Adjust the divisor as needed
}

// Set camera position
camera.position.z = 5;

// Function to close the overlay menu
function closeMenu() {
    document.getElementById('overlayMenu').style.display = 'none'; // Hide the overlay menu
    isPlaying = true;
    start_idle();
}

function start_idle(){
    spectate = false;
    idleAnimation = !idleAnimation;
    idleRotationSpeed = 0.002;
}

// Render loop
function animate() {
    requestAnimationFrame(animate);
    if(!idleAnimation){
        idleRotationSpeed-=0.000075;
    }
    if(idleRotationSpeed>0){
        cubesParent.rotation.y += idleRotationSpeed;
        cubesParent.rotation.x += idleRotationSpeed;
    }
    renderer.render(scene, camera);
}

animate();