const authenticate = async (url, body, onSuccess, onFailure) => {
    const promise = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const token = await promise.json();
    
    console.log();
}

export default authenticate