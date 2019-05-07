import {expect, test} from '@oclif/test'

describe('create-app', () => {
  test
    .stdout()
    .command(['create-app','--name','testApp','--key','test-app','--description','test','--shortName','test','--git','--install'])
    .it('runs create-app --help', ctx => {
      expect(ctx.stdout).to.contain('App ready');
    })
})
