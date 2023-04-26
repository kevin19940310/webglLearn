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
function getTranslateMatrix(x = 0, y = 0, z = 0) {
  return new Float32Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    x, y, z, 1
  ])
}

// 缩放矩阵
function getScaleMatrix(x = 1, y = 1, z = 1) {
  return new Float32Array([
    x, 0.0, 0.0, 0.0,
    0.0, y, 0.0, 0.0,
    0.0, 0.0, z, 0.0,
    0.0, 0.0, 0.0, 1
  ])
}

// 绕z轴旋转的旋转矩阵
function getRotateZMatrix(deg) {
  return new Float32Array([
    Math.cos(deg), Math.sin(deg), 0.0, 0.0,
    -Math.sin(deg), Math.cos(deg), 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ])
}
// 绕y轴旋转的旋转矩阵
function getRotateYMatrix(deg) {
  return new Float32Array([
    Math.cos(deg), 0.0, Math.sin(deg), 0.0,
    0.0, 1.0, 0.0, 0.0,
    -Math.sin(deg), 0.0, Math.cos(deg), 0.0,
    0.0, 0.0, 0.0, 1.0
  ])
}
// 绕x轴旋转的旋转矩阵
function getRotateXMatrix(deg) {
  return new Float32Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, Math.cos(deg), -Math.sin(deg), 0.0,
    0.0, Math.sin(deg), Math.cos(deg), 0.0,
    0.0, 0.0, 0.0, 1.0
  ])
}

// 矩阵复合函数
function mixMatrix(A, B) {
  const result = new Float32Array(16);

  for (let i = 0; i < 4; i++) {
    result[i] = A[i] * B[0] + A[i + 4] * B[1] + A[i + 8] * B[2] + A[i + 12] * B[3]
    result[i + 4] = A[i] * B[4] + A[i + 4] * B[5] + A[i + 8] * B[6] + A[i + 12] * B[7]
    result[i + 8] = A[i] * B[8] + A[i + 4] * B[9] + A[i + 8] * B[10] + A[i + 12] * B[11]
    result[i + 12] = A[i] * B[12] + A[i + 4] * B[13] + A[i + 8] * B[14] + A[i + 12] * B[15]
  }

  return result;
}

// 规一划函数 归一化到0-1之间
function normalized(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i] * arr[i];
  }
  const middle = Math.sqrt(sum);
  for (let index = 0; index < arr.length; index++) {
    arr[index] = arr[index] / middle;
  }
}
// 叉积，求两个平面的法向量
function cross(a, b) {
  return new Float32Array([
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ])
}
// 点积，求某点在x、y、z轴上的投影长度
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
// 向量差，获取视点到目标点之间的向量
function minus(a, b) {
  return new Float32Array([
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2],
  ])
}
// 视图矩阵获取
function getViewMatrix(eyeX, eyeY, eyeZ, lookAtX, lookAtY, lookAtZ, upX, upY, upZ) {
  // 视点
  const eye = new Float32Array([eyeX, eyeY, eyeZ]);
  // 目标点
  const lookAt = new Float32Array([lookAtX, lookAtY, lookAtZ]);
  // 上方向
  const up = new Float32Array([upX, upY, upZ]);
  // 确定z轴
  const z = minus(eye, lookAt);

  normalized(z);
  normalized(up);

  // 确定x轴
  const x = cross(z, up);
  normalized(x);
  // 确定y轴
  const y = cross(x, z);
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot(x, eye), -dot(y, eye), -dot(z, eye), 1
  ])
}

// 获取正射投影矩阵
function getOrtho(l, r, t, b, n, f) {
  return new Float32Array([
    2 / (r - l), 0, 0, 0,
    0, 2 / (t - b), 0, 0,
    0, 0, -2 / (f - n), 0,
    -(r + l) / (r - l), -(t + b) / (t - b), -(f + n) / (f - n), 1
  ])
}