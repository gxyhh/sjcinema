<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  text-decoration: none;
}
.scroll-container::-webikit-scrollbar {
  width: 6px;
}
.scroll-container::-webikit-scrollbar-track {
  background: #fff;
  border-radius: 3px;
  width: 6px;
}
.scroll-container::-webikit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 3px;
  width: 6px;
}
</style>
