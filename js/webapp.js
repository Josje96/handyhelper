// Function to add a new measurement line
function addMeasurementLine() {
    const measurementList = document.getElementById('measurementList');
    const newRow = document.createElement('div');
    newRow.className = 'measurement-row';
    newRow.innerHTML = `
        <label>Length (ft):</label>
        <input type="number" class="length" placeholder="Enter length">

        <label>Turn:</label>
        <select class="turn">
            <option value="right">Right</option>
            <option value="left">Left</option>
        </select>

        <label>Turn Angle (°):</label>
        <select class="angle">
            <option value="15">15°</option>
            <option value="22.5">22.5°</option>
            <option value="30">30°</option>
            <option value="45">45°</option>
            <option value="60">60°</option>
            <option value="90" selected>90°</option>
        </select>
    `;
    measurementList.appendChild(newRow);
}

// Function to calculate area, linear feet, and wall square footage
function calculateAndDraw() {
    const lengths = Array.from(document.getElementsByClassName('length')).map(input => parseFloat(input.value) || 0);
    const turns = Array.from(document.getElementsByClassName('turn')).map(input => input.value.toLowerCase());
    const angles = Array.from(document.getElementsByClassName('angle')).map(input => parseFloat(input.value) || 0);
    const height = parseFloat(document.getElementById('height').value) || 0;

    // Calculate total linear feet
    const totalLinearFeet = lengths.reduce((a, b) => a + b, 0);

    // Calculate wall area (sqft) using height
    const totalWallSquareFootage = totalLinearFeet * height;

    // Initialize total area (starting at 0)
    let totalArea = 0;

    // Initialize the drawing coordinates
    let x = 50;
    let y = 50;
    let currentDirection = 'right'; // Start with right

    // Coordinates to draw the floor plan
    let wallCoordinates = [{ x: x, y: y }];

    // Loop through the walls and turns
    for (let i = 0; i < lengths.length; i++) {
        const length = lengths[i];
        const angle = angles[i];

        // Update position based on turn and angle
        const radian = angle * (Math.PI / 180); // Convert angle to radians

        // Move in the current direction based on angle
        if (currentDirection === 'right') {
            x += length;
        } else if (currentDirection === 'down') {
            y += length;
        } else if (currentDirection === 'left') {
            x -= length;
        } else if (currentDirection === 'up') {
            y -= length;
        }

        // Record the new coordinate for drawing
        wallCoordinates.push({ x: x, y: y });

        // Change direction after turn
        if (turns[i] === 'right') {
            currentDirection = turnRight(currentDirection);
        } else if (turns[i] === 'left') {
            currentDirection = turnLeft(currentDirection);
        }
    }

    // Calculate the area (simple rectangular area for now)
    totalArea = lengths[0] * lengths[1]; // For now assume it's a basic rectangle

    // Display results
    document.getElementById('results').innerHTML = `
        <p>Total Linear Feet: ${totalLinearFeet.toFixed(2)} ft</p>
        <p>Total Wall Square Footage: ${totalWallSquareFootage.toFixed(2)} sqft</p>
        <p>Approximate Floor Area: ${totalArea.toFixed(2)} sqft</p>
    `;

    // Draw floor plan
    const canvas = document.getElementById('floorplanCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Begin drawing the floor plan
    ctx.beginPath();
    ctx.moveTo(wallCoordinates[0].x, wallCoordinates[0].y);

    // Draw the lines based on coordinates
    wallCoordinates.forEach(coord => {
        ctx.lineTo(coord.x, coord.y);
    });

    ctx.closePath();
    ctx.stroke();
}

// Helper functions for turning directions
function turnRight(currentDirection) {
    if (currentDirection === 'right') return 'down';
    if (currentDirection === 'down') return 'left';
    if (currentDirection === 'left') return 'up';
    if (currentDirection === 'up') return 'right';
}

function turnLeft(currentDirection) {
    if (currentDirection === 'right') return 'up';
    if (currentDirection === 'up') return 'left';
    if (currentDirection === 'left') return 'down';
    if (currentDirection === 'down') return 'right';
}
