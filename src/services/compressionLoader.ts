import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

export interface CompressionPipeline {
  gltfLoader: GLTFLoader;
  dracoLoader: DRACOLoader;
  ktx2Loader: KTX2Loader;
  gpuFormats: string[];
  dispose: () => void;
}

// Official Google Draco decoder CDN path
const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

// Official Three.js Basis Universal KTX2 transcoder path
const BASIS_TRANSCODER_PATH = 'https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/libs/basis/';

/**
 * Initializes a GPU-accelerated texture & geometry decompression pipeline.
 * - DRACO: Point & mesh geometry decompression (up to 85% geometry payload reduction).
 * - KTX2 / Basis Universal: GPU-native compressed textures (ASTC / BC7 / ETC2 / DXT)
 *   transcoded directly to the graphics card VRAM without CPU-side decompression,
 *   reducing VRAM usage by up to 75% and eliminating framerate stuttering during uploads.
 */
export function createCompressionPipeline(renderer: THREE.WebGLRenderer): CompressionPipeline {
  // 1. Initialize Draco Geometry Loader
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(DRACO_DECODER_PATH);
  dracoLoader.setDecoderConfig({ type: 'js' }); // Fallback-safe JS/WASM worker

  // 2. Initialize KTX2 Texture Loader & Detect GPU Texture Compression Formats
  const ktx2Loader = new KTX2Loader();
  ktx2Loader.setTranscoderPath(BASIS_TRANSCODER_PATH);
  ktx2Loader.detectSupport(renderer);

  // Detect supported hardware texture compression extensions
  const gl = renderer.getContext();
  const gpuFormats: string[] = [];
  if (gl.getExtension('WEBGL_compressed_texture_astc')) gpuFormats.push('ASTC');
  if (gl.getExtension('EXT_texture_compression_bptc')) gpuFormats.push('BC7');
  if (gl.getExtension('WEBGL_compressed_texture_s3tc')) gpuFormats.push('DXT');
  if (gl.getExtension('WEBGL_compressed_texture_etc')) gpuFormats.push('ETC2');
  if (gpuFormats.length === 0) gpuFormats.push('RGBA_FALLBACK');

  // 3. Initialize GLTFLoader wired to both Draco & KTX2
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.setKTX2Loader(ktx2Loader);

  const dispose = () => {
    try {
      dracoLoader.dispose();
      ktx2Loader.dispose();
    } catch (e) {
      console.debug('Compression pipeline disposed', e);
    }
  };

  return {
    gltfLoader,
    dracoLoader,
    ktx2Loader,
    gpuFormats,
    dispose,
  };
}

/**
 * Helper to asynchronously load a Draco-compressed GLB model with full error handling.
 */
export async function loadDracoModel(
  pipeline: CompressionPipeline,
  url: string,
  onProgress?: (event: ProgressEvent) => void
): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    pipeline.gltfLoader.load(
      url,
      (gltf) => {
        resolve(gltf.scene);
      },
      onProgress,
      (error) => {
        reject(error);
      }
    );
  });
}

/**
 * Helper to load a KTX2 GPU-compressed texture directly into WebGL memory.
 */
export async function loadKTX2Texture(
  pipeline: CompressionPipeline,
  url: string
): Promise<THREE.CompressedTexture> {
  return new Promise((resolve, reject) => {
    pipeline.ktx2Loader.load(
      url,
      (texture) => {
        resolve(texture);
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
}
