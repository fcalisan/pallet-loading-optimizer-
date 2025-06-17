<template>
  <div ref="container" class="gorselleme-container" data-gorselleme>
    <div v-if="hoveredPalet" ref="tooltip" class="palet-tooltip" :style="tooltipStyle">
      <div class="tooltip-card">
        <div class="tooltip-header">
          <h4>{{ hoveredPalet.orijinalAd || hoveredPalet.id }}</h4>
          <span class="tooltip-close" @click="hoveredPalet = null">×</span>
        </div>
        <div class="tooltip-content">
          <div class="tooltip-row">
            <span class="label">Boyutlar:</span>
            <span class="value"
              >{{ (hoveredPalet.gercekBoyutlar.en * 100).toFixed(0) }}×{{
                (hoveredPalet.gercekBoyutlar.boy * 100).toFixed(0)
              }}×{{ (hoveredPalet.gercekBoyutlar.yukseklik * 100).toFixed(0) }} cm</span
            >
          </div>
          <div class="tooltip-row">
            <span class="label">Konum:</span>
            <span class="value"
              >X:{{ (hoveredPalet.konum.x * 100).toFixed(0) }} Y:{{
                (hoveredPalet.konum.y * 100).toFixed(0)
              }}
              Z:{{ (hoveredPalet.konum.z * 100).toFixed(0) }} cm</span
            >
          </div>
          <div class="tooltip-row">
            <span class="label">Ağırlık:</span>
            <span class="value">{{ hoveredPalet.agirlik || 'Belirtilmemiş' }} kg</span>
          </div>
          <div class="tooltip-row">
            <span class="label">Adet:</span>
            <span class="value">{{ hoveredPalet.adet || 1 }}</span>
          </div>
          <div class="tooltip-row">
            <span class="label">Rotasyon:</span>
            <span class="value">{{ hoveredPalet.rotasyon || 0 }}°</span>
          </div>
          <div class="tooltip-row">
            <span class="label">İstiflenebilir:</span>
            <span class="value">{{ hoveredPalet.istiflenebilir ? 'Evet' : 'Hayır' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const props = defineProps({
  dorseBoyutlari: {
    type: Object,
    required: true,
  },
  yerlesenPaletler: {
    type: Array,
    default: () => [],
  },
})

const container = ref(null)
let scene, camera, renderer, controls
let animationId = null

const hoveredPalet = ref(null)
const tooltipStyle = ref({})
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

const hoveredMesh = ref(null)
const originalColors = new Map()

onMounted(async () => {
  await nextTick()
  if (container.value) {
    initThree()
    animate()
  }
})

onUnmounted(() => {
  console.log('🧹 Component unmount - temizlik yapılıyor...')
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  sahneTemizle()
})

watch(
  () => props.yerlesenPaletler,
  (newPaletler) => {
    console.log('Görselleştirme watch tetiklendi:', newPaletler)
    if (scene) {
      gorsellemeyiGuncelle()
    }
  },
  { deep: true },
)

watch(
  () => props.dorseBoyutlari,
  (newBoyutlar, oldBoyutlar) => {
    console.log('🏗️ Dorse boyutları değişti:', { newBoyutlar, oldBoyutlar })

    if (
      !oldBoyutlar ||
      newBoyutlar.uzunluk !== oldBoyutlar.uzunluk ||
      newBoyutlar.genislik !== oldBoyutlar.genislik ||
      newBoyutlar.yukseklik !== oldBoyutlar.yukseklik
    ) {
      if (scene && container.value) {
        console.log('🔄 Sahne yeniden oluşturuluyor...')

        sahneTemizle()

        setTimeout(() => {
          if (container.value) {
            initThree()
            if (props.yerlesenPaletler && props.yerlesenPaletler.length > 0) {
              gorsellemeyiGuncelle()
            }
            animate()
            console.log('✅ Sahne yeniden oluşturuldu')
          }
        }, 100)
      }
    }
  },
  { deep: true },
)

function initThree() {
  if (!container.value) return

  console.log('Three.js sahne başlatılıyor...')

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf5f5f5)

  const width = container.value.clientWidth
  const height = container.value.clientHeight
  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)

  const maxDimension = Math.max(
    props.dorseBoyutlari.uzunluk,
    props.dorseBoyutlari.genislik,
    props.dorseBoyutlari.yukseklik,
  )
  camera.position.set(maxDimension * 1.2, maxDimension * 1.0, maxDimension * 1.2)
  camera.lookAt(
    props.dorseBoyutlari.uzunluk / 2,
    props.dorseBoyutlari.yukseklik / 2,
    props.dorseBoyutlari.genislik / 2,
  )

  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  renderer.domElement.id = 'three-canvas'
  renderer.domElement.className = 'three-canvas'
  renderer.domElement.setAttribute('data-three-canvas', 'true')

  if (container.value && !container.value.contains(renderer.domElement)) {
    container.value.appendChild(renderer.domElement)
  }

  renderer.domElement.addEventListener('mousemove', onMouseMove)
  renderer.domElement.addEventListener('click', onMouseClick)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = true
  controls.minDistance = maxDimension * 0.5
  controls.maxDistance = maxDimension * 4
  controls.target.set(
    props.dorseBoyutlari.uzunluk / 2,
    props.dorseBoyutlari.yukseklik / 2,
    props.dorseBoyutlari.genislik / 2,
  )

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(maxDimension, maxDimension * 2, maxDimension)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)

  const dorseGeometry = new THREE.BoxGeometry(
    props.dorseBoyutlari.uzunluk,
    props.dorseBoyutlari.yukseklik,
    props.dorseBoyutlari.genislik,
  )
  const dorseMaterial = new THREE.MeshBasicMaterial({
    color: 0x666666,
    wireframe: true,
    transparent: true,
    opacity: 0.4,
  })
  const dorse = new THREE.Mesh(dorseGeometry, dorseMaterial)
  dorse.position.set(
    props.dorseBoyutlari.uzunluk / 2,
    props.dorseBoyutlari.yukseklik / 2,
    props.dorseBoyutlari.genislik / 2,
  )
  dorse.userData.isDorse = true
  scene.add(dorse)

  const zeminGeometry = new THREE.PlaneGeometry(
    props.dorseBoyutlari.uzunluk,
    props.dorseBoyutlari.genislik,
  )
  const zeminMaterial = new THREE.MeshLambertMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.8,
  })
  const zemin = new THREE.Mesh(zeminGeometry, zeminMaterial)
  zemin.rotation.x = -Math.PI / 2
  zemin.position.set(props.dorseBoyutlari.uzunluk / 2, 0, props.dorseBoyutlari.genislik / 2)
  zemin.receiveShadow = true
  zemin.userData.isZemin = true
  scene.add(zemin)

  const koseMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const koseGeometry = new THREE.SphereGeometry(0.1, 8, 8)

  const kose000 = new THREE.Mesh(koseGeometry, koseMaterial)
  kose000.position.set(0, 0, 0)
  scene.add(kose000)

  const koseSonMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
  const koseSon = new THREE.Mesh(koseGeometry, koseSonMaterial)
  koseSon.position.set(
    props.dorseBoyutlari.uzunluk,
    props.dorseBoyutlari.yukseklik,
    props.dorseBoyutlari.genislik,
  )
  scene.add(koseSon)

  const koseYesilMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

  const koseSagAltOn = new THREE.Mesh(koseGeometry, koseYesilMaterial)
  koseSagAltOn.position.set(props.dorseBoyutlari.uzunluk, 0, 0)
  scene.add(koseSagAltOn)

  const koseSolAltArka = new THREE.Mesh(koseGeometry, koseYesilMaterial)
  koseSolAltArka.position.set(0, 0, props.dorseBoyutlari.genislik)
  scene.add(koseSolAltArka)

  const gridHelper = new THREE.GridHelper(
    Math.max(props.dorseBoyutlari.uzunluk, props.dorseBoyutlari.genislik),
    20,
    0x888888,
    0xbbbbbb,
  )
  gridHelper.position.set(props.dorseBoyutlari.uzunluk / 2, 0, props.dorseBoyutlari.genislik / 2)
  gridHelper.userData.isGrid = true
  scene.add(gridHelper)

  const axesHelper = new THREE.AxesHelper(maxDimension * 0.5)
  axesHelper.userData.isAxes = true
  scene.add(axesHelper)

  console.log('Three.js sahne hazır')

  window.addEventListener('resize', onWindowResize)
}

