document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("dasf");
    const query = await fetch("http://localhost:3000/login", {
        method: "POST",
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })

    // const data = await query.json()
    window.location = query.url;
})