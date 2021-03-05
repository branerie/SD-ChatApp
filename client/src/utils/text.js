const replaceEmojis = (text) => {
    return text.replace(':)', '\u{1f642}')
               .replace(';)', '\u{1f609}')
               .replace(':D', '\u{1f600}')
               .replace(':P', '\u{1f60b}')
               .replace(':(', '\u{1f641}')
               .replace(':o', '\u{1f62e}')
               .replace(';(', '\u{1f622}')
            //    .replace(':/', '\u{1f615}')
               .replace(':*', '\u{1f618}')
               .replace('<3', '\u{1f497}')
}

const capitalizeFirstLetter = (text) => {
    return `${text[0].toUpperCase()}${text.slice(1)}`
}

const shortenText = (text, maxLength) => {
    if (text.length <= maxLength) return text

    return `${text.slice(0, maxLength - 3)}...`
}

export {
    capitalizeFirstLetter,
    replaceEmojis,
    shortenText
}