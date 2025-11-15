const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/assignments`;
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
};

export const assignmentService = {
  async getAssignment(id) {
    const res = await fetch(`${BASE_URL}/${id}`, { headers });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  },

  async getAllAssignments() {
    const res = await fetch(BASE_URL, { headers });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  },

  async createAssignment(formData) {
    const res = await fetch(`${BASE_URL}/new`, {  // matches your controller
      method: 'POST',
      headers,
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  },

  async updateAssignment(id, formData) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  },

  async deleteAssignment(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok && res.status !== 204) throw new Error(`HTTP error! status: ${res.status}`);
    return res.status === 204 ? {} : res.json();
  },
};
