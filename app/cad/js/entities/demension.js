// Register this command with the scene
commands.push({
    command: "Demension",
    shortcut: "DM"
});

function Demension(data) //startX, startY, endX, endY)
{
    //Define Properties         //Associated DXF Value
    this.type = "Demension";
    this.family = "Geometry";
    this.minPoints = 3;
    this.showPreview = true; //show preview of item as its being created
    //this.limitPoints = true;
    //this.allowMultiple = false;
    this.helper_geometry = false; // If true a Line will be drawn between points when defining geometry
    this.points = [];
    this.lineWidth = 2; //Thickness
    this.colour = "BYLAYER";
    this.layer = "0";
    this.alpha = 1.0 //Transparancy
    if (data) {
         /*
        if (data.points) {

            var point1 = new Point(data.points[0].x, data.points[0].y);
            var point2 = new Point(data.points[1].x, data.points[0].y);
            var point3 = new Point(data.points[1].x, data.points[1].y);
            var point4 = new Point(data.points[0].x, data.points[1].y);
            var point5 = new Point(data.points[0].x, data.points[0].y);

            this.points.push(point1);
            this.points.push(point2);
            this.points.push(point3);
            this.points.push(point4);
            this.points.push(point5);
        }

        if (data.colour) {
            this.colour = data.colour;
        }

        if (data.layer) {
            this.layer = data.layer;
        }*/
    }
}
/*
 * SHAPE
 */
let INDENT = 15
const getHorizontalDistance = (points) => {
    const _distance = points[2].y
    return  points[0].y - ( points[0].y - _distance )
}
const getVerticalDistance = (points) => {
    const _distance = points[2].x
    return  points[0].x - ( points[0].x - _distance )
}
const isHReverseSelection = (points) => {
    return true
}
const isVReverseSelection = (points) => {
    return true
}
/**
 * Lines
 */

const addBorder = (points, mode) => {
        let x1 = 0
        let y1 = 0
        let x2 = 0
        let y2 = 0
        
        switch (mode){
            case 'LEFT':
                    x1 = points[0].x
                    y1 = getHorizontalDistance(points) - INDENT
                    x2 = points[0].x
                    y2 = points[0].y 
                    break
            case 'RIGHT':
                    x1 = points[1].x
                    y1 = points[1].y
                    x2 = points[1].x 
                    y2 = getHorizontalDistance(points) - INDENT
                    break
            case 'TOP':
                    x1 = points[0].x
                    y1 = points[0].y
                    x2 = getVerticalDistance(points) + INDENT
                    y2 = points[0].y
                    break
            case 'BOTTOM':
                    x1 = points[1].x
                    y1 = points[1].y
                    x2 = getVerticalDistance(points) + INDENT
                    y2 = points[1].y
                    break
        }  


        const data = {
            points: [ new Point(x1, y1), new Point(x2, y2) ],
            colour: "BYLAYER",
            layer: LM.getCLayer()
        }
        const line = new Line(data)
        items.push(line)
}

const addBaseLine = (points, direction) => {
        let x1 = 0
        let y1 = 0
        let x2 = 0
        let y2 = 0
 
        switch (direction){
            case 'H':
                    x1 = points[0].x
                    y1 = getHorizontalDistance(points)
                    x2 = points[1].x
                    y2 =  getHorizontalDistance(points)
                    break
            case 'V':
                    x1 = getVerticalDistance(points)
                    y1 = points[0].y
                    x2 = x1
                    y2 =  points[1].y
                    break
        }

        const data = {
            points: [ new Point(x1, y1), new Point(x2, y2) ],
            colour: "BYLAYER",
            layer: LM.getCLayer()
        }
        const line = new Line(data)
        items.push(line)
}
/**
 * Arraw
 */
const addArrow = (points, mode) => {
        let x = 0
        let y = 0
        let string = ''
     
        switch (mode){
            case 'LEFT':
                    x = points[0].x - 0.933
                    y = getHorizontalDistance(points) - 2.252
                    string = '◄'
                    break
            case 'RIGHT':
                    x = points[1].x - 5.65
                    y = getHorizontalDistance(points) - 2.252
                    string = '►'
                    break
            case 'TOP':
                    x = getVerticalDistance(points) - 3.297
                    y = points[0].y - 4.62
                    string = '▲'
                    break
            case 'BOTTOM':
                    x = getVerticalDistance(points) - 3.297
                    y = points[1].y + 0.1
                    string = '▼'
                    break
        }
      
            
        const data = {
            points: [ new Point(x, y) ],
            colour: "BYLAYER",
            layer: LM.getCLayer(),
            string,
            height: 5,
            rotation: 0,

        }
        const text = new Text(data)
        items.push(text)
}

