class Giphy {
    constructor(url, key){
        this.url = url;
        this.key = 'api_key=' + key;
    }

    async getTrendings(limit, offset) {

        let qs = `${this.key}&limit=${limit}&offset=${offset}`;

        let res = await fetch(`${this.url}/gifs/trending?${qs}`);
        let trendings = await res.json();
        return trendings;
    };

    async getSearch(term, limit, offset) {

        let qs = `${this.key}&q=${term}&limit=${limit}&offset=${offset}`;

        let res = await fetch(`${this.url}/gifs/search?${qs}`);
        let search = await res.json();
        return search;
    };

    async getCategories() {

        let qs = this.key;

        let res = await fetch(`${this.url}/gifs/categories?${qs}`);
        let categories = await res.json();
        return categories;
    };

    async getRelatedTags(term) {

        let qs = `{${term}}?${this.key}`;

        let res = await fetch(`${this.url}/tags/related/${qs}`);
        let relatedTerms = await res.json();
        return relatedTerms;
    };

    async uploadGif(blob) {

        const header = new Headers();

        const upload = await fetch(`${this.url}?${this.key}`, {
            method: 'POST', 
            headers: header, 
            cors: "cors",
            body: blob
        });

        const res = await upload.json()

        return res;
    }

    async getGifById(id) {

       const res = await fetch(`${this.url}/gifs/${id}?${this.key}`);
       const gif = await res.json();
       return gif
    }

};

export default Giphy;