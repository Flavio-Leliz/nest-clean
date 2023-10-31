import { Either, left, right } from './either'

function doSomeThing(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(1)
  } else {
    return left('error')
  }
}

test('Success result', () => {
  const result = doSomeThing(true)

  expect(result.isRight()).toEqual(true)
  expect(result.isLeft()).toEqual(false)
})

test('error result', () => {
  const result = doSomeThing(false)

  expect(result.isLeft()).toEqual(true)
  expect(result.isRight()).toEqual(false)
})
