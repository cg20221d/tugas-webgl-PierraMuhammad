function main() {
    kanvas = document.getElementById("kanvas");
    gl = kanvas.getContext("webgl");

    var vertices = [
    // R Depan, Merah
    -1.2, -1, 3,        0, 0, 1,      // Index: 0
    -1.2, 1, 3,         0, 0, 1,      // Index: 1
    -0.8, 1, 3,         0, 0, 1,      // Index: 2
    -0.8, -1, 3,        0, 0, 1,      // Index: 3
    -0.8, 0, 3,         0, 0, 1,      // Index: 4
    -0.3, 1, 3,         0, 0, 1,      // Index: 5
    -0.3, 0, 3,         0, 0, 1,      // Index: 6
    -0.8, -0.6, 3,      0, 0, 1,      // Index: 7
    -0.6, -1, 3,        0, 0, 1,      // Index: 8
    -0.2, -1, 3,        0, 0, 1,      // Index: 9

    // R Kiri, 
    -1.2, -1, 2.5,      0, 1, 0,      // Index: 10 
    -1.2, 1, 2.5,       0, 1, 0,      // Index: 11
    -0.6, -1, 2.5,      0, 1, 0,      // Index: 12
    -0.8, -0.6, 2.5,    0, 1, 0,      // Index: 13

    // R Atas
    0, 1, 2.5,       0, 1, 0,      // Index: 14

    // R kanan
    0, 0, 2.5,       0, 1, 0,      // Index: 15
    -0.5, 0, 2.5,       0, 1, 0,      // Index: 16
    0.1, -1, 2.5,      0, 1, 0,      // Index: 17
    -0.8, -0.6, 2.5,    0, 1, 0,      // Index: 18
    -0.8, -1, 2.5,      0, 1, 0,      // Index: 19

    // R belakang
    -1.2, -1, 2.5,      0, 1, 0,    // Index: 20
    -1.2, 1, 2.5,       0, 1, 0,    // Index: 21
    -0.8, 1, 2.5,       0, 1, 0,    // Index: 22
    -0.8, -1, 2.5,      0, 1, 0,    // Index: 23
    -0.8, 0, 2.5,       0, 1, 0,    // Index: 24
    -0.3, 1, 2.5,       0, 1, 0,    // Index: 25
    -0.3, 0, 2.5,       0, 1, 0,    // Index: 26
    -0.8, -0.6, 2.5,    0, 1, 0,    // Index: 27
    -0.6, -1, 2.5,      0, 1, 0,    // Index: 28
    -0.2, -1, 2.5,      0, 1, 0,    // Index: 29

	//2 Depan
	1.2, 1, 3,	0, 1, 0, //30
    1.9, 1, 3,	0, 1, 0, //31

    1.9, 1, 3,	0, 1, 0, //32
    1.9, 0, 3,	0, 1, 0, //33

    1.2, 0, 3,	0, 1, 0, //34
    1.9, 0, 3,	0, 1, 0, //35

    1.2, -1, 3,	0, 1, 0, //36
    1.9, -1, 3,	0, 1, 0, //37

    1.2, 0, 3,	0, 1, 0, //38
    1.2, -1, 3, 	0, 1, 0 //39
];

    // Vertex shader
    var vertexShaderCode = `
    attribute vec3 aPosition;   // Sebelumnya vec2, makanya tidak tergambar kubus :D
    attribute vec3 aColor;
    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    varying vec3 vColor;
    void main() {
        gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
        vColor = aColor;
    }
    `;
    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject);   // sampai sini sudah jadi .o

    // Fragment shader
    var fragmentShaderCode = `
    precision mediump float;
    varying vec3 vColor;
    void main() {
        gl_FragColor = vec4(vColor, 1.0);
    }
    `;
    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
    gl.compileShader(fragmentShaderObject);   // sampai sini sudah jadi .o

    shaderProgram = gl.createProgram(); // wadah dari executable (.exe)
    gl.attachShader(shaderProgram, vertexShaderObject);
    gl.attachShader(shaderProgram, fragmentShaderObject);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    var gl, kanvas, shaderProgram;
    var uModel, uView, uProjection, view, proj, model;
    var thetaYSpeed = 0.0;
    var thetaY = 0.0;
    var thetaXSpeed = 0.0;
    var thetaX = 0.0;
    var horizontalDelta = 1.0;
    var horizontalSpeed = 0.0017;
    var scale = 0.5
    var scaleSpeed = 0.02; 
    // Model
    uModel = gl.getUniformLocation(shaderProgram, "uModel");

    // View
    var cameraX = 0.0;
    var cameraZ = 7.5;
    uView = gl.getUniformLocation(shaderProgram, "uView");
    view = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(
        view,
        [cameraX, 0.0, cameraZ],
        [cameraX, 0.0, -10],
        [0.0, 1.0, 0.0]
    );

    // Atur perspektif kamera dengan area pandang 75 derajat, rasio aspek persegi, titik potong dekat 0.5, titik potong jauh 50.0
    uProjection = gl.getUniformLocation(shaderProgram, "uProjection");
    perspective = glMatrix.mat4.create();
    glMatrix.mat4.perspective(perspective, glMatrix.glMatrix.toRadian(75), 1.0, 0.5, 50.0);

    function onKeydown(event) {
        if (event.keyCode == 37) thetaYSpeed = -0.05;
        if (event.keyCode == 39) thetaYSpeed = 0.05;
        if (event.keyCode == 38) thetaXSpeed = -0.05;
        if (event.keyCode == 40) thetaXSpeed = 0.05;
    }
    function onKeyup(event) {
        if (event.keyCode == 37 || event.keyCode == 39) thetaYSpeed = 0.0;
        if (event.keyCode == 38 || event.keyCode == 40) thetaXSpeed = 0.0;
    }
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);

    function render() {
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0.5, 0.5, 0.5, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        letterR();
		number1();

    requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

function letterR() {
    var indices = [
        // depan
        0, 1, 2,        0, 2, 3,
        2, 4, 6,        2, 5, 6,
        4, 7, 8,        4, 8, 9,

        // kiri
        0, 1, 11,       0, 10, 11,
        7, 8, 13,       8, 12, 13,

        // atas
        1, 5, 14,       1, 11, 14,

        // kanan
        5, 14, 15,      5, 6, 15,
        4, 16, 17,      4, 9, 17,
        3, 7, 18,       3, 18, 19,

        // bawah
        0, 3, 19,       0, 10, 19,
        8, 9, 17,       8, 12, 17,
        4, 15, 16,      4, 6, 15,

        // belakang
        20, 21, 22,     20, 22, 23,
        22, 24, 26,     22, 25, 26,
        24, 27, 28,     24, 28, 29,

    ];

    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0);
    gl.enableVertexAttribArray(aPosition);

    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    thetaX += thetaXSpeed;
    model = glMatrix.mat4.create();
    glMatrix.mat4.rotateX(
        model, model, thetaX
    );
    gl.uniformMatrix4fv(uModel, false, model);
    gl.uniformMatrix4fv(uView, false, view);
    gl.uniformMatrix4fv(uProjection, false, perspective);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

function number1() {
    var indices = [
        // depan
        30, 31,
		32, 33,
		34, 35,
		36, 37,
		38, 39
    ];

    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0);
    gl.enableVertexAttribArray(aPosition);

    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    horizontalDelta += horizontalSpeed;
    if (horizontalDelta > 1.6 || horizontalDelta < -2.8) {
        horizontalSpeed *= -1; // Pantul
    }
    model = glMatrix.mat4.create();
    glMatrix.mat4.translate(
        model, model, [horizontalDelta, 0.0, 0.0]
    );
    gl.uniformMatrix4fv(uModel, false, model);
    gl.uniformMatrix4fv(uView, false, view);
    gl.uniformMatrix4fv(uProjection, false, perspective);
    gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);
}
}