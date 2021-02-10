const replaceEmojis = (text) => {
    return text.replace(':)', '\u{1f642}')
               .replace(';)', '\u{1f609}')
               .replace(':D', '\u{1f600}')
               .replace(':P', '\u{1f60b}')
               .replace(':(', '\u{1f641}')
               .replace(':o', '\u{1f62e}')
               .replace(';(', '\u{1f622}')
               .replace(':/', '\u{1f615}')
               .replace(':*', '\u{1f618}')
               .replace('<3', '\u{1f497}')
}

export {
    replaceEmojis
}