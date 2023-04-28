const basicType = {
  color: {
    method: 'addColor',
    getValue: item => item.color.getStyle(),
    setValue: (item, value) => item.color.setStyle(value),
  },
  groundColor: {
    method: 'addColor',
    getValue: item => item.groundColor.getStyle(),
    setValue: (item, value) => item.groundColor.setStyle(value),
  },
  intensity: {
    extends: [0, 10],
    getValue: item => item.intensity,
    setValue: (item, value) => item.intensity = +value,
  },
  distance: {
    extends: [0, 2],
    getValue: item => item.distance,
    setValue: (item, value) => item.distance = +value,
  },
  angle: {
    extends: [0, Math.PI / 2],
    getValue: item => item.angle,
    setValue: (item, value) => item.angle = +value,
  },
  penumbra: {
    extends: [0, 1],
    getValue: item => item.penumbra,
    setValue: (item, value) => item.penumbra = +value,
  },
  exponent: {
    extends: [0, 20],
    getValue: item => item.exponent,
    setValue: (item, value) => item.exponent = +value,
  },
  opacity: {
    extends: [0, 1],
    getValue: item => item.opacity,
    setValue: (item, value) => item.opacity = +value,
  },
  transparent: {
    getValue: item => item.transparent,
    setValue: (item, value) => item.transparent = value,
  },
  wireframe: {
    getValue: item => item.wireframe,
    setValue: (item, value) => item.wireframe = value,
  },
  visible: {
    getValue: item => item.visible,
    setValue: (item, value) => item.visible = value,
  },
  cameraNear: {
    extends: [0, 50],
    getValue: (item, camera) => camera.near,
    setValue: (item, value, camera) => camera.near = value,
  },
  cameraFar: {
    extends: [50, 1000],
    getValue: (item, camera) => camera.far,
    setValue: (item, value, camera) => camera.far = value,
  },
  side: {
    extends: [['front', 'back', 'double']],
    getValue: () => 'front',
    setValue: (item, value) => {
      switch (value) {
        case 'front':
          item.side = THREE.FrontSide;
          break;
        case 'back':
          item.side = THREE.BackSide;
          break;
        case 'double':
          item.side = THREE.DoubleSide;
          break;
      }
    },
  },
  // 材料的环境颜色
  ambient: {
    method: 'addColor',
    getValue: (item) => item.ambient.getHex(),
    setValue: (item, value, camera) => item.ambient = new THREE.Color(value),
  },
  // 物体材料本身发出的颜色
  emissive: {
    method: 'addColor',
    getValue: (item) => item.emissive.getHex(),
    setValue: (item, value, camera) => item.emissive = new THREE.Color(value),
  },
  // 设置高亮部分的颜色
  specular: {
    method: 'addColor',
    getValue: (item) => item.specular.getHex(),
    setValue: (item, value, camera) => item.specular = new THREE.Color(value),
  },
  // 设置高亮部分的亮度
  shininess: {
    extends: [0, 100],
    getValue: (item) => item.shininess,
    setValue: (item, value, camera) => item.shininess = value,
  },
  red: {
    extends: [0, 1],
    getValue: (item) => item.uniforms.r.value,
    setValue: (item, value, camera) => item.uniforms.r.value = value,
  },
  alpha: {
    extends: [0, 1],
    getValue: (item) => item.uniforms.a.value,
    setValue: (item, value, camera) => item.uniforms.a.value = value,
  },
  dashSize: {
    extends: [0, 5],
    getValue: (item) => item.dashSize,
    setValue: (item, value, camera) => item.dashSize = +value,
  },
  gapSize: {
    extends: [0, 5],
    getValue: (item) => item.gapSize,
    setValue: (item, value, camera) => item.gapSize = +value,
  },
}

const itemType = {
  SpotLight: ['color', 'intensity', 'distance', 'angle', 'penumbra'],// 聚光灯
  AmbientLight: ['color'], // 环境光
  PointLight: ['color', 'intensity', 'distance'], // 点光源
  DirectionalLight: ['color', 'intensity'], // 平行光
  HemisphereLight: ['skyColor', 'groundColor', 'intensity'], // 半球光
  MeshBasicMaterial: ['color', 'opacity', 'transparent', 'wireframe', 'visible'],
  MeshDepthMaterial: ['wireframe', 'cameraNear', 'cameraFar'],
  MeshNormalMaterial: ['opacity', 'transparent', 'wireframe', 'visible', 'side'],
  MeshLambertMaterial: ['opacity', 'transparent', 'wireframe', 'visible', 'side', 'ambient', 'emissive', 'color'],
  MeshPhongMaterial: ['opacity', 'transparent', 'wireframe', 'visible', 'side', 'ambient', 'emissive', 'color', 'specular', 'shininess'],
  ShaderMaterial: ['red', 'alpha'],
  LineBasicMaterial: ['color'],
  LineDashedMaterial: ['dashSize', 'gapSize'],
  PlaneGeometry: ['width', 'height', 'widthSegments', 'heightSegments'],
  PlaneBufferGeometry: ['width', 'height', 'widthSegments', 'heightSegments'],
  CircleGeometry: ['radius', 'segments', 'thetaStart', 'thetaLength'],
  BoxGeometry: ['width', 'height', 'depth', 'widthSegments', 'heightSegments', 'depthSegments'],
  SphereGeometry: ['radius', 'widthSegments', 'heightSegments', 'phiStart', 'phiLength', 'thetaStart', 'thetaLength'],
  CylinderGeometry: ['radiusTop', 'radiusBottom', 'height', 'radialSegments', 'heightSegments', 'openEnded'],
  TorusGeometry: ['radius', 'tube', 'radialSegments', 'tubularSegments', 'arc'],
  TorusKnotGeometry: ['radius', 'tube', 'radialSegments', 'tubularSegments', 'p', 'q', 'heightScale'],
  PolyhedronGeometry: ['radius', 'detail'],
  TetrahedronGeometry: ['radius', 'detail'],
  OctahedronGeometry: ['radius', 'detail'],
  IcosahedronGeometry: ['radius', 'detail'],
  TextGeometry: ['size', 'bevelThickness', 'bevelSize', 'bevelEnabled', 'bevelSegments', 'curveSegments', 'steps'],
}


function initControls(item, camera) {
  const typeList = itemType[item.type];
  const controls = {};
  if (!typeList || !typeList.length) {
    return;
  }
  const gui = new dat.GUI();

  for (let i = 0; i < typeList.length; i++) {
    const child = basicType[typeList[i]];
    if (child) {
      controls[typeList[i]] = child.getValue(item, camera);

      const childExtends = child.extends || [];

      gui[child.method || 'add'](controls, typeList[i], ...childExtends).onChange((value) => {
        child.setValue(item, value, camera);
      });
    }
  }
}