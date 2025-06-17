<template>
  <div class="palet-girisi">
    <h2>Palet Girişi</h2>

    <el-alert
      title="Dorse Ölçü Sınırları"
      type="info"
      :closable="false"
      show-icon
      class="dorse-bilgi"
    >
      <template #default>
        <p><strong>Standart Dorse Ölçüleri:</strong></p>
        <ul>
          <li>
            Maksimum En: {{ dorseMaksimumOlculeri.en }}cm ({{
              (dorseMaksimumOlculeri.en / 100).toFixed(2)
            }}m)
          </li>
          <li>
            Maksimum Boy: {{ dorseMaksimumOlculeri.boy }}cm ({{
              (dorseMaksimumOlculeri.boy / 100).toFixed(2)
            }}m)
          </li>
          <li>
            Maksimum Yükseklik: {{ dorseMaksimumOlculeri.yukseklik }}cm ({{
              (dorseMaksimumOlculeri.yukseklik / 100).toFixed(2)
            }}m)
          </li>
        </ul>
        <p><em>Paletleriniz bu ölçüleri aşmamalıdır.</em></p>
      </template>
    </el-alert>

    <el-form :model="paletForm" label-width="120px" class="palet-form">
      <el-form-item label="Palet Adı">
        <el-input v-model="paletForm.ad" placeholder="Palet adını giriniz"></el-input>
      </el-form-item>

      <el-form-item label="Ölçüler (cm)">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input-number
              v-model="paletForm.en"
              :min="1"
              :max="dorseMaksimumOlculeri.en"
              placeholder="En"
            >
              <template #append>cm</template>
            </el-input-number>
            <div class="olcu-bilgi">Max: {{ dorseMaksimumOlculeri.en }}cm</div>
          </el-col>
          <el-col :span="8">
            <el-input-number
              v-model="paletForm.boy"
              :min="1"
              :max="dorseMaksimumOlculeri.boy"
              placeholder="Boy"
            >
              <template #append>cm</template>
            </el-input-number>
            <div class="olcu-bilgi">Max: {{ dorseMaksimumOlculeri.boy }}cm</div>
          </el-col>
          <el-col :span="8">
            <el-input-number
              v-model="paletForm.yukseklik"
              :min="1"
              :max="dorseMaksimumOlculeri.yukseklik"
              placeholder="Yükseklik"
            >
              <template #append>cm</template>
            </el-input-number>
            <div class="olcu-bilgi">Max: {{ dorseMaksimumOlculeri.yukseklik }}cm</div>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="Adet">
        <el-input-number v-model="paletForm.adet" :min="1"></el-input-number>
      </el-form-item>

      <el-form-item label="Ağırlık (kg)">
        <el-input-number v-model="paletForm.agirlik" :min="0" :precision="2"></el-input-number>
      </el-form-item>

      <el-form-item label="İstiflenebilir mi?">
        <el-switch v-model="paletForm.istiflenebilir"></el-switch>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="paletEkle">Palet Ekle</el-button>
        <el-button @click="formTemizle">Formu Temizle</el-button>
        <el-button type="success" @click="akilliBoyutAnaliziIleRandomPaletUret">
          Akıllı Random Paletler Üret
        </el-button>
      </el-form-item>
    </el-form>

    <el-divider>Girilen Paletler</el-divider>

    <el-table :data="paletStore.paletler" style="width: 100%">
      <el-table-column prop="ad" label="Palet Adı"></el-table-column>
      <el-table-column label="Ölçüler">
        <template #default="scope">
          {{ scope.row.en }}x{{ scope.row.boy }}x{{ scope.row.yukseklik }} cm
        </template>
      </el-table-column>
      <el-table-column prop="adet" label="Adet"></el-table-column>
      <el-table-column prop="agirlik" label="Ağırlık (kg)"></el-table-column>
      <el-table-column prop="istiflenebilir" label="İstiflenebilir">
        <template #default="scope">
          {{ scope.row.istiflenebilir ? 'Evet' : 'Hayır' }}
        </template>
      </el-table-column>
      <el-table-column label="İşlemler">
        <template #default="scope">
          <el-button type="danger" size="small" @click="paletSil(scope.$index)">Sil</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { usePaletStore } from '@/stores/paletStore'

const paletStore = usePaletStore()

const dorseMaksimumOlculeri = ref({
  en: 247,
  boy: 1360,
  yukseklik: 300,
})

