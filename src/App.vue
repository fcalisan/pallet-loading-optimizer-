<template>
  <el-container class="app-container">
    <el-header>
      <nav class="nav-header">
        <h1>Lojistik Yükleme Optimizasyon Paneli</h1>
        <el-menu mode="horizontal" router>
          <el-menu-item index="/">Ana Sayfa</el-menu-item>
          <el-menu-item index="/palet-girisi">Palet Girişi</el-menu-item>
          <el-menu-item index="/yukleme-planlama">Yükleme Planlama</el-menu-item>
          <el-menu-item index="/proje-yonetimi">Proje Yönetimi</el-menu-item>
          <el-menu-item index="/raporlar">Raporlar</el-menu-item>
        </el-menu>
      </nav>
    </el-header>

    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import { ElContainer, ElHeader, ElMain, ElMenu, ElMenuItem } from 'element-plus'
</script>

<style>
.app-container {
  min-height: 100vh;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.el-header {
  background-color: #409eff;
  color: white;
  padding: 0;
}

.el-main {
  padding: 20px;
}
</style>
