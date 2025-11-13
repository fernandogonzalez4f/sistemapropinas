<template>
  <div class="dividir-container">
    <h2>Dividir Propinas</h2>

    <form @submit.prevent="dividirPropinas">
      <label>Total de Propinas:</label>
      <input type="number" v-model.number="total" placeholder="Monto total" required />

      <div class="empleados">
        <h3>Empleados</h3>

        <div v-for="(emp, i) in empleados" :key="i" class="empleado-item">
          <input
            v-model="emp.nombre"
            placeholder="Nombre del empleado"
            required
          />
          <input
            v-model.number="emp.porcentaje"
            type="number"
            placeholder="%"
            min="0"
            max="1000"
            required
          />
          <button type="button" @click="eliminarEmpleado(i)">❌</button>
        </div>

        <button type="button" @click="agregarEmpleado" class="add-btn">+ Agregar empleado</button>
      </div>

      <div class="actions">
        <button type="submit">Dividir Propinas</button>
      </div>
    </form>

    <div v-if="distribucion.length" class="resultado">
      <h3>Distribución de Propinas</h3>
      <ul>
        <li v-for="(d, i) in distribucion" :key="i">
          {{ d.nombre }} — ${{ d.monto.toFixed(2) }}
        </li>
      </ul>
      <p><strong>Total:</strong> ${{ total.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { setDistribucion } from "../store/tipsStore";

type EmpleadoInput = { nombre: string; porcentaje: number };
type DistribucionItem = { nombre: string; monto: number };

const total = ref<number>(0);
const empleados = ref<EmpleadoInput[]>([
  { nombre: "", porcentaje: 0 },
]);
const distribucion = ref<DistribucionItem[]>([]);

function agregarEmpleado() {
  empleados.value.push({ nombre: "", porcentaje: 0 });
}

function eliminarEmpleado(i: number) {
  empleados.value.splice(i, 1);
}

function validarEmpleados() {
  if (!total.value || total.value <= 0) {
    alert("Ingresa un total válido (> 0).");
    return false;
  }
  if (empleados.value.length === 0) {
    alert("Agrega al menos un empleado.");
    return false;
  }
  for (const e of empleados.value) {
    if (!e.nombre || e.nombre.trim() === "") {
      alert("Todos los empleados deben tener nombre.");
      return false;
    }
    if (typeof e.porcentaje !== "number" || isNaN(e.porcentaje) || e.porcentaje < 0) {
      alert("Porcentajes inválidos.");
      return false;
    }
  }
  return true;
}

async function dividirPropinas() {
  if (!validarEmpleados()) return;

  try {
    // Usamos el endpoint backend para la lógica (si tienes uno)
    const payload = {
      total: total.value,
      empleados: empleados.value.map(e => ({ nombre: e.nombre.trim(), porcentaje: e.porcentaje })),
    };

    const resp = await axios.post("http://localhost:3000/tips/dividir", payload);
    // respuesta esperada: { total, distribucion: [{nombre, monto}, ...] }
    distribucion.value = resp.data.distribucion;

    // Guardar en store para que otros componentes (pago) lo puedan usar
    setDistribucion(distribucion.value);

  } catch (err) {
    // Si no tienes endpoint o falla, calcular localmente como fallback
    console.error("Error al dividir via backend, calculando localmente:", err);
    calcularLocalmente();
  }
}

function calcularLocalmente() {
  const sumaPorcentajes = empleados.value.reduce((s, e) => s + e.porcentaje, 0);
  if (sumaPorcentajes === 0) {
    // repartir equitativamente
    const partes = empleados.value.length;
    const monto = Math.round((total.value / partes) * 100) / 100;
    distribucion.value = empleados.value.map(e => ({ nombre: e.nombre.trim(), monto }));
  } else {
    distribucion.value = empleados.value.map(e => {
      const ratio = e.porcentaje / sumaPorcentajes;
      const monto = Math.round((total.value * ratio + Number.EPSILON) * 100) / 100;
      return { nombre: e.nombre.trim(), monto };
    });
    // Ajuste por redondeo
    const suma = distribucion.value.reduce((s, it) => s + it.monto, 0);
    const diff = Math.round((total.value - suma) * 100) / 100;

    const primerEmpleado = distribucion.value.find(e => e.monto !== undefined);
    if (distribucion.value.length > 0 && Math.abs(diff) >= 0.01) {
    distribucion.value[0].monto = Math.round((distribucion.value[0].monto + diff) * 100) / 100;
    }
  }
  if (empleados.value.length === 0) {
  alert("No hay empleados para dividir las propinas.");
  return;
  }
  if (distribucion.value.length === 0) {
  alert("No se pudo calcular la distribución de propinas. Revisa los datos de los empleados.");
  return;
}
}
</script>

<style scoped>
.dividir-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.empleado-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.add-btn {
  margin-top: 8px;
  background-color: #6c757d;
}

.actions {
  margin-top: 12px;
}

button {
  margin-top: 8px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