const paletForm = ref({
  ad: '',
  en: 0,
  boy: 0,
  yukseklik: 0,
  adet: 1,
  agirlik: 0,
  istiflenebilir: false,
})

const paletEkle = () => {
  if (!paletForm.value.ad.trim()) {
    ElMessage.error('Lütfen palet adını giriniz')
    return
  }

  if (paletForm.value.en <= 0 || paletForm.value.boy <= 0 || paletForm.value.yukseklik <= 0) {
    ElMessage.error('Lütfen geçerli ölçüler giriniz')
    return
  }

  if (paletForm.value.en > dorseMaksimumOlculeri.value.en) {
    ElMessage.error(
      `Palet eni ${dorseMaksimumOlculeri.value.en}cm'yi geçemez (Dorse genişliği sınırı)`,
    )
    return
  }

  if (paletForm.value.boy > dorseMaksimumOlculeri.value.boy) {
    ElMessage.error(
      `Palet boyu ${dorseMaksimumOlculeri.value.boy}cm'yi geçemez (Dorse uzunluğu sınırı)`,
    )
    return
  }

  if (paletForm.value.yukseklik > dorseMaksimumOlculeri.value.yukseklik) {
    ElMessage.error(
      `Palet yüksekliği ${dorseMaksimumOlculeri.value.yukseklik}cm'yi geçemez (Dorse yüksekliği sınırı)`,
    )
    return
  }

  if (paletForm.value.adet <= 0) {
    ElMessage.error('Palet adedi 1 veya daha fazla olmalıdır')
    return
  }

  try {
    paletStore.paletEkle({ ...paletForm.value })
    const adet = paletForm.value.adet
    formTemizle()
    ElMessage.success(
      `Palet başarıyla eklendi! (${adet} adet) - Yükleme planlamasında kullanılabilir`,
    )
  } catch (error) {
    ElMessage.error('Palet eklenirken hata oluştu: ' + error.message)
    console.error('Palet ekleme hatası:', error)
  }
}

const formTemizle = () => {
  paletForm.value = {
    ad: '',
    en: 0,
    boy: 0,
    yukseklik: 0,
    adet: 1,
    agirlik: 0,
    istiflenebilir: false,
  }
}

const paletSil = (index) => {
  paletStore.paletSil(index)
  ElMessage.success('Palet başarıyla silindi')
}

const akilliBoyutAnaliziIleRandomPaletUret = () => {
  try {
    const mevcutPaletler = paletStore.paletler
    const boyutAnalizi =
      mevcutPaletler.length > 0 ? analizMevcutPaletler(mevcutPaletler) : varsayilanBoyutAnalizi()

    console.log('📊 Boyut analizi:', boyutAnalizi)

    const paletSayisi = Math.floor(Math.random() * 6) + 5
    let uretilenSayisi = 0

    for (let i = 0; i < paletSayisi; i++) {
      const randomPalet = akilliBoyutaUygunRandomPalet(boyutAnalizi, i + 1)

      if (randomPalet) {
        paletStore.paletEkle(randomPalet)
        uretilenSayisi++
      }
    }

    ElMessage.success(
      `${uretilenSayisi} adet akıllı random palet üretildi! Boyutlar mevcut verilerle uyumlu.`,
    )
  } catch (error) {
    console.error('Random palet üretim hatası:', error)
    ElMessage.error('Random palet üretimi sırasında hata oluştu')
  }
}

const analizMevcutPaletler = (paletler) => {
  const boyutlar = {
    enler: [],
    boylar: [],
    yukseklikler: [],
    agirliklar: [],
  }

  paletler.forEach((palet) => {
    for (let i = 0; i < palet.adet; i++) {
      boyutlar.enler.push(palet.en)
      boyutlar.boylar.push(palet.boy)
      boyutlar.yukseklikler.push(palet.yukseklik)
      boyutlar.agirliklar.push(palet.agirlik || 0)
    }
  })

  return {
    ortalama: {
      en: boyutlar.enler.reduce((a, b) => a + b, 0) / boyutlar.enler.length,
      boy: boyutlar.boylar.reduce((a, b) => a + b, 0) / boyutlar.boylar.length,
      yukseklik: boyutlar.yukseklikler.reduce((a, b) => a + b, 0) / boyutlar.yukseklikler.length,
      agirlik: boyutlar.agirliklar.reduce((a, b) => a + b, 0) / boyutlar.agirliklar.length,
    },
    maksimum: {
      en: Math.max(...boyutlar.enler),
      boy: Math.max(...boyutlar.boylar),
      yukseklik: Math.max(...boyutlar.yukseklikler),
      agirlik: Math.max(...boyutlar.agirliklar),
    },
    minimum: {
      en: Math.min(...boyutlar.enler),
      boy: Math.min(...boyutlar.boylar),
      yukseklik: Math.min(...boyutlar.yukseklikler),
      agirlik: Math.min(...boyutlar.agirliklar),
    },
    toplamPalet: boyutlar.enler.length,
  }
}

