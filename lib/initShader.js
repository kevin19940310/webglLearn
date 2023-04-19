function initShader(gl, VERTEX_SHADER_SOURCES, FRAGMENT_SHADER_SOURCES) {
  // 创建顶点作色器对象
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  // 创建片元着色器对象
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  // 指定着色器源程序
  gl.shaderSource(vertexShader, VERTEX_SHADER_SOURCES); // 指定顶点着色器源码
  gl.shaderSource(fragmentShader, FRAGMENT_SHADER_SOURCES); // 指定片元着色器源码

  // 编译着色器
  gl.compileShader(vertexShader);  // 编译顶点着色器源码
  gl.compileShader(fragmentShader); // 编译片元着色器源码

  // 创建一个程序对象
  const program = gl.createProgram();

  // 给程序对象指定着色器
  // 指定顶点着色器
  gl.attachShader(program, vertexShader);
  // 指定片元着色器
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program); // 将JS与webgl做关联
  gl.useProgram(program); // 使用程序对象
  return program;
}

// 平移矩阵
function getTranslateMatrix( x = 0, y = 0, z = 0 ) {
  return new Float32Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    x, y, z, 1
  ])
}

// 缩放矩阵
function getScaleMatrix( x = 1, y = 1, z = 1 ) {
  return new Float32Array([
    x, 0.0, 0.0, 0.0,
    0.0, y, 0.0, 0.0,
    0.0, 0.0, z, 0.0,
    0.0, 0.0, 0.0, 1
  ])
}

// 绕z轴旋转的旋转矩阵
function getRotateZMatrix( deg ) {
  return new Float32Array([
    Math.cos(deg), Math.sin(deg), 0.0, 0.0,
    -Math.sin(deg), Math.cos(deg), 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ])
}
// 绕y轴旋转的旋转矩阵
function getRotateYMatrix( deg ) {
  return new Float32Array([
    Math.cos(deg), 0.0, Math.sin(deg), 0.0,
    0.0, 1.0, 0.0, 0.0,
    -Math.sin(deg), 0.0, Math.cos(deg), 0.0,
    0.0, 0.0, 0.0, 1.0
  ])
}
// 绕x轴旋转的旋转矩阵
function getRotateXMatrix( deg ) {
  return new Float32Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, Math.cos(deg), -Math.sin(deg), 0.0,
    0.0, Math.sin(deg), Math.cos(deg), 0.0,
    0.0, 0.0, 0.0, 1.0
  ])
}