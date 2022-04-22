import axios from "axios"

export async function get() {
    try {
        let result = await axios.get('api/appsettings');
        return result.data;
    } catch (error) {
        console.error(error);
    }
}