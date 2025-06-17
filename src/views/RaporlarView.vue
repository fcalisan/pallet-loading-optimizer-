<template>
  <div class="raporlar">
    <h2>Yükleme Raporları</h2>

    <el-card class="rapor-filtreleri">
      <template #header>
        <div class="card-header">
          <h3>Rapor Filtreleri</h3>
        </div>
      </template>

      <el-form :model="filtreForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Başlangıç Tarihi">
              <el-date-picker
                v-model="filtreForm.baslangicTarihi"
                type="date"
                placeholder="Başlangıç tarihi seçiniz"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Bitiş Tarihi">
              <el-date-picker
                v-model="filtreForm.bitisTarihi"
                type="date"
                placeholder="Bitiş tarihi seçiniz"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Dorse Tipi">
              <el-select v-model="filtreForm.dorseTipi" placeholder="Dorse tipi seçiniz">
                <el-option label="Tümü" value=""></el-option>
                <el-option label="Standart" value="standart"></el-option>
                <el-option label="Özel" value="ozel"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="raporlariGetir">Raporları Getir</el-button>
          <el-button @click="filtreleriTemizle">Filtreleri Temizle</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="rapor-listesi">
      <template #header>
        <div class="card-header">
          <h3>Yükleme Raporları</h3>
          <el-button type="success" @click="tumRaporlariIndir">Tüm Raporları İndir</el-button>
        </div>
      </template>

      <el-table :data="raporlar" style="width: 100%">
        <el-table-column prop="tarih" label="Tarih" width="180"></el-table-column>
        <el-table-column prop="dorseTipi" label="Dorse Tipi" width="120"></el-table-column>
        <el-table-column prop="toplamPalet" label="Toplam Palet" width="120"></el-table-column>
        <el-table-column prop="yerlestirilenPalet" label="Yerleştirilen" width="120"></el-table-column>
        <el-table-column prop="bosAlanOrani" label="Boş Alan Oranı" width="120">
          <template #default="scope">
            {{ scope.row.bosAlanOrani }}%
          </template>
        </el-table-column>
        <el-table-column label="İşlemler">
          <template #default="scope">
            <el-button type="primary" size="small" @click="raporGoruntule(scope.row)">Görüntüle</el-button>
            <el-button type="success" size="small" @click="raporIndir(scope.row)">İndir</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="toplamRapor"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const filtreForm = ref({
  baslangicTarihi: null,
  bitisTarihi: null,
  dorseTipi: ''
})

const raporlar = ref([
  {
    id: 1,
    tarih: '2024-03-20',
    dorseTipi: 'Standart',
    toplamPalet: 20,
    yerlestirilenPalet: 15,
    bosAlanOrani: 25
  },
  {
    id: 2,
    tarih: '2024-03-19',
    dorseTipi: 'Özel',
    toplamPalet: 25,
    yerlestirilenPalet: 22,
    bosAlanOrani: 12
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const toplamRapor = ref(100)

const raporlariGetir = () => {
  // Burada API'den raporlar getirilecek
  ElMessage.success('Raporlar başarıyla getirildi')
}

const filtreleriTemizle = () => {
  filtreForm.value = {
    baslangicTarihi: null,
    bitisTarihi: null,
    dorseTipi: ''
  }
}

const raporGoruntule = (rapor) => {
  // Rapor detaylarını görüntüleme modalı açılacak
  ElMessage.info('Rapor görüntüleme özelliği yakında eklenecek')
}

const raporIndir = (rapor) => {
  // Seçili raporu PDF olarak indirme
  ElMessage.success('Rapor indirme işlemi başlatıldı')
}

const tumRaporlariIndir = () => {
  // Tüm raporları toplu indirme
  ElMessage.success('Tüm raporların indirme işlemi başlatıldı')
}

const handleSizeChange = (val) => {
  pageSize.value = val
  raporlariGetir()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  raporlariGetir()
}
</script>

<style scoped>
.raporlar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.rapor-filtreleri,
.rapor-listesi {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>