<template>
  <v-card class="price-list">
    <h2 class="title">Cennik Biletów</h2>
    <div class="ticket-option">
      <h3>Film 2D</h3>
      <p class="price">22 zł</p>
    </div>
    <div class="ticket-option">
      <h3>Film 3D</h3>
      <p class="price">25 zł</p>
      <p class="note">+ 5 zł za okulary 3D (opcjonalnie)</p>
    </div>
  </v-card>
</template>

<script>
</script>

<style scoped>
.price-list {
  max-width: 400px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
}

.title {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.ticket-option {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-left: 4px solid #3498db;
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