const varsayilanBoyutAnalizi = () => {
  return {
    ortalama: {
      en: 140,
      boy: 120,
      yukseklik: 170,
      agirlik: 350,
    },
    maksimum: {
      en: 220,
      boy: 200,
      yukseklik: 260,
      agirlik: 700,
    },
    minimum: {
      en: 80,
      boy: 70,
      yukseklik: 100,
      agirlik: 100,
    },
    toplamPalet: 0,
  }
}

const akilliBoyutaUygunRandomPalet = (analiz, sira) => {
  try {
    const varyasyonFaktoru = 0.5

    const enMin = Math.max(analiz.minimum.en * (1 - varyasyonFaktoru), 70)
    const enMax = Math.min(
      analiz.maksimum.en * (1 + varyasyonFaktoru),
      dorseMaksimumOlculeri.value.en * 0.95,
    )
    const en = Math.floor(Math.random() * (enMax - enMin) + enMin)

    const boyMin = Math.max(analiz.minimum.boy * (1 - varyasyonFaktoru), 80)
    const boyMax = Math.min(
      analiz.maksimum.boy * (1 + varyasyonFaktoru),
      dorseMaksimumOlculeri.value.boy * 0.25,
    )
    const boy = Math.floor(Math.random() * (boyMax - boyMin) + boyMin)

    const yukseklikMin = Math.max(analiz.minimum.yukseklik * (1 - varyasyonFaktoru), 100)
    const yukseklikMax = Math.min(
      analiz.maksimum.yukseklik * (1 + varyasyonFaktoru),
      dorseMaksimumOlculeri.value.yukseklik * 0.9,
    )
    const yukseklik = Math.floor(Math.random() * (yukseklikMax - yukseklikMin) + yukseklikMin)

    const hacim = (en * boy * yukseklik) / 1000000 // m³
    const yogunluk = 250 + Math.random() * 400
    const hacimBazliAgirlik = Math.floor(hacim * yogunluk)

    const analizBazliAgirlik = Math.floor(
      Math.random() * (analiz.maksimum.agirlik - analiz.minimum.agirlik) + analiz.minimum.agirlik,
    )

    const agirlik = Math.floor((hacimBazliAgirlik + analizBazliAgirlik) / 2)

    let adet
    if (hacim < 0.5) {
      adet = Math.floor(Math.random() * 4) + 2
    } else if (hacim < 1.5) {
      adet = Math.floor(Math.random() * 3) + 1
    } else {
      adet = Math.floor(Math.random() * 2) + 1
    }

    let istiflenebilir
    if (agirlik > 600 || hacim > 2) {
      istiflenebilir = Math.random() > 0.8
    } else if (agirlik > 400 || hacim > 1) {
      istiflenebilir = Math.random() > 0.5
    } else {
      istiflenebilir = Math.random() > 0.25
    }

    if (
      en > dorseMaksimumOlculeri.value.en ||
      boy > dorseMaksimumOlculeri.value.boy ||
      yukseklik > dorseMaksimumOlculeri.value.yukseklik
    ) {
      console.warn('Üretilen palet dorse sınırlarını aşıyor, atlanıyor')
      return null
    }

    return {
      ad: `Akıllı-Palet-${sira}`,
      en,
      boy,
      yukseklik,
      adet,
      agirlik,
      istiflenebilir,
    }
  } catch (error) {
    console.error('Random palet üretim hatası:', error)
    return null
  }
}
</script>

<style scoped>
.palet-girisi {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.palet-form {
  margin-top: 20px;
  max-width: 800px;
}

.el-divider {
  margin: 30px 0;
}

.olcu-bilgi {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  text-align: center;
}

.el-input-number {
  width: 100%;
}

.dorse-bilgi {
  margin: 20px 0;
}

.dorse-bilgi ul {
  margin: 10px 0;
  padding-left: 20px;
}

.dorse-bilgi li {
  margin: 5px 0;
}
</style>
