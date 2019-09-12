class PromiseHttp {
    static get(url) {
        return new Promise((resolve, reject) => {
            $.get(url)
                .then((data, status) => {
                    resolve(data);
                }, err => reject(err))
        })
    }

    static post(url, data) {
        return new Promise((resolve, reject) => {
            $.post(url, data)
                .then((data, status) => {
                    resolve(data);
                }, err => reject(err))
        })
    }

    static put(url, data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'PUT',
                url,
                data,
            })
                .then((data, status) => {
                    resolve(data);
                }, err => reject(err))
        })
    }
}