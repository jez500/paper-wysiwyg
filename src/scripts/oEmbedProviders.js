
export default [
    {
        name: 'Youtube',
        buildEmbed: url => {
            const regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
            const embedUrl = 'https://www.youtube-nocookie.com/embed/{{ID}}';

            let match = url.match(regex)
            return (match && match[5]) ? embedUrl.replace('{{ID}}', match[5]) : null
        }
    },
    {
        name: 'Codepen',
        buildEmbed: url => {
            let match = url.match(/^https:\/\/codepen.io\/([\w\-]+)\/pen\/([\w\-]+)$/)
            return (match && match[1] && match[2])
                ? `https://codepen.io/${match[1]}/embed/${match[2]}` : null
        }
    },
    {
        name: 'Gist',
        buildEmbed: url => {
            let match = url.match(/^https:\/\/gist.github.com\/([\w\-]+)\/([\w\-]+)$/)
            return (match && match[1] && match[2])
                ? `data:text/html;charset=utf-8,<head><base target='_blank' /></head><body><script src='https://gist.github.com/${match[1]}/${match[2]}.js'></script></body>` : null
        }
    },

]
