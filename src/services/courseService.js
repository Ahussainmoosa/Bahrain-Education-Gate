const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/courses`;
const  headers = {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }

export const courseService = {
    //get course id
    async getCourse(id){
        const res = await fetch (`${BASE_URL}/${id}`, {
            headers
        });

        const data = await res.json();

        if(data.err){
            throw new Error('Failed');
        };

        return data;
    },

    //create new course
    async createCourse(formData){
        const res = await fetch(`${BASE_URL}/new`, {
            method: 'POST',
            headers,
            body: JSON.stringify(formData), 
        });
        
        const data = await res.json();        

        if(data.err){
            throw new Error('Failed');
        };

        return data;
    },

    //update course
    async updateCourse(id, formData){
        const res = await fetch (`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(formData), 
        });
        const data = await res.json();        

        if(data.err){
            throw new Error('Failed');
        };

        return data;
        
    },

    async deleteCourse(id){
        const res = await fetch (`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers
        });
        const data = await res.json();        

        if(!res.err){
            throw new Error('Failed');
        };

        return data;
        
    },
};