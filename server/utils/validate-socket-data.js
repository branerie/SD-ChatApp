const siteData = (site, description) => {
    const errors = []
    if (!site) errors.push('Name is reqiured')
    if (site && site.length < 4) errors.push('Name too short. Minimum is 4 symbols.')
    if (site && site.length > 20) errors.push('Name too long. Maximum is 20 symbols.')
    if (description && description.length > 100) errors.push('Description too long. Maximum is 100 symbols.')

    return { failed: errors.length > 0, errors }
}

module.exports = {
    siteData,
}