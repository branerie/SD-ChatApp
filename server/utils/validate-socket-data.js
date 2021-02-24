function getTime() {
    return new Date().toLocaleTimeString()
}

function sysLog(message) {
    console.log(`[${getTime()}] ${message}`)
}

// remove leading, trailing and middle repeating spaces
function trimAll(string) {
    return string.split(' ').filter(Boolean).join(' ')
}

function isString(string) {
    return typeof string === 'string' || string instanceof String
}

function isObject(source, object) {
    if (object === null || object === undefined) {
        sysLog(`Invalid data from ${source} Expected Object - got ${object}`)
        return false
    } else if (!object || object.constructor.name !== 'Object') {
        sysLog(`Invalid data from ${source} Expected Object - got ${object.constructor.name}.`)
        return false
    } else return true
}

const profileData = (source, data, errors = []) => {
    if (!isObject(source, data)) return { failed: true, errors }
    const allowedFields = ['name', 'company', 'position', 'email', 'mobile', 'picture']
    const ignoredData = {}
    let invalidData = false
    for (const field in data) {
        if (!allowedFields.includes(field) || !isString(data[field])) {
            invalidData = true
            ignoredData[field] = data[field]
            delete data[field]
        } else {
            data[field] = trimAll(data[field])
        }
    }
    // log removed invalid fields but don't fail validation
    // might be misconfiguration on server (check allowedFileds)
    invalidData && sysLog(`Unexpected data from ${source}.\nIgnored data: ${JSON.stringify(ignoredData)}.`)
    return { failed: false, data }
}

const siteData = (site, description, errors = []) => {
    if (!site) errors.push('Name is reqiured')
    if (site && site.length < 4) errors.push('Name too short. Minimum is 4 symbols.')
    if (site && site.length > 20) errors.push('Name too long. Maximum is 20 symbols.')
    if (description && description.length > 100) errors.push('Description too long. Maximum is 100 symbols.')

    return { failed: errors.length > 0, errors }
}

module.exports = {
    siteData,
    profileData,
}