function onWindowResize() {
  if (!container.value || !camera || !renderer) return

  const width = container.value.clientWidth
  const height = container.value.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function sahneTemizle() {
  if (!scene) return

  console.log('🧹 Sahne temizleniyor...')

  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  hoveredMesh.value = null
  originalColors.clear()
  hoveredPalet.value = null

  while (scene.children.length > 0) {
    const child = scene.children[0]
    if (child.geometry) child.geometry.dispose()
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose())
      } else {
        child.material.dispose()
      }
    }
    scene.remove(child)
  }

  window.removeEventListener('resize', onWindowResize)
  if (renderer && renderer.domElement) {
    renderer.domElement.removeEventListener('mousemove', onMouseMove)
    renderer.domElement.removeEventListener('click', onMouseClick)
  }

  if (renderer && container.value && container.value.contains(renderer.domElement)) {
    container.value.removeChild(renderer.domElement)
    renderer.dispose()
    renderer = null
  }

  scene = null
  camera = null
  controls = null

  console.log('✅ Sahne temizlendi')
}

function paletRengiAl(index, paletId) {
  const renkler = [
    0xff6b6b, // Kırmızı
    0x4ecdc4, // Turkuaz
    0x45b7d1, // Mavi
    0x96ceb4, // Yeşil
    0xfeca57, // Sarı
    0xff9ff3, // Pembe
    0x54a0ff, // Açık Mavi
    0x5f27cd, // Mor
    0x00d2d3, // Cyan
    0xff9f43, // Turuncu
    0x1dd1a1, // Mint
    0xfeca57, // Altın
    0xff6348, // Mercan
    0x48dbfb, // Açık Turkuaz
    0x0abde3, // Okyanus Mavisi
    0x006ba6, // Koyu Mavi
    0x8e44ad, // Koyu Mor
    0x27ae60, // Koyu Yeşil
    0xf39c12, // Koyu Sarı
    0xe74c3c, // Koyu Kırmızı
  ]

  let hash = 0
  const idStr = paletId ? paletId.toString() : index.toString()
  for (let i = 0; i < idStr.length; i++) {
    hash = ((hash << 5) - hash + idStr.charCodeAt(i)) & 0xffffffff
  }

  return renkler[Math.abs(hash) % renkler.length]
}

