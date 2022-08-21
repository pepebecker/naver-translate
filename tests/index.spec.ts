import 'mocha'
import { expect } from 'chai'

import navert from '../src/index'

describe('Translate', () => {
  it('get stem of a verb', async () => {
    const stem = await navert.lookupStem('배워요')
    expect(stem).equal('배우다')
  })
  it('get meaning of a word', async () => {
    const meanings = await navert.lookupMeanings('기타', { strip: true })
    const meaning = meanings.find(m => m.means.find(mean => mean.includes('guitar')))
    expect(meaning?.means).includes('guitar')
  })
  it('get examples', async () => {
    const examples = await navert.lookupExamples('사과')
    expect(examples).length.greaterThanOrEqual(1)
    expect(examples[0]).has.property('ko')
    expect(examples[0]).has.property('en')
  })
})
