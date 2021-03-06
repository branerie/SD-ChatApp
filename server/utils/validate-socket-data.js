const MAX_MSG_LEN = 7000

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

function isPosInt(number) {
    return Number.isInteger(number) && number >= 0
}

function isObject(src, object) {
    if (object === null || object === undefined) {
        sysLog(`Invalid data from ${src}. Expected Object - got ${object}`)
        return false
    } else if (!object || object.constructor.name !== 'Object') {
        sysLog(`Invalid data from ${src}. Expected Object - got ${object.constructor.name}.`)
        return false
    } else return true
}

const messageData = (src, data) => {
    if (!isObject(src, data)) return { failed: true }
    const { msg = '', type = 'plain' } = data
    if (!isString(msg) || trimAll(msg) === '') return { failed: true }
    const allowedTypes = ['plain', 'uri', 'image']
    if (!isString(type) || !allowedTypes.includes(type)) {
        sysLog(`Invalid message type from ${src}. Got ${type}.`)
        return { failed: true }
    }

    if (type === 'plain' && msg.length > MAX_MSG_LEN) {
        sysLog(`Message length from ${src} exceeded max allowed.`)
        return { failed: true, error: 'Message not sent: Too long' }
    }
    return { failed: false }
}

const profileData = (src, data, errors = []) => {
    if (!isObject(src, data)) return { failed: true, errors }
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
    invalidData && sysLog(`Unexpected data from ${src}.\nIgnored data: ${JSON.stringify(ignoredData)}.`)
    return { failed: false, data }
}

const siteData = (site, description, errors = []) => {
    if (!site) errors.push('Name is required')
    if (site && site.length < 4) errors.push('Name too short. Minimum is 4 symbols.')
    if (site && site.length > 50) errors.push('Name too long. Maximum is 50 symbols.')
    if (description && description.length > 100) errors.push('Description too long. Maximum is 100 symbols.')

    return { failed: errors.length > 0, errors }
}

const siteSearch = (src, data) => {
    if (!isObject(src, data)) return { failed: true }
    if (!isString(data.site) || !isPosInt(data.page)) {
        sysLog(`Invalid data type from ${src}.`)
        return { failed: true }
    }
    data.site = trimAll(data.site)
    if (!data.site) return { failed: true, error: 'Site is required' }
    return { failed: false, data }

}

module.exports = {
    messageData,
    siteSearch,
    siteData,
    profileData,
}