function gorsellemeyiGuncelle() {
  if (!scene) return

  console.log('Görselleştirme güncelleniyor...')
  console.log('Yerleşen paletler:', props.yerlesenPaletler)

  hoveredMesh.value = null
  originalColors.clear()

  const paletleriKaldir = []
  scene.traverse((child) => {
    if (child.userData && child.userData.isPalet) {
      paletleriKaldir.push(child)
    }
  })
  paletleriKaldir.forEach((palet) => scene.remove(palet))
  console.log(`${paletleriKaldir.length} eski palet kaldırıldı`)

  if (props.yerlesenPaletler && props.yerlesenPaletler.length > 0) {
    props.yerlesenPaletler.forEach((palet, index) => {
      console.log(`Palet ${index + 1} ekleniyor:`, palet)

      const enM = palet.gercekBoyutlar.en
      const boyM = palet.gercekBoyutlar.boy
      const yukseklikM = palet.gercekBoyutlar.yukseklik

      const geometry = new THREE.BoxGeometry(enM, yukseklikM, boyM)

      const paletRengi = paletRengiAl(index, palet.id)
      const material = new THREE.MeshPhongMaterial({
        color: paletRengi,
        transparent: true,
        opacity: 0.85,
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.userData.isPalet = true
      mesh.userData.paletId = palet.id || index

      const x = palet.konum.x + enM / 2 // X: uzunluk ekseni
      const y = palet.konum.z + yukseklikM / 2 // Y: yükseklik ekseni (zemin seviyesinden)
      const z = palet.konum.y + boyM / 2 // Z: genişlik ekseni

      console.log(`🎯 Palet ${palet.id} koordinat hesaplama:`, {
        optimizasyonKonumM: palet.konum, // X=uzunluk, Y=genişlik, Z=yükseklik (metre)
        gercekBoyutlarM: palet.gercekBoyutlar, // metre
        threeJsKonumM: { x, y, z }, // X=uzunluk, Y=yükseklik, Z=genişlik (metre)
        zeminSeviyesi: {
          optimizasyonZ: palet.konum.z, // yükseklik başlangıcı (metre)
          threeJsY: palet.konum.z, // yükseklik başlangıcı (metre)
          paletMerkezY: y, // palet merkezi yüksekliği (metre)
        },
        sinirlardaMi: {
          xOK: palet.konum.x + enM <= props.dorseBoyutlari.uzunluk,
          yOK: palet.konum.z + yukseklikM <= props.dorseBoyutlari.yukseklik,
          zOK: palet.konum.y + boyM <= props.dorseBoyutlari.genislik,
        },
        renk: `#${paletRengi.toString(16)}`,
        rotasyon: palet.rotasyon,
      })

      mesh.position.set(x, y, z)

      if (palet.rotasyon === 90) {
        mesh.rotation.y = Math.PI / 2
      }

      mesh.castShadow = true
      mesh.receiveShadow = true

      const edges = new THREE.EdgesGeometry(geometry)
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x333333,
        linewidth: 2,
      })
      const wireframe = new THREE.LineSegments(edges, lineMaterial)
      wireframe.position.copy(mesh.position)
      wireframe.rotation.copy(mesh.rotation)
      wireframe.userData.isWireframe = true
      wireframe.userData.paletId = palet.id || index

      scene.add(mesh)
      scene.add(wireframe)

      console.log(`✅ Palet ${palet.id || index} görselleştirildi:`, {
        konum: palet.konum,
        gercekBoyutlar: palet.gercekBoyutlar,
        rotasyon: palet.rotasyon,
        pozisyon: { x, y, z },
        renk: `#${paletRengi.toString(16)}`,
      })
    })

    console.log(`✅ Toplam ${props.yerlesenPaletler.length} palet görselleştirildi`)
  } else {
    console.log('Görselleştirilecek palet yok')
  }

  if (props.yerlesenPaletler.length === 0) {
    console.log('⚠️ Hiç palet yerleştirilmemiş - test paleti ekleniyor...')
    const testGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.8)
    const testMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.7,
    })
    const testMesh = new THREE.Mesh(testGeometry, testMaterial)
    testMesh.position.set(0.6, 0.75, 0.4)
    testMesh.userData.isPalet = true
    testMesh.userData.isTest = true
    scene.add(testMesh)
    console.log('🟢 Test paleti eklendi (yeşil kutu) - 0,0,0 noktasında')
  }
}

