/**
 * Utility to safely detect WebGL support without throwing unhandled exceptions.
 * Handles sandboxed iframes, disabled hardware acceleration, and buggy ANGLE/D3D11 drivers.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    // Try webgl2 first, then webgl, then experimental-webgl
    const gl = (
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: false })
    ) as WebGLRenderingContext | null;

    if (!gl) {
      return false;
    }

    // Check if the context was immediately lost or invalid
    if (typeof gl.isContextLost === 'function' && gl.isContextLost()) {
      return false;
    }

    // Verify shader capability with a basic shader
    const vs = gl.createShader(gl.VERTEX_SHADER);
    if (!vs) {
      return false;
    }
    gl.shaderSource(vs, 'void main(){gl_Position=vec4(0.,0.,0.,1.);}');
    gl.compileShader(vs);
    const compiled = gl.getShaderParameter(vs, gl.COMPILE_STATUS);
    gl.deleteShader(vs);

    if (!compiled) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
