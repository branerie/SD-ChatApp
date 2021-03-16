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

const messageData = (src, data, failed = true) => {
    if (!isObject(src, data)) return { failed }
    const { msg = '', type = 'plain' } = data
    if (!isString(msg) || trimAll(msg) === '') return { failed }
    const allowedTypes = ['plain', 'uri', 'image']
    if (!isString(type) || !allowedTypes.includes(type)) {
        sysLog(`Invalid message type from ${src}. Got ${type}.`)
        return { failed }
    }

    if (type === 'plain' && msg.length > MAX_MSG_LEN) {
        sysLog(`Message length from ${src} exceeded max allowed.`)
        return { failed, error: 'Message not sent: Too long' }
    }
    return { data }
}

const profileData = (src, data, failed = true, errors = []) => {
    if (!isObject(src, data)) return { failed, errors }
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
    return { data }
}

const siteData = (src, data, failed = true) => {
    if (!isObject(src, data)) return { failed }
    const { sid = '', site = '', description = '', logo = '' } = data
    if (!isString(sid) || !isString(site) || !isString(description) || !isString(logo)) {
        sysLog(`Invalid data type from ${src}.`)
        return { failed }
    }
    data.site = trimAll(site)
    if (!data.site) {
        sysLog(`Project name not specified from ${src}.`)
        return { failed, error: 'Project name is required' }
    }
    data.description = trimAll(description)
    return { data }
}

const groupData = (src, data, failed = true) => {
    if (!isObject(src, data)) return { failed }
    const { group = '' } = data
    if (!isString(group)) {
        sysLog(`Invalid data type from ${src}.`)
        return { failed }
    }

    data.group = trimAll(group)
    if (!data.group) return { failed, error: 'Name is required' }
    if (data.group.toLowerCase() === 'general') return { failed, error: 'General is reserved name' }
    return { data }
}

const siteSearch = (src, data, failed = true) => {
    if (!isObject(src, data)) return { failed }
    if (!isString(data.site) || !isPosInt(data.page)) {
        sysLog(`Invalid data type from ${src}.`)
        return { failed }
    }
    data.site = trimAll(data.site)
    if (!data.site) return { failed, error: 'Site is required' }
    return { data }
}

const peopleSearch = (src, data, failed = true) => {
    if (!isObject(src, data)) return { failed }
    if (!isString(data.name) || !isPosInt(data.page)) {
        sysLog(`Invalid data type from ${src}.`)
        return { failed }
    }
    data.name = trimAll(data.name)
    if (!data.name) return { failed, error: 'Name is required' }
    return { data }
}

const membershipData = (src, data, failed = true) => {
    // expect object with member and group props and string values representing object id
    // object id data type and rights will be checked on db
    if (!isObject(src, data)) return { failed }
    const { member, group } = data
    if (!isString(member) || !isString(group)) {
        sysLog(`Invalid data type from ${src}.`)
        return { failed }
    }
    return { data }
}

const userAndSiteId = (src, data, failed = true) => {
    // expect object with uid and sid props and string values representing object id
    // object id data type and rights will be checked on db
    if (!isObject(src, data)) return { failed }
    const { uid, sid } = data
    if (!isString(uid) || !isString(sid)) {
        sysLog(`Invalid data type from ${src}.`)
        return { failed }
    }
    return { data }
}

const siteId = (src, site, failed = true) => {
    // expect string with site id 
    // object id data type will be checked on db
    if (!isString(site)) {
        sysLog(`Invalid data type from ${src}.`)
        return { failed }
    }
    return site
}

module.exports = {
    messageData,
    siteSearch,
    peopleSearch,
    siteData,
    groupData,
    profileData,
    membershipData,
    userAndSiteId,
    siteId
}