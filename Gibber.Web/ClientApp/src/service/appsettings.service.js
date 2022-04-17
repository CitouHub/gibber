import axios from "axios"

export default {
    get: async () => {
        try {
            let result = await axios.get('api/appsettings');
            return result.data;
        } catch (error) {
            console.error(error);
        }
    }
}