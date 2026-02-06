// Helper function to extract error messages from API responses
export const getErrorMessage = (error) => {
  if (!error.response?.data) {
    return 'Error de conexión con el servidor';
  }

  const { detail } = error.response.data;

  // If detail is a string, return it
  if (typeof detail === 'string') {
    return detail;
  }

  // If detail is an array (Pydantic validation errors)
  if (Array.isArray(detail)) {
    // Extract messages from validation errors
    const messages = detail.map(err => {
      if (typeof err === 'string') return err;
      if (err.msg) return err.msg;
      return 'Error de validación';
    });
    return messages.join(', ');
  }

  // If detail is an object
  if (typeof detail === 'object') {
    if (detail.msg) return detail.msg;
    if (detail.message) return detail.message;
  }

  return 'Error al procesar la solicitud';
};
