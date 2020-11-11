const authenticate = async (url, body, onSuccess, onFailure) => {
    try {
        const promise = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log('promise', promise);
        const authToken = promise.headers.get("Authorization")
        console.log('token',authToken);
        document.cookie = `x-auth-token=${authToken}`
        const response = await promise.json()
        console.log(response.username);
        if (response.username && authToken) {
            onSuccess({
                username: response.username,
                id: response._id
            });
        } else {
            onFailure()
        }

    } catch (error) {
        onFailure(error)
    }
}

export default authenticate