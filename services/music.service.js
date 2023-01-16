import _ from 'lodash';
import {SongModel} from '../db/model.js';

const dict = ['а', 'о', 'и', 'ы', 'у', 'ю', 'е', 'ё', 'э', 'я']

function getRhyme(sent) {
  let words = sent.split(' ')
  for (let word in words) {
    words[word] = words[word].split('').filter(i => dict.indexOf(i.toLowerCase()) !== -1)
      .map(i => i.toLowerCase()).join('')
  }
  words = words.map(i => i[0] ? i : '')
  return words
}

function refactorRhyme(sent) {
  let result = sent
  for (let word in sent) {
    sent[word] = sent[word].split('').map((i) => {
      if (i === 'ё') return 'е'
      if (i === 'о') return 'е'
      if (i === 'я') return 'а'
      if (i === 'ы') return 'и'
      if (i === 'ю') return 'у'
      return i
    }).join('')
  }
  return result
}

/**
 * @function {number} getArrScore - return score of rhymes
 * @param {string[]} target
 * @param {string[]} compared
 */
function getArrScore(target, compared) {
  let score = 0
  for (let x in target) {
    for (let y in target[x]) {
      if (target[x] && compared[x]) {
       if (target[x][y] === compared[x][y]) {
         score++
       }
      }
    }
  }
  return score
}

export const findMusic = async (str) => {
  let strRhyme = getRhyme(str)
  if (strRhyme.length < 4) {
    return {
      result: false,
      message: 'введеная запись слишком короткая, введите минимум 4 слова.',
    }
  }
  let data = await SongModel.findAll()
  data = data.map((i) => {
    return {
      id: i.dataValues.id,
      artist: i.dataValues.artist,
      title: i.dataValues.title,
      chorus: i.dataValues.chorus
    }
  })
  data = data.map(i => {
    return ({
      ...i,
      chorus: getRhyme(i.chorus)
    })
  })
  // let's try to find exactly match rhyme
  for (let item in data) {
    if (_.isEqual(data[item].chorus, strRhyme) === true) {
      return ({
        result: true,
        message: `ваше произведение похоже на: ${data[item].artist} - ${data[item].title}`,
      })
    }
  }
  // if nope - go ahead and try to find max matched rhyme, for that lets try to refactor rhymes
  data = data.map(i => {
    return ({
      ...i,
      chorus: refactorRhyme(i.chorus)
    })
  })
  strRhyme = refactorRhyme(strRhyme)
  let maxScore = 0
  for (let item of strRhyme) {
    maxScore = maxScore + item.length
  }
  // collect all scores and find the highest of them
  let pivotScores = []
  for (let item in data) {
    const tempScore = getArrScore(data[item].chorus, strRhyme)
    // break if we find something with high score
    if (tempScore > maxScore/1.2) {
      return ({
        result: true,
        message: `ваше произведение похоже на: ${data[item].artist} - ${data[item].title}`,
      })
    }
    pivotScores.push(tempScore)
  }
  if (Math.max(...pivotScores) > maxScore / 2) {
    const founded =  data[pivotScores.indexOf(Math.max(...pivotScores))]
    return ({
      result: true,
      message: `ваше произведение похоже на: ${founded.artist} - ${founded.title}`,
    })
  }
  // if nothing works - return false
  return ({
    result: false,
    message: 'я ничего не нашел.',
  })
}