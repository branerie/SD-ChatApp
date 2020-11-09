const authenticate = async (url, body, onSuccess, onFailure) => {
    const promise = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    console.log(promise);
}

export default authenticate