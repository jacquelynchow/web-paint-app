
window.addEventListener('load', () => {
    // variables
    // set canvas id to variable
    const canvas = document.getElementById("draw");    
    // set another variable to the .getContext(’2d’) of that canvas variable so we can draw within it
    // get canvas 2D context and set it to the correct size
    const ctx = canvas.getContext("2d");
    var color = document.getElementById("hex");
    const fillButton = document.getElementById("fill");
    const saveButton = document.getElementById("save");
    const loadButton = document.getElementById("load");
    const clearDrawingButton = document.getElementById("clearDrawing");
    const clearSavedButton = document.getElementById("clearSaved");
    const showStoredButton = document.getElementById("showStored");
    const savedDrawingsNames = [];

    resize();
    // haven't started drawing yet
    let drawing = false;

    // for responsize canvas 
    window.addEventListener('orientationchange', resize);
    // add a document event listener to trigger the draw() function when mouse is moved
    canvas.addEventListener("mousemove", draw);
    // add a document event listener to trigger the setPosition() (user’s mouse current position) function when mouse is clicked
    canvas.addEventListener("mousedown", startDraw);
    // add a document event listener to trigger the setPosition() (user’s mouse current position) function when mouse is moved over the canvas function
    canvas.addEventListener("mouseup", finishDraw);
    // add a window event listener to trigger when window is resized
    window.addEventListener("resize", resize);
    // when any of the html buttons are clicked
    fillButton.addEventListener("click", fillCanvas);
    saveButton.addEventListener("click", ifSave);
    loadButton.addEventListener("click", ifLoad);
    clearDrawingButton.addEventListener("click", clearDrawing);
    clearSavedButton.addEventListener("click", clearStorage);
    showStoredButton.addEventListener("click", showStored);

    function ifSave() {
        var canvasName = document.getElementById('canvasName').value;
        // check if user put in a name
        if (canvasName != "") {
            // check if this name already exists
            if (localStorage.getItem(canvasName) != null) {
                alert("A drawing exists with this name");
            } else {
                localStorage.setItem(canvasName, canvas.toDataURL());
                savedDrawingsNames.push(canvasName);
            }
            
        // ask user to enter a name
        } else {
            alert("Enter a name for the drawing");
        }
    }
    
    function ifLoad() {
        // ask user for drawing name
        var name = window.prompt("Enter the canvas name: ");
        // if user put in a name that was not in storage and it wasn't because user cancelled
        if (localStorage.getItem(name) === null && name != null) {
            alert("Sorry, there is no canvas with that name.");
            return;
        }
        // clear prior drawing before loading saved drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var dataURL = localStorage.getItem(name);
        // create new img element
        var img = document.createElement("img");
        img.src = dataURL;
        // load image onto screen
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        };
    }
    
    function clearDrawing() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    function clearStorage() {
        localStorage.clear();
        // reload page
        location.reload();
        // return false due to onclick event call
        return false;
    }
    
    function showStored() {
        let stored = document.getElementById('stored');
        for (var i = 0; i < savedDrawingsNames.length; i++){
            var drawingName = document.createElement("li");
            drawingName.textContent = savedDrawingsNames[i];
            stored.appendChild(drawingName);
        }
    }
    
    // resize canvas and redraw when window is resized
    function resize() {
        // save the canvas content as imageURL
        var data = canvas.toDataURL();
        // resize canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // scale and redraw content
        var img = document.createElement("img");
        img.onload = function () {
            ctx.drawImage(img, 0, 0, img.width, img.height);
        }
        img.src = data;
    }
    
    // last known position
    var pos = { x: 0, y: 0 };
    // new position from mouse events
    function setPosition(event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }
    function startDraw(event) {
        drawing = true;
        draw(event);
    }
    function finishDraw(event) {
        drawing = false;
        // clear last path, ready for next path/draw
        ctx.beginPath();
    }
    // We must only draw on mouse click
    // We must use the color from the input field
    // We can set some properties for the line
    // We must draw the line
    function draw(event) {
        if (!drawing) {
            return; 
        }
        const width = document.getElementById("width").value;
        var pos = setPosition(event);

        ctx.lineCap = "round"; // rounded end cap
        ctx.strokeStyle = color.value; // hex color if line
        ctx.lineWidth = width; // width of line
        
        ctx.lineTo(pos.x, pos.y); // to position
        ctx.stroke(); // draw line

        ctx.beginPath(); // beginning to draw
        ctx.moveTo(pos.x, pos.y); // from position
    
    }    
    function fillCanvas() {
        ctx.beginPath();
        ctx.fillStyle = color.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.stroke();
    }

});