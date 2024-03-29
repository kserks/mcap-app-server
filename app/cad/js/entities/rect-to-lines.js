// Register this command with the scene
commands.push({
    command: "RECT_TO_LINES",
    shortcut: "RTL"
});

function RECT_TO_LINES(data) //startX, startY, endX, endY)
{
    //Define Properties         //Associated DXF Value
    this.type = "RECT_TO_LINES";
    this.family = "Geometry";
    this.minPoints = 2;
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
        }
    }
}
/***/

function addLine (x, y, x2, y2, targetRect){
        let layer = LM.getCLayer()
        if(targetRect) layer = targetRect.layer


        let data = {
            points: [ new Point(x, y), new Point(x2, y2) ],
            colour: "BYLAYER",
            layer: layer
        }
        let line = new Line(data)
        items.push(line)
   

}

RECT_TO_LINES.prototype.drawLines = function (points){

    let a = points[0]
    let b = points[1]


    addLine (a.x, a.y, b.x, a.y)
    addLine (a.x, b.y, b.x, b.y)
    addLine (a.x, a.y, a.x, b.y)
    addLine (b.x, a.y, b.x, b.y)
   // удаляем прямоугольник
   setTimeout(()=>{
        items = items.filter(item=>{
            if(item.type==="RECT_TO_LINES") return false  
            return true
        })

   }, 0)

}


RECT_TO_LINES.prototype.prompt = function (inputArray) {
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
            
    var validInput = expectedType[num].includes(typeof inputArray[num-1])
            
    if(!validInput || num > this.minPoints){
        inputArray.pop()
    }else if (inputArray.length === this.minPoints){
        this.drawLines(inputArray)
        action = true;
        reset = true
    }
 
    return [prompt[inputArray.length], reset, action, validInput]
}

RECT_TO_LINES.prototype.draw = function (ctx, scale) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    var colour = this.colour;

    if (this.colour === "BYLAYER") {
        colour = LM.getLayerByName(this.layer).colour
    }

    ctx.strokeStyle = colour;
    ctx.lineWidth = this.lineWidth / scale;
    ctx.beginPath()
    ctx.moveTo(this.points[0].x, this.points[0].y);
    ctx.lineTo(this.points[1].x, this.points[1].y);
    ctx.lineTo(this.points[2].x, this.points[2].y);
    ctx.lineTo(this.points[3].x, this.points[3].y);
    ctx.lineTo(this.points[4].x, this.points[4].y);
    ctx.stroke()
}

RECT_TO_LINES.prototype.svg = function () {
    //<RECT_TO_LINES x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
    //<RECT_TO_LINES x1="20" y1="100" x2="100" y2="100" stroke-width="2" stroke="black"/>
    var quote = "\""
    var svgstr = ""
    var data = svgstr.concat("<rect x1=", "\"", this.startX, "\"",
        " y1=", "\"", this.startY, "\"",
        " x2=", "\"", this.endX, "\"",
        " y2=", "\"", this.endY, "\"",
        " stroke=", "\"", this.colour, "\"",
        " stroke-width=", "\"", this.RECT_TO_LINESWidth, "\"", "/>"
    )

    return data
}

RECT_TO_LINES.prototype.dxf = function () {

    //Save the RECT_TO_LINES as a polyline as there is no RECT_TO_LINES DXF code
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
    console.log(" RECT_TO_LINES.js - DXF Data:" + data)
    return data
}

RECT_TO_LINES.prototype.vertices = function () {
 
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

RECT_TO_LINES.prototype.intersectPoints = function () {
         
    return {
        start: this.points[0],
        end: this.points[2]
    }
}


RECT_TO_LINES.prototype.midPoint = function (x, x1, y, y1) {

    var midX = (x + x1) / 2
    var midY = (y + y1) / 2

    var midPoint = new Point(midX, midY);

    return midPoint;
}


RECT_TO_LINES.prototype.snaps = function (mousePoint, delta) {

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

RECT_TO_LINES.prototype.closestPoint = function (P) {

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
            //console.log(" RECT_TO_LINES.js - Dist: " + dist);
            if (dist < distance) {
                distance = dist;
            }
        }
    }

    return [closest, distance]
}

RECT_TO_LINES.prototype.extremes = function () {

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

RECT_TO_LINES.prototype.within = function (selection_extremes) {

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

RECT_TO_LINES.prototype.touched = function (selection_extremes) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    var rP1 = new Point(selection_extremes[0], selection_extremes[2]);
    var rP2 = new Point(selection_extremes[1], selection_extremes[3]);

    var rectPoints = {
        start: rP1,
        end: rP2
    };

    var output = Intersection.intersectRectangleRectangle(this.intersectPoints(), rectPoints);
    //console.log(output.status)

    if (output.status === "Intersection") {
        return true
    }
    //no intersection found. return false
    return false
}