const indentControl = (points, direction) => {
    let route = ''
    INDENT = 0

    if(direction==='H'){
            if(points[0].x<points[2].x){
                route = 'RIGHT'
                INDENT = 15
            }
            if(points[0].x>points[2].x){
                route = 'LEFT'
                INDENT = -15
            }
            if(points[0].y<points[2].y){
                route = 'TOP'
                INDENT = -15
            }/*
            if(points[0].y>points[2].y){
                route = 'BOTTOM'
               // INDENT = 15
            }*/
    }
    if(direction==='V'){
            if(points[0].x<points[2].x){
                route = 'RIGHT'
                INDENT = 15
            }
            if(points[0].x>points[2].x){
                route = 'LEFT'
                INDENT = -15
            }
            if(points[0].y<points[2].y){
                route = 'TOP'
                INDENT = -15
            }
            if(points[0].y>points[2].y){
                route = 'BOTTOM'
                //INDENT = -15
            }
    }

    console.warn(points[0].x, points[2].x, direction, route, INDENT)
}

const getDirection = (points) => {
        const Pt1 = this.points[0];
        const Pt2 = this.points[1];
        const Pt3 = this.points[2];
        const dx = Pt2.x - Pt1.x;
        const dy = Pt2.y - Pt1.y;

        const iX = ((Math.abs(Pt3.x - Pt1.x) + Math.abs(Pt2.x - Pt3.x)) - Math.abs(dx));
        const iY = ((Math.abs(Pt3.y - Pt1.y) + Math.abs(Pt2.y - Pt3.y)) - Math.abs(dy));

        if (iX > iY && dy !== 0) {
            return 'V'
        } 
        else if (iX < iY && dx !== 0) {
            return 'H'
        }
}


Demension.prototype.drawShape = function (points){

    const direction = getDirection(points)

    indentControl(points, direction)

    if(direction==='H'){
        addBaseLine(points, direction)
        addBorder(points, 'LEFT')
        addBorder(points, 'RIGHT')
        addArrow(points, 'LEFT')
        addArrow(points, 'RIGHT')
    }
    if(direction==='V'){
        addBaseLine(points, direction)
        addBorder(points, 'TOP')
        addBorder(points, 'BOTTOM')
        addArrow(points, 'TOP')
        addArrow(points, 'BOTTOM')
    }

}



Demension.prototype.prompt = function (inputArray) {
    var num = inputArray.length;
    var expectedType = [];
    var reset = false;
    var action = false;
    var prompt = [];

    expectedType[0] = ["undefined"];
    prompt[0] = "Pick the start point:";
 
    expectedType[1] = ["object"];   
    prompt[1] = "Pick opposite corner:";

    expectedType[2] = ["object"];   
    prompt[2] = prompt[1];
    //
    
    expectedType[3] = ["object"];   
    prompt[3] = prompt[1]; 

    var validInput = expectedType[num].includes(typeof inputArray[num-1])
            
    if(!validInput || num > this.minPoints){
        inputArray.pop()
    }
    else if (inputArray.length === this.minPoints){
        
        action = true;
        reset = true
        this.drawShape(inputArray)
    }
 
    return [prompt[inputArray.length], reset, action, validInput]
}

Demension.prototype.draw = function (ctx, scale) {

/*
    if (!LM.layerVisible(this.layer)) {
        return
    }

    var colour = this.colour;

    if (this.colour === "BYLAYER") {
        colour = LM.getLayerByName(this.layer).colour
    }*/
   // ctx.save()
   /*
    ctx.strokeStyle = colour;
    ctx.lineWidth = this.lineWidth / scale;
    ctx.beginPath()
    ctx.font = 10 + "pt";
    ctx.fillStyle = colour;

    ctx.moveTo(this.points[1].x, this.points[0].y)
    ctx.lineTo(this.points[1].x, this.points[1].y)
*/
    //ctx.fillText('◄', this.points[0].x, this.points[0].y)
    //ctx.fillText('►', this.points[1].x, this.points[0].y)
    /*
    ctx.lineTo(this.points[2].x, this.points[2].y);
    ctx.lineTo(this.points[3].x, this.points[3].y);
    ctx.lineTo(this.points[4].x, this.points[4].y);*/
    //ctx.stroke()

}

Demension.prototype.svg = function () {
    //<Demension x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
    //<Demension x1="20" y1="100" x2="100" y2="100" stroke-width="2" stroke="black"/>
    var quote = "\""
    var svgstr = ""
    var data = svgstr.concat("<rect x1=", "\"", this.startX, "\"",
        " y1=", "\"", this.startY, "\"",
        " x2=", "\"", this.endX, "\"",
        " y2=", "\"", this.endY, "\"",
        " stroke=", "\"", this.colour, "\"",
        " stroke-width=", "\"", this.DemensionWidth, "\"", "/>"
    )

    return data
}

