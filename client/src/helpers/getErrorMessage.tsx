export const getErrorMessage = (error: unknown): string => {
  try {
    // Axios JSON API
    if ((error as any)?.response?.data?.msg) {
      let fault = (error as any).response.data.msg;
      const match = fault.match(/ValidationError:\s*\('([\s\S]*?)',\s*None\)/);
      if (match && match[1]) {
        return match[1].replace(/\\n/g, '\n');
      }
      return (error as any).response.data.msg;
    }

    // Generic axios error
    if ((error as any)?.response?.data) {
      return JSON.stringify((error as any).response.data);
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'Có gì đó không ổn';
  } catch {
    return 'Có gì đó không ổn';
  }
};
