export const fetchData = async (route) => {
    const response = await fetch(route);
    if (!response.ok) {
        throw new Error(response.error);
    }
    return response.json();
  }