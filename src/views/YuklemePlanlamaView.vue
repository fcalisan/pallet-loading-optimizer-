<template>
  <div class="yukleme-planlama">
    <h2>Yükleme Planlama</h2>

    <el-card class="dorse-secim">
      <template #header>
        <div class="card-header">
          <h3>Dorse Seçimi</h3>
        </div>
      </template>

      <el-form :model="dorseForm" label-width="120px">
        <el-form-item label="Dorse Tipi">
          <el-select v-model="dorseForm.tip" placeholder="Dorse tipini seçiniz">
            <el-option label="Standart Dorse (13.60m x 2.47m x 3.00m)" value="standart"></el-option>
            <el-option label="Mega Dorse (13.60m x 2.47m x 3.20m)" value="mega"></el-option>
            <el-option label="Jumbo Dorse (16.50m x 2.47m x 3.00m)" value="jumbo"></el-option>
            <el-option label="Küçük Dorse (7.50m x 2.47m x 2.70m)" value="kucuk"></el-option>
            <el-option label="Özel Ölçü" value="ozel"></el-option>
          </el-select>
        </el-form-item>

        <template v-if="dorseForm.tip === 'ozel'">
          <el-form-item label="Ölçüler (m)">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-input-number
                  v-model="dorseForm.uzunluk"
                  :min="1"
                  :precision="2"
                  placeholder="Uzunluk"
                ></el-input-number>
              </el-col>
              <el-col :span="8">
                <el-input-number
                  v-model="dorseForm.genislik"
                  :min="1"
                  :precision="2"
                  placeholder="Genişlik"
                ></el-input-number>
              </el-col>
              <el-col :span="8">
                <el-input-number
                  v-model="dorseForm.yukseklik"
                  :min="1"
                  :precision="2"
                  placeholder="Yükseklik"
                ></el-input-number>
              </el-col>
            </el-row>
          </el-form-item>
        </template>

        <!-- Mevcut Dorse Boyutları Bilgisi -->
        <el-form-item label="Mevcut Boyutlar">
          <el-tag type="info" size="large">
            {{ dorseBoyutlari.uzunluk }}m × {{ dorseBoyutlari.genislik }}m ×
            {{ dorseBoyutlari.yukseklik }}m
          </el-tag>
          <span style="margin-left: 10px; color: #666">
            (Hacim:
            {{
              (dorseBoyutlari.uzunluk * dorseBoyutlari.genislik * dorseBoyutlari.yukseklik).toFixed(
                2,
              )
            }}
            m³)
          </span>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="palet-listesi">
      <template #header>
        <div class="card-header">
          <h3>Mevcut Paletler</h3>
          <div class="button-group">
            <el-button type="success" @click="ornekPaletEkle">Örnek Paletler</el-button>
            <el-button type="primary" @click="randomPaletEkle">🎲 Random Paletler</el-button>
            <el-button type="danger" @click="tumPaletleriTemizle" v-if="paletStore.paletSayisi > 0">
              Tümünü Temizle
            </el-button>
          </div>
        </div>
      </template>

      <div class="palet-tablo-container">
        <el-table :data="paletStore.paletler" style="width: 100%" max-height="400">
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="ad" label="Palet Adı" width="180"></el-table-column>
          <el-table-column label="En (cm)" width="100">
            <template #default="scope">{{ scope.row.en }}</template>
          </el-table-column>
          <el-table-column label="Boy (cm)" width="100">
            <template #default="scope">{{ scope.row.boy }}</template>
          </el-table-column>
          <el-table-column label="Yükseklik (cm)" width="120">
            <template #default="scope">{{ scope.row.yukseklik }}</template>
          </el-table-column>
          <el-table-column prop="adet" label="Adet" width="80"></el-table-column>
          <el-table-column prop="agirlik" label="Ağırlık (kg)" width="100"></el-table-column>
          <el-table-column prop="istiflenebilir" label="İstiflenebilir" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.istiflenebilir ? 'success' : 'danger'">
                {{ scope.row.istiflenebilir ? 'Evet' : 'Hayır' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Toplam Hacim (m³)" width="140">
            <template #default="scope">
              {{
                (
                  (scope.row.en / 100) *
                  (scope.row.boy / 100) *
                  (scope.row.yukseklik / 100) *
                  scope.row.adet
                ).toFixed(3)
              }}
            </template>
          </el-table-column>
          <el-table-column label="İşlemler" width="100" fixed="right">
            <template #default="scope">
              <el-button type="danger" size="small" @click="paletSil(scope.$index)" icon="Delete">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="palet-ozet" v-if="paletStore.paletSayisi > 0">
        <el-descriptions :column="3" size="small" border>
          <el-descriptions-item label="Toplam Palet Türü">{{
            paletStore.paletSayisi
          }}</el-descriptions-item>
          <el-descriptions-item label="Toplam Palet Adedi">{{
            paletStore.optimizasyonIcinPaletler.length
          }}</el-descriptions-item>
          <el-descriptions-item label="Toplam Hacim"
            >{{ paletStore.toplamHacim.toFixed(2) }} m³</el-descriptions-item
          >
        </el-descriptions>
      </div>
    </el-card>

    <el-card class="yukleme-onizleme">
      <template #header>
        <div class="card-header">
          <h3>Yükleme Önizleme</h3>
          <el-button
            type="primary"
            @click="optimizasyonBaslat"
            :loading="optimizasyonYukleniyor"
            :disabled="paletStore.paletSayisi === 0"
          >
            {{ optimizasyonYukleniyor ? 'Optimizasyon Yapılıyor...' : 'Optimizasyonu Başlat' }}
          </el-button>
        </div>
      </template>

      <div class="onizleme-container">
        <Gorselleme :dorse-boyutlari="dorseBoyutlari" :yerlesen-paletler="yerlesenPaletler" />
      </div>
    </el-card>

    <el-card class="sonuc-ozeti" v-if="optimizasyonSonucu">
      <template #header>
        <div class="card-header">
          <h3>Sonuç Özeti</h3>
          <div class="button-group">
            <el-button type="success" @click="projeKaydetModalAc" icon="DocumentAdd">
              Projeyi Kaydet
            </el-button>
            <el-button type="primary" @click="raporOlustur" icon="Document"> PDF Rapor </el-button>
          </div>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="Girilen Palet Türü">{{
          paletStore.paletSayisi
        }}</el-descriptions-item>
        <el-descriptions-item label="Toplam Palet Adedi">{{
          paletStore.optimizasyonIcinPaletler.length
        }}</el-descriptions-item>
        <el-descriptions-item label="Yerleştirilen Palet">{{
          optimizasyonSonucu.yerlesenPaletler.length
        }}</el-descriptions-item>
        <el-descriptions-item label="Dışarıda Kalan Palet">{{
          optimizasyonSonucu.disaridaKalanPaletler.length
        }}</el-descriptions-item>
        <el-descriptions-item label="Boş Alan Oranı"
          >{{ optimizasyonSonucu.bosAlan.toFixed(2) }}%</el-descriptions-item
        >
        <el-descriptions-item label="Doluluk Oranı"
          >{{ optimizasyonSonucu.dolulukOrani.toFixed(2) }}%</el-descriptions-item
        >
        <el-descriptions-item label="Yerleşim Başarı Oranı"
          >{{
            (
              (optimizasyonSonucu.yerlesenPaletler.length /
                paletStore.optimizasyonIcinPaletler.length) *
              100
            ).toFixed(2)
          }}%</el-descriptions-item
        >
        <el-descriptions-item label="Toplam Ağırlık" v-if="optimizasyonSonucu.toplamAgirlik">
          {{ optimizasyonSonucu.toplamAgirlik }} kg
        </el-descriptions-item>
        <el-descriptions-item label="Ağırlık Merkezi" v-if="optimizasyonSonucu.agirlikMerkezi">
          X: {{ optimizasyonSonucu.agirlikMerkezi.x }}m, Y:
          {{ optimizasyonSonucu.agirlikMerkezi.y }}m, Z: {{ optimizasyonSonucu.agirlikMerkezi.z }}m
        </el-descriptions-item>
      </el-descriptions>

      <div v-if="optimizasyonSonucu.yerlesenPaletler.length > 0" style="margin-top: 20px">
        <h4>Yerleştirilen Paletler:</h4>
        <el-table :data="optimizasyonSonucu.yerlesenPaletler" size="small" max-height="300">
          <el-table-column prop="id" label="Palet ID" width="150"></el-table-column>
          <el-table-column label="Boyutlar (m)" width="120">
            <template #default="scope">
              {{ scope.row.en.toFixed(2) }}×{{ scope.row.boy.toFixed(2) }}×{{
                scope.row.yukseklik.toFixed(2)
              }}
            </template>
          </el-table-column>
          <el-table-column label="Konum (cm)" width="150">
            <template #default="scope">
              ({{ scope.row.konum.x }}, {{ scope.row.konum.y }}, {{ scope.row.konum.z }})
            </template>
          </el-table-column>
          <el-table-column label="Rotasyon" width="80">
            <template #default="scope"> {{ scope.row.rotasyon }}° </template>
          </el-table-column>
          <el-table-column label="Skor" width="80">
            <template #default="scope">
              {{ scope.row.yerlesimSkoru?.toFixed(1) || 'N/A' }}
            </template>
          </el-table-column>
          <el-table-column label="Ağırlık" width="80">
            <template #default="scope"> {{ scope.row.agirlik || 0 }} kg </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-if="optimizasyonSonucu.disaridaKalanPaletler.length > 0" style="margin-top: 20px">
        <h4>Dışarıda Kalan Paletler:</h4>
        <el-alert
          title="Bu paletler dorse içine yerleştirilemedi"
          type="warning"
          :closable="false"
          show-icon
          style="margin-bottom: 10px"
        >
          <template #default>
            <p>
              Nedenleri: Boyut uyumsuzluğu, ağırlık sınırı, istifleme kuralları veya boş alan
              yetersizliği
            </p>
          </template>
        </el-alert>

        <el-table :data="optimizasyonSonucu.disaridaKalanPaletler" size="small">
          <el-table-column prop="id" label="Palet ID" width="150"></el-table-column>
          <el-table-column label="Boyutlar (m)" width="120">
            <template #default="scope">
              {{ scope.row.en.toFixed(2) }}×{{ scope.row.boy.toFixed(2) }}×{{
                scope.row.yukseklik.toFixed(2)
              }}
            </template>
          </el-table-column>
          <el-table-column label="Ağırlık" width="80">
            <template #default="scope"> {{ scope.row.agirlik || 0 }} kg </template>
          </el-table-column>
          <el-table-column label="İstiflenebilir" width="100">
            <template #default="scope">
              {{ scope.row.istiflenebilir ? 'Evet' : 'Hayır' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog v-model="projeKaydetModalVisible" title="Projeyi Kaydet" width="500px">
      <el-form :model="projeKaydetForm" label-width="120px">
        <el-form-item label="Proje Adı" required>
          <el-input v-model="projeKaydetForm.ad" placeholder="Proje adını giriniz"></el-input>
        </el-form-item>
        <el-form-item label="Açıklama">
          <el-input
            v-model="projeKaydetForm.aciklama"
            type="textarea"
            :rows="3"
            placeholder="Proje hakkında açıklama (opsiyonel)"
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="projeKaydetModalVisible = false">İptal</el-button>
          <el-button type="primary" @click="projeKaydet" :loading="projeKaydediliyor">
            {{ projeKaydediliyor ? 'Kaydediliyor...' : 'Kaydet' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import Gorselleme from '@/components/Gorselleme.vue'
import { OptimizasyonService } from '@/services/optimizasyonService.js'
import { RaporService } from '@/services/raporService.js'
import { usePaletStore } from '@/stores/paletStore'
import { useProjeStore } from '@/stores/projeStore'
import { ElMessage, ElMessageBox } from 'element-plus'

const paletStore = usePaletStore()
const projeStore = useProjeStore()

const dorseForm = ref({
  tip: 'standart',
  uzunluk: 13.6,
  genislik: 2.47,
  yukseklik: 3.0,
})

const optimizasyonSonucu = ref(null)
const optimizasyonYukleniyor = ref(false)

const projeKaydetModalVisible = ref(false)
const projeKaydediliyor = ref(false)
const projeKaydetForm = ref({
  ad: '',
  aciklama: '',
})

watch(
  () => dorseForm.value,
  (newForm, oldForm) => {
    console.log('🏗️ Dorse form değişti:', { newForm, oldForm })

    if (newForm.tip === 'ozel' && oldForm?.tip !== 'ozel') {
      const mevcutBoyutlar = dorseBoyutlari.value
      dorseForm.value.uzunluk = mevcutBoyutlar.uzunluk
      dorseForm.value.genislik = mevcutBoyutlar.genislik
      dorseForm.value.yukseklik = mevcutBoyutlar.yukseklik
      ElMessage.info('Özel ölçü moduna geçildi. Boyutları düzenleyebilirsiniz.')
    }

    if (newForm.tip !== 'ozel' && oldForm?.tip === 'ozel') {
      const tipIsimleri = {
        standart: 'Standart Dorse',
        mega: 'Mega Dorse',
        jumbo: 'Jumbo Dorse',
        kucuk: 'Küçük Dorse',
      }
      ElMessage.info(`${tipIsimleri[newForm.tip]} boyutları kullanılıyor.`)
    }

    if (optimizasyonSonucu.value) {
      optimizasyonSonucu.value = null
      ElMessage.warning('Dorse boyutları değişti. Optimizasyonu yeniden çalıştırın.')
    }
  },
  { deep: true },
)

const dorseBoyutlari = computed(() => {
  if (dorseForm.value.tip === 'standart') {
    return {
      uzunluk: 13.6,
      genislik: 2.47,
      yukseklik: 3.0,
    }
  } else if (dorseForm.value.tip === 'mega') {
    return {
      uzunluk: 13.6,
      genislik: 2.47,
      yukseklik: 3.2,
    }
  } else if (dorseForm.value.tip === 'jumbo') {
    return {
      uzunluk: 16.5,
      genislik: 2.47,
      yukseklik: 3.0,
    }
  } else if (dorseForm.value.tip === 'kucuk') {
    return {
      uzunluk: 7.5,
      genislik: 2.47,
      yukseklik: 2.7,
    }
  } else {
    return {
      uzunluk: dorseForm.value.uzunluk,
      genislik: dorseForm.value.genislik,
      yukseklik: dorseForm.value.yukseklik,
    }
  }
})

const yerlesenPaletler = computed(() => {
  return optimizasyonSonucu.value ? optimizasyonSonucu.value.yerlesenPaletler : []
})

const ornekPaletEkle = () => {
  paletStore.ornekPaletleriEkle()
  console.log("Örnek paletler store'dan eklendi")
}

const randomPaletEkle = () => {
  const mevcutDorseBoyutlari = dorseBoyutlari.value
  console.log('🎲 Random paletler ekleniyor - Dorse boyutları:', mevcutDorseBoyutlari)

  paletStore.randomPaletleriEkle(mevcutDorseBoyutlari)

  const dorseTipIsimleri = {
    standart: 'Standart Dorse (13.60×2.47×3.00m)',
    mega: 'Mega Dorse (13.60×2.47×3.20m)',
    jumbo: 'Jumbo Dorse (16.50×2.47×3.00m)',
    kucuk: 'Küçük Dorse (7.50×2.47×2.70m)',
    ozel: `Özel Dorse (${mevcutDorseBoyutlari.uzunluk}×${mevcutDorseBoyutlari.genislik}×${mevcutDorseBoyutlari.yukseklik}m)`,
  }

  const dorseTipAdi = dorseTipIsimleri[dorseForm.value.tip] || 'Bilinmeyen Dorse'

  ElMessage.success(`🎲 ${dorseTipAdi} için uygun random paletler eklendi!`)
}

const paletSil = (index) => {
  const silinenPalet = paletStore.paletSil(index)
  if (silinenPalet) {
    ElMessage.success(`"${silinenPalet.ad}" paleti silindi`)
    if (optimizasyonSonucu.value) {
      optimizasyonSonucu.value = null
      ElMessage.info('Palet listesi değişti. Optimizasyonu yeniden çalıştırın.')
    }
  }
}

const tumPaletleriTemizle = () => {
  paletStore.tumPaletleriTemizle()
  optimizasyonSonucu.value = null
  ElMessage.success('Tüm paletler temizlendi')
}

const optimizasyonBaslat = async () => {
  if (paletStore.paletSayisi === 0) {
    ElMessage.warning('Palet listesi boş - önce palet girişi yapın')
    return
  }

  optimizasyonYukleniyor.value = true
  optimizasyonSonucu.value = null

  try {
    console.log('🚀 Optimizasyon başlatılıyor...')
    console.log('📐 Dorse boyutları:', dorseBoyutlari.value)
    console.log("📦 Store'dan alınan paletler:", paletStore.optimizasyonIcinPaletler)

    const optimizasyonService = new OptimizasyonService()

    optimizasyonService.dorseBoyutlari = dorseBoyutlari.value

    const sonuc = optimizasyonService.paletleriYerlestir(paletStore.optimizasyonIcinPaletler)

    console.log('✅ Optimizasyon sonucu:', sonuc)
    optimizasyonSonucu.value = sonuc

    const toplamPalet = paletStore.optimizasyonIcinPaletler.length
    const yerlesenPalet = sonuc.yerlesenPaletler.length
    const basariOrani = ((yerlesenPalet / toplamPalet) * 100).toFixed(1)

    if (yerlesenPalet === toplamPalet) {
      ElMessage.success(
        `🎉 Tüm paletler başarıyla yerleştirildi! (${yerlesenPalet}/${toplamPalet})`,
      )
    } else if (yerlesenPalet > 0) {
      ElMessage.warning(
        `⚠️ ${yerlesenPalet}/${toplamPalet} palet yerleştirildi (%${basariOrani} başarı)`,
      )
    } else {
      ElMessage.error('❌ Hiçbir palet yerleştirilemedi. Palet boyutlarını kontrol edin.')
    }
  } catch (error) {
    console.error('❌ Optimizasyon hatası:', error)
    ElMessage.error('Optimizasyon sırasında hata oluştu: ' + error.message)

    optimizasyonSonucu.value = {
      yerlesenPaletler: [],
      disaridaKalanPaletler: paletStore.optimizasyonIcinPaletler,
      bosAlan: 100,
      dolulukOrani: 0,
      toplamAgirlik: 0,
      agirlikMerkezi: { x: 0, y: 0, z: 0 },
    }
  } finally {
    optimizasyonYukleniyor.value = false
  }
}

const projeKaydetModalAc = () => {
  if (!optimizasyonSonucu.value) {
    ElMessage.warning('Önce optimizasyon çalıştırın!')
    return
  }

  const tarih = new Date().toLocaleDateString('tr-TR')
  const saat = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  projeKaydetForm.value.ad = `Proje ${tarih} ${saat}`
  projeKaydetForm.value.aciklama = ''

  projeKaydetModalVisible.value = true
}

const projeKaydet = async () => {
  if (!projeKaydetForm.value.ad.trim()) {
    ElMessage.warning('Proje adı gereklidir!')
    return
  }

  projeKaydediliyor.value = true

  try {
    const toplamPalet = paletStore.optimizasyonIcinPaletler.length
    const yerlesenPalet = optimizasyonSonucu.value.yerlesenPaletler.length
    const disaridaKalanPalet = optimizasyonSonucu.value.disaridaKalanPaletler.length
    const dolulukOrani = optimizasyonSonucu.value.dolulukOrani || 0
    const toplamAgirlik = optimizasyonSonucu.value.toplamAgirlik || 0

    const projeVerileri = {
      ad: projeKaydetForm.value.ad.trim(),
      aciklama: projeKaydetForm.value.aciklama.trim(),
      dorseTip: dorseForm.value.tip,
      dorseBoyutlari: dorseBoyutlari.value,
      paletler: [...paletStore.paletler],
      optimizasyonSonucu: {
        ...optimizasyonSonucu.value,
        yerlesenPaletler: [...optimizasyonSonucu.value.yerlesenPaletler],
        disaridaKalanPaletler: [...optimizasyonSonucu.value.disaridaKalanPaletler],
      },
      istatistikler: {
        toplamPalet,
        yerlesenPalet,
        disaridaKalanPalet,
        dolulukOrani,
        toplamAgirlik,
      },
    }

    const kaydedilenProje = projeStore.projeKaydet(projeVerileri)

    ElMessage.success(`✅ Proje "${kaydedilenProje.ad}" başarıyla kaydedildi!`)
    projeKaydetModalVisible.value = false

    projeKaydetForm.value.ad = ''
    projeKaydetForm.value.aciklama = ''
  } catch (error) {
    console.error('Proje kaydetme hatası:', error)
    ElMessage.error('Proje kaydedilirken hata oluştu: ' + error.message)
  } finally {
    projeKaydediliyor.value = false
  }
}

const raporOlustur = async () => {
  if (!optimizasyonSonucu.value) {
    ElMessage.warning('Önce optimizasyon çalıştırın!')
    return
  }

  try {
    ElMessage.info('📄 PDF raporu oluşturuluyor...')

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const raporService = new RaporService()

    let gorselElement = null

    const canvasSelectors = [
      '#three-canvas',
      '.three-canvas',
      '[data-three-canvas]',
      '.onizleme-container canvas',
      '.gorselleme-container canvas',
      '[data-gorselleme] canvas',
      'canvas',
    ]

    for (const selector of canvasSelectors) {
      const element = document.querySelector(selector)
      if (element && element.tagName === 'CANVAS') {
        gorselElement = element
        console.log('Canvas bulundu:', selector, element)
        break
      }
    }

    if (!gorselElement) {
      const containerSelectors = [
        '.onizleme-container',
        '.gorselleme-container',
        '[data-gorselleme]',
      ]

      for (const selector of containerSelectors) {
        const element = document.querySelector(selector)
        if (element && element.offsetWidth > 0) {
          gorselElement = element
          console.log('Container bulundu:', selector, element)
          break
        }
      }
    }

    console.log('Seçilen görsel element:', gorselElement)

    const projeVerileri = {
      proje: {
        ad: projeStore.aktifProje?.ad || 'Yeni Proje',
        aciklama: projeStore.aktifProje?.aciklama || 'Otomatik oluşturulan rapor',
        olusturmaTarihi: projeStore.aktifProje?.olusturmaTarihi || new Date().toISOString(),
        dorseBilgileri: {
          tip: dorseForm.value.tip,
          hacim:
            dorseBoyutlari.value.uzunluk *
            dorseBoyutlari.value.genislik *
            dorseBoyutlari.value.yukseklik,
        },
      },
      optimizasyonSonucu: optimizasyonSonucu.value,
      dorseBoyutlari: dorseBoyutlari.value,
    }

    const pdf = await raporService.projeRaporuOlustur(projeVerileri, gorselElement)

    const tarih = new Date().toISOString().split('T')[0]
    const saat = new Date()
      .toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      .replace(':', '-')
    const dosyaAdi = `palet_yukleme_raporu_${tarih}_${saat}.pdf`

    pdf.save(dosyaAdi)

    ElMessage.success('✅ PDF raporu başarıyla oluşturuldu!')
  } catch (error) {
    console.error('PDF rapor hatası:', error)
    ElMessage.error('PDF raporu oluşturulurken hata oluştu: ' + error.message)
  }
}

onMounted(() => {
  console.log('Yükleme planlama sayfası yüklendi')
})
</script>

<style scoped>
.yukleme-planlama {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
}

.button-group {
  display: flex;
  gap: 10px;
}

.el-card {
  margin-bottom: 20px;
}

.palet-tablo-container {
  margin-bottom: 15px;
}

.palet-ozet {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

.onizleme-container {
  height: 500px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.el-descriptions {
  margin-top: 20px;
}
</style>