Demension.prototype.dxf = function () {

    //Save the Demension as a polyline as there is no Demension DXF code
    var closed = (this.points[0].x === this.points[this.points.length - 1].x && this.points[0].y === this.points[this.points.length - 1].y);
    var vertices = this.vertices();
    var dxfitem = ""
    var data = dxfitem.concat(
        "0",
        "\n", "POLYLINE",
        //"\n", "5", //HANDLE
        //"\n", "DA",
        "\n", "8", //LAYERNAME
        "\n", this.layer,
        "\n", "66",
        "\n", "1",
        "\n", "10", //X
        "\n", "0",
        "\n", "20", //Y
        "\n", "0",
        "\n", "30", //Z
        "\n", "0",
        "\n", "39", //Line Width
        "\n", this.lineWidth,
        "\n", "70", //Flags
        "\n", closed ? "1" : "0",
        //"\n", "100", //Subclass marker
        //"\n", "AcDb2dPolyline",
        vertices, //Dont use a new line here as the vertix data will start with a new line.
        "\n", "0",
        "\n", "SEQEND", //END OF SEQUENCE
        "\n", "8", //LAYERNAME
        "\n", this.layer
    )
    console.log(" Demension.js - DXF Data:" + data)
    return data
}

Demension.prototype.vertices = function () {
 
    var vertices_data = "";
    for (var i = 0; i < this.points.length; i++) {

        vertices_data = vertices_data.concat(
            "\n", "0",
            "\n", "VERTEX",
            //"\n", "5", //HANDLE
            //"\n", "DA",
            "\n", "8", //LAYERNAME
            "\n", "0",
            //"\n", "100",
            //"\n", "AcDbVertex",
            //"\n", "100",
            //"\n", "AcDb2dVertex",
            "\n", "10", //X
            "\n", this.points[i].x,
            "\n", "20", //Y
            "\n", this.points[i].y,
            "\n", "30", //Z
            //"\n", "0",
            //"\n", "0",
            "\n", "0"
        )
    }

    return vertices_data;
}

Demension.prototype.intersectPoints = function () {
         
    return {
        start: this.points[0],
        end: this.points[2]
    }
}


Demension.prototype.midPoint = function (x, x1, y, y1) {

    var midX = (x + x1) / 2
    var midY = (y + y1) / 2

    var midPoint = new Point(midX, midY);

    return midPoint;
}


Demension.prototype.snaps = function (mousePoint, delta) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    var snaps = [];

    if (settings.endSnap) {

        // End points for each segment
        for (var i = 0; i < this.points.length; i++) {
            snaps.push(this.points[i]);
        }
    }

    if (settings.midSnap) {
        for (var i = 1; i < this.points.length; i++) {

            var start = this.points[i - 1];
            var end = this.points[i]

            snaps.push(this.midPoint(start.x, end.x, start.y, end.y));
        }
    }

    if (settings.nearestSnap) {

        var closest = this.closestPoint(mousePoint)

        // Crude way to snap to the closest point or a node
        if (closest[1] < delta / 10) {
            snaps.push(closest[0])
        }
    }

    return snaps;
}

Demension.prototype.closestPoint = function (P) {

    var closest = new Point();
    var distance = 1.65;

    for (var i = 1; i < this.points.length; i++) {

        var A = this.points[i - 1];
        var B = this.points[i];

        //find the closest point on the straight line
        var APx = P.x - A.x;
        var APy = P.y - A.y;
        var ABx = B.x - A.x;
        var ABy = B.y - A.y;

        var magAB2 = ABx * ABx + ABy * ABy;
        var ABdotAP = ABx * APx + ABy * APy;
        var t = ABdotAP / magAB2;


        // check if the point is < start or > end
        if (t > 0 && t < 1) {
            closest.x = A.x + ABx * t
            closest.y = A.y + ABy * t

            var dist = distBetweenPoints(P.x, P.y, closest.x, closest.y);
            //console.log(" Demension.js - Dist: " + dist);
            if (dist < distance) {
                distance = dist;
            }
        }
    }

    return [closest, distance]
}

Demension.prototype.extremes = function () {

    var x_values = [];
    var y_values = [];

    for (var i = 0; i < this.points.length; i++) {
        x_values.push(this.points[i].x);
        y_values.push(this.points[i].y);
    }

    var xmin = Math.min.apply(Math, x_values)
    var xmax = Math.max.apply(Math, x_values)
    var ymin = Math.min.apply(Math, y_values)
    var ymax = Math.max.apply(Math, y_values)

    return [xmin, xmax, ymin, ymax]
}

Demension.prototype.within = function (selection_extremes) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    // determin if this entities is within a the window specified by selection_extremes
    var extremePoints = this.extremes()
    if (extremePoints[0] > selection_extremes[0] &&
        extremePoints[1] < selection_extremes[1] &&
        extremePoints[2] > selection_extremes[2] &&
        extremePoints[3] < selection_extremes[3]
    ) {

        return true
    } else {
        return false
    }
}

Demension.prototype.touched = function (selection_extremes) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    var rP1 = new Point(selection_extremes[0], selection_extremes[2]);
    var rP2 = new Point(selection_extremes[1], selection_extremes[3]);

    var rectPoints = {
        start: rP1,
        end: rP2
    };

    //var output = Intersection.intersectRectangleRectangle(this.intersectPoints(), rectPoints);
    //console.log(output.status)
/*
    if (output.status === "Intersection") {
        return true
    }*/
    //no intersection found. return false
    return false
}