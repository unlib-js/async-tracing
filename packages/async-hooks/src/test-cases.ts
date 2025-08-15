// Test case for deeply nested async function calls
// Entry function calls nested "good" functions, then a "bad" function that takes >10s

async function goodAsyncFunction1(): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return await goodAsyncFunction2()
}

async function goodAsyncFunction2(): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 150))
  return await goodAsyncFunction3()
}

async function goodAsyncFunction3(): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return await goodAsyncFunction4()
}

async function goodAsyncFunction4(): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return 'Good functions completed'
}

async function badAsyncFunction(): Promise<string> {
  // This function takes longer than 10 seconds to complete
  await new Promise(resolve => setTimeout(resolve, 12000))
  return 'Bad function completed (this took >10s)'
}

async function triggerBadFunction(): Promise<string> {
  // This function is reached quickly (within 3s) but calls the slow bad function
  await new Promise(resolve => setTimeout(resolve, 100))
  return await badAsyncFunction()
}

export async function testCaseDeepNesting(): Promise<void> {
  console.log('Starting test case with deep nesting...')

  // Call the good nested functions first
  const goodResult = await goodAsyncFunction1()
  console.log('Good functions result:', goodResult)

  // Now call the bad function (reached in <3s, but takes >10s to complete)
  console.log('About to call bad function (should be reached within 3s)...')
  const startTime = Date.now()

  const badResult = await triggerBadFunction()
  const endTime = Date.now()
  const duration = endTime - startTime
  console.log('Bad function result:', badResult)
  console.log(`Bad function took ${duration}ms to complete`)
  throw new Error('Should not see me')
}
