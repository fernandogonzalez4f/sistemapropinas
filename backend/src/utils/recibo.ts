export const generarRecibo = (metodoPago:
    string, distribucion: any[]) => {
        return {
            id: Date.now(),
            fecha: new Date(),
            metodoPago,
            detalles: distribucion
        };
    };