<<<<<<< HEAD:lib/lint.js
const list = require('list');
=======
const list = require('./list')
>>>>>>> parent of ae21df4... update folder structure:lint.js

const createMatchObjectMerger = matchObject => (start, end) => {
  const newMatchObject = matchObject
  newMatchObject.location.position[0][1] = start
  newMatchObject.location.position[1][1] = end
  return newMatchObject
}
const createMatchFinder = merger => (contents, regex) => {
  let matches = []
  for (;;) {
    const match = regex.exec(contents)
    if (match === null) break
    matches = matches.concat(merger(match.index, match.index + match[0].length))
  }
  return matches
}

const reduceDecorator = callback => [
  (accumulator, currentValue, currentIndex, array) => {
    const result = callback(accumulator, currentValue, currentIndex, array)
    if (Array.isArray(result) && result.length === 0) return accumulator
    return [...accumulator, ...result]
  },
  []
]

const findSpelling = file => (allLineMatches, lineContents, lineNumber) => (
  list.reduce(...reduceDecorator((allMatches, { british, american }) => {
    const merger = createMatchObjectMerger({
      severity: 'info',
      location: {
        file,
        position: [[lineNumber, 0], [lineNumber, 1]]
      },
      excerpt: `You should spell this "${british}"!`,
      description: '> _This is American._ '
    })
    const matchFinder = createMatchFinder(merger)
    return matchFinder(lineContents, new RegExp('\\b' + american + '\\b', 'gi'))
  }))
)

module.exports = (filePath, fileContents) => (
  fileContents.split('\n').reduce(...reduceDecorator(findSpelling(filePath)))
)
