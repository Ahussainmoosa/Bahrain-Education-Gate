const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`;
const  headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }

export const index = async () => {
   try {
    const res = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    console.log(data)
    return data
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}