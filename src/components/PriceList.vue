<template>
  <v-card class="price-list">
    <v-card-title>
      <h1>Cennik Biletów</h1>
    </v-card-title>
    <div class="ticket-option">
      <h3>Film 2D</h3>
      <p class="price">22 zł</p>
    </div>
    <div class="ticket-option">
      <h3>Film 3D</h3>
      <p class="price">25 zł</p>
    </div>
  </v-card>
</template>

<script></script>

<style scoped>
.price-list {
  max-width: 400px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", sans-serif;
}

.ticket-option {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-left: 6px solid #ffa600ff;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.ticket-option h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  font-weight: 500;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.note {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-top: 0.5rem;
}
</style>
