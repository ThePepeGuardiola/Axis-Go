
export const saveTrip = async (tripData: any) => {
    try {
      console.log('Sending trip data:', tripData);
      
      const response = await fetch('http://localhost:5050/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el viaje');
      }
  
      return await response.json();
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        throw new Error('No se pudo conectar al servidor. Verifique que el servidor esté ejecutándose.');
      }
      throw error;
    }
  };

