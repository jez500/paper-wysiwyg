import axios from "axios";

export default {
    uploadImage: async (file, viewProps) => {
        if (! viewProps?.uploadUrl) {
            return null;
        }

        let formData = new FormData();
        formData.append('images', file);
        const headers = {'Content-Type': 'multipart/form-data'};

        const response = await axios.post(viewProps.uploadUrl, formData, {headers: headers} );

        if (response.data.length === 0) {
            return alert('Unable to upload file');
        }

        return response.data[0];
    },
}
