const authenticate = async (url, body, onSuccess, onFailure) => {
    try {
        const promise = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(promise)
        const authToken = promise.headers.get("Authorization")
        document.cookie = `x-auth-token=${authToken}`
        const response = await promise.json()
        console.log(response)
        if (response.username && authToken) {
            onSuccess({
                username: response.username,
                id: response._id
            });
        } else {
            console.log('here')
            onFailure()
        }

    } catch (error) {
        onFailure(error)
    }
}

export default authenticate