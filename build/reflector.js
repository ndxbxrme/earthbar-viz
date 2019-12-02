(function() {
  /**
   * @author Slayvin / http://slayvin.net
   */
  var Color, LinearFilter, Matrix4, Mesh, PerspectiveCamera, Plane, RGBFormat, Reflector, ShaderMaterial, UniformsUtils, Vector3, Vector4, WebGLRenderTarget, _Math;

  ({Color, LinearFilter, Matrix4, Mesh, PerspectiveCamera, Plane, RGBFormat, ShaderMaterial, UniformsUtils, Vector3, Vector4, WebGLRenderTarget} = require('three'));

  _Math = require('three').Math;

  Reflector = function(geometry, options) {
    var cameraWorldPosition, clipBias, clipPlane, color, lookAtPosition, material, normal, parameters, q, recursion, reflectorPlane, reflectorWorldPosition, renderTarget, rotationMatrix, scope, shader, target, textureHeight, textureMatrix, textureWidth, view, virtualCamera;
    Mesh.call(this, geometry);
    this.type = 'Reflector';
    scope = this;
    options = options || {};
    color = options.color !== void 0 ? new Color(options.color) : new Color(0x7F7F7F);
    textureWidth = options.textureWidth || 512;
    textureHeight = options.textureHeight || 512;
    clipBias = options.clipBias || 0;
    shader = options.shader || Reflector.ReflectorShader;
    recursion = options.recursion !== void 0 ? options.recursion : 0;
    
    reflectorPlane = new Plane;
    normal = new Vector3;
    reflectorWorldPosition = new Vector3;
    cameraWorldPosition = new Vector3;
    rotationMatrix = new Matrix4;
    lookAtPosition = new Vector3(0, 0, -1);
    clipPlane = new Vector4;
    view = new Vector3;
    target = new Vector3;
    q = new Vector4;
    textureMatrix = new Matrix4;
    virtualCamera = new PerspectiveCamera;
    parameters = {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBFormat,
      stencilBuffer: false
    };
    renderTarget = new WebGLRenderTarget(textureWidth, textureHeight, parameters);
    if (!_Math.isPowerOfTwo(textureWidth) || !_Math.isPowerOfTwo(textureHeight)) {
      renderTarget.texture.generateMipmaps = false;
    }
    material = new ShaderMaterial({
      transparent: true,
      uniforms: UniformsUtils.clone(shader.uniforms),
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader
    });
    material.uniforms['tDiffuse'].value = renderTarget.texture;
    material.uniforms['color'].value = color;
    material.uniforms['textureMatrix'].value = textureMatrix;
    this.material.transparent = true;
    this.material = material;
    this.onBeforeRender = function(renderer, scene, camera) {
      var currentRenderTarget, currentShadowAutoUpdate, currentVrEnabled, projectionMatrix, viewport;
      if ('recursion' in camera.userData) {
        if (camera.userData.recursion === recursion) {
          return;
        }
        camera.userData.recursion++;
      }
      reflectorWorldPosition.setFromMatrixPosition(scope.matrixWorld);
      cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);
      rotationMatrix.extractRotation(scope.matrixWorld);
      normal.set(0, 0, 1);
      normal.applyMatrix4(rotationMatrix);
      view.subVectors(reflectorWorldPosition, cameraWorldPosition);
      // Avoid rendering when reflector is facing away
      if (view.dot(normal) > 0) {
        return;
      }
      view.reflect(normal).negate();
      view.add(reflectorWorldPosition);
      rotationMatrix.extractRotation(camera.matrixWorld);
      lookAtPosition.set(0, 0, -1);
      lookAtPosition.applyMatrix4(rotationMatrix);
      lookAtPosition.add(cameraWorldPosition);
      target.subVectors(reflectorWorldPosition, lookAtPosition);
      target.reflect(normal).negate();
      target.add(reflectorWorldPosition);
      virtualCamera.position.copy(view);
      virtualCamera.up.set(0, 1, 0);
      virtualCamera.up.applyMatrix4(rotationMatrix);
      virtualCamera.up.reflect(normal);
      virtualCamera.lookAt(target);
      virtualCamera.far = camera.far;
      // Used in WebGLBackground
      virtualCamera.updateMatrixWorld();
      virtualCamera.projectionMatrix.copy(camera.projectionMatrix);
      virtualCamera.userData.recursion = 0;
      // Update the texture matrix
      textureMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
      textureMatrix.multiply(virtualCamera.projectionMatrix);
      textureMatrix.multiply(virtualCamera.matrixWorldInverse);
      textureMatrix.multiply(scope.matrixWorld);
      // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
      // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
      reflectorPlane.setFromNormalAndCoplanarPoint(normal, reflectorWorldPosition);
      reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);
      clipPlane.set(reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant);
      projectionMatrix = virtualCamera.projectionMatrix;
      q.x = (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
      q.y = (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
      q.z = -1.0;
      q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];
      // Calculate the scaled plane vector
      clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));
      // Replacing the third row of the projection matrix
      projectionMatrix.elements[2] = clipPlane.x;
      projectionMatrix.elements[6] = clipPlane.y;
      projectionMatrix.elements[10] = clipPlane.z + 1.0 - clipBias;
      projectionMatrix.elements[14] = clipPlane.w;
      // Render
      scope.visible = false;
      currentRenderTarget = renderer.getRenderTarget();
      currentVrEnabled = renderer.vr.enabled;
      currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
      renderer.vr.enabled = false;
      // Avoid camera modification and recursion
      renderer.shadowMap.autoUpdate = false;
      // Avoid re-computing shadows
      renderer.setRenderTarget(renderTarget);
      renderer.setClearColor(0x000000);
      renderer.clear();
      renderer.render(scene, virtualCamera);
      renderer.setClearColor(0xffffff);
      renderer.vr.enabled = currentVrEnabled;
      renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
      renderer.setRenderTarget(currentRenderTarget);
      // Restore viewport
      viewport = camera.viewport;
      if (viewport !== void 0) {
        renderer.state.viewport(viewport);
      }
      scope.visible = true;
    };
    this.getRenderTarget = function() {
      return renderTarget;
    };
  };

  Reflector.prototype = Object.create(Mesh.prototype);

  Reflector.prototype.constructor = Reflector;

  Reflector.ReflectorShader = {
    uniforms: {
      'color': {
        value: null
      },
      'tDiffuse': {
        value: null
      },
      'textureMatrix': {
        value: null
      }
    },
    vertexShader: ['uniform mat4 textureMatrix;', 'varying vec4 vUv;', 'void main() {', '  vUv = textureMatrix * vec4( position, 1.0 );', '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );', '}'].join('\n'),
    fragmentShader: ['uniform vec3 color;', 'uniform sampler2D tDiffuse;', 'varying vec4 vUv;', 'float blendOverlay( float base, float blend ) {', '  return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );', '}', 'vec3 blendOverlay( vec3 base, vec3 blend ) {', '  return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );', '}', 'void main() {', '    vec3 blr  = vec3(0.0);', '    float amnt = 0.008;', '    blr += 0.026109*texture2DProj( tDiffuse, (vUv.xyz+vec3(-15.5*amnt,0.0,0.0)) ).xyz;', '    blr += 0.034202*texture2DProj( tDiffuse, (vUv.xyz+vec3(-13.5*amnt,0.0,0.0)) ).xyz;', '    blr += 0.043219*texture2DProj( tDiffuse, (vUv.xyz+vec3(-11.5*amnt,0.0,0.0)) ).xyz;', '    blr += 0.052683*texture2DProj( tDiffuse, (vUv.xyz+vec3( -9.5*amnt,0.0,0.0)) ).xyz;', '    blr += 0.061948*texture2DProj( tDiffuse, (vUv.xyz+vec3( -7.5*amnt,0.0,0.0)) ).xyz;', '    blr += 0.070266*texture2DProj( tDiffuse, (vUv.xyz+vec3( -5.5*amnt,0.0,0.0)) ).xyz;', '    blr += 0.076883*texture2DProj( tDiffuse, (vUv.xyz+vec3( -3.5*amnt,0.0,0.0)) ).xyz;', '    blr += 0.081149*texture2DProj( tDiffuse, (vUv.xyz+vec3( -1.5*amnt,0.0,0.0)) ).xyz;', '    blr += 0.041312*texture2DProj( tDiffuse, (vUv.xyz+vec3(  0.0,0.0,0.0)) ).xyz;', '    blr += 0.081149*texture2DProj( tDiffuse, (vUv.xyz+vec3(  1.5*amnt,0.0,0.0)) ).xyz;', '    blr += 0.076883*texture2DProj( tDiffuse, (vUv.xyz+vec3(  3.5*amnt,0.0,0.0)) ).xyz;', '    blr += 0.070266*texture2DProj( tDiffuse, (vUv.xyz+vec3(  5.5*amnt,0.0,0.0)) ).xyz;', '    blr += 0.061948*texture2DProj( tDiffuse, (vUv.xyz+vec3(  7.5*amnt,0.0,0.0)) ).xyz;', '    blr += 0.052683*texture2DProj( tDiffuse, (vUv.xyz+vec3(  9.5*amnt,0.0,0.0)) ).xyz;', '    blr += 0.043219*texture2DProj( tDiffuse, (vUv.xyz+vec3( 11.5*amnt,0.0,0.0)) ).xyz;', '    blr += 0.034202*texture2DProj( tDiffuse, (vUv.xyz+vec3( 13.5*amnt,0.0,0.0)) ).xyz;', '    blr += 0.026109*texture2DProj( tDiffuse, (vUv.xyz+vec3( 15.5*amnt,0.0,0.0)) ).xyz;', '    blr /= 0.93423; // renormalize to compensate for the 4 taps I skipped', '    vec4 base = texture2DProj( tDiffuse, vUv );', '    float alpha = 0.2;', '    if(base == vec4(0.0, 0.0, 0.0, 1.0)) {', '      alpha = 0.0;', '    }', '    gl_FragColor = vec4( blendOverlay( blr, color ), alpha );', '}'].join('\n')
  };

  module.exports = Reflector;

}).call(this);

//# sourceMappingURL=reflector.js.map
