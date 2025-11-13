<template>
  <div>
    <h2>Pagar Propinas</h2>

    <form @submit.prevent="pagar">
      <label>Total:</label>
      <input type="number" :value="total" readonly />

      <label>Método de Pago:</label>
      <select v-model="metodoPago" required>
        <option disabled value="">Selecciona método</option>
        <option>Efectivo</option>
        <option>Tarjeta</option>
        <option>Transferencia</option>
      </select>

      <button type="submit">Registrar Pago</button>
    </form>

    <div v-if="recibo">
      <h3>Recibo Generado</h3>
      <p><strong>ID:</strong> {{ recibo.id }}</p>
      <p><strong>Fecha:</strong> {{ new Date(recibo.fecha).toLocaleString() }}</p>
      <p><strong>Total:</strong> ${{ recibo.total }}</p>
      <p><strong>Método:</strong> {{ recibo.metodoPago }}</p>
      <div v-if="recibo.distribucion?.length">
        <h4>Distribución:</h4>
        <ul>
          <li v-for="d in recibo.distribucion" :key="d.nombre">
            {{ d.nombre }} — ${{ d.monto.toFixed(2) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import axios from "axios";
import { getDistribucion } from "../store/tipsStore";

const metodoPago = ref("");
const recibo = ref<any>(null);

// Total calculado dinámicamente
const total = computed(() => getDistribucion().reduce((s, e) => s + e.monto, 0));

async function pagar() {
  if (total.value <= 0) {
    alert("No hay propinas para pagar.");
    return;
  }
  if (!metodoPago.value) {
    alert("Selecciona un método de pago.");
    return;
  }

  try {
    const payload = {
      total: total.value,
      periodo: new Date().toISOString().split("T")[0],
      metodoPago: metodoPago.value,
      distribucion: getDistribucion(),
    };
    console.log("Payload:", payload);

    const resp = await axios.post("http://localhost:3000/tips/pagar", payload);
    recibo.value = resp.data.recibo;

    alert("Pago registrado correctamente.");
  } catch (err) {
    console.error(err);
    alert("Error al registrar el pago.");
  }
}
</script>


<style scoped>
.pago-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.recibo {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #ddd;
}
</style>
