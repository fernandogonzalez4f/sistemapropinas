import { ref } from "vue";

type DistribucionItem = { nombre: string; monto: number };
const distribucion = ref<DistribucionItem[]>([]);

export const setDistribucion = (data: DistribucionItem[]) => { distribucion.value = data; };
export const getDistribucion = () => distribucion.value;