function onMouseMove(event) {
  if (!container.value || !camera || !scene) return

  const rect = container.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const paletMeshes = []

  scene.traverse((child) => {
    if (
      child.userData &&
      child.userData.isPalet &&
      !child.userData.isTest &&
      !child.userData.isWireframe &&
      child.geometry &&
      child.material
    ) {
      paletMeshes.push(child)
    }
  })

  const intersects = raycaster.intersectObjects(paletMeshes)

  if (intersects.length > 0) {
    const intersectedMesh = intersects[0].object

    container.value.style.cursor = 'pointer'

    if (hoveredMesh.value !== intersectedMesh) {
      if (hoveredMesh.value && originalColors.has(hoveredMesh.value)) {
        hoveredMesh.value.material.color.setHex(originalColors.get(hoveredMesh.value))
      }

      if (!originalColors.has(intersectedMesh)) {
        originalColors.set(intersectedMesh, intersectedMesh.material.color.getHex())
      }

      const originalColor = originalColors.get(intersectedMesh)
      const hoverColor = lightenColor(originalColor, 0.3)
      intersectedMesh.material.color.setHex(hoverColor)

      hoveredMesh.value = intersectedMesh
      console.log('🎯 Palet hover - renk değişti:', intersectedMesh.userData.paletId)
    }
  } else {
    container.value.style.cursor = 'default'

    if (hoveredMesh.value && originalColors.has(hoveredMesh.value)) {
      hoveredMesh.value.material.color.setHex(originalColors.get(hoveredMesh.value))
      console.log('❌ Hover rengi eski haline getirildi')
    }
    hoveredMesh.value = null
  }
}

function lightenColor(color, amount) {
  const r = (color >> 16) & 0xff
  const g = (color >> 8) & 0xff
  const b = color & 0xff

  const newR = Math.min(255, Math.floor(r + (255 - r) * amount))
  const newG = Math.min(255, Math.floor(g + (255 - g) * amount))
  const newB = Math.min(255, Math.floor(b + (255 - b) * amount))

  return (newR << 16) | (newG << 8) | newB
}

function onMouseClick(event) {
  if (!container.value || !camera || !scene) return

  const rect = container.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const paletMeshes = []

  scene.traverse((child) => {
    if (
      child.userData &&
      child.userData.isPalet &&
      !child.userData.isTest &&
      !child.userData.isWireframe &&
      child.geometry &&
      child.material
    ) {
      paletMeshes.push(child)
    }
  })

  const intersects = raycaster.intersectObjects(paletMeshes)

  if (intersects.length > 0) {
    const intersectedMesh = intersects[0].object
    const paletId = intersectedMesh.userData.paletId

    const palet = props.yerlesenPaletler.find(
      (p) => (p.id || props.yerlesenPaletler.indexOf(p)) == paletId,
    )

    if (palet) {
      hoveredPalet.value = palet
      console.log('🎯 Palet tıklandı - tooltip açıldı:', palet.id)
    }
  } else {
    if (hoveredPalet.value) {
      console.log('❌ Boş alana tıklandı - tooltip kapatıldı')
      hoveredPalet.value = null
    }
  }
}

function animate() {
  if (!scene || !camera || !renderer) return

  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  animationId = requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
</script>

<style scoped>
.gorselleme-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  position: relative;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.palet-tooltip {
  position: absolute;
  top: 20px;
  right: 20px;
  width: auto;
  height: auto;
  background-color: transparent;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  z-index: 1000;
  pointer-events: none;
}

.tooltip-card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 350px;
  min-width: 280px;
  animation: tooltipFadeIn 0.2s ease-out;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  pointer-events: auto;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.tooltip-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tooltip-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.tooltip-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.tooltip-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.tooltip-content {
  padding: 20px;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.tooltip-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.value {
  font-weight: 500;
  color: #333;
  font-size: 14px;
  text-align: right;
}
</style>
