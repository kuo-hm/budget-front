# 3D Coin Models Guide

## Recommended Sources

### 1. **Sketchfab** (Best Option)
- URL: https://sketchfab.com
- Search: "coin", "currency coin", "gold coin"
- Filter by: "Downloadable" + "Free" + "GLTF/GLB"
- Recommended models:
  - Search for "low poly coin" for performance
  - Look for models with < 5k triangles

### 2. **Poly Haven**
- URL: https://polyhaven.com/models
- All models are free and CC0 licensed
- High quality, optimized models

### 3. **TurboSquid Free Section**
- URL: https://www.turbosquid.com/Search/3D-Models/free/coin
- Filter by "Free" and "GLTF" format

### 4. **Create Your Own (Recommended)**
For a simple, performant coin, you can enhance the current geometry:

```tsx
// Enhanced coin with better details
<mesh>
  <cylinderGeometry args={[0.3, 0.3, 0.1, 64]} />
  <meshStandardMaterial
    color="#FFD700"
    metalness={0.9}
    roughness={0.1}
    envMapIntensity={1}
  />
</mesh>
```

## How to Use a Downloaded Model

### Step 1: Download Model
1. Download GLTF or GLB format (GLB is preferred - single file)
2. Place in `public/models/` folder
3. Example: `public/models/coin.glb`

### Step 2: Update Component
```tsx
import { useGLTF } from '@react-three/drei';

function Coin() {
  const { scene } = useGLTF('/models/coin.glb');
  
  return (
    <primitive
      object={scene.clone()}
      scale={[0.5, 0.5, 0.5]}
    />
  );
}

// Preload for better performance
useGLTF.preload('/models/coin.glb');
```

### Step 3: Optimize Model (Optional)
Use gltf-transform to optimize:
```bash
npm install -g @gltf-transform/cli
gltf-transform optimize coin.glb coin-optimized.glb
```

## Quick Links to Free Coin Models

1. **Sketchfab Free Coins:**
   - https://sketchfab.com/3d-models?q=coin&features=downloadable&sort_by=-likeCount

2. **Simple Coin Generator:**
   - Create programmatically (current approach is fine)
   - Or use a simple textured cylinder

## Recommended Approach

For best performance and visual quality:
1. **Use a simple, low-poly coin model** (< 2k triangles)
2. **Or enhance current geometry** with better materials and textures
3. **Add normal maps** for detail without geometry cost

Example enhanced coin:
```tsx
<mesh>
  <cylinderGeometry args={[0.3, 0.3, 0.1, 64]} />
  <meshStandardMaterial
    map={coinTexture}
    normalMap={coinNormalMap}
    metalness={0.9}
    roughness={0.1}
  />
</mesh>
```

