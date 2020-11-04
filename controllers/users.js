

const login = (request, response, next) => {
    console.log(request.body);
    response.redirect("chat.html")
}

module.exports = {
    login
}