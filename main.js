function main(){
    var kanvas = document.getElementById('kanvas');
    var gl = kanvas.getContext('webgl');

    var vertices = [
        // B
        -0.3, 0.0,
        -0.5, 0.2,
        -0.5, -0.2,

        -0.3, 0.3,
        -0.5, 0.5,
        -0.5, 0.1,

        // R
        -0.1, -0.2,
        -0.2, 0.0,
        -0.1, 0.2,

        0.0, 0.0,
        -0.1, 0.0,
        -0.1, 0.2
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    if(!gl){
        console.log('gl gak ada');
    }

    // vertex shader -> posisi
    var vertexShaderCode = 
    `
    attribute vec2 aPosition;
    void main(){
        float x = aPosition.x;
        float y = aPosition.y;
        gl_PointSize = 50.0;
        gl_Position = vec4(x, y, 0.0, 1.0);
    }
    `;

    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject);
    // sapai sini sudah jadi .o

    // fragment shader -> warna
    var fragmentShaderCode = 
    `
    precision mediump float;
    void main(){
        float r = 0.0;
        float g = 0.0;
        float b = 1.0;
        gl_FragColor= vec4(r, g, b, 1.0);
    }
    `;
    
    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
    gl.compileShader(fragmentShaderObject);

    var shaderProgram = gl.createProgram();//sudah dari executabel (.exe)
    gl.attachShader(shaderProgram, vertexShaderObject);
    gl.attachShader(shaderProgram, fragmentShaderObject)
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    
    // kita mengajari GPU bagaimana caranya mengoleksi 
    // nilai posisi dari ARRAY_BUFFER
    // untuk setiap vertex yang sedang diproses
    var aPosition= gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.clearColor(1.0,    0.65,    0.0,       1.0);
    //             Red    Green    Blue    Transparasi
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 